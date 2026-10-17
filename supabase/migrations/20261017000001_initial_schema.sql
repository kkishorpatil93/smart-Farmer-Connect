-- ==============================================================================
-- SMART FARMER CONNECT: MIGRATION 00001 - CORE DATABASE SCHEMA
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom enum types
CREATE TYPE user_role AS ENUM ('farmer', 'seller', 'admin');
CREATE TYPE preferred_language AS ENUM ('en', 'kn');
CREATE TYPE listing_status AS ENUM (
    'draft',
    'posted',
    'buyer_interested',
    'visit_confirmed',
    'partially_sold',
    'sold',
    'cancelled',
    'expired'
);
CREATE TYPE offer_status AS ENUM ('pending', 'accepted', 'declined', 'withdrawn', 'expired');
CREATE TYPE visit_status AS ENUM ('proposed', 'confirmed', 'completed', 'no_show', 'cancelled');
CREATE TYPE notification_channel AS ENUM ('in_app', 'sms', 'whatsapp', 'push');
CREATE TYPE delivery_status AS ENUM ('queued', 'sent', 'failed', 'mock');
CREATE TYPE payment_method AS ENUM ('cash', 'upi', 'bank_transfer', 'other');
CREATE TYPE report_status AS ENUM ('pending', 'investigating', 'resolved', 'dismissed');

-- ------------------------------------------------------------------------------
-- 1. PROFILES (Base user table linked to auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    full_name TEXT NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    language preferred_language DEFAULT 'kn',
    is_verified BOOLEAN DEFAULT false,
    is_suspended BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. FARMER PROFILES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS farmer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    village TEXT NOT NULL,
    taluk TEXT NOT NULL,
    district TEXT NOT NULL,
    lat NUMERIC(9, 6),
    lng NUMERIC(9, 6),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. SELLER PROFILES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS seller_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    shop_name TEXT NOT NULL,
    license_no TEXT,
    preferred_crops TEXT[] DEFAULT '{}',
    rating_avg NUMERIC(3, 2) DEFAULT 0.00 CHECK (rating_avg >= 0 AND rating_avg <= 5.00),
    rating_count INT DEFAULT 0 CHECK (rating_count >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. APMC MARKETS (Karnataka Master List)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS markets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_kn TEXT NOT NULL,
    district TEXT NOT NULL,
    lat NUMERIC(9, 6) NOT NULL,
    lng NUMERIC(9, 6) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. SELLER MARKETS (Many-to-many relationship)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS seller_markets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES seller_profiles(id) ON DELETE CASCADE,
    market_id UUID NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(seller_id, market_id)
);

-- ------------------------------------------------------------------------------
-- 6. CROPS MASTER DATA
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS crops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL UNIQUE,
    name_kn TEXT NOT NULL,
    default_unit TEXT DEFAULT 'quintal', -- 'kg', 'quintal', 'tonne'
    icon_name TEXT,
    category TEXT DEFAULT 'vegetable',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. CROP LISTINGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS crop_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES farmer_profiles(id) ON DELETE RESTRICT,
    crop_id UUID NOT NULL REFERENCES crops(id) ON DELETE RESTRICT,
    market_id UUID NOT NULL REFERENCES markets(id) ON DELETE RESTRICT,
    
    -- Normalized metric values
    quantity_kg NUMERIC(12, 2) NOT NULL CHECK (quantity_kg > 0),
    quantity_remaining_kg NUMERIC(12, 2) NOT NULL CHECK (quantity_remaining_kg >= 0),
    price_per_kg NUMERIC(10, 2) NOT NULL CHECK (price_per_kg > 0),
    
    -- Original farmer entered values
    entered_quantity NUMERIC(10, 2) NOT NULL CHECK (entered_quantity > 0),
    entered_unit TEXT NOT NULL CHECK (entered_unit IN ('kg', 'quintal', 'tonne')),
    entered_price NUMERIC(10, 2) NOT NULL CHECK (entered_price > 0),
    entered_price_unit TEXT NOT NULL CHECK (entered_price_unit IN ('kg', 'quintal', 'tonne')),
    
    harvest_date DATE NOT NULL,
    description VARCHAR(300),
    status listing_status DEFAULT 'posted',
    idempotency_key UUID UNIQUE NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. CROP IMAGES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS crop_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES crop_listings(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    position SMALLINT DEFAULT 1 CHECK (position >= 1 AND position <= 3),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. BUYER OFFERS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS buyer_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES crop_listings(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES seller_profiles(id) ON DELETE RESTRICT,
    quantity_kg NUMERIC(12, 2) NOT NULL CHECK (quantity_kg > 0),
    price_per_kg NUMERIC(10, 2) NOT NULL CHECK (price_per_kg > 0),
    proposed_visit_at TIMESTAMPTZ,
    status offer_status DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. VISIT BOOKINGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS visit_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id UUID NOT NULL UNIQUE REFERENCES buyer_offers(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMPTZ NOT NULL,
    verification_code VARCHAR(8) NOT NULL, -- QR verification code for market validation
    status visit_status DEFAULT 'proposed',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. NOTIFICATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'new_listing', 'offer_received', 'offer_accepted', 'visit_confirmed'
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    channel notification_channel DEFAULT 'in_app',
    delivery_status delivery_status DEFAULT 'sent',
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 12. TRANSACTIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id UUID NOT NULL REFERENCES buyer_offers(id) ON DELETE RESTRICT,
    final_quantity_kg NUMERIC(12, 2) NOT NULL CHECK (final_quantity_kg > 0),
    final_price_per_kg NUMERIC(10, 2) NOT NULL CHECK (final_price_per_kg > 0),
    total_amount NUMERIC(14, 2) NOT NULL CHECK (total_amount > 0),
    payment_method payment_method DEFAULT 'cash',
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 13. RATINGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    rater_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    ratee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    stars SMALLINT NOT NULL CHECK (stars >= 1 AND stars <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 14. REPORTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    target_type TEXT NOT NULL CHECK (target_type IN ('listing', 'user', 'offer')),
    target_id UUID NOT NULL,
    reason TEXT NOT NULL,
    status report_status DEFAULT 'pending',
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 15. AUDIT LOG
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id UUID NOT NULL,
    before JSONB,
    after JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indices
CREATE INDEX IF NOT EXISTS idx_listings_market ON crop_listings(market_id, status);
CREATE INDEX IF NOT EXISTS idx_listings_farmer ON crop_listings(farmer_id);
CREATE INDEX IF NOT EXISTS idx_offers_listing ON buyer_offers(listing_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read_at);
