-- ============================================
-- FIX: signup flow broken by missing INSERT policy
-- Run this in the Supabase SQL Editor
-- ============================================
--
-- SUPABASE_RLS_HARDENING.sql enabled RLS on user_profiles and added
-- SELECT and UPDATE policies, but no INSERT policy. AuthContext.tsx's
-- fetchProfile() tries to create a user's profile row client-side right
-- after signup — with RLS on and no INSERT policy, Postgres denies that
-- insert by default. The auth account still gets created (that's a
-- separate, unaffected table), but the app never gets a profile row,
-- so anything depending on `profile` (role-based routing, dashboards)
-- silently breaks.
--
-- This policy lets a freshly-authenticated user insert exactly one row
-- for themselves (id must match their own auth.uid()) and nothing else.

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================
-- Verify it worked
-- ============================================
-- After running the above, confirm the policy exists:
--
--   SELECT policyname, cmd FROM pg_policies
--   WHERE tablename = 'user_profiles';
--
-- You should see an INSERT policy alongside the existing SELECT/UPDATE
-- ones. Then test an actual signup end-to-end and confirm a matching
-- row appears in user_profiles:
--
--   SELECT id, email, role, created_at FROM user_profiles
--   ORDER BY created_at DESC LIMIT 5;
