import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChefHat, Car, ShoppingBag, ShieldCheck, ArrowLeft,
  DollarSign, TrendingUp, Gift, Mail
} from 'lucide-react';

const HowPaymentsWork: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-5">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-white/80 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-white" />
            <div>
              <p className="text-white font-bold">How Payments Work</p>
              <p className="text-white/70 text-xs">Homemade Connect Delivery</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* ── VENDORS ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <ChefHat className="w-5 h-5 text-orange-500" />
            <h2 className="font-black text-gray-900 text-lg">For Vendors — How You Get Paid</h2>
          </div>

          <p className="text-sm text-gray-600 mb-3">
            You keep <strong className="text-orange-600">85%</strong> of every order's food/goods
            total. Homemade Connect keeps a <strong>15% platform fee</strong>, which covers payment
            processing, the app, marketing, and customer support.
          </p>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4">
            <p className="text-xs font-bold text-orange-700 mb-1">Example — a $40.00 order:</p>
            <p className="text-xs text-orange-700">You receive <strong>$34.00</strong> (85%) · Platform fee $6.00 (15%)</p>
            <p className="text-xs text-orange-600 mt-1">The delivery fee is paid by the customer separately — it never comes out of your share.</p>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Payments go <strong>directly to your own bank account</strong> through our secure
            payment partner (Stripe). You set up your payout account once during onboarding —
            about 5 minutes. Homemade Connect never holds your money.
          </p>

          <p className="text-xs font-bold text-gray-700 mb-2">Vendor membership tiers (monthly):</p>
          <div className="space-y-2 mb-3">
            {[
              { name: 'Basic Vendor', price: '$50/mo', perks: 'List products, accept orders, vendor dashboard' },
              { name: 'Co-op Vendor', price: '$100/mo', perks: 'Everything in Basic + co-ownership stake + voting rights + priority placement' },
              { name: 'Kitchen Partner', price: '$150/mo', perks: 'Everything in Co-op + trailer kitchen time slots + co-ownership deed + featured placement' },
            ].map((tier) => (
              <div key={tier.name} className="flex items-start justify-between gap-3 border border-gray-100 rounded-xl p-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{tier.name}</p>
                  <p className="text-xs text-gray-500">{tier.perks}</p>
                </div>
                <p className="text-sm font-bold text-orange-600 whitespace-nowrap">{tier.price}</p>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl p-3">
            <Gift className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-green-700">
              <strong>First 100 Vendors Bonus:</strong> the first 100 vendors to join receive a
              <strong> $10 credit</strong> applied to their first month.
            </p>
          </div>
        </div>

        {/* ── DRIVERS ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Car className="w-5 h-5 text-blue-500" />
            <h2 className="font-black text-gray-900 text-lg">For Drivers — How You Earn</h2>
          </div>

          <div className="space-y-1.5 mb-4">
            {[
              ['Base pay', '$3.50 – $5.00 per delivery'],
              ['Mileage', '+ $0.75 per mile driven'],
              ['Peak hours bonus', '+ $1.50 per delivery during busy times'],
              ['Tips', '100% yours — we never take a cut of tips'],
              ['Milestone bonus', '$25 – $50 for every 50 deliveries completed'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-3 text-sm border-b border-gray-50 pb-1.5">
                <span className="text-gray-600">{label}</span>
                <span className="font-semibold text-gray-800 text-right">{value}</span>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-3">
            <p className="text-xs font-bold text-blue-700 mb-1">Example — a 4-mile peak-hour delivery with a $3 tip:</p>
            <p className="text-xs text-blue-700">
              Base $4.00 + Mileage $3.00 + Peak bonus $1.50 + Tip $3.00 = <strong>$11.50 total</strong>
            </p>
          </div>

          <p className="text-sm text-gray-600">
            Earnings go <strong>directly to your own bank account</strong> through our secure
            payment partner (Stripe). Instant payout options may be available so you can access
            your earnings quickly.
          </p>
        </div>

        {/* ── CUSTOMERS ───────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag className="w-5 h-5 text-green-600" />
            <h2 className="font-black text-gray-900 text-lg">For Customers — What You Pay</h2>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            The price you see is the vendor's price. Your only added cost is delivery —
            and members get it <strong>free</strong>. 100% of your tip goes to your driver.
          </p>

          <div className="space-y-2">
            {[
              { name: 'Community Supporter', price: 'Free', delivery: '$3.99 delivery per order', perks: 'Access to all vendors in your state, vendor stories & profiles' },
              { name: 'Homemade Member', price: '$9.99/mo', delivery: 'FREE delivery', perks: 'Priority delivery at peak hours, early access to new vendors, $5 monthly credit, member badge' },
              { name: 'Co-op Community Member', price: '$19.99/mo', delivery: 'FREE delivery', perks: 'Everything in Homemade Member + 10% off every order + co-op voting + Community Wall listing' },
            ].map((plan) => (
              <div key={plan.name} className="border border-gray-100 rounded-xl p-3">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <p className="text-sm font-semibold text-gray-800">{plan.name}</p>
                  <p className="text-sm font-bold text-green-600 whitespace-nowrap">{plan.price}</p>
                </div>
                <p className="text-xs font-semibold text-orange-600 mb-0.5">{plan.delivery}</p>
                <p className="text-xs text-gray-500">{plan.perks}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── TRUST NOTE ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-orange-500" />
            <h2 className="font-black text-gray-900 text-lg">Security & Trust</h2>
          </div>
          <p className="text-sm text-gray-600">
            All money on Homemade Connect Delivery moves through <strong>Stripe</strong>, one of
            the world's most trusted payment processors. Vendors and drivers are paid directly
            into their own bank accounts. Homemade Connect operates as a technology platform
            connecting buyers, sellers, and drivers — we never warehouse products or hold your
            funds, and we never see or store your card number.
          </p>
          <p className="text-xs text-gray-400 mt-3">
            Rates and fees shown are current as of this posting and may be updated with notice.
          </p>
          <a
            href="mailto:info@homemadeconnectdelivery.com"
            className="inline-flex items-center gap-1.5 mt-3 text-sm text-orange-600 font-semibold hover:underline"
          >
            <Mail className="w-4 h-4" /> Questions? info@homemadeconnectdelivery.com
          </a>
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="w-full text-center text-gray-400 text-sm hover:text-gray-600 py-2"
        >
          ← Back to home
        </button>
      </div>
    </div>
  );
};

export default HowPaymentsWork;
