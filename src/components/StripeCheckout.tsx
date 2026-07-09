import React, { useState, useEffect } from 'react';
import { Shield, CreditCard, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { STATE_COMPLIANCE } from '@/lib/compliance';

interface StripeCheckoutProps {
  orderAmountCents: number;
  vendorStripeAccountId?: string;
  driverStripeAccountId?: string;
  orderId: string;
  vendorState?: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

export const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  orderAmountCents,
  vendorStripeAccountId,
  driverStripeAccountId,
  orderId,
  vendorState = 'IL',
  onSuccess,
  onError,
}) => {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [breakdown, setBreakdown] = useState<any>(null);
  const compliance = STATE_COMPLIANCE[vendorState];

  // Create payment intent when component mounts
  useEffect(() => {
    const createIntent = async () => {
      try {
        const res = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderAmountCents,
            vendorStripeAccountId,
            driverStripeAccountId,
            orderId,
          }),
        });
        const data = await res.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
          setBreakdown(data.breakdown);
        }
      } catch (err) {
        console.error('Failed to create payment intent:', err);
      }
    };

    if (vendorStripeAccountId) createIntent();
  }, [orderAmountCents, vendorStripeAccountId, orderId]);

  const handlePayment = async () => {
    if (!clientSecret) return;
    setLoading(true);
    try {
      // Import Stripe.js dynamically
      const { loadStripe } = await import('@stripe/stripe-js');
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      if (!stripe) throw new Error('Stripe failed to load');

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret);
      if (error) {
        onError(error.message || 'Payment failed');
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      }
    } catch (err: any) {
      onError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-orange-500" />
        <h3 className="font-bold text-gray-900 dark:text-white">Secure Checkout</h3>
      </div>

      {/* Order breakdown */}
      {breakdown && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 space-y-1 text-sm">
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Subtotal</span>
            <span>${(breakdown.orderAmount / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Delivery fee</span>
            <span className="text-green-600">${(breakdown.deliveryFee / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold border-t dark:border-gray-700 pt-1 text-gray-900 dark:text-white">
            <span>Total</span>
            <span className="text-orange-500">${(breakdown.total / 100).toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* State disclaimer */}
      {compliance && (
        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-800 dark:text-amber-200">
                Legal Notice — {compliance.state}
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5 leading-relaxed">
                {compliance.disclaimer}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Agreement */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={accepted}
          onChange={e => setAccepted(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-orange-500 flex-shrink-0"
        />
        <span className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
          I understand this product was made in a home kitchen and agree to the Terms of Service.
        </span>
      </label>

      {/* Payment button */}
      {accepted && clientSecret ? (
        <Button
          onClick={handlePayment}
          disabled={loading}
          className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold text-base rounded-2xl"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Pay ${breakdown ? (breakdown.total / 100).toFixed(2) : '...'}
            </div>
          )}
        </Button>
      ) : (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {!accepted ? 'Please accept the terms above' : 'Setting up secure payment...'}
          </p>
        </div>
      )}

      <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
        🔒 Powered by Stripe — PCI DSS compliant
      </p>
    </div>
  );
};
