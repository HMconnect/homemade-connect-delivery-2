import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ApplicationCard } from '@/components/admin/ApplicationCard';
import { SMSLogsTable } from '@/components/admin/SMSLogsTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applications, setApplications] = useState<any[]>([]);
  const [filteredApps, setFilteredApps] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && !profile?.is_admin && profile?.role !== 'admin') {
      toast({ 
        title: 'Access Denied', 
        description: 'Admin access required. Visit /admin-setup to configure admin access.',
        variant: 'destructive' 
      });
      navigate('/');
    }
  }, [profile, loading, navigate]);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const fetchApplications = async () => {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .neq('application_status', 'none')
      .order('application_submitted_at', { ascending: false });
    setApplications(data || []);
  };

  const filterApplications = () => {
    let filtered = applications;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.application_status === statusFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredApps(filtered);
  };

  const handleBulkApprove = async () => {
    await Promise.all(selectedIds.map(id =>
      supabase.from('user_profiles').update({ application_status: 'approved', license_status: 'approved', role: 'vendor' }).eq('id', id)
    ));
    setSelectedIds([]);
    fetchApplications();
    toast({ title: 'Success', description: `${selectedIds.length} applications approved` });
  };

  if (loading || (!profile?.is_admin && profile?.role !== 'admin')) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="applications">Vendor Applications</TabsTrigger>
            <TabsTrigger value="sms">SMS Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by business name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              {selectedIds.length > 0 && (
                <Button onClick={handleBulkApprove}>Approve Selected ({selectedIds.length})</Button>
              )}
            </div>

            <div className="grid gap-4">
              {filteredApps.map(app => (
                <ApplicationCard key={app.id} application={app} onUpdate={fetchApplications} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sms">
            <SMSLogsTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

