-- ==============================================================================
-- SMART FARMER CONNECT: SEED DATA (supabase/seed.sql)
-- ==============================================================================

-- Clean up existing data in reverse order of foreign keys
TRUNCATE TABLE audit_log, reports, ratings, transactions, visit_bookings, buyer_offers, 
               crop_images, crop_listings, seller_markets, seller_profiles, farmer_profiles, 
               notifications, crops, markets, profiles CASCADE;

-- ------------------------------------------------------------------------------
-- 1. SEED MARKETS (Karnataka APMCs)
-- ------------------------------------------------------------------------------
INSERT INTO markets (id, name_en, name_kn, district, lat, lng, is_active) VALUES
('m0000001-0000-0000-0000-000000000001', 'Hubballi APMC (Amaragol)', 'ಹುಬ್ಬಳ್ಳಿ ಎಪಿಎಂಸಿ (ಅಮರಗೋಳ)', 'Dharwad', 15.3921, 75.1054, true),
('m0000001-0000-0000-0000-000000000002', 'Belagavi APMC', 'ಬೆಳಗಾವಿ ಎಪಿಎಂಸಿ', 'Belagavi', 15.8497, 74.4977, true),
('m0000001-0000-0000-0000-000000000003', 'Bengaluru Yeshwanthpur APMC', 'ಬೆಂಗಳೂರು ಯಶವಂತಪುರ ಎಪಿಎಂಸಿ', 'Bengaluru Urban', 13.0238, 77.5529, true),
('m0000001-0000-0000-0000-000000000004', 'Mysuru Bandipalya APMC', 'ಮೈಸೂರು ಬಂಡಿಪಾಳ್ಯ ಎಪಿಎಂಸಿ', 'Mysuru', 12.2829, 76.6663, true),
('m0000001-0000-0000-0000-000000000005', 'Gadag APMC', 'ಗದಗ ಎಪಿಎಂಸಿ', 'Gadag', 15.4312, 75.6358, true),
('m0000001-0000-0000-0000-000000000006', 'Davanagere APMC', 'ದಾವಣಗೆರೆ ಎಪಿಎಂಸಿ', 'Davanagere', 14.4644, 75.9218, true),
('m0000001-0000-0000-0000-000000000007', 'Shivamogga APMC', 'ಶಿವಮೊಗ್ಗ ಎಪಿಎಂಸಿ', 'Shivamogga', 13.9299, 75.5681, true),
('m0000001-0000-0000-0000-000000000008', 'Kalaburagi APMC', 'ಕಲಬುರಗಿ ಎಪಿಎಂಸಿ', 'Kalaburagi', 17.3297, 76.8343, true);

-- ------------------------------------------------------------------------------
-- 2. SEED CROPS MASTER DATA
-- ------------------------------------------------------------------------------
INSERT INTO crops (id, name_en, name_kn, default_unit, icon_name, category) VALUES
('c0000001-0000-0000-0000-000000000001', 'Tomato', 'ಟೊಮೆಟೊ', 'quintal', 'tomato', 'vegetable'),
('c0000001-0000-0000-0000-000000000002', 'Onion', 'ಈರುಳ್ಳಿ', 'quintal', 'onion', 'vegetable'),
('c0000001-0000-0000-0000-000000000003', 'Potato', 'ಆಲೂಗಡ್ಡೆ', 'quintal', 'potato', 'vegetable'),
('c0000001-0000-0000-0000-000000000004', 'Rice (Paddy)', 'ಭತ್ತ / ಅಕ್ಕಿ', 'quintal', 'rice', 'grain'),
('c0000001-0000-0000-0000-000000000005', 'Maize', 'ಮೆಕ್ಕೆಜೋಳ', 'quintal', 'maize', 'grain'),
('c0000001-0000-0000-0000-000000000006', 'Green Chilli', 'ಹಸಿ ಮೆಣಸಿನಕಾಯಿ', 'kg', 'chilli', 'vegetable'),
('c0000001-0000-0000-0000-000000000007', 'Cotton', 'ಹತ್ತಿ', 'quintal', 'cotton', 'commercial'),
('c0000001-0000-0000-0000-000000000008', 'Groundnut', 'ಕಡಲೆಕಾಯಿ', 'quintal', 'groundnut', 'oilseed');

-- ------------------------------------------------------------------------------
-- 3. SEED USERS & PROFILES
-- ------------------------------------------------------------------------------
-- Admin
INSERT INTO profiles (id, role, full_name, phone, language, is_verified) VALUES
('u0000000-0000-0000-0000-000000000000', 'admin', 'Karnataka APMC Admin', '+919845000000', 'kn', true);

-- Farmers
INSERT INTO profiles (id, role, full_name, phone, language, is_verified) VALUES
('u0000001-0000-0000-0000-000000000001', 'farmer', 'Basavaraj Patil (ಬಸವರಾಜ ಪಾಟೀಲ)', '+919845011111', 'kn', true),
('u0000001-0000-0000-0000-000000000002', 'farmer', 'Ningappa Gowda (ನಿಂಗಪ್ಪ ಗೌಡ)', '+919845022222', 'kn', true),
('u0000001-0000-0000-0000-000000000003', 'farmer', 'Ramesh Hegde (ರಮೇಶ್ ಹೆಗಡೆ)', '+919845033333', 'en', true);

INSERT INTO farmer_profiles (id, user_id, village, taluk, district, lat, lng) VALUES
('f0000001-0000-0000-0000-000000000001', 'u0000001-0000-0000-0000-000000000001', 'Konnur', 'Gokak', 'Belagavi', 16.1952, 74.8340),
('f0000001-0000-0000-0000-000000000002', 'u0000001-0000-0000-0000-000000000002', 'Annigeri', 'Navalgund', 'Dharwad', 15.4278, 75.4336),
('f0000001-0000-0000-0000-000000000003', 'u0000001-0000-0000-0000-000000000003', 'Bilikere', 'Hunsur', 'Mysuru', 12.3394, 76.4385);

-- Sellers
INSERT INTO profiles (id, role, full_name, phone, language, is_verified) VALUES
('u0000002-0000-0000-0000-000000000001', 'seller', 'Suresh Kumar', '+919845044444', 'kn', true),
('u0000002-0000-0000-0000-000000000002', 'seller', 'Anand Kulkarni', '+919845055555', 'kn', true),
('u0000002-0000-0000-0000-000000000003', 'seller', 'Manjunath Swamy', '+919845066666', 'en', true),
('u0000002-0000-0000-0000-000000000004', 'seller', 'Praveen Shettar', '+919845077777', 'kn', true);

INSERT INTO seller_profiles (id, user_id, shop_name, license_no, preferred_crops, rating_avg, rating_count) VALUES
('s0000001-0000-0000-0000-000000000001', 'u0000002-0000-0000-0000-000000000001', 'Suresh Agro Traders', 'APMC-HUB-2024-88', ARRAY['Onion', 'Potato'], 4.80, 24),
('s0000001-0000-0000-0000-000000000002', 'u0000002-0000-0000-0000-000000000002', 'Annapurna Veg Syndicate', 'APMC-HUB-2023-14', ARRAY['Tomato', 'Green Chilli'], 4.65, 18),
('s0000001-0000-0000-0000-000000000003', 'u0000002-0000-0000-0000-000000000003', 'Cauvery Mandi Commission', 'APMC-BLR-2022-09', ARRAY['Tomato', 'Onion', 'Potato'], 4.90, 42),
('s0000001-0000-0000-0000-000000000004', 'u0000002-0000-0000-0000-000000000004', 'Basaveshwara Agro', 'APMC-BEL-2024-03', ARRAY['Maize', 'Groundnut', 'Tomato'], 4.50, 11);

-- Link Sellers to APMC Markets
INSERT INTO seller_markets (seller_id, market_id) VALUES
('s0000001-0000-0000-0000-000000000001', 'm0000001-0000-0000-0000-000000000001'), -- Suresh -> Hubballi
('s0000001-0000-0000-0000-000000000002', 'm0000001-0000-0000-0000-000000000001'), -- Annapurna -> Hubballi
('s0000001-0000-0000-0000-000000000003', 'm0000001-0000-0000-0000-000000000003'), -- Cauvery -> Bengaluru
('s0000001-0000-0000-0000-000000000004', 'm0000001-0000-0000-0000-000000000002'); -- Basaveshwara -> Belagavi

-- ------------------------------------------------------------------------------
-- 4. SEED 8 CROP LISTINGS IN VARIOUS LIFECYCLE STATES
-- ------------------------------------------------------------------------------
-- 1. Fresh Tomato listing (status: posted)
INSERT INTO crop_listings (id, farmer_id, crop_id, market_id, quantity_kg, quantity_remaining_kg, price_per_kg, entered_quantity, entered_unit, entered_price, entered_price_unit, harvest_date, description, status, idempotency_key) VALUES
('l0000001-0000-0000-0000-000000000001', 'f0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'm0000001-0000-0000-0000-000000000001', 500.00, 500.00, 22.00, 5.00, 'quintal', 2200.00, 'quintal', CURRENT_DATE, 'Grade-A fresh red round tomatoes harvested this morning. Firm and clean.', 'posted', 'i0000001-0000-0000-0000-000000000001');

-- 2. Onion listing with offers (status: buyer_interested)
INSERT INTO crop_listings (id, farmer_id, crop_id, market_id, quantity_kg, quantity_remaining_kg, price_per_kg, entered_quantity, entered_unit, entered_price, entered_price_unit, harvest_date, description, status, idempotency_key) VALUES
('l0000001-0000-0000-0000-000000000002', 'f0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000002', 'm0000001-0000-0000-0000-000000000001', 1000.00, 1000.00, 28.00, 10.00, 'quintal', 2800.00, 'quintal', CURRENT_DATE - 1, 'Medium-large Bellary pink onion. Well dried and packed in gunny bags.', 'buyer_interested', 'i0000001-0000-0000-0000-000000000002');

-- 3. Potato listing with confirmed visit (status: visit_confirmed)
INSERT INTO crop_listings (id, farmer_id, crop_id, market_id, quantity_kg, quantity_remaining_kg, price_per_kg, entered_quantity, entered_unit, entered_price, entered_price_unit, harvest_date, description, status, idempotency_key) VALUES
('l0000001-0000-0000-0000-000000000003', 'f0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000003', 'm0000001-0000-0000-0000-000000000001', 800.00, 0.00, 19.50, 8.00, 'quintal', 1950.00, 'quintal', CURRENT_DATE - 2, 'Jyoti variety table potato, uniform medium size, minimal mud.', 'visit_confirmed', 'i0000001-0000-0000-0000-000000000003');

-- 4. Green Chilli listing (status: posted)
INSERT INTO crop_listings (id, farmer_id, crop_id, market_id, quantity_kg, quantity_remaining_kg, price_per_kg, entered_quantity, entered_unit, entered_price, entered_price_unit, harvest_date, description, status, idempotency_key) VALUES
('l0000001-0000-0000-0000-000000000004', 'f0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000006', 'm0000001-0000-0000-0000-000000000002', 150.00, 150.00, 45.00, 150.00, 'kg', 45.00, 'kg', CURRENT_DATE, 'G4 spicy green chillies. Freshly hand-picked early morning.', 'posted', 'i0000001-0000-0000-0000-000000000004');

-- 5. Maize listing (status: buyer_interested)
INSERT INTO crop_listings (id, farmer_id, crop_id, market_id, quantity_kg, quantity_remaining_kg, price_per_kg, entered_quantity, entered_unit, entered_price, entered_price_unit, harvest_date, description, status, idempotency_key) VALUES
('l0000001-0000-0000-0000-000000000005', 'f0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000005', 'm0000001-0000-0000-0000-000000000002', 2000.00, 2000.00, 18.00, 20.00, 'quintal', 1800.00, 'quintal', CURRENT_DATE - 3, 'Yellow hybrid feed maize, 13% moisture level, clean kernels.', 'buyer_interested', 'i0000001-0000-0000-0000-000000000005');

-- 6. Rice (Paddy) listing (status: partially_sold)
INSERT INTO crop_listings (id, farmer_id, crop_id, market_id, quantity_kg, quantity_remaining_kg, price_per_kg, entered_quantity, entered_unit, entered_price, entered_price_unit, harvest_date, description, status, idempotency_key) VALUES
('l0000001-0000-0000-0000-000000000006', 'f0000001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000004', 'm0000001-0000-0000-0000-000000000004', 3000.00, 1000.00, 26.00, 3.00, 'tonne', 26000.00, 'tonne', CURRENT_DATE - 4, 'Sona Masoori raw paddy, moisture 14%, excellent grain length.', 'partially_sold', 'i0000001-0000-0000-0000-000000000006');

-- 7. Groundnut listing (status: sold)
INSERT INTO crop_listings (id, farmer_id, crop_id, market_id, quantity_kg, quantity_remaining_kg, price_per_kg, entered_quantity, entered_unit, entered_price, entered_price_unit, harvest_date, description, status, idempotency_key) VALUES
('l0000001-0000-0000-0000-000000000007', 'f0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000008', 'm0000001-0000-0000-0000-000000000002', 1200.00, 0.00, 65.00, 12.00, 'quintal', 6500.00, 'quintal', CURRENT_DATE - 7, 'TMV-2 dried pods, high oil yield, pod filling 80%.', 'sold', 'i0000001-0000-0000-0000-000000000007');

-- 8. Cancelled listing (status: cancelled)
INSERT INTO crop_listings (id, farmer_id, crop_id, market_id, quantity_kg, quantity_remaining_kg, price_per_kg, entered_quantity, entered_unit, entered_price, entered_price_unit, harvest_date, description, status, idempotency_key) VALUES
('l0000001-0000-0000-0000-000000000008', 'f0000001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000001', 'm0000001-0000-0000-0000-000000000004', 400.00, 400.00, 20.00, 4.00, 'quintal', 2000.00, 'quintal', CURRENT_DATE - 10, 'Weather damage after heavy rains, withdrawn by farmer.', 'cancelled', 'i0000001-0000-0000-0000-000000000008');

-- ------------------------------------------------------------------------------
-- 5. SEED OFFERS, BOOKINGS & TRANSACTIONS
-- ------------------------------------------------------------------------------
-- Offers for listing 2 (Onion)
INSERT INTO buyer_offers (id, listing_id, seller_id, quantity_kg, price_per_kg, proposed_visit_at, status, message) VALUES
('o0000001-0000-0000-0000-000000000001', 'l0000001-0000-0000-0000-000000000002', 's0000001-0000-0000-0000-000000000001', 500.00, 29.00, NOW() + INTERVAL '1 day', 'pending', 'Interested in 5 quintals, can pick up tomorrow morning from Hubballi.'),
('o0000001-0000-0000-0000-000000000002', 'l0000001-0000-0000-0000-000000000002', 's0000001-0000-0000-0000-000000000002', 600.00, 27.50, NOW() + INTERVAL '2 days', 'pending', 'Can take 6 quintals on Wednesday at 10 AM.');

-- Accepted offer & Visit booking for listing 3 (Potato)
INSERT INTO buyer_offers (id, listing_id, seller_id, quantity_kg, price_per_kg, proposed_visit_at, status, message) VALUES
('o0000001-0000-0000-0000-000000000003', 'l0000001-0000-0000-0000-000000000003', 's0000001-0000-0000-0000-000000000001', 800.00, 19.50, NOW() + INTERVAL '18 hours', 'accepted', 'Confirmed all 8 quintals. Will bring vehicle to yard.');

INSERT INTO visit_bookings (id, offer_id, scheduled_at, verification_code, status, notes) VALUES
('v0000001-0000-0000-0000-000000000001', 'o0000001-0000-0000-0000-000000000003', NOW() + INTERVAL '18 hours', 'HUB-8921', 'confirmed', 'Vehicle KA-25-EA-4412 will arrive at Gate 2.');

-- Completed offer, transaction and rating for listing 7 (Groundnut)
INSERT INTO buyer_offers (id, listing_id, seller_id, quantity_kg, price_per_kg, proposed_visit_at, status, message) VALUES
('o0000001-0000-0000-0000-000000000004', 'l0000001-0000-0000-0000-000000000007', 's0000001-0000-0000-0000-000000000004', 1200.00, 65.00, NOW() - INTERVAL '3 days', 'accepted', 'Deal closed and loaded.');

INSERT INTO transactions (id, offer_id, final_quantity_kg, final_price_per_kg, total_amount, payment_method, completed_at) VALUES
('t0000001-0000-0000-0000-000000000001', 'o0000001-0000-0000-0000-000000000004', 1200.00, 65.00, 78000.00, 'upi', NOW() - INTERVAL '3 days');

INSERT INTO ratings (id, transaction_id, rater_id, ratee_id, stars, comment) VALUES
('r0000001-0000-0000-0000-000000000001', 't0000001-0000-0000-0000-000000000001', 'u0000001-0000-0000-0000-000000000001', 'u0000002-0000-0000-0000-000000000004', 5, 'Quick weighment and immediate UPI transfer. Honest trader.');
