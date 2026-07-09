# Vercel Edge Function Compatibility Audit

## ENDPOINT ANALYSIS:

### /api/stripe/create-payment-intent
- Uses: Stripe Node SDK, process.env
- Node-only APIs: YES (stripe requires Node crypto)
- Verdict: ✅ Vercel SERVERLESS (not Edge)
- Config: export const config = { runtime: 'nodejs18.x' }

### /api/stripe/onboard-vendor  
- Uses: Stripe Node SDK, process.env
- Node-only APIs: YES
- Verdict: ✅ Vercel SERVERLESS
- Config: export const config = { runtime: 'nodejs18.x' }

### /api/stripe/onboard-driver
- Uses: Stripe Node SDK, process.env  
- Node-only APIs: YES
- Verdict: ✅ Vercel SERVERLESS
- Config: export const config = { runtime: 'nodejs18.x' }

### /api/stripe/driver-instant-payout
- Uses: Stripe Node SDK, process.env
- Node-only APIs: YES
- Verdict: ✅ Vercel SERVERLESS
- Config: export const config = { runtime: 'nodejs18.x' }

### /api/stripe/webhook
- Uses: Stripe Node SDK, raw body parsing
- Node-only APIs: YES (requires raw body for signature verification)
- Verdict: ✅ Vercel SERVERLESS
- IMPORTANT: Must disable body parsing for webhook
- Add: export const config = { api: { bodyParser: false }, runtime: 'nodejs18.x' }

## SUMMARY:
All Stripe endpoints → Vercel Serverless (nodejs18.x)
No Edge functions needed for Stripe
Frontend (React/Vite) → Vercel Static
