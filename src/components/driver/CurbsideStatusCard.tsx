import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Accessibility, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

/** Driver dashboard card for the Senior & Disability Curbside Protocol. */
export const CurbsideStatusCard: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const status = profile?.curbside_status || 'none';

  const look = {
    none: { box: 'border-gray-200 bg-white', chip: '', chipText: '', line: 'Age 70+ or have a physical disability? Earn without leaving your car.', cta: 'Apply' },
    pending: { box: 'border-amber-300 bg-amber-50', chip: 'bg-amber-100 text-amber-800', chipText: 'Pending review', line: 'We\'re reviewing your eligibility. Curbside orders turn on once you\'re approved.', cta: 'View' },
    approved: { box: 'border-green-400 bg-green-50', chip: 'bg-green-100 text-green-800', chipText: 'Approved', line: 'Curbside Protocol active. Vendors and customers come to your car window.', cta: 'Details' },
    denied: { box: 'border-red-300 bg-red-50', chip: 'bg-red-100 text-red-700', chipText: 'Not approved', line: 'See the reason and resubmit with updated information.', cta: 'Review' },
  }[status as 'none' | 'pending' | 'approved' | 'denied'] || null;

  if (!look) return null;

  return (
    <button
      onClick={() => navigate('/driver/curbside')}
      className={`w-full text-left rounded-2xl border-2 p-4 flex items-center gap-3 transition-shadow hover:shadow-md ${look.box}`}
    >
      <div className="w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
        <Accessibility className="w-6 h-6 text-orange-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-gray-900">Curbside Protocol</span>
          {look.chipText && <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${look.chip}`}>{look.chipText}</span>}
        </div>
        <p className="text-sm text-gray-600 mt-0.5">{look.line}</p>
      </div>
      <span className="flex items-center text-orange-600 font-semibold text-sm flex-shrink-0">
        {look.cta}<ChevronRight className="w-4 h-4" />
      </span>
    </button>
  );
};

export default CurbsideStatusCard;
