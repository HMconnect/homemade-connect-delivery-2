import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { AppProvider } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ChefHat, LogIn } from 'lucide-react';

const Index: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
          <p className="text-white/80 text-sm mt-3">Loading Homemade Connect...</p>
        </div>
      </div>
    );
  }

  // Show a sign-in banner at top for guests but still show the app
  return (
    <AppProvider>
      {!user && (
        <div className="bg-orange-600 text-white px-4 py-2 flex items-center justify-between">
          <p className="text-sm font-medium">
            👋 Sign in to order, sell, or drive with Homemade Connect
          </p>
          <Button
            size="sm"
            onClick={() => navigate('/welcome')}
            className="bg-white text-orange-600 hover:bg-orange-50 h-7 text-xs font-bold px-3 flex-shrink-0 ml-2"
          >
            <LogIn className="w-3 h-3 mr-1" />
            Sign In
          </Button>
        </div>
      )}
      <AppLayout />
    </AppProvider>
  );
};

export default Index;
