import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, ShieldCheck, Clock, XCircle, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPTED = 'image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf';

type Application = {
  status: 'pending' | 'approved' | 'denied';
  date_of_birth: string;
  limitation: string | null;
  denial_reason: string | null;
  submitted_at: string;
};

export const calcAge = (dob: string): number | null => {
  if (!dob) return null;
  const d = new Date(dob + 'T00:00:00');
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
};

/**
 * Senior & Disability Curbside Protocol — driver eligibility application.
 * Details (birth date, limitation, document) are stored privately: only the
 * driver and admins can read them. Status stays PENDING until an admin approves.
 */
export default function DriverCurbside() {
  const navigate = useNavigate();
  const { user, profile, loading, refreshProfile } = useAuth();
  const [existing, setExisting] = useState<Application | null>(null);
  const [checking, setChecking] = useState(true);
  const [qualifies, setQualifies] = useState(false);
  const [dob, setDob] = useState('');
  const [limitation, setLimitation] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);

  const age = useMemo(() => calcAge(dob), [dob]);
  const needsLimitation = age !== null && age < 70;

  useEffect(() => {
    if (!loading && !user) navigate('/welcome');
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('driver_curbside_applications')
        .select('status, date_of_birth, limitation, denial_reason, submitted_at')
        .eq('driver_id', user.id)
        .maybeSingle();
      setExisting((data as Application) || null);
      if (data) {
        setDob(data.date_of_birth || '');
        setLimitation(data.limitation || '');
        setQualifies(true);
      }
      setChecking(false);
    })();
  }, [user]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setError('');
    if (f && f.size > MAX_FILE_BYTES) {
      setError('That file is larger than 10 MB. Please choose a smaller photo or PDF.');
      e.target.value = '';
      return;
    }
    setFile(f);
  };

  const submit = async () => {
    setError('');
    if (!user) return;
    if (!qualifies) { setError('Check the box to confirm you qualify for the protocol.'); return; }
    if (age === null || age < 16 || age > 120) { setError('Please enter a valid date of birth.'); return; }
    if (needsLimitation && limitation.trim().length < 10) {
      setError('Please state your physical disability or mobility limitation for administrative review.');
      return;
    }
    if (!file) { setError('Please upload a photo of your ID or your disability documentation.'); return; }

    setSubmitting(true);
    try {
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('driver-documents')
        .upload(path, file, { contentType: file.type || undefined });
      if (upErr) throw upErr;

      const row = {
        driver_id: user.id,
        date_of_birth: dob,
        limitation: needsLimitation ? limitation.trim() : (limitation.trim() || null),
        document_path: path,
      };
      const { error: dbErr } = await supabase
        .from('driver_curbside_applications')
        .upsert(row, { onConflict: 'driver_id' });
      if (dbErr) throw dbErr;

      setExisting({ status: 'pending', date_of_birth: dob, limitation: row.limitation, denial_reason: null, submitted_at: new Date().toISOString() });
      setEditing(false);
      setFile(null);
      await refreshProfile();
    } catch (e: any) {
      setError(e?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || checking) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading…</div>;
  }

  const showForm = !existing || editing;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-5 text-white">
        <div className="max-w-xl mx-auto">
          <button onClick={() => navigate('/driver')} className="flex items-center gap-1 text-white/90 text-sm mb-3">
            <ArrowLeft className="w-4 h-4" /> Back to dashboard
          </button>
          <h1 className="text-2xl font-bold">Senior &amp; Disability Curbside Protocol</h1>
          <p className="text-white/90 text-sm mt-1">
            For drivers 70 or older, or with a physical disability. Vendors bring orders to your car window and
            customers walk out to collect them, so you never have to leave your vehicle.
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6 space-y-5">
        {existing && !editing && (
          <StatusPanel
            app={existing}
            onResubmit={() => { setEditing(true); setFile(null); }}
          />
        )}

        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                id="curbside-qualifies"
                type="checkbox"
                checked={qualifies}
                onChange={e => setQualifies(e.target.checked)}
                className="mt-1 h-5 w-5 accent-orange-500"
              />
              <span className="text-gray-800 font-semibold">
                I qualify for the Senior &amp; Disability Curbside Protocol
                <span className="block text-sm font-normal text-gray-500">
                  I am 70 or older, or I have a physical disability or mobility limitation.
                </span>
              </span>
            </label>

            {qualifies && (
              <>
                <div>
                  <Label htmlFor="curbside-dob" className="font-semibold">Date of birth</Label>
                  <Input
                    id="curbside-dob"
                    type="date"
                    value={dob}
                    max={new Date().toISOString().slice(0, 10)}
                    onChange={e => setDob(e.target.value)}
                    className="mt-1 h-11"
                  />
                  {age !== null && age >= 0 && (
                    <p className="text-sm text-gray-500 mt-1">Age: {age}</p>
                  )}
                </div>

                {needsLimitation && (
                  <div>
                    <Label htmlFor="curbside-limitation" className="font-semibold">
                      Please state your physical disability or mobility limitation for administrative review.
                      <span className="text-red-500"> *</span>
                    </Label>
                    <Textarea
                      id="curbside-limitation"
                      value={limitation}
                      onChange={e => setLimitation(e.target.value)}
                      rows={4}
                      placeholder="For example: I use a wheelchair, or I can't walk more than a few steps."
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Describe how it limits your mobility. You don't need to share a medical diagnosis.
                    </p>
                  </div>
                )}

                <div>
                  <Label className="font-semibold">Upload ID or documentation <span className="text-red-500">*</span></Label>
                  <p className="text-xs text-gray-500 mb-2">
                    A photo of your driver's license or state ID, or a state-issued disability form or medical documentation.
                    JPG, PNG or PDF, up to 10 MB. Only our admin team can see this file.
                  </p>
                  <label htmlFor="curbside-file" className={`flex items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed py-4 text-sm font-semibold cursor-pointer ${file ? 'border-green-400 bg-green-50 text-green-700' : 'border-orange-300 bg-orange-50 text-orange-600 hover:bg-orange-100'}`}>
                    {file ? <FileText className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                    {file ? file.name : 'Choose photo or PDF'}
                  </label>
                  <input id="curbside-file" type="file" accept={ACCEPTED} onChange={onFile} className="hidden" />
                </div>

                <div className="flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-sm text-blue-800">
                  <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                  <span>Your information is private and only used to approve your curbside eligibility. You can keep driving standard routes while we review it.</span>
                </div>
              </>
            )}

            {error && (
              <p className="flex items-start gap-2 text-sm text-red-600"><AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />{error}</p>
            )}

            <div className="flex gap-3">
              {editing && (
                <Button variant="outline" onClick={() => setEditing(false)} className="h-11 flex-1">Cancel</Button>
              )}
              <Button onClick={submit} disabled={submitting || !qualifies} className="h-11 flex-1 bg-orange-500 hover:bg-orange-600 font-bold">
                {submitting ? 'Submitting…' : 'Submit for review'}
              </Button>
            </div>
          </div>
        )}

        {profile?.role && profile.role !== 'driver' && profile.role !== 'admin' && (
          <p className="text-xs text-gray-500 text-center">This program is for delivery drivers.</p>
        )}
      </div>
    </div>
  );
}

function StatusPanel({ app, onResubmit }: { app: Application; onResubmit: () => void }) {
  const submitted = new Date(app.submitted_at).toLocaleDateString();
  if (app.status === 'approved') {
    return (
      <div className="rounded-2xl border-2 border-green-400 bg-green-50 p-5">
        <div className="flex items-center gap-2 text-green-700 font-bold text-lg"><CheckCircle className="w-6 h-6" /> Approved</div>
        <p className="text-green-800 text-sm mt-1">
          You're approved for curbside orders. Vendors will bring orders to your car window, and customers on curbside orders will walk out to you.
        </p>
      </div>
    );
  }
  if (app.status === 'denied') {
    return (
      <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-5 space-y-3">
        <div className="flex items-center gap-2 text-red-700 font-bold text-lg"><XCircle className="w-6 h-6" /> Not approved</div>
        {app.denial_reason && <p className="text-red-800 text-sm"><span className="font-semibold">Reason:</span> {app.denial_reason}</p>}
        <Button onClick={onResubmit} className="bg-orange-500 hover:bg-orange-600">Update and resubmit</Button>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 space-y-2">
      <div className="flex items-center gap-2 text-amber-700 font-bold text-lg"><Clock className="w-6 h-6" /> Pending review</div>
      <p className="text-amber-800 text-sm">
        Submitted {submitted}. Our team is reviewing your information. Curbside orders stay off until you're approved, but you can drive standard routes in the meantime.
      </p>
      <button onClick={onResubmit} className="text-sm text-amber-800 underline">Update my submission</button>
    </div>
  );
}
