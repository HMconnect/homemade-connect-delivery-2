import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, FileText, Phone, MapPin, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Application {
  id: string;
  email: string;
  full_name?: string;
  business_name?: string;
  business_description?: string;
  business_address?: string;
  business_phone?: string;
  license_url?: string;
  license_status?: string;
  application_status: string;
  application_submitted_at?: string;
}

interface ApplicationCardProps {
  application: Application;
  onUpdate: () => void;
}

export const ApplicationCard = ({ application, onUpdate }: ApplicationCardProps) => {
  const handleApprove = async () => {
    await supabase.from('user_profiles').update({
      application_status: 'approved',
      license_status: 'approved',
      role: 'vendor'
    }).eq('id', application.id);
    onUpdate();
  };

  const handleReject = async () => {
    await supabase.from('user_profiles').update({
      application_status: 'rejected',
      license_status: 'rejected'
    }).eq('id', application.id);
    onUpdate();
  };

  const viewLicense = () => {
    if (application.license_url) {
      window.open(application.license_url, '_blank');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{application.business_name || 'Unnamed Business'}</CardTitle>
            <p className="text-sm text-muted-foreground">{application.full_name}</p>
          </div>
          <Badge variant={application.application_status === 'pending' ? 'default' : 'secondary'}>
            {application.application_status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm">{application.business_description}</p>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{application.business_address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>{application.business_phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(application.application_submitted_at || '').toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          {application.license_url && (
            <Button variant="outline" size="sm" onClick={viewLicense}>
              <FileText className="w-4 h-4 mr-2" />
              View License
            </Button>
          )}
          <Button variant="default" size="sm" onClick={handleApprove}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve
          </Button>
          <Button variant="destructive" size="sm" onClick={handleReject}>
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
