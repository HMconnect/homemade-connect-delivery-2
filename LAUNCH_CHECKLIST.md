# 🚀 HOMEMADE CONNECT DELIVERY — FINAL LAUNCH CHECKLIST
# Complete ALL items before public launch

## PHASE 1 — CODE ✅
- [x] next-themes removed — zero references
- [x] Double AuthProvider fixed — single instance in App.tsx
- [x] ErrorBoundary wraps entire app
- [x] Vite-safe ThemeProvider with localStorage
- [x] Reusable Modal (focus trap, ESC, ARIA, dark mode)
- [x] SampleVendorModal with isSample flag
- [x] WelcomePopup (3s delay, localStorage, once per session)
- [x] VendorCard with isSample support
- [x] CheckoutPayPal (hosted button PRZQ66AUU3BM4)
- [x] StripeCheckout frontend component
- [x] All Stripe API endpoints (5 total)
- [x] vercel.json SPA routing
- [x] netlify.toml fallback
- [x] React Query caching (5min stale, 30min GC)
- [x] Global error logger with Supabase sink
- [x] Supabase RLS hardening
- [x] Edge function audit — all Serverless

## PHASE 2 — DATABASE
- [ ] Run SUPABASE_STRIPE_MIGRATION.sql in Supabase SQL Editor
- [ ] Run SUPABASE_RLS_HARDENING.sql in Supabase SQL Editor
- [ ] Verify app_logs table created
- [ ] Set owner account as admin:
      UPDATE user_profiles SET is_admin=true, role='admin'
      WHERE email='info@homemadeconnectdelivery.com';

## PHASE 3 — LOCAL BUILD TEST
- [ ] npm run build — zero errors
- [ ] npx serve dist — open localhost:3000
- [ ] App loads — NOT blank
- [ ] Welcome popup after 3 seconds
- [ ] Click sample vendor → modal opens
- [ ] ESC closes modal
- [ ] Bottom navigation works
- [ ] Signup flow works
- [ ] No console errors (F12)

## PHASE 4 — VERCEL DEPLOYMENT
- [ ] Connect Vercel to GitHub repo
- [ ] Set build command: npm run build
- [ ] Set output directory: dist
- [ ] Add environment variables:
      VITE_SUPABASE_URL
      VITE_SUPABASE_ANON_KEY
      VITE_STRIPE_PUBLISHABLE_KEY (when ready)
      STRIPE_SECRET_KEY (when ready)
      STRIPE_CONNECT_WEBHOOK_SECRET (when ready)
- [ ] Deploy and verify live URL loads
- [ ] Test SPA routing (refresh on /welcome, /driver)

## PHASE 5 — STRIPE TEST MODE
- [ ] Create Stripe account at stripe.com
- [ ] Get test mode API keys
- [ ] Add to Vercel environment variables
- [ ] Test vendor onboarding flow
- [ ] Test driver onboarding flow  
- [ ] Test payment with card: 4242 4242 4242 4242
- [ ] Verify webhook receives payment_intent.succeeded
- [ ] Verify transfers created in Stripe dashboard
- [ ] Verify vendor balance updated
- [ ] Verify driver balance updated

## PHASE 6 — STRIPE LIVE MODE
- [ ] Apply for Y Combinator startup credits at startupschool.org
- [ ] Apply for Stripe startup program at stripe.com/startup
- [ ] Switch to live mode keys when credits confirmed
- [ ] Test real payment with small amount ($1.00)
- [ ] Verify real payout to test bank account

## PHASE 7 — SOFT LAUNCH
- [ ] Invite first 10 vendors personally
- [ ] Each vendor completes profile and lists 3+ products
- [ ] Each vendor tests checkout as customer
- [ ] Collect feedback and fix any issues
- [ ] Invite first 5 drivers
- [ ] Test complete order flow end-to-end

## PHASE 8 — PUBLIC LAUNCH 🎉
- [ ] Post on Facebook with app link
- [ ] Send email to all outreach contacts announcing launch
- [ ] Hand out flyers on Uber Eats deliveries
- [ ] Post NotebookLM video
- [ ] Monitor Supabase for new signups
- [ ] Monitor app_logs for any errors
- [ ] Respond to all vendor inquiries within 24 hours

## EMERGENCY CONTACTS:
- Supabase support: supabase.com/support
- Vercel support: vercel.com/support
- Stripe support: stripe.com/support or 1-888-926-2289
- Claude: claude.ai (you're already here!)
- Copilot: github.com/copilot
