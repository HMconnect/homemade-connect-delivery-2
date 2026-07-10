import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BusinessInfoStep } from '@/components/vendor-application/BusinessInfoStep';
import { LicenseStep } from '@/components/vendor-application/LicenseStep';
import { TermsStep } from '@/components/vendor-application/TermsStep';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { ChefHat, CheckCircle, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

const STEPS = [
  { number: 1, title: 'Business Info', description: 'Tell us about yourself' },
  { number: 2, title: 'License & Docs', description: 'Upload your cottage food license' },
  { number: 3, title: 'Terms', description: 'Review and agree to terms' },
];

export default function VendorApplication() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    businessName: profile?.business_name || '',
    businessDescription: profile?.business_description || '',
    businessAddress: profile?.business_address || '',
    businessPhone: profile?.business_phone || '',
    vendorType: profile?.vendor_type || '',
    communityTag: profile?.community_tag || '',
    state: profile?.state || 'IL',
    city: profile?.city || 'Chicago',
    licenseUrl: (profile?.license_url || null) as string | null,
    termsAgreed: false,
  });

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLicenseUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, licenseUrl: url }));
  };

  const handleTermsChange = (agreed: boolean) => {
    setFormData(prev => ({ ...prev, termsAgreed: agreed }));
  };

  const canProceed = () => {
    if (step === 1) {
      return Boolean(
        formData.businessName &&
        formData.businessDescription &&
        formData.businessAddress &&
        formData.businessPhone &&
        formData.vendorType &&
        formData.state &&
        formData.city
      );
    }
    if (step === 2) return true; // License optional for cottage food
    if (step === 3) return formData.termsAgreed;
    return false;
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate('/welcome');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          role: 'vendor',
          business_name: formData.businessName,
          business_description: formData.businessDescription,
          business_address: formData.businessAddress,
          business_phone: formData.businessPhone,
          vendor_type: formData.vendorType,
          community_tag: formData.communityTag,
          state: formData.state,
          city: formData.city,
          license_url: formData.licenseUrl,
          terms_agreed: formData.termsAgreed,
          terms_agreed_at: new Date().toISOString(),
          application_status: 'pending',
          application_submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      setSubmitted(true);
      toast({ title: '🎉 Application submitted!', description: 'We will review and approve you shortly.' });
    } catch (error: any) {
      toast({
        title: 'Submission failed',
        description: error?.message || 'Something went wrong — please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <ChefHat className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create an Account First</h2>
          <p className="text-gray-500 text-sm mb-6">
            You need a free account before applying as a vendor. It only takes a minute!
          </p>
          <Button
            onClick={() => navigate('/welcome')}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 rounded-2xl"
          >
            Create Free Account
          </Button>
          <button onClick={() => navigate('/')} className="mt-3 text-gray-400 text-sm hover:text-gray-600">
            ← Back to browsing
          </button>
        </div>
      </div>
    );
  }

  // Already submitted
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-500 text-sm mb-2">
            Thank you <strong>{formData.businessName}</strong>! Your vendor application is under review.
          </p>
          <p className="text-gray-400 text-xs mb-6">
            We typically review applications within 24–48 hours. You'll receive an email at <strong>{user.email}</strong> once approved.
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6">
            <p className="text-orange-700 font-bold">🎉 You may qualify for the First 100 Vendors Bonus!</p>
            <p className="text-orange-600 text-xs mt-1">If you're one of our first 100 vendors, a <strong>$10 credit</strong> will be applied to your account upon approval.</p>
          </div>
          <Button
            onClick={() => navigate('/')}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 rounded-2xl"
          >
            Browse the App While You Wait
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-white/80 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-white" />
            <div>
              <p className="text-white font-bold text-sm">Vendor Application</p>
              <p className="text-white/70 text-xs">Homemade Connect Delivery</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, i) => (
            <div key={s.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step > s.number ? 'bg-green-500 text-white'
                  : step === s.number ? 'bg-orange-500 text-white shadow-lg scale-110'
                  : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s.number ? '✓' : s.number}
                </div>
                <p className={`text-xs mt-1 font-medium ${step === s.number ? 'text-orange-600' : 'text-gray-400'}`}>
                  {s.title}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded transition-all ${step > s.number ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          {step === 1 && (
            <BusinessInfoStep data={formData} onChange={handleFieldChange} />
          )}
          {step === 2 && (
            <LicenseStep
              licenseUrl={formData.licenseUrl}
              onLicenseUploaded={handleLicenseUploaded}
              userId={user.id}
            />
          )}
          {step === 3 && (
            <TermsStep
              termsAgreed={formData.termsAgreed}
              onTermsChange={handleTermsChange}
              state={formData.state}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(s => s - 1)} className="flex-1 h-12 rounded-2xl">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          )}
          {step < 3 ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              className="flex-1 h-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold"
            >
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || submitting}
              className="flex-1 h-12 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Submit Application
                </span>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
