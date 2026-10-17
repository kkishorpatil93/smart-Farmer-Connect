-- ==============================================================================
-- SMART FARMER CONNECT: COMPLETE SUPABASE DATABASE SETUP SCRIPT
-- Copy and paste this script directly into Supabase SQL Editor and click "RUN"
-- Project URL: https://gjsdwangzyvbpyyhisor.supabase.co
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Custom Enum Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('farmer', 'seller', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE preferred_language AS ENUM ('en', 'kn');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE listing_status AS ENUM (
        'draft', 'posted', 'buyer_interested', 'visit_confirmed', 
        'partially_sold', 'sold', 'cancelled', 'expired'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE offer_status AS ENUM ('pending', 'accepted', 'declined', 'withdrawn', 'expired');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE visit_status AS ENUM ('proposed', 'confirmed', 'completed', 'no_show', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE notification_channel AS ENUM ('in_app', 'sms', 'whatsapp', 'push');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE delivery_status AS ENUM ('queued', 'sent', 'failed', 'mock');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. Profiles Table (Supports both Supabase Auth & Phone OTP)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role user_role NOT NULL,
    full_name TEXT NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    language preferred_language DEFAULT 'kn',
    is_verified BOOLEAN DEFAULT true,
    is_suspended BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Farmer Profiles
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

-- 5. Seller Profiles
CREATE TABLE IF NOT EXISTS seller_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    shop_name TEXT NOT NULL,
    license_no TEXT,
    preferred_crops TEXT[] DEFAULT '{}',
    rating_avg NUMERIC(3, 2) DEFAULT 0.00,
    rating_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. APMC Markets (Karnataka Mandis)
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

-- 7. Seller Markets Mapping
CREATE TABLE IF NOT EXISTS seller_markets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES seller_profiles(id) ON DELETE CASCADE,
    market_id UUID NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(seller_id, market_id)
);

-- 8. Crops Master Data
CREATE TABLE IF NOT EXISTS crops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL UNIQUE,
    name_kn TEXT NOT NULL,
    default_unit TEXT DEFAULT 'quintal',
    icon_name TEXT,
    category TEXT DEFAULT 'vegetable',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Crop Listings (with Quality Grading & Price Reference)
CREATE TABLE IF NOT EXISTS crop_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES farmer_profiles(id) ON DELETE CASCADE,
    crop_id UUID NOT NULL REFERENCES crops(id) ON DELETE RESTRICT,
    market_id UUID NOT NULL REFERENCES markets(id) ON DELETE RESTRICT,
    
    quantity_kg NUMERIC(12, 2) NOT NULL CHECK (quantity_kg > 0),
    quantity_remaining_kg NUMERIC(12, 2) NOT NULL CHECK (quantity_remaining_kg >= 0),
    price_per_kg NUMERIC(10, 2) NOT NULL CHECK (price_per_kg > 0),
    min_price_per_kg NUMERIC(10, 2),
    is_negotiable BOOLEAN DEFAULT true,
    
    entered_quantity NUMERIC(10, 2) NOT NULL CHECK (entered_quantity > 0),
    entered_unit TEXT NOT NULL CHECK (entered_unit IN ('kg', 'quintal', 'tonne')),
    entered_price NUMERIC(10, 2) NOT NULL CHECK (entered_price > 0),
    entered_price_unit TEXT NOT NULL CHECK (entered_price_unit IN ('kg', 'quintal', 'tonne')),
    
    harvest_date DATE NOT NULL,
    description VARCHAR(300),
    status listing_status DEFAULT 'posted',
    idempotency_key UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    
    -- AI Quality Assessment
    quality_assessment JSONB DEFAULT NULL,
    -- APMC Mandi Benchmark Reference
    price_benchmark JSONB DEFAULT NULL,
    -- Uploaded photo URLs array
    photos TEXT[] DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Crop Images
CREATE TABLE IF NOT EXISTS crop_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES crop_listings(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    position SMALLINT DEFAULT 1 CHECK (position >= 1 AND position <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Buyer Offers
CREATE TABLE IF NOT EXISTS buyer_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES crop_listings(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES seller_profiles(id) ON DELETE CASCADE,
    quantity_kg NUMERIC(12, 2) NOT NULL CHECK (quantity_kg > 0),
    price_per_kg NUMERIC(10, 2) NOT NULL CHECK (price_per_kg > 0),
    proposed_visit_at TIMESTAMPTZ,
    status offer_status DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Visit Bookings
CREATE TABLE IF NOT EXISTS visit_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id UUID NOT NULL UNIQUE REFERENCES buyer_offers(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMPTZ NOT NULL,
    verification_code VARCHAR(8) NOT NULL,
    status visit_status DEFAULT 'proposed',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    channel notification_channel DEFAULT 'in_app',
    delivery_status delivery_status DEFAULT 'sent',
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_listings_market ON crop_listings(market_id, status);
CREATE INDEX IF NOT EXISTS idx_listings_farmer ON crop_listings(farmer_id);
CREATE INDEX IF NOT EXISTS idx_offers_listing ON buyer_offers(listing_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read_at);

-- 15. Storage Bucket for Crop Photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('crop-photos', 'crop-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public View Crop Photos" ON storage.objects;
CREATE POLICY "Public View Crop Photos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'crop-photos');

DROP POLICY IF EXISTS "Allow Upload Crop Photos" ON storage.objects;
CREATE POLICY "Allow Upload Crop Photos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'crop-photos');

-- 16. SEED DATA (Karnataka APMC Markets)
INSERT INTO markets (id, name_en, name_kn, district, lat, lng, is_active) VALUES
('m0000001-0000-0000-0000-000000000001', 'Hubballi APMC (Amaragol)', 'ಹುಬ್ಬಳ್ಳಿ ಎಪಿಎಂಸಿ (ಅಮರಗೋಳ)', 'Dharwad', 15.3921, 75.1054, true),
('m0000001-0000-0000-0000-000000000002', 'Belagavi APMC', 'ಬೆಳಗಾವಿ ಎಪಿಎಂಸಿ', 'Belagavi', 15.8497, 74.4977, true),
('m0000001-0000-0000-0000-000000000003', 'Bengaluru Yeshwanthpur APMC', 'ಬೆಂಗಳೂರು ಯಶವಂತಪುರ ಎಪಿಎಂಸಿ', 'Bengaluru Urban', 13.0238, 77.5529, true),
('m0000001-0000-0000-0000-000000000004', 'Mysuru Bandipalya APMC', 'ಮೈಸೂರು ಬಂಡಿಪಾಳ್ಯ ಎಪಿಎಂಸಿ', 'Mysuru', 12.2829, 76.6663, true),
('m0000001-0000-0000-0000-000000000005', 'Gadag APMC', 'ಗದಗ ಎಪಿಎಂಸಿ', 'Gadag', 15.4312, 75.6358, true),
('m0000001-0000-0000-0000-000000000006', 'Davanagere APMC', 'ದಾವಣಗೆರೆ ಎಪಿಎಂಸಿ', 'Davanagere', 14.4644, 75.9218, true),
('m0000001-0000-0000-0000-000000000007', 'Shivamogga APMC', 'ಶಿವಮೊಗ್ಗ ಎಪಿಎಂಸಿ', 'Shivamogga', 13.9299, 75.5681, true),
('m0000001-0000-0000-0000-000000000008', 'Kalaburagi APMC', 'ಕಲಬುರಗಿ ಎಪಿಎಂಸಿ', 'Kalaburagi', 17.3297, 76.8343, true)
ON CONFLICT (id) DO NOTHING;

-- 17. SEED DATA (Karnataka Crops)
INSERT INTO crops (id, name_en, name_kn, default_unit, icon_name, category) VALUES
('c0000001-0000-0000-0000-000000000001', 'Tomato', 'ಟೊಮೆಟೊ', 'quintal', '🍅', 'vegetable'),
('c0000001-0000-0000-0000-000000000002', 'Onion', 'ಈರುಳ್ಳಿ', 'quintal', '🧅', 'vegetable'),
('c0000001-0000-0000-0000-000000000003', 'Potato', 'ಆಲೂಗಡ್ಡೆ', 'quintal', '🥔', 'vegetable'),
('c0000001-0000-0000-0000-000000000004', 'Rice (Paddy)', 'ಭತ್ತ / ಅಕ್ಕಿ', 'quintal', '🌾', 'grain'),
('c0000001-0000-0000-0000-000000000005', 'Maize', 'ಮೆಕ್ಕೆಜೋಳ', 'quintal', '🌽', 'grain'),
('c0000001-0000-0000-0000-000000000006', 'Green Chilli', 'ಹಸಿ ಮೆಣಸಿನಕಾಯಿ', 'kg', '🌶️', 'vegetable'),
('c0000001-0000-0000-0000-000000000007', 'Cotton', 'ಹತ್ತಿ', 'quintal', '☁️', 'commercial'),
('c0000001-0000-0000-0000-000000000008', 'Groundnut', 'ಕಡಲೆಕಾಯಿ', 'quintal', '🥜', 'oilseed')
ON CONFLICT (name_en) DO NOTHING;

-- 18. SEED TEST USERS (Basavaraj Patil & Suresh Agro Traders)
INSERT INTO profiles (id, role, full_name, phone, language, is_verified) VALUES
('u0000001-0000-0000-0000-000000000001', 'farmer', 'Basavaraj Patil (ಬಸವರಾಜ ಪಾಟೀಲ)', '+919845011111', 'kn', true),
('u0000002-0000-0000-0000-000000000001', 'seller', 'Suresh Kumar (Suresh Agro Traders)', '+919845044444', 'kn', true)
ON CONFLICT (phone) DO NOTHING;

INSERT INTO farmer_profiles (id, user_id, village, taluk, district, lat, lng) VALUES
('f0000001-0000-0000-0000-000000000001', 'u0000001-0000-0000-0000-000000000001', 'Konnur', 'Gokak', 'Belagavi', 16.1952, 74.8340)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO seller_profiles (id, user_id, shop_name, license_no, preferred_crops, rating_avg, rating_count) VALUES
('s0000001-0000-0000-0000-000000000001', 'u0000002-0000-0000-0000-000000000001', 'Suresh Agro Traders', 'APMC-HUB-2024-88', ARRAY['Tomato', 'Onion'], 4.80, 24)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO seller_markets (seller_id, market_id) VALUES
('s0000001-0000-0000-0000-000000000001', 'm0000001-0000-0000-0000-000000000001')
ON CONFLICT (seller_id, market_id) DO NOTHING;
