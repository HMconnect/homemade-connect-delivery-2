# 🚀 GO-LIVE VALIDATION SCRIPT
# Homemade Connect Delivery — Production Validation
# Run this BEFORE public launch. Check every box.

## SETUP (5 minutes)
```bash
npm run build
npx serve dist
```
Open http://localhost:3000 in Chrome

---

## BLOCK 1 — CORE APP (10 minutes)

### 1.1 App Loads
- [ ] Open http://localhost:3000
- [ ] App renders — NOT blank white page
- [ ] No red errors in F12 Console
- [ ] Loading spinner appears then app shows
- [ ] Title shows "Homemade Connect Delivery"

### 1.2 Welcome Popup
- [ ] Wait 3 seconds — popup slides up from bottom
- [ ] Popup shows "Join Leah and our growing community"
- [ ] Green box shows "$10 bonus for first 100 vendors"
- [ ] Blue box shows "These are sample vendors"
- [ ] "Sign Up Free Today" button visible
- [ ] "Browse first" button visible
- [ ] Click ESC — popup closes
- [ ] Refresh page — popup does NOT show again (localStorage)
- [ ] Open incognito — popup shows again after 3s

### 1.3 Sample Vendor Cards
- [ ] Home page shows food cards with "SAMPLE" stamp
- [ ] Orange banner: "These are sample vendors!"
- [ ] Click any food card → SampleVendorModal opens
- [ ] Modal shows vendor name
- [ ] Modal shows "Are YOU a home cook?" message
- [ ] Modal shows "Want to order real homemade food?"
- [ ] "Sign Up Free Now!" button works → goes to /welcome
- [ ] "Keep Browsing" closes modal
- [ ] ESC key closes modal
- [ ] Backdrop click closes modal
- [ ] No cart popup (sample vendors don't add to cart)

### 1.4 Navigation
- [ ] Bottom nav shows: Home / Market / Vendor / Drive / Account
- [ ] Home tab → goes to /
- [ ] Drive tab → goes to /driver
- [ ] Vendor tab → goes to /vendor-application or /vendor-dashboard
- [ ] Account tab → goes to /welcome if not logged in

---

## BLOCK 2 — AUTHENTICATION (10 minutes)

### 2.1 Sign Up Flow
- [ ] Click "Sign Up Free Today"
- [ ] Welcome page loads at /welcome
- [ ] Can select Customer / Vendor / Driver role
- [ ] Email signup works
- [ ] Google OAuth button visible
- [ ] Facebook OAuth button visible

### 2.2 Vendor Signup
- [ ] Select Vendor role
- [ ] 3-step vendor application loads
- [ ] Step 1: Business info fills correctly
- [ ] Step 2: License upload works
- [ ] Step 3: Terms and compliance shows correctly
- [ ] State disclaimer shows for selected state (IL/GA/WI/MI)
- [ ] Michigan shows extra messaging requirement notice
- [ ] Submit application → confirmation message

### 2.3 Driver Signup
- [ ] Select Driver role
- [ ] Driver account created
- [ ] Driver dashboard loads at /driver
- [ ] Online toggle visible
- [ ] Earnings tracker visible
- [ ] Driver compliance checklist visible

---

## BLOCK 3 — PAYMENTS (15 minutes)

### 3.1 PayPal Button (current)
- [ ] Go to checkout (any item)
- [ ] Legal disclaimer shows correct state text
- [ ] Checkbox required before PayPal button appears
- [ ] Check the checkbox → PayPal button appears
- [ ] Click PayPal button → PayPal opens in new tab
- [ ] PayPal shows "Homemade Connect Delivery Order"
- [ ] Customer can enter amount (customer set price)
- [ ] Payment completes → returns to app

### 3.2 Stripe Test Mode (when keys added)
- [ ] Add test keys to environment
- [ ] Go to checkout
- [ ] StripeCheckout component loads
- [ ] Order breakdown shows correctly:
      Subtotal + $3.99 delivery = total
- [ ] Enter test card: 4242 4242 4242 4242
- [ ] Expiry: 12/34 / CVC: 123
- [ ] Payment processes
- [ ] Success screen shows
- [ ] Check Stripe dashboard → PaymentIntent created
- [ ] Check Stripe dashboard → Transfers created
- [ ] Vendor balance updated (75% of order)
- [ ] Driver balance updated (15% + $3.99)
- [ ] Platform fee captured (10%)

---

## BLOCK 4 — THEME AND UX (5 minutes)

### 4.1 Theme
- [ ] Default theme is light
- [ ] Toggle to dark → smooth 200ms transition
- [ ] All text readable in dark mode
- [ ] Modal respects dark mode
- [ ] Refresh page → theme persists
- [ ] No flash of wrong theme on load

### 4.2 Animations
- [ ] Modal slides in smoothly (not instant)
- [ ] Backdrop fades in
- [ ] Vendor card lifts on hover
- [ ] No janky animations on mobile

---

## BLOCK 5 — ROUTING (5 minutes)

### 5.1 SPA Routing
- [ ] Go to /welcome → page loads
- [ ] Go to /driver → page loads
- [ ] Go to /vendor-dashboard → page loads
- [ ] REFRESH on /welcome → still loads (not 404)
- [ ] REFRESH on /driver → still loads (not 404)
- [ ] REFRESH on /vendor-dashboard → still loads (not 404)
- [ ] Back button works correctly

---

## BLOCK 6 — MOBILE (10 minutes)

### 6.1 On Real Phone
- [ ] Open live URL on iPhone
- [ ] App loads in under 5 seconds on 4G
- [ ] Not blank
- [ ] Welcome popup appears after 3 seconds
- [ ] Bottom nav visible and tappable
- [ ] Sample vendor tap → modal opens full screen
- [ ] Modal close button easy to tap (44px+)
- [ ] No horizontal scrolling
- [ ] Text readable without zooming

### 6.2 On Android
- [ ] Repeat above on Android device
- [ ] Google Pay option visible in PayPal if applicable

---

## BLOCK 7 — ERROR LOGGING (5 minutes)

### 7.1 Error Pipeline
- [ ] Open Supabase → Table Editor → app_logs
- [ ] Trigger a test error (see errorTests.ts)
- [ ] Log appears in app_logs table
- [ ] Log has: level, source, message, timestamp
- [ ] No passwords, card numbers or secrets in logs
- [ ] Regular user CANNOT read app_logs
- [ ] Admin CAN read app_logs

---

## BLOCK 8 — SUPABASE RLS (5 minutes)

### 8.1 Data Isolation
- [ ] Log in as vendor A
- [ ] Run: SELECT stripe_account_id FROM user_profiles WHERE id != auth.uid()
- [ ] Result: 0 rows (RLS blocks)
- [ ] Log in as admin
- [ ] Same query → returns all rows
- [ ] Vendor cannot see other vendor's earnings

---

## TOTAL TIME: ~65 minutes
## PASS RATE REQUIRED: 100% before launch
## DATE COMPLETED: _______________
## VALIDATED BY: _______________
