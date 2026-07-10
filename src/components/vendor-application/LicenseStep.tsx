import { useState } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface LicenseStepProps {
  licenseUrl: string | null;
  onLicenseUploaded: (url: string) => void;
  userId: string;
}

export function LicenseStep({ licenseUrl, onLicenseUploaded, userId }: LicenseStepProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Max 5MB', variant: 'destructive' });
      return;
    }

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId || 'vendor'}-${Date.now()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('vendor-licenses')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('vendor-licenses')
        .getPublicUrl(fileName);

      if (typeof onLicenseUploaded === 'function' && data?.publicUrl) {
        onLicenseUploaded(data.publicUrl);
      }
      toast({ title: 'License uploaded successfully' });
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error?.message || 'Please try again or continue without a file.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center py-8 border-2 border-dashed rounded-lg">
        {licenseUrl ? (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="w-12 h-12 text-green-500" />
            <p className="font-medium">License Uploaded</p>
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Upload className="w-12 h-12 text-gray-400" />
            <div>
              <p className="font-medium mb-2">Upload Your Cottage Food License</p>
              <p className="text-sm text-gray-500 mb-1">PDF, JPG, or PNG (Max 5MB)</p>
              <p className="text-xs text-gray-400 mb-4">
                Optional for now — you can add it later, but it speeds up approval.
              </p>
            </div>
            <Button asChild disabled={uploading}>
              <label className="cursor-pointer">
                {uploading ? 'Uploading...' : 'Choose File'}
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </label>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
