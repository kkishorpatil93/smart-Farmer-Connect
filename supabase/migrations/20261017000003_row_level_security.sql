-- ==============================================================================
-- SMART FARMER CONNECT: MIGRATION 00003 - ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- ENABLE RLS ON ALL TABLES
-- ------------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- HELPER FUNCTIONS FOR RLS CHECKS
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_farmer_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT id FROM farmer_profiles
        WHERE user_id = auth.uid()
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_seller_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT id FROM seller_profiles
        WHERE user_id = auth.uid()
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 1. PROFILES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins have full access to profiles"
    ON profiles FOR ALL
    USING (is_admin());

CREATE POLICY "Users can read their own profile"
    ON profiles FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (id = auth.uid());

-- ------------------------------------------------------------------------------
-- 2. FARMER & SELLER PROFILES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins full access to farmer profiles"
    ON farmer_profiles FOR ALL USING (is_admin());

CREATE POLICY "Farmers manage own profile"
    ON farmer_profiles FOR ALL
    USING (user_id = auth.uid());

CREATE POLICY "Public can view farmer village and district"
    ON farmer_profiles FOR SELECT
    USING (true);

CREATE POLICY "Admins full access to seller profiles"
    ON seller_profiles FOR ALL USING (is_admin());

CREATE POLICY "Sellers manage own profile"
    ON seller_profiles FOR ALL
    USING (user_id = auth.uid());

CREATE POLICY "Public can view seller profiles"
    ON seller_profiles FOR SELECT
    USING (true);

-- ------------------------------------------------------------------------------
-- 3. MARKETS & CROPS (Master Data)
-- ------------------------------------------------------------------------------
CREATE POLICY "Public read active markets"
    ON markets FOR SELECT USING (is_active = true);

CREATE POLICY "Admin manage markets"
    ON markets FOR ALL USING (is_admin());

CREATE POLICY "Public read crops"
    ON crops FOR SELECT USING (true);

CREATE POLICY "Admin manage crops"
    ON crops FOR ALL USING (is_admin());

CREATE POLICY "Sellers manage own market subscriptions"
    ON seller_markets FOR ALL
    USING (seller_id = get_user_seller_id() OR is_admin());

-- ------------------------------------------------------------------------------
-- 4. CROP LISTINGS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins full access to crop listings"
    ON crop_listings FOR ALL USING (is_admin());

CREATE POLICY "Farmers manage their own listings"
    ON crop_listings FOR ALL
    USING (farmer_id = get_user_farmer_id());

CREATE POLICY "Sellers view listings in their subscribed markets"
    ON crop_listings FOR SELECT
    USING (
        status NOT IN ('draft', 'cancelled')
        AND (
            EXISTS (
                SELECT 1 FROM seller_markets sm
                WHERE sm.seller_id = get_user_seller_id()
                  AND sm.market_id = crop_listings.market_id
            )
            OR get_user_seller_id() IS NULL -- allows public browse on landing page
        )
    );

CREATE POLICY "Public view active images"
    ON crop_images FOR SELECT USING (true);

CREATE POLICY "Farmers manage crop images"
    ON crop_images FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM crop_listings cl
            WHERE cl.id = crop_images.listing_id
              AND cl.farmer_id = get_user_farmer_id()
        )
    );

-- ------------------------------------------------------------------------------
-- 5. BUYER OFFERS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins full access to offers"
    ON buyer_offers FOR ALL USING (is_admin());

CREATE POLICY "Sellers view and manage their own offers"
    ON buyer_offers FOR ALL
    USING (seller_id = get_user_seller_id());

CREATE POLICY "Farmers view offers on their listings"
    ON buyer_offers FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM crop_listings cl
            WHERE cl.id = buyer_offers.listing_id
              AND cl.farmer_id = get_user_farmer_id()
        )
    );

CREATE POLICY "Farmers update offer status (accept/decline)"
    ON buyer_offers FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM crop_listings cl
            WHERE cl.id = buyer_offers.listing_id
              AND cl.farmer_id = get_user_farmer_id()
        )
    );

-- ------------------------------------------------------------------------------
-- 6. VISIT BOOKINGS & TRANSACTIONS
-- ------------------------------------------------------------------------------
CREATE POLICY "Offer parties view and update visit bookings"
    ON visit_bookings FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM buyer_offers bo
            JOIN crop_listings cl ON cl.id = bo.listing_id
            WHERE bo.id = visit_bookings.offer_id
              AND (bo.seller_id = get_user_seller_id() OR cl.farmer_id = get_user_farmer_id())
        )
        OR is_admin()
    );

CREATE POLICY "Offer parties view transactions"
    ON transactions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM buyer_offers bo
            JOIN crop_listings cl ON cl.id = bo.listing_id
            WHERE bo.id = transactions.offer_id
              AND (bo.seller_id = get_user_seller_id() OR cl.farmer_id = get_user_farmer_id())
        )
        OR is_admin()
    );

-- ------------------------------------------------------------------------------
-- 7. NOTIFICATIONS & RATINGS
-- ------------------------------------------------------------------------------
CREATE POLICY "Users read and mark own notifications"
    ON notifications FOR ALL
    USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Public read ratings"
    ON ratings FOR SELECT USING (true);

CREATE POLICY "Participants create ratings"
    ON ratings FOR INSERT
    WITH CHECK (rater_id = auth.uid());

CREATE POLICY "Users create reports"
    ON reports FOR INSERT
    WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Admins manage reports"
    ON reports FOR ALL USING (is_admin());

CREATE POLICY "Admins view audit log"
    ON audit_log FOR SELECT USING (is_admin());

-- ------------------------------------------------------------------------------
-- 8. SECURE CONTACT DISCLOSURE RPC
-- ------------------------------------------------------------------------------
-- Phone number and full contact details are unlocked ONLY if an accepted offer exists
CREATE OR REPLACE FUNCTION get_deal_contact_details(p_listing_id UUID)
RETURNS TABLE (
    farmer_name TEXT,
    farmer_phone VARCHAR(15),
    village TEXT,
    taluk TEXT,
    district TEXT,
    seller_name TEXT,
    seller_phone VARCHAR(15),
    shop_name TEXT,
    offer_status offer_status
) AS $$
DECLARE
    v_caller_id UUID := auth.uid();
    v_is_accepted BOOLEAN;
BEGIN
    -- Verify an accepted offer exists between this seller and the listing's farmer
    SELECT EXISTS (
        SELECT 1 FROM buyer_offers bo
        JOIN crop_listings cl ON cl.id = bo.listing_id
        JOIN seller_profiles sp ON sp.id = bo.seller_id
        JOIN farmer_profiles fp ON fp.id = cl.farmer_id
        WHERE bo.listing_id = p_listing_id
          AND bo.status = 'accepted'
          AND (sp.user_id = v_caller_id OR fp.user_id = v_caller_id OR is_admin())
    ) INTO v_is_accepted;

    IF NOT v_is_accepted THEN
        RAISE EXCEPTION 'Access Denied: Contact details are protected until an offer is accepted by the farmer.';
    END IF;

    RETURN QUERY
    SELECT 
        pf.full_name AS farmer_name,
        pf.phone AS farmer_phone,
        fp.village,
        fp.taluk,
        fp.district,
        ps.full_name AS seller_name,
        ps.phone AS seller_phone,
        sp.shop_name,
        bo.status AS offer_status
    FROM buyer_offers bo
    JOIN crop_listings cl ON cl.id = bo.listing_id
    JOIN farmer_profiles fp ON fp.id = cl.farmer_id
    JOIN profiles pf ON pf.id = fp.user_id
    JOIN seller_profiles sp ON sp.id = bo.seller_id
    JOIN profiles ps ON ps.id = sp.user_id
    WHERE bo.listing_id = p_listing_id
      AND bo.status = 'accepted'
      AND (sp.user_id = v_caller_id OR fp.user_id = v_caller_id OR is_admin());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
