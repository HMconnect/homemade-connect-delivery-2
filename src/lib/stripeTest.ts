// Stripe Test Mode Simulation Guide
// Test cards: 4242 4242 4242 4242 (success)
//             4000 0000 0000 9995 (insufficient funds)
//             4000 0025 0000 3155 (3D Secure required)

export const STRIPE_TEST_SCENARIOS = {
  vendorOnboarding: {
    steps: [
      '1. Call POST /api/stripe/onboard-vendor',
      '2. Receive accountLink.url',
      '3. Open URL — complete Express onboarding',
      '4. Verify stripe_account_id saved in Supabase',
      '5. Check Stripe dashboard — account visible',
    ],
    expectedResult: 'vendor.stripe_account_id populated in user_profiles',
  },
  driverOnboarding: {
    steps: [
      '1. Call POST /api/stripe/onboard-driver',
      '2. Receive accountLink.url',
      '3. Complete Express onboarding with debit card',
      '4. Verify stripe_account_id saved in Supabase',
      '5. Verify instant payouts enabled',
    ],
    expectedResult: 'driver.stripe_account_id populated + payouts_enabled: true',
  },
  customerCheckout: {
    testCard: '4242 4242 4242 4242',
    expiry: '12/34',
    cvc: '123',
    steps: [
      '1. Add items to cart ($20.00)',
      '2. Proceed to checkout',
      '3. Accept legal disclaimer',
      '4. Enter test card',
      '5. Confirm payment',
      '6. Verify PaymentIntent created',
    ],
    expectedSplit: {
      total: '$23.99',
      platform: '$2.00 (10%)',
      vendor: '$15.00 (75%)',
      driver: '$6.99 (15% + delivery)',
    },
  },
  webhookFlow: {
    steps: [
      '1. Use Stripe CLI: stripe listen --forward-to localhost:3000/api/stripe/webhook',
      '2. Complete test payment',
      '3. Webhook receives payment_intent.succeeded',
      '4. Transfers created to vendor + driver accounts',
      '5. Verify in Stripe dashboard under Transfers',
    ],
    expectedResult: 'Both transfers visible in Stripe dashboard',
  },
};

export const runStripeHealthCheck = async () => {
  const checks = {
    publishableKeyPresent: !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    supabaseUrlPresent: !!import.meta.env.VITE_SUPABASE_URL,
    supabaseKeyPresent: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  };
  
  const allPassed = Object.values(checks).every(Boolean);
  console.log('Stripe Health Check:', checks);
  return { checks, allPassed };
};
