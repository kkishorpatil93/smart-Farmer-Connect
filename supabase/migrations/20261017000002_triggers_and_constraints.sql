-- ==============================================================================
-- SMART FARMER CONNECT: MIGRATION 00002 - TRIGGERS & CONSTRAINTS
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. STATE MACHINE VALIDATION FOR CROP LISTINGS
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION validate_listing_status_transition()
RETURNS TRIGGER AS $$
DECLARE
    is_valid BOOLEAN := FALSE;
BEGIN
    -- No change in status
    IF OLD.status = NEW.status THEN
        RETURN NEW;
    END IF;

    -- Allowed transitions:
    -- draft -> posted, cancelled
    -- posted -> buyer_interested, cancelled, expired
    -- buyer_interested -> visit_confirmed, partially_sold, sold, cancelled, expired
    -- visit_confirmed -> partially_sold, sold, cancelled
    -- partially_sold -> visit_confirmed, sold, cancelled
    -- sold / cancelled / expired -> terminal states (no further transitions allowed)

    IF OLD.status = 'draft' AND NEW.status IN ('posted', 'cancelled') THEN
        is_valid := TRUE;
    ELSIF OLD.status = 'posted' AND NEW.status IN ('buyer_interested', 'cancelled', 'expired') THEN
        is_valid := TRUE;
    ELSIF OLD.status = 'buyer_interested' AND NEW.status IN ('visit_confirmed', 'partially_sold', 'sold', 'cancelled', 'expired') THEN
        is_valid := TRUE;
    ELSIF OLD.status = 'visit_confirmed' AND NEW.status IN ('partially_sold', 'sold', 'cancelled') THEN
        is_valid := TRUE;
    ELSIF OLD.status = 'partially_sold' AND NEW.status IN ('visit_confirmed', 'sold', 'cancelled') THEN
        is_valid := TRUE;
    END IF;

    IF NOT is_valid THEN
        RAISE EXCEPTION 'Invalid listing transition from % to %', OLD.status, NEW.status;
    END IF;

    -- Record in audit log
    INSERT INTO audit_log (actor_id, action, entity, entity_id, before, after)
    VALUES (
        auth.uid(),
        'STATUS_CHANGE',
        'crop_listings',
        NEW.id,
        jsonb_build_object('status', OLD.status, 'quantity_remaining_kg', OLD.quantity_remaining_kg),
        jsonb_build_object('status', NEW.status, 'quantity_remaining_kg', NEW.quantity_remaining_kg)
    );

    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_listing_status_transition
BEFORE UPDATE ON crop_listings
FOR EACH ROW
EXECUTE FUNCTION validate_listing_status_transition();

-- ------------------------------------------------------------------------------
-- 2. PREVENT OVER-ALLOCATION OF OFFERS
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION validate_and_update_offer_allocation()
RETURNS TRIGGER AS $$
DECLARE
    v_total_kg NUMERIC(12, 2);
    v_accepted_kg NUMERIC(12, 2);
    v_listing_status listing_status;
BEGIN
    -- Only check when an offer transitions to 'accepted' or quantity is altered while accepted
    IF (TG_OP = 'UPDATE' AND NEW.status = 'accepted' AND (OLD.status != 'accepted' OR OLD.quantity_kg != NEW.quantity_kg))
       OR (TG_OP = 'INSERT' AND NEW.status = 'accepted') THEN
        
        -- Lock listing row for update to prevent concurrent race conditions
        SELECT quantity_kg, status INTO v_total_kg, v_listing_status
        FROM crop_listings
        WHERE id = NEW.listing_id
        FOR UPDATE;

        -- Sum existing accepted offers (excluding the current one)
        SELECT COALESCE(SUM(quantity_kg), 0) INTO v_accepted_kg
        FROM buyer_offers
        WHERE listing_id = NEW.listing_id
          AND status = 'accepted'
          AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid);

        -- Check total allocation
        IF (v_accepted_kg + NEW.quantity_kg) > v_total_kg THEN
            RAISE EXCEPTION 'Cannot accept offer: requested % kg, but only % kg available out of % kg total.',
                NEW.quantity_kg, (v_total_kg - v_accepted_kg), v_total_kg;
        END IF;

        -- Update listing remaining quantity and status
        UPDATE crop_listings
        SET quantity_remaining_kg = v_total_kg - (v_accepted_kg + NEW.quantity_kg),
            status = CASE 
                WHEN (v_accepted_kg + NEW.quantity_kg) >= v_total_kg THEN 'visit_confirmed'::listing_status
                ELSE 'partially_sold'::listing_status
            END,
            updated_at = NOW()
        WHERE id = NEW.listing_id;
    END IF;

    -- If an accepted offer is declined, withdrawn, or cancelled, restore remaining quantity
    IF TG_OP = 'UPDATE' AND OLD.status = 'accepted' AND NEW.status IN ('declined', 'withdrawn', 'expired') THEN
        UPDATE crop_listings
        SET quantity_remaining_kg = quantity_remaining_kg + OLD.quantity_kg,
            status = CASE 
                WHEN quantity_remaining_kg + OLD.quantity_kg >= quantity_kg THEN 'buyer_interested'::listing_status
                ELSE 'partially_sold'::listing_status
            END,
            updated_at = NOW()
        WHERE id = NEW.listing_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_validate_offer_allocation
AFTER INSERT OR UPDATE ON buyer_offers
FOR EACH ROW
EXECUTE FUNCTION validate_and_update_offer_allocation();

-- ------------------------------------------------------------------------------
-- 3. PREVENT DUPLICATE SUBMISSION WITHIN 10 MINUTES
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION prevent_duplicate_listing_submission()
RETURNS TRIGGER AS $$
DECLARE
    v_recent_id UUID;
BEGIN
    SELECT id INTO v_recent_id
    FROM crop_listings
    WHERE farmer_id = NEW.farmer_id
      AND crop_id = NEW.crop_id
      AND market_id = NEW.market_id
      AND entered_quantity = NEW.entered_quantity
      AND created_at > (NOW() - INTERVAL '10 minutes')
    LIMIT 1;

    IF v_recent_id IS NOT NULL THEN
        RAISE EXCEPTION 'Duplicate listing detected: an identical crop listing was created within the last 10 minutes.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_duplicate_listing
BEFORE INSERT ON crop_listings
FOR EACH ROW
EXECUTE FUNCTION prevent_duplicate_listing_submission();

-- ------------------------------------------------------------------------------
-- 4. AUTO-RECALCULATE SELLER RATING UPON NEW REVIEW
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_seller_rating_summary()
RETURNS TRIGGER AS $$
DECLARE
    v_seller_profile_id UUID;
    v_new_avg NUMERIC(3, 2);
    v_new_count INT;
BEGIN
    -- Check if ratee is a seller
    SELECT sp.id INTO v_seller_profile_id
    FROM seller_profiles sp
    WHERE sp.user_id = NEW.ratee_id;

    IF v_seller_profile_id IS NOT NULL THEN
        SELECT 
            ROUND(AVG(stars)::numeric, 2),
            COUNT(*)
        INTO v_new_avg, v_new_count
        FROM ratings
        WHERE ratee_id = NEW.ratee_id;

        UPDATE seller_profiles
        SET rating_avg = COALESCE(v_new_avg, 0.00),
            rating_count = v_new_count,
            updated_at = NOW()
        WHERE id = v_seller_profile_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_update_seller_rating
AFTER INSERT OR UPDATE ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_seller_rating_summary();
