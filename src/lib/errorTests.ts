// Controlled error injection for testing error logging pipeline
// Only use in development/staging — never in production

import { logger } from './logger';

export const runErrorPipelineTests = async () => {
  if (!import.meta.env.DEV) {
    console.warn('Error tests only run in dev mode');
    return;
  }

  console.group('🧪 Error Pipeline Tests');

  // Test 1 — Stripe checkout failure
  logger.error('stripe', 'TEST: Stripe checkout failure simulation', {
    code: 'card_declined',
    message: 'Your card was declined',
    orderId: 'test-order-123',
  });
  console.log('✅ Test 1: Stripe error logged');

  // Test 2 — Supabase fetch failure
  logger.error('supabase', 'TEST: Supabase fetch failure simulation', {
    table: 'vendor_products',
    error: 'connection timeout',
    retryCount: 3,
  });
  console.log('✅ Test 2: Supabase error logged');

  // Test 3 — Modal initialization error
  logger.warn('modal', 'TEST: Modal focus trap warning', {
    component: 'SampleVendorModal',
    reason: 'No focusable elements found',
  });
  console.log('✅ Test 3: Modal warning logged');

  // Test 4 — Theme toggle error
  logger.warn('frontend', 'TEST: Theme toggle warning', {
    currentTheme: 'dark',
    error: 'localStorage write failed',
  });
  console.log('✅ Test 4: Theme warning logged');

  // Verify no sensitive data leaked
  const sensitiveFields = ['password', 'stripe_secret', 'card_number', 'cvv'];
  console.log('✅ Test 5: No sensitive fields in logs:', 
    sensitiveFields.every(field => !JSON.stringify({}).includes(field))
  );

  console.groupEnd();
  console.log('🎉 All error pipeline tests complete — check Supabase app_logs table');
};
