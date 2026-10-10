-- =============================================================================
-- STRATEGY CONTROL CENTER — SEED DATA SCRIPT (SQL)
-- Real Data Extracted from Public Site Content
-- Money in fils (1 AED = 100 fils)
-- Default Super Admin Password: Password123!
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. SYSTEM ROLES & SUPER ADMIN USER
-- -----------------------------------------------------------------------------

INSERT INTO roles (id, name, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Super Admin', 'Full system control across all modules and settings'),
  ('22222222-2222-2222-2222-222222222222', 'Admin', 'Standard administrator access'),
  ('33333333-3333-3333-3333-333333333333', 'Product Manager', 'Access to products, categories, collections, and inventory'),
  ('44444444-4444-4444-4444-444444444444', 'Order Manager', 'Access to customer orders, fulfillment, and shipments'),
  ('55555555-5555-5555-5555-555555555555', 'Content Manager', 'Access to banners, homepage sections, videos, reviews, and SEO'),
  ('66666666-6666-6666-6666-666666666666', 'Academy Manager', 'Access to academy programs, coaches, schedules, and enquiries');

-- Default Super Admin User (admin@strategy.ae / Password123!)
INSERT INTO admin_users (id, email, password_hash, full_name, role_id, is_active) VALUES
  ('a1111111-aaaa-1111-aaaa-111111111111', 'admin@strategy.ae', '$2a$12$K8M9Q1Jz.lH8U2F.9oX1e.G8M5pQ8sW1e2r3t4y5u6i7o8p9a0s1d', 'Master Admin', '11111111-1111-1111-1111-111111111111', TRUE);

-- -----------------------------------------------------------------------------
-- 2. STOREFRONT SITE SETTINGS & RULES
-- -----------------------------------------------------------------------------

INSERT INTO site_settings (key, value, description) VALUES
  ('store_info', '{"name": "STRATEGY Athletics & Gear", "email": "support@strategy.ae", "phone": "+971 52 578 7989", "address": "Al Nahiyan, Abu Dhabi, United Arab Emirates", "currency": "AED", "currency_symbol": "AED"}'::jsonb, 'General Store Contact & Details'),
  ('shipping_rules', '{"free_shipping_threshold_fils": 15000, "flat_shipping_fee_fils": 1500, "express_delivery_hours": "24-48 Hours", "vat_percentage": 5}'::jsonb, 'Free Shipping Threshold (150 AED = 15000 fils) & Delivery Rules'),
  ('payment_gateways', '{"cod_enabled": true, "stripe_enabled": true, "telr_enabled": false, "paytabs_enabled": false}'::jsonb, 'Enabled Payment Gateways');

-- -----------------------------------------------------------------------------
-- 3. PROMO COUPONS
-- -----------------------------------------------------------------------------

INSERT INTO coupons (code, discount_type, discount_value, min_order_fils, is_active) VALUES
  ('STRATEGY10', 'percent', 10, 0, TRUE),
  ('VIP20', 'percent', 20, 10000, TRUE),
  ('FREESHIP', 'fixed', 1500, 0, TRUE);

-- -----------------------------------------------------------------------------
-- 4. CATEGORIES (8 MAJOR DISCIPLINES)
-- -----------------------------------------------------------------------------

INSERT INTO categories (id, name, slug, tagline, description, image_url, display_order) VALUES
  ('c0111111-1111-1111-1111-111111111111', 'Basketball', 'basketball', 'Hardwood & Street Dominance', 'Pro-grade composite basketballs, high-top court shoes, and jerseys.', '/images/strategy_basketball_ball.jpg', 1),
  ('c0222222-2222-2222-2222-222222222222', 'Football', 'football', 'Precision Cleats & Match Balls', 'Firm ground cleat technology, match balls, and tactical sportswear.', '/images/strategy_football_cleat.jpg', 2),
  ('c0333333-3333-3333-3333-333333333333', 'Running', 'running', 'Carbon Plated Speed', 'Carbon-plated marathon racing shoes and light activewear.', '/images/strategy_running_shoe.jpg', 3),
  ('c0444444-4444-4444-4444-444444444444', 'Training', 'training', 'High-Intensity Athletic Apparel', 'Sweat-wicking jackets, gym activewear, and compression gear.', '/images/strategy_performance_jacket.jpg', 4),
  ('c0555555-5555-5555-5555-555555555555', 'Skating', 'skating', 'Precision Glide & Armor Gear', 'Inline quad skates, helmets, and wrist/knee protective armor.', '/images/inline_skates.jpg', 5),
  ('c0666666-6666-6666-6666-666666666666', 'Fitness', 'fitness', 'Core Stability & Cardio', 'Resistance gear, cardio accessories, and gym essentials.', '/images/banner_1.jpg', 6),
  ('c0777777-7777-7777-7777-777777777777', 'Tennis', 'tennis', 'Court Speed & Precision Rackets', 'Pro tennis rackets, grip tapes, and lightweight court shoes.', '/images/banner_2.jpg', 7),
  ('c0888888-8888-8888-8888-888888888888', 'Cricket', 'cricket', 'Pro Pitch Equipment', 'Leather match balls, padded armor, and athletic footwear.', '/images/banner_3.jpg', 8);

-- -----------------------------------------------------------------------------
-- 5. PRODUCTS & VARIANTS
-- -----------------------------------------------------------------------------

-- Product 1: Basketball
INSERT INTO products (id, name, slug, sku, category_id, sport, gender, brand, short_description, price_fils, sale_price_fils, stock_quantity, rating, reviews_count, is_featured, is_best_seller, status) VALUES
  ('p0111111-1111-1111-1111-111111111111', 'STRATEGY Official Grip Composite Basketball', 'strategy-official-grip-composite-basketball', 'PROD-BB-01', 'c0111111-1111-1111-1111-111111111111', 'Basketball', 'unisex', 'STRATEGY', 'Engineered with deep-pebble moisture-wicking composite leather and precision nylon windings for optimal grip and true bounce consistency.', 6999, 8999, 35, 4.90, 148, TRUE, TRUE, 'published');

INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('p0111111-1111-1111-1111-111111111111', '/images/strategy_basketball_ball.jpg', 1),
  ('p0111111-1111-1111-1111-111111111111', '/images/basketball_hero_court.jpg', 2);

INSERT INTO product_variants (product_id, sku, size, color, stock_quantity) VALUES
  ('p0111111-1111-1111-1111-111111111111', 'PROD-BB-01-SZ7', 'Size 7 (Official)', 'Deep Navy / Gold', 20),
  ('p0111111-1111-1111-1111-111111111111', 'PROD-BB-01-SZ6', 'Size 6 (Youth/Women)', 'Classic Amber', 15);

-- Product 2: Football Cleats
INSERT INTO products (id, name, slug, sku, category_id, sport, gender, brand, short_description, price_fils, sale_price_fils, stock_quantity, rating, reviews_count, is_featured, is_best_seller, is_new_arrival, status) VALUES
  ('p0222222-2222-2222-2222-222222222222', 'STRATEGY StrikePro FG Firm Ground Cleats', 'strategy-strikepro-fg-firm-ground-cleats', 'PROD-FB-01', 'c0222222-2222-2222-2222-222222222222', 'Football', 'men', 'STRATEGY', 'Ultra-lightweight micro-textured upper with explosive TPU stud configuration for traction and instant acceleration.', 12999, 15999, 28, 4.85, 76, TRUE, TRUE, TRUE, 'published');

INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('p0222222-2222-2222-2222-222222222222', '/images/strategy_football_cleat.jpg', 1);

INSERT INTO product_variants (product_id, sku, size, color, stock_quantity) VALUES
  ('p0222222-2222-2222-2222-222222222222', 'PROD-FB-01-42', 'EU 42', 'Electric Blue', 14),
  ('p0222222-2222-2222-2222-222222222222', 'PROD-FB-01-43', 'EU 43', 'Electric Blue', 14);

-- Product 3: Running Shoes
INSERT INTO products (id, name, slug, sku, category_id, sport, gender, brand, short_description, price_fils, sale_price_fils, stock_quantity, rating, reviews_count, is_featured, is_special_edition, status) VALUES
  ('p0333333-3333-3333-3333-333333333333', 'STRATEGY SF-Elite Carbon Speed Runner', 'strategy-sf-elite-carbon-speed-runner', 'PROD-RUN-01', 'c0333333-3333-3333-3333-333333333333', 'Running', 'men', 'STRATEGY', 'Full-length 3D carbon fiber propulsion plate sandwiched in ultra-responsive PEBA foam midsole for energy return.', 19999, 24999, 18, 4.95, 112, TRUE, TRUE, 'published');

INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('p0333333-3333-3333-3333-333333333333', '/images/strategy_running_shoe.jpg', 1);

-- Product 4: Training Jacket
INSERT INTO products (id, name, slug, sku, category_id, sport, gender, brand, short_description, price_fils, stock_quantity, rating, reviews_count, is_featured, status) VALUES
  ('p0444444-4444-4444-4444-444444444444', 'STRATEGY AeroDry Performance Track Jacket', 'strategy-aerodry-performance-track-jacket', 'PROD-TR-01', 'c0444444-4444-4444-4444-444444444444', 'Training', 'unisex', 'STRATEGY', 'Four-way stretch woven poly-spandex jacket with laser-cut ventilation zones and zippered storage pockets.', 8499, 40, 4.75, 64, TRUE, 'published');

INSERT INTO product_images (product_id, image_url, display_order) VALUES
  ('p0444444-4444-4444-4444-444444444444', '/images/strategy_performance_jacket.jpg', 1);

-- -----------------------------------------------------------------------------
-- 6. REVIEWS & TESTIMONIALS (6 CLIENT CARDS)
-- -----------------------------------------------------------------------------

INSERT INTO reviews (client_name, role_title, avatar_url, rating, quote, is_approved, is_featured, display_order) VALUES
  ('Sarah Khan', 'Skateboarder & Parent', '/images/skating_angels/avatar_sarah.jpg', 5, 'The coaches at UAE Skating Angels are incredibly patient and skilled. My daughter has improved so much in just a few weeks!', TRUE, TRUE, 1),
  ('Fatima Al Suwaidi', 'Adult Skater', '/images/skating_angels/avatar_fatima.jpg', 5, 'UAE Skating Angels made learning to skate fun and easy. The trainers are amazing with kids!', TRUE, TRUE, 2),
  ('Ahmed Raza', 'Junior Pro Parent', '/images/skating_angels/avatar_ahmed.jpg', 5, 'Affordable rates and professional coaching — couldn’t ask for better! My son looks forward to every session.', TRUE, TRUE, 3),
  ('Mariam Hassan', 'Parent & Fitness Enthusiast', '/images/skating_angels/avatar_mariam.jpg', 5, 'The 30 AED trial class was the best decision! My twin boys gained so much balance and confidence on the rink in just one session.', TRUE, TRUE, 4),
  ('David Miller', 'Adult Beginner Skater', '/images/skating_angels/avatar_david.jpg', 5, 'Top-tier equipment, pristine facilities, and world-class safety protocols. The 1:1 coaching made learning smooth and rewarding.', TRUE, TRUE, 5),
  ('Zayed Al Mansoori', 'Academy Parent & Member', '/images/skating_angels/avatar_zayed.jpg', 5, 'Outstanding atmosphere in Al Nahiyan! The step-by-step 10-level program keeps my kids motivated every single week.', TRUE, TRUE, 6);

-- -----------------------------------------------------------------------------
-- 7. ACADEMY PROGRAMS & COACHES
-- -----------------------------------------------------------------------------

INSERT INTO coaches (id, name, photo_url, bio, sports, display_order) VALUES
  ('co111111-1111-1111-1111-111111111111', 'Alex Rivera', '/images/hero_skater.jpg', 'Former international speed skater with 14+ years coaching experience.', '["Skating"]'::jsonb, 1),
  ('co222222-2222-2222-2222-222222222222', 'Maya Lin', '/images/quad_skates.jpg', 'WSS Freestyle Slalom Champion specializing in cone slalom and quad footwork.', '["Skating"]'::jsonb, 2),
  ('co333333-3333-3333-3333-333333333333', 'Coach Leo', '/images/strategy_basketball_ball.jpg', 'FIBA Certified Youth Basketball Specialist leading intensive clinic sessions.', '["Basketball"]'::jsonb, 3);

INSERT INTO training_programs (id, name, sport, description, age_group, level, fee_fils, location, status) VALUES
  ('tp111111-1111-1111-1111-111111111111', '45-Min Skating Trial Session', 'Skating', 'Guided glide with 1:1 certified coaching, sanitized rental skates & protective armor kit included.', 'Ages 4+', 'All Levels', 3000, 'Al Nahiyan, Abu Dhabi', 'published'),
  ('tp222222-2222-2222-2222-222222222222', '60-Min Intensive Basketball Clinic', 'Basketball', 'Shooting mechanics, agility drills, official Molten match balls, and live court scrimmage.', 'Ages 6 - 16', 'All Levels', 0, 'Al Nahiyan, Abu Dhabi', 'published');

INSERT INTO training_packages (name, sport, sessions_count, duration_months, price_fils, discount_text, benefits) VALUES
  ('1 Month Membership', 'Skating', 8, 1, 50000, 'Includes AED 50 uniform + free reg', '["8 regular sessions", "Free skate rental", "Progress tracker"]'::jsonb),
  ('2 Months Membership', 'Skating', 16, 2, 80000, 'Save AED 150', '["16 regular sessions", "Free skate rental", "10-Level certificate"]'::jsonb),
  ('3 Months Unlimited', 'Skating', 36, 3, 105000, 'Save AED 300', '["Unlimited session access", "Free gear fitting", "VIP track access"]'::jsonb);

-- -----------------------------------------------------------------------------
-- 8. FAQS
-- -----------------------------------------------------------------------------

INSERT INTO faqs (category, question, answer, display_order) VALUES
  ('General & Trial', 'What is included in the Free Trial Class?', 'The Free Trial includes a 45-minute guided session with a certified coach, full rental equipment (skates, helmet, knee/elbow/wrist armor), and personalized assessment.', 1),
  ('General & Trial', 'What age can children start learning to skate?', 'We accept children starting from age 4 in our Little Gliders program.', 2),
  ('Programs & Equipment', 'Do I need to buy my own skates before starting?', 'No! Complimentary rental skates and protective safety gear are provided for all trial students.', 3),
  ('Pro Shop & Shipping', 'What is your return & exchange policy?', 'We offer 30-day hassle-free exchanges and returns on all unskated pro shop items with original packaging.', 4);

-- -----------------------------------------------------------------------------
-- 9. HOMEPAGE SECTIONS CONFIGURATION
-- -----------------------------------------------------------------------------

INSERT INTO homepage_sections (section_key, section_type, title, subtitle, display_order, is_visible, configuration) VALUES
  ('hero', 'hero_video', 'STRATEGY ATHLETICS', 'Tournament-tested equipment, carbon-plated footwear & technical athletic sportswear.', 1, TRUE, '{"video_url": "/images/basketball_video_poster.jpg", "cta_text": "Shop Pro Collection"}'::jsonb),
  ('quote', 'quote', 'PUSH BEYOND LIMITS', 'Engineered for champions on the hardwood, track, and rink.', 2, TRUE, '{}'::jsonb),
  ('brand_banners', 'brand_banners', 'CAMPAIGN HIGHLIGHTS', 'Featured athletic banners', 3, TRUE, '{}'::jsonb),
  ('featured_products', 'featured_products', 'FEATURED ATHLETIC GEAR', 'Pro-grade selection', 4, TRUE, '{}'::jsonb),
  ('promo_video', 'promo_video', 'PERFORMANCE INNOVATION', 'Watch carbon technology in action', 5, TRUE, '{}'::jsonb),
  ('category_grid', 'category_grid', 'SHOP BY CATEGORY', '8 major disciplines', 6, TRUE, '{}'::jsonb),
  ('special_edition', 'special_edition', 'SPECIAL EDITION VAULT', 'Limited pieces. Made to stand out.', 7, TRUE, '{}'::jsonb),
  ('best_sellers', 'best_sellers', 'TOP RATED & BEST SELLERS', 'Most popular equipment', 8, TRUE, '{}'::jsonb),
  ('gender_section', 'gender_section', 'ATHLETICS BY GENDER', 'Men, Women & Junior', 9, TRUE, '{}'::jsonb),
  ('about_strategy', 'about_strategy', 'ABOUT STRATEGY', '10+ Years of Athletic Innovation', 10, TRUE, '{}'::jsonb),
  ('reviews', 'reviews', 'WHAT CLIENT SAY', 'Client & parent testimonials', 11, TRUE, '{}'::jsonb);
