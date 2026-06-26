import React, { useState } from 'react';
import { X, Check, AlertCircle, Loader2 } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (hasDiscount: boolean) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [discountCode, setDiscountCode] = useState('');
  const [showDiscountField, setShowDiscountField] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [discountStatus, setDiscountStatus] = useState<'none' | 'valid' | 'invalid'>('none');
  const [signupFee, setSignupFee] = useState(10);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const validCodes = ['WELCOME2025', 'COTTAGE10', 'HOMEMADE'];

  const validateCode = async (code: string) => {
    if (!code.trim()) {
      setDiscountStatus('none');
      setSignupFee(10);
      return;
    }

    setIsValidating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (validCodes.includes(code.toUpperCase())) {
      setDiscountStatus('valid');
      setSignupFee(0);
    } else {
      setDiscountStatus('invalid');
      setSignupFee(10);
    }
    
    setIsValidating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(discountStatus === 'valid');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Join HomeMade Connect</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Membership Fee</span>
                <div className="text-right">
                  {discountStatus === 'valid' ? (
                    <div>
                      <span className="text-gray-400 line-through text-sm">$10.00</span>
                      <div className="text-lg font-bold text-green-600">FREE</div>
                    </div>
                  ) : (
                    <span className="text-lg font-bold">${signupFee}.00</span>
                  )}
                </div>
              </div>

              {!showDiscountField ? (
                <button
                  type="button"
                  onClick={() => setShowDiscountField(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Have a discount code?
                </button>
              ) : (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Discount Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => {
                        setDiscountCode(e.target.value);
                        validateCode(e.target.value);
                      }}
                      placeholder="Enter code"
                      className={`w-full px-4 py-3 border rounded-lg pr-10 ${
                        discountStatus === 'valid' ? 'border-green-500 bg-green-50' :
                        discountStatus === 'invalid' ? 'border-red-500 bg-red-50' :
                        'border-gray-300'
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {isValidating ? (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      ) : discountStatus === 'valid' ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : discountStatus === 'invalid' ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : null}
                    </div>
                  </div>
                  {discountStatus === 'valid' && (
                    <p className="text-sm text-green-600 font-medium">
                      🎉 Discount applied! Your signup fee has been waived.
                    </p>
                  )}
                  {discountStatus === 'invalid' && (
                    <p className="text-sm text-red-600">
                      Invalid code. Please check and try again.
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!name || !email}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {signupFee > 0 ? `Complete Signup - $${signupFee}` : 'Complete Free Signup'}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;