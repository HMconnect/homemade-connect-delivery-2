import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const VendorProfileForm: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    business_name: profile?.business_name || '',
    business_description: profile?.business_description || '',
    business_address: profile?.business_address || '',
    business_phone: profile?.business_phone || '',
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      toast({ title: 'Success', description: 'Profile updated successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="business_name">Business Name</Label>
            <Input id="business_name" value={formData.business_name} onChange={(e) => setFormData({...formData, business_name: e.target.value})} />
          </div>

          <div>
            <Label htmlFor="business_description">Business Description</Label>
            <Textarea id="business_description" value={formData.business_description} onChange={(e) => setFormData({...formData, business_description: e.target.value})} rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="business_phone">Business Phone</Label>
              <Input id="business_phone" value={formData.business_phone} onChange={(e) => setFormData({...formData, business_phone: e.target.value})} />
            </div>
            <div>
              <Label htmlFor="phone">Personal Phone</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>

          <div>
            <Label htmlFor="business_address">Business Address</Label>
            <Textarea id="business_address" value={formData.business_address} onChange={(e) => setFormData({...formData, business_address: e.target.value})} rows={2} />
          </div>

          <Button type="submit" className="w-full">Save Changes</Button>
        </form>
      </CardContent>
    </Card>
  );
};
