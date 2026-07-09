-- ============================================
-- SUPABASE RLS HARDENING
-- Run AFTER SUPABASE_STRIPE_MIGRATION.sql
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USER PROFILES — Stripe data protection
-- ============================================
DROP POLICY IF EXISTS "Users see own profile" ON user_profiles;
CREATE POLICY "Users see own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users update own profile" ON user_profiles;
CREATE POLICY "Users update own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Admins can see all profiles
DROP POLICY IF EXISTS "Admins see all profiles" ON user_profiles;
CREATE POLICY "Admins see all profiles"
ON user_profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- ============================================
-- ORDERS — Role-based access
-- ============================================
DROP POLICY IF EXISTS "Customers see own orders" ON orders;
CREATE POLICY "Customers see own orders"
ON orders FOR SELECT
USING (customer_id = auth.uid());

DROP POLICY IF EXISTS "Vendors see their orders" ON orders;
CREATE POLICY "Vendors see their orders"
ON orders FOR SELECT
USING (vendor_id = auth.uid());

DROP POLICY IF EXISTS "Drivers see assigned orders" ON orders;
CREATE POLICY "Drivers see assigned orders"
ON orders FOR SELECT
USING (driver_id = auth.uid());

DROP POLICY IF EXISTS "Admins see all orders" ON orders;
CREATE POLICY "Admins see all orders"
ON orders FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- ============================================
-- VENDOR PRODUCTS
-- ============================================
DROP POLICY IF EXISTS "Public can view approved products" ON vendor_products;
CREATE POLICY "Public can view approved products"
ON vendor_products FOR SELECT
USING (is_available = true);

DROP POLICY IF EXISTS "Vendors manage own products" ON vendor_products;
CREATE POLICY "Vendors manage own products"
ON vendor_products FOR ALL
USING (vendor_id = auth.uid())
WITH CHECK (vendor_id = auth.uid());

-- ============================================
-- DRIVER EARNINGS — Strict isolation
-- ============================================
DROP POLICY IF EXISTS "Drivers see own earnings" ON driver_earnings;
CREATE POLICY "Drivers see own earnings"
ON driver_earnings FOR SELECT
USING (driver_id = auth.uid());

DROP POLICY IF EXISTS "System inserts earnings" ON driver_earnings;
CREATE POLICY "System inserts earnings"
ON driver_earnings FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- ============================================
-- LOGS TABLE (create if not exists)
-- ============================================
CREATE TABLE IF NOT EXISTS app_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  level TEXT NOT NULL CHECK (level IN ('info', 'warn', 'error')),
  source TEXT NOT NULL,
  message TEXT NOT NULL,
  details JSONB,
  user_id UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Logs: insert-only for all, read only for admins
ALTER TABLE app_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert logs"
ON app_logs FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins read logs"
ON app_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);
