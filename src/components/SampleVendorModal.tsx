import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/Modal';

interface Props {
  vendorName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SampleVendorModal: React.FC<Props> = ({ vendorName, isOpen, onClose }) => {
  const navigate = useNavigate();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${vendorName} — Sample Vendor`}
      size="sm"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 px-5 py-5">
        <div className="flex items-center gap-3 pr-6">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">Coming Soon!</h2>
            <p className="text-white/80 text-xs">Real vendors are joining now</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-5 space-y-4">
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          <span className="font-bold">{vendorName}</span> is a sample vendor
          showing what our app looks like with real home cooks and crafters!
        </p>

        <div className="bg-orange-50 dark:bg-orange-950 rounded-xl p-4">
          <p className="text-orange-800 dark:text-orange-200 font-bold text-sm mb-1">
            🍳 Are YOU a home cook or crafter?
          </p>
          <p className="text-orange-600 dark:text-orange-300 text-xs">
            Sign up FREE and get a $10 welcome bonus — first 100 vendors only!
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-950 rounded-xl p-4">
          <p className="text-green-800 dark:text-green-200 font-bold text-sm mb-1">
            🛍️ Want to order real homemade food?
          </p>
          <p className="text-green-600 dark:text-green-300 text-xs">
            Sign up as a customer — we will notify you when real vendors join your area!
          </p>
        </div>

        <div className="space-y-2 pt-1">
          <Button
            onClick={() => { onClose(); navigate('/welcome'); }}
            className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl"
          >
            Sign Up Free Now!
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full h-9 text-gray-400 dark:text-gray-500 text-sm"
          >
            Keep Browsing
          </Button>
        </div>
      </div>
    </Modal>
  );
};
