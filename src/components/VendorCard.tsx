import React, { useState } from 'react';
import { Star, Clock, MapPin } from 'lucide-react';
import { SampleVendorModal } from '@/components/SampleVendorModal';

export interface Vendor {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  reviewCount?: number;
  prepTime: string;
  distance: string;
  description: string;
  isSample?: boolean;
}

interface VendorCardProps {
  vendor: Vendor;
  onClick?: () => void;
}

export const VendorCard: React.FC<VendorCardProps> = ({ vendor, onClick }) => {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (vendor.isSample) {
      setShowModal(true);
    } else {
      onClick?.();
    }
  };

  return (
    <>
      <SampleVendorModal
        vendorName={vendor.name}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group overflow-hidden"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
        aria-label={vendor.isSample ? `${vendor.name} — sample vendor, click to learn more` : vendor.name}
      >
        {/* Image */}
        <div className="relative overflow-hidden h-48">
          <img
            src={vendor.image}
            alt={vendor.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${vendor.isSample ? 'opacity-75' : ''}`}
          />
          {/* SAMPLE stamp */}
          {vendor.isSample && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-4 border-orange-400 rounded-xl px-4 py-2 rotate-[-20deg] bg-white/20 backdrop-blur-sm">
                <span className="text-orange-500 font-black text-lg tracking-widest uppercase drop-shadow">
                  Sample
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1 group-hover:text-orange-500 transition-colors">
            {vendor.name}
          </h3>
          <p className="text-sm text-orange-500 font-medium mb-2">{vendor.cuisine}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {vendor.description}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-400 dark:text-gray-500">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-medium text-gray-700 dark:text-gray-300">{vendor.rating.toFixed(1)}</span>
              {vendor.reviewCount && <span>({vendor.reviewCount})</span>}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{vendor.prepTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{vendor.distance}</span>
              </div>
            </div>
          </div>

          {vendor.isSample && (
            <div className="mt-3 bg-orange-50 dark:bg-orange-950 rounded-lg px-3 py-2">
              <p className="text-xs text-orange-600 dark:text-orange-300 font-medium text-center">
                Sample vendor — tap to learn how to join! 🍳
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
