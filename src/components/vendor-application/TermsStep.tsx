import React from 'react';
import { TERMS_OF_SERVICE_CLAUSES, STATE_COMPLIANCE } from '@/lib/compliance';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

interface TermsStepProps {
  termsAgreed: boolean;
  onTermsChange: (agreed: boolean) => void;
  state?: string;
}

export function TermsStep({ termsAgreed, onTermsChange, state = 'IL' }: TermsStepProps) {
  const compliance = STATE_COMPLIANCE[state] || STATE_COMPLIANCE['IL'];

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof onTermsChange === 'function') {
      onTermsChange(e.target.checked);
    }
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-orange-500" />
        <h3 className="font-bold text-gray-900">Terms of Service & Legal Compliance</h3>
      </div>

      {/* State specific disclaimer */}
      {compliance && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-800 mb-1">
                {compliance.state} Legal Disclaimer — Required on all product listings:
              </p>
              <p className="text-xs text-amber-700 leading-relaxed italic">
                "{compliance.disclaimer}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Michigan chat requirement */}
      {compliance?.requiresChat && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs font-bold text-blue-800 mb-1">Michigan Requirement:</p>
          <p className="text-xs text-blue-700">
            Michigan law requires customers to be able to contact you directly before purchasing. Your profile must include active in-app messaging.
          </p>
        </div>
      )}

      {/* Prohibited foods */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-xs font-bold text-red-700 mb-2">❌ Prohibited Items — Never list these:</p>
        <div className="space-y-1">
          {compliance?.prohibitedFoods.map((food, i) => (
            <p key={i} className="text-xs text-red-600">• {food}</p>
          ))}
        </div>
      </div>

      {/* Packaging requirements */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <p className="text-xs font-bold text-green-700 mb-2">✅ Packaging Requirements:</p>
        <div className="space-y-1">
          {compliance?.packagingRequirements.map((req, i) => (
            <p key={i} className="text-xs text-green-600">• {req}</p>
          ))}
        </div>
      </div>

      {/* Terms of service */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-xs font-bold text-gray-700 mb-3">Terms of Service — Vendor Agreement:</p>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {TERMS_OF_SERVICE_CLAUSES.map((clause, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-gray-400 text-xs flex-shrink-0">{i + 1}.</span>
              <p className="text-xs text-gray-600 leading-relaxed">{clause}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Agreement checkbox */}
      <label className="flex items-start gap-3 cursor-pointer bg-orange-50 border border-orange-200 rounded-xl p-4">
        <input
          type="checkbox"
          checked={Boolean(termsAgreed)}
          onChange={handleCheckboxChange}
          className="mt-0.5 w-5 h-5 accent-orange-500 flex-shrink-0"
        />
        <span className="text-sm text-gray-700 leading-relaxed">
          I have read and agree to all terms above. I understand my legal obligations as a cottage food vendor and will maintain compliance with all applicable state and local laws.
          <span className="block mt-1 text-xs text-orange-600 font-medium">
            By checking this box you confirm you are a legally registered cottage food vendor in your state.
          </span>
        </span>
      </label>

    </div>
  );
}
