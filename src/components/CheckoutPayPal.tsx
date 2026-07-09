import React, { useState } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { STATE_COMPLIANCE } from '@/lib/compliance';

interface Props { vendorState?: string; orderAmount?: number; }

export const CheckoutPayPal: React.FC<Props> = ({ vendorState = 'IL', orderAmount }) => {
  const [accepted, setAccepted] = useState(false);
  const compliance = STATE_COMPLIANCE[vendorState];

  return (
    <div className="space-y-4 p-4 bg-white rounded-2xl border border-gray-200">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-orange-500" />
        <h3 className="font-bold text-gray-900">Complete Your Order</h3>
      </div>
      <div className="bg-gray-50 rounded-xl p-3 space-y-1 text-sm">
        {orderAmount && (
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>${(orderAmount / 100).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery fee</span>
          <span className="text-green-600">$3.99</span>
        </div>
        <div className="flex justify-between font-bold border-t pt-1">
          <span>Total</span>
          <span className="text-orange-500">
            {orderAmount ? `$${((orderAmount + 399) / 100).toFixed(2)}` : 'Enter amount at PayPal'}
          </span>
        </div>
      </div>
      {compliance && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-800">Legal Notice — {compliance.state}</p>
              <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">{compliance.disclaimer}</p>
            </div>
          </div>
        </div>
      )}
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-orange-500 flex-shrink-0" />
        <span className="text-xs text-gray-700 leading-relaxed">
          I have read and understand the legal notice above and agree to the Terms of Service.
        </span>
      </label>
      {accepted ? (
        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
          <input type="hidden" name="cmd" value="_s-xclick" />
          <input type="hidden" name="hosted_button_id" value="PRZQ66AUU3BM4" />
          <button type="submit"
            className="w-full h-12 bg-[#003087] hover:bg-[#002067] text-white font-bold text-base rounded-2xl transition-colors">
            Pay with PayPal / Venmo
          </button>
          <p className="text-xs text-gray-400 text-center mt-2">🔒 Secured by PayPal</p>
        </form>
      ) : (
        <div className="bg-gray-100 rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-500">Please accept the terms above to pay</p>
        </div>
      )}
    </div>
  );
};
