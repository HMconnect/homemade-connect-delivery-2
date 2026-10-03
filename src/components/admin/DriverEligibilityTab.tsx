import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle, XCircle, Clock, FileText, Phone, Mail, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { displayPhone } from '@/lib/phone';

type Row = {
  id: string;
  driver_id: string;
  date_of_birth: string;
  age_at_submission: number | null;
  limitation: string | null;
  document_path: string;
  status: 'pending' | 'approved' | 'denied';
  denial_reason: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  user_profiles?: { full_name: string | null; email: string | null; phone: string | null } | null;
};

const STATUS_STYLE: Record<Row['status'], string> = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-green-100 text-green-800',
  denied: 'bg-red-100 text-red-700',
};

/** Admin Review Gate for the Senior & Disability Curbside Protocol. */
export const DriverEligibilityTab: React.FC = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'denied' | 'all'>('pending');

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('driver_curbside_applications')
      .select('*, user_profiles!driver_curbside_applications_driver_id_fkey(full_name, email, phone)')
      .order('submitted_at', { ascending: false });
    if (error) toast({ title: 'Could not load requests', description: error.message, variant: 'destructive' });
    setRows((data as Row[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const counts = useMemo(() => ({
    pending: rows.filter(r => r.status === 'pending').length,
    approved: rows.filter(r => r.status === 'approved').length,
    denied: rows.filter(r => r.status === 'denied').length,
    all: rows.length,
  }), [rows]);

  const shown = filter === 'all' ? rows : rows.filter(r => r.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {(['pending', 'approved', 'denied', 'all'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${filter === f ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'}`}
          >
            {f[0].toUpperCase() + f.slice(1)} ({counts[f]})
          </button>
        ))}
        <Button variant="ghost" size="sm" onClick={load} className="ml-auto"><RefreshCw className="w-4 h-4 mr-1" />Refresh</Button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : shown.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
          {filter === 'pending' ? 'No curbside requests waiting for review.' : 'Nothing here yet.'}
        </div>
      ) : (
        <div className="grid gap-4">
          {shown.map(r => <RequestCard key={r.id} row={r} onChanged={load} />)}
        </div>
      )}
    </div>
  );
};

function RequestCard({ row, onChanged }: { row: Row; onChanged: () => void }) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [denying, setDenying] = useState(false);
  const [reason, setReason] = useState('');
  const p = row.user_profiles;
  const age = row.age_at_submission;

  const viewDocument = async () => {
    const { data, error } = await supabase.storage.from('driver-documents').createSignedUrl(row.document_path, 300);
    if (error || !data?.signedUrl) {
      toast({ title: 'Could not open document', description: error?.message, variant: 'destructive' });
      return;
    }
    window.open(data.signedUrl, '_blank', 'noopener');
  };

  const decide = async (status: 'approved' | 'denied') => {
    if (status === 'denied' && reason.trim().length < 3) {
      toast({ title: 'Reason needed', description: 'Tell the driver why so they can fix it and resubmit.', variant: 'destructive' });
      return;
    }
    setBusy(true);
    const { error } = await supabase
      .from('driver_curbside_applications')
      .update(status === 'approved' ? { status, denial_reason: null } : { status, denial_reason: reason.trim() })
      .eq('id', row.id);
    setBusy(false);
    if (error) {
      toast({ title: 'Could not save decision', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: status === 'approved' ? 'Eligibility approved' : 'Request denied' });
    setDenying(false);
    setReason('');
    onChanged();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{p?.full_name || 'Unnamed driver'}</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-1">
            {p?.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{p.email}</span>}
            {p?.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{displayPhone(p.phone)}</span>}
          </div>
        </div>
        <span className={`text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${STATUS_STYLE[row.status]}`}>{row.status}</span>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 text-sm">
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-gray-500 text-xs uppercase tracking-wide">Age</p>
          <p className="font-bold text-gray-900">{age ?? '—'} {age !== null && age >= 70 && <span className="text-green-700 font-semibold">(70+)</span>}</p>
          <p className="text-gray-500 text-xs">Born {new Date(row.date_of_birth + 'T00:00:00').toLocaleDateString()}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-gray-500 text-xs uppercase tracking-wide">Submitted</p>
          <p className="font-bold text-gray-900">{new Date(row.submitted_at).toLocaleDateString()}</p>
          {row.reviewed_at && <p className="text-gray-500 text-xs">Reviewed {new Date(row.reviewed_at).toLocaleDateString()}</p>}
        </div>
        <div className="rounded-lg bg-gray-50 p-3 flex items-center">
          <Button variant="outline" onClick={viewDocument} className="w-full"><FileText className="w-4 h-4 mr-2" />View document</Button>
        </div>
      </div>

      <div>
        <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Stated limitation</p>
        <p className="text-gray-900 text-sm whitespace-pre-wrap rounded-lg border border-gray-100 bg-gray-50 p-3">
          {row.limitation || (age !== null && age >= 70 ? 'Not required (age 70+). Check the ID for date of birth.' : '—')}
        </p>
      </div>

      {row.status === 'denied' && row.denial_reason && (
        <p className="text-sm text-red-700"><span className="font-semibold">Denial reason:</span> {row.denial_reason}</p>
      )}

      <p className="text-xs text-gray-500">
        Check: the document matches the driver's name; the birth date matches (70+), or the documentation supports the stated limitation.
      </p>

      {denying ? (
        <div className="space-y-2">
          <Textarea
            id={`deny-reason-${row.id}`}
            value={reason}
            onChange={e => setReason(e.target.value)}
            rows={3}
            placeholder="Reason shown to the driver, e.g. The photo is blurry. Please upload a clearer picture of your ID."
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setDenying(false)} disabled={busy}>Cancel</Button>
            <Button onClick={() => decide('denied')} disabled={busy} className="bg-red-600 hover:bg-red-700">
              <XCircle className="w-4 h-4 mr-2" />Confirm deny
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {row.status !== 'approved' && (
            <Button onClick={() => decide('approved')} disabled={busy} className="bg-green-600 hover:bg-green-700 font-bold tracking-wide">
              <CheckCircle className="w-4 h-4 mr-2" />APPROVE ELIGIBILITY
            </Button>
          )}
          {row.status !== 'denied' && (
            <Button variant="outline" onClick={() => setDenying(true)} disabled={busy} className="text-red-600 border-red-200 hover:bg-red-50">
              {row.status === 'approved' ? 'Revoke' : 'Deny'}
            </Button>
          )}
          {row.status === 'pending' && <span className="flex items-center text-xs text-amber-700"><Clock className="w-3.5 h-3.5 mr-1" />Curbside orders blocked until approved</span>}
        </div>
      )}
    </div>
  );
}

export default DriverEligibilityTab;
