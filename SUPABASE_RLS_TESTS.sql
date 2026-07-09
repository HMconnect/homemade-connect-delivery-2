-- ============================================
-- SUPABASE RLS VALIDATION TESTS
-- Run each block and verify expected results
-- ============================================

-- TEST 1: Vendor can only read own Stripe account
-- Expected: Returns only the row where id = current user
SELECT id, stripe_account_id, stripe_onboarding_complete
FROM user_profiles
WHERE id = auth.uid();
-- ✅ Should return 1 row (own data only)
-- ❌ Should NOT return other users' stripe_account_id

-- TEST 2: Vendor cannot read other vendors' financial data
-- Expected: Returns 0 rows or only own row
SELECT id, stripe_account_id 
FROM user_profiles
WHERE id != auth.uid();
-- ✅ Should return 0 rows (RLS blocks access)

-- TEST 3: Driver earnings isolation
-- Expected: Only own earnings visible
SELECT * FROM driver_earnings
WHERE driver_id != auth.uid();
-- ✅ Should return 0 rows

-- TEST 4: Customer cannot see financial order data of others
SELECT stripe_payment_intent_id, vendor_amount, driver_amount
FROM orders
WHERE customer_id != auth.uid();
-- ✅ Should return 0 rows

-- TEST 5: Admin can see all (run as admin user)
-- First set test user as admin:
-- UPDATE user_profiles SET is_admin=true WHERE email='test@admin.com';
SELECT COUNT(*) as total_users FROM user_profiles;
SELECT COUNT(*) as total_orders FROM orders;
-- ✅ Admin should see all rows

-- TEST 6: Log insertion (any authenticated user)
INSERT INTO app_logs (level, source, message)
VALUES ('info', 'frontend', 'RLS test log entry');
-- ✅ Should succeed

-- TEST 7: Log reading (admin only)
SELECT * FROM app_logs ORDER BY created_at DESC LIMIT 5;
-- ✅ Admin sees logs
-- ❌ Regular user should get 0 rows

-- ============================================
-- CLEANUP
-- ============================================
DELETE FROM app_logs WHERE message = 'RLS test log entry';
