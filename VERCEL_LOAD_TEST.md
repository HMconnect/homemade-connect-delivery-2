# Vercel Deployment Behavior Validation

## COLD START TEST:
1. Open app in fresh incognito window
2. Measure time to first meaningful paint
3. Expected: < 3 seconds on 4G mobile
4. Check: No blank flash before content appears

## MODAL TESTS:
- [ ] Open sample vendor → modal slides in smoothly
- [ ] ESC closes → no animation glitch
- [ ] Backdrop click closes → no layout shift
- [ ] Open/close rapidly → no stuck state
- [ ] Open on mobile → bottom sheet style
- [ ] Open in dark mode → correct colors

## THEME TESTS:
- [ ] Toggle dark/light → smooth 200ms transition
- [ ] Refresh page → theme persists from localStorage
- [ ] No flash of wrong theme on load
- [ ] Modal respects current theme
- [ ] All text readable in both modes

## VENDOR LIST CACHING:
- [ ] First load → Supabase query fires
- [ ] Navigate away and back → uses cache (no spinner)
- [ ] Cache expires after 5 minutes → fresh fetch
- [ ] Sample vendors show SAMPLE badge
- [ ] Click sample → modal opens (not cart)

## CHECKOUT FLOW:
- [ ] PayPal button loads correctly
- [ ] Legal disclaimer shows for correct state
- [ ] Checkbox required before PayPal button appears
- [ ] PayPal window opens in new tab
- [ ] No console errors during checkout

## SPA ROUTING:
- [ ] / → loads Index
- [ ] /welcome → loads Welcome page
- [ ] /driver → loads DriverDashboard
- [ ] /vendor-dashboard → loads VendorDashboard
- [ ] REFRESH on /welcome → still loads (not 404)
- [ ] REFRESH on /driver → still loads (not 404)
- [ ] Deep link to /vendor/123 → loads VendorProfile

## WEBHOOK LATENCY:
- [ ] Payment completes → webhook fires < 5 seconds
- [ ] Transfers created → visible in Stripe dashboard
- [ ] No duplicate webhook processing

## CORS VALIDATION:
- [ ] /api/stripe/* endpoints accessible from frontend
- [ ] No CORS errors in console
- [ ] Preflight OPTIONS requests handled

## MOBILE RESPONSIVENESS:
- [ ] iPhone SE (375px) → app usable
- [ ] iPhone 14 (390px) → app usable
- [ ] Android mid-range (360px) → app usable
- [ ] Bottom nav visible on all sizes
- [ ] Touch targets minimum 44px
- [ ] No horizontal scroll

## ACCESSIBILITY:
- [ ] Screen reader announces modal open
- [ ] Focus returns to trigger on modal close
- [ ] Tab order logical throughout app
- [ ] All images have alt text
- [ ] Buttons have aria-label where needed
- [ ] Color contrast passes WCAG AA
