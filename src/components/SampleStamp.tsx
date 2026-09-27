import React from 'react';

/**
 * Large diagonal "SAMPLE / DEMO ONLY" stamp laid across a card image so
 * customers can't mistake demo listings for real vendors.
 * Parent must be `relative`.
 */
export const SampleStamp: React.FC = () => (
  <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none bg-black/25">
    <div className="-rotate-12 rounded-xl border-4 border-red-600 bg-white/90 px-5 py-2 text-center shadow-lg">
      <div className="text-3xl font-black tracking-[0.2em] text-red-600 leading-none">SAMPLE</div>
      <div className="mt-1 text-[11px] font-bold uppercase tracking-widest text-red-600/90">
        Demo only · not a real vendor
      </div>
    </div>
  </div>
);

export default SampleStamp;
