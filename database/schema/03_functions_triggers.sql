-- =============================================================================
-- STRATEGY CONTROL CENTER — DATABASE FUNCTIONS & TRIGGERS
-- =============================================================================

-- 1. Automatic updated_at Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Attach updated_at triggers
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_homepage_sections_updated_at BEFORE UPDATE ON homepage_sections FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON banners FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_training_programs_updated_at BEFORE UPDATE ON training_programs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 2. Version Tracking for Homepage Sections
CREATE OR REPLACE FUNCTION track_homepage_section_version()
RETURNS TRIGGER AS $$
BEGIN
   IF (OLD.configuration IS DISTINCT FROM NEW.configuration) THEN
      NEW.current_version = OLD.current_version + 1;
      INSERT INTO homepage_section_versions(section_id, version_number, configuration)
      VALUES (NEW.id, NEW.current_version, NEW.configuration);
   END IF;
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_homepage_section_version BEFORE UPDATE ON homepage_sections FOR EACH ROW EXECUTE PROCEDURE track_homepage_section_version();
