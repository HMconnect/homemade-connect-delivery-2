-- ============================================
-- HOMEMADE CONNECT DELIVERY
-- Stripe Connect Migration
-- Run in Supabase SQL Editor
-- ============================================

-- Add Stripe fields to user_profiles (vendors and drivers)
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS stripe_account_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_onboarding_complete BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS stripe_payouts_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS stripe_charges_enabled BOOLEAN DEFAULT FALSE;

-- Add Stripe fields to orders
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_transfer_group TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS vendor_amount INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS driver_amount INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS platform_fee INTEGER DEFAULT 0;

-- Add Stripe payout tracking to driver_earnings
ALTER TABLE driver_earnings
ADD COLUMN IF NOT EXISTS stripe_payout_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_transfer_id TEXT,
ADD COLUMN IF NOT EXISTS payout_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS instant_payout BOOLEAN DEFAULT FALSE;

-- Index for fast order lookup by transfer_group
CREATE INDEX IF NOT EXISTS idx_orders_transfer_group 
ON orders(stripe_transfer_group);

-- Index for vendor Stripe account lookup
CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe_account 
ON user_profiles(stripe_account_id);

-- ============================================
-- PAYMENT SPLIT FUNCTION
-- Automatically calculates splits on order creation
-- ============================================
CREATE OR REPLACE FUNCTION calculate_order_split(
  order_amount_cents INTEGER,
  delivery_fee_cents INTEGER DEFAULT 399
)
RETURNS TABLE (
  total_cents INTEGER,
  platform_fee_cents INTEGER,
  vendor_amount_cents INTEGER,
  driver_amount_cents INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (order_amount_cents + delivery_fee_cents)::INTEGER as total_cents,
    (ROUND(order_amount_cents * 0.10))::INTEGER as platform_fee_cents,
    (ROUND(order_amount_cents * 0.75))::INTEGER as vendor_amount_cents,
    (ROUND(order_amount_cents * 0.15) + delivery_fee_cents)::INTEGER as driver_amount_cents;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- RLS POLICIES FOR STRIPE DATA
-- ============================================

-- Users can only see their own Stripe account ID
CREATE POLICY IF NOT EXISTS "Users see own stripe data"
ON user_profiles
FOR SELECT
USING (auth.uid() = id);

-- Only admins can update Stripe account IDs
CREATE POLICY IF NOT EXISTS "Admins update stripe accounts"
ON user_profiles
FOR UPDATE
USING (
  auth.uid() = id 
  OR EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);
