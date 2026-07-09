# Pre-Deploy Checklist — Homemade Connect Delivery
# Run EVERY time before deploying

## STEP 1 — Build
```bash
npm run build
```
✅ Must complete with ZERO errors

## STEP 2 — Local test with serve
```bash
npx serve dist
```
Open http://localhost:3000 and verify:
- [ ] App loads — NOT blank
- [ ] Welcome popup appears after 3 seconds
- [ ] Click sample vendor → SampleVendorModal opens
- [ ] ESC key closes modal
- [ ] Backdrop click closes modal
- [ ] Bottom navigation works (Home/Market/Vendor/Drive/Account)
- [ ] Sign up flow navigates correctly
- [ ] Dark mode toggle works (if applicable)
- [ ] No console errors (F12 → Console tab)
- [ ] No console warnings about next-themes or AuthProvider

## STEP 3 — SPA routing test
```bash
npx serve dist
```
- [ ] Navigate to /welcome — page loads
- [ ] Navigate to /driver — page loads  
- [ ] Refresh on /welcome — does NOT show 404
- [ ] Refresh on /driver — does NOT show 404

## STEP 4 — Mobile test
Open http://[your-local-ip]:3000 on your phone
- [ ] App loads on mobile
- [ ] Touch targets are large enough
- [ ] Bottom navigation visible
- [ ] Welcome popup appears

## STEP 5 — Only deploy if ALL boxes checked!

## DEPLOYMENT STEPS (Vercel):
1. Push to GitHub main branch
2. Vercel auto-deploys
3. Check Vercel build log for errors
4. Visit live URL and repeat mobile test

## DEPLOYMENT STEPS (Netlify drag-and-drop):
1. Build locally: npm run build
2. Open File Explorer: start .
3. Drag dist folder to Netlify deploy box
4. Wait for "Published" confirmation
5. Visit live URL and test

## ENVIRONMENT VARIABLES (set in Vercel/Netlify dashboard):
- VITE_SUPABASE_URL=https://veuqupdtxsmneuewfrze.supabase.co
- VITE_SUPABASE_ANON_KEY=sb_publishable_hfIkyLjpngyc8P_IKNDXSw_gOOtMTZZ
- VITE_STRIPE_PUBLISHABLE_KEY=(add when Stripe credits arrive)
- STRIPE_SECRET_KEY=(add when Stripe credits arrive)
- STRIPE_CONNECT_WEBHOOK_SECRET=(add when Stripe credits arrive)

## COMMON ISSUES:
| Problem | Fix |
|---------|-----|
| Blank page | Check F12 console — usually AuthProvider or import error |
| 404 on refresh | Check vercel.json/netlify.toml has catch-all redirect |
| Popup not showing | Clear localStorage: in console type localStorage.clear() |
| Dark mode broken | Check tailwind.config.ts has darkMode: ["class"] |
| PayPal not loading | Check network tab — PayPal script must load |
