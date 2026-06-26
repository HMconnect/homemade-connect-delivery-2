import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const LicenseUpload: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Error', description: 'File must be under 5MB', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('vendor-licenses')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('vendor-licenses')
        .getPublicUrl(fileName);

      await updateProfile({
        license_url: publicUrl,
        license_status: 'pending',
      });

      toast({ title: 'Success', description: 'License uploaded successfully!' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to upload license', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Illinois Food Service License</h3>
      
      {profile?.license_url ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <FileText className="w-5 h-5" />
            <span>License uploaded</span>
            {profile.license_status === 'approved' && <CheckCircle className="w-5 h-5 text-green-600" />}
            {profile.license_status === 'pending' && <AlertCircle className="w-5 h-5 text-yellow-600" />}
          </div>
          <p className="text-sm text-gray-600">Status: {profile.license_status}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Upload your Illinois cottage food operator license</p>
          <label htmlFor="license-upload">
            <Button disabled={uploading} className="cursor-pointer" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload License'}
              </span>
            </Button>
            <input
              id="license-upload"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      )}
    </Card>
  );
};
