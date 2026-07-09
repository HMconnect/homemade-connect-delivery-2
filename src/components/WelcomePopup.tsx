import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Users, Gift, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/Modal';
import { useAuth } from '@/contexts/AuthContext';

const STORAGE_KEY = 'hmc_welcome_seen_v1';

export const WelcomePopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) return;
    let seen = false;
    try { seen = !!localStorage.getItem(STORAGE_KEY); } catch {}
    if (seen) return;
    timerRef.current = setTimeout(() => setIsOpen(true), 3000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [user]);

  const dismiss = () => {
    setIsOpen(false);
    try { localStorage.setItem(STORAGE_KEY, 'true'); } catch {}
  };

  if (user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={dismiss}
      title="Welcome to Homemade Connect Delivery"
      size="sm"
      closeOnBackdrop={false}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 px-5 py-5">
        <div className="flex items-center gap-3 pr-6">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">
              Welcome to Homemade Connect!
            </h2>
            <p className="text-white/80 text-xs">IL · GA · WI · MI</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-3">
        <div className="bg-orange-50 dark:bg-orange-950 rounded-xl p-3 flex items-center gap-3">
          <Users className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <p className="text-sm text-orange-800 dark:text-orange-200 font-medium">
            Join Leah and our growing community of home cooks and drivers!
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-950 rounded-xl p-3 flex items-center gap-3">
          <Gift className="w-5 h-5 text-green-500 flex-shrink-0" />
          <div>
            <p className="text-sm text-green-800 dark:text-green-200 font-bold">
              🎉 First 100 Vendors Sign Up FREE!
            </p>
            <p className="text-xs text-green-600 dark:text-green-300 mt-0.5">
              Plus receive a $10 welcome bonus credit
            </p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 rounded-xl p-3 flex items-start gap-3">
          <Star className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 dark:text-blue-200 font-bold">
              Be one of our first real vendors!
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-300 mt-0.5">
              Vendors shown are samples — we are recruiting real home cooks like YOU!
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <Button
            onClick={() => { dismiss(); navigate('/welcome'); }}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold text-base rounded-2xl"
          >
            🍳 Sign Up Free Today
          </Button>
          <Button
            onClick={dismiss}
            variant="ghost"
            className="w-full h-10 text-gray-400 dark:text-gray-500 text-sm"
          >
            Browse first
          </Button>
        </div>
      </div>
    </Modal>
  );
};
