import React, { useState } from 'react';
import { Phone, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatUSPhoneInput, normalizeUSPhone } from '@/lib/phone';

/**
 * Shown to any signed-in user whose profile has no phone number
 * (older accounts, and Google/Facebook sign-ups). Drivers, vendors and
 * customers all need a number so orders can be coordinated.
 */
export const PhoneRequiredPrompt: React.FC = () => {
  const { user, profile, loading, updateProfile, signOut } = useAuth();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  if (loading || !user || !profile || profile.phone) return null;

  const roleLine =
    profile.role === 'driver' ? 'Customers and vendors need to reach you about deliveries.' :
    profile.role === 'vendor' ? 'Customers and drivers need to reach you about orders.' :
    'Your driver and cook need to reach you about your order.';

  const save = async () => {
    const phone = normalizeUSPhone(value);
    if (!phone) { setError('Enter a 10-digit US phone number.'); return; }
    setSaving(true);
    setError('');
    try {
      const { error: saveError } = await updateProfile({ phone });
      if (saveError) setError('Could not save. Please try again.');
    } catch {
      setError('Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="phone-prompt-title">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
          <Phone className="h-6 w-6 text-orange-600" />
        </div>
        <h2 id="phone-prompt-title" className="text-center text-xl font-bold text-gray-900">Add your phone number</h2>
        <p className="mt-1 text-center text-sm text-gray-500">{roleLine}</p>
        <div className="mt-4">
          <Label htmlFor="required-phone" className="text-xs font-semibold text-gray-600">Mobile phone</Label>
          <Input
            id="required-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(312) 555-0123"
            value={value}
            onChange={e => setValue(formatUSPhoneInput(e.target.value))}
            onKeyDown={e => e.key === 'Enter' && save()}
            className={`mt-1 h-11 rounded-xl ${error ? 'border-red-400' : 'border-gray-200'}`}
          />
          {error && <p className="mt-1 flex items-center gap-1 text-xs text-red-500"><AlertCircle className="h-3 w-3" />{error}</p>}
        </div>
        <Button onClick={save} disabled={saving} className="mt-4 h-11 w-full rounded-xl bg-orange-500 font-bold hover:bg-orange-600">
          {saving ? 'Saving...' : 'Save phone number'}
        </Button>
        <button onClick={() => signOut()} className="mt-3 w-full text-center text-xs text-gray-400 hover:text-gray-600">
          Sign out
        </button>
      </div>
    </div>
  );
};

export default PhoneRequiredPrompt;
