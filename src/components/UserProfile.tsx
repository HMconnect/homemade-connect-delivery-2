import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, MapPin, LogOut, MessageSquare } from 'lucide-react';
import { LicenseUpload } from './LicenseUpload';

interface UserProfileProps {
  open: boolean;
  onClose: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ open, onClose }) => {
  const { user, profile, signOut, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [smsOptIn, setSmsOptIn] = useState(profile?.sms_opt_in || false);
  const { toast } = useToast();

  const handleSave = async () => {
    await updateProfile({ full_name: fullName, phone, address, sms_opt_in: smsOptIn });
    toast({ title: 'Success', description: 'Profile updated successfully.' });
    setEditing(false);
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
    toast({ title: 'Signed Out', description: 'You have been logged out.' });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'vendor': return 'bg-blue-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            My Profile
            {profile && <Badge className={getRoleBadgeColor(profile.role)}>{profile.role}</Badge>}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span>{user?.email}</span>
          </div>
          {editing ? (
            <>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1234567890" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <div>
                    <Label htmlFor="smsOptIn" className="text-sm font-medium">SMS Notifications</Label>
                    <p className="text-xs text-gray-500">Receive order updates via text</p>
                  </div>
                </div>
                <Switch id="smsOptIn" checked={smsOptIn} onCheckedChange={setSmsOptIn} />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1">Save</Button>
                <Button variant="outline" onClick={() => setEditing(false)} className="flex-1">Cancel</Button>
              </div>
            </>
          ) : (
            <>
              {profile?.full_name && <div className="flex items-center gap-2"><User className="w-4 h-4" /><span>{profile.full_name}</span></div>}
              {profile?.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4" /><span>{profile.phone}</span></div>}
              {profile?.address && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>{profile.address}</span></div>}
              {profile?.sms_opt_in && <div className="flex items-center gap-2 text-green-600"><MessageSquare className="w-4 h-4" /><span className="text-sm">SMS notifications enabled</span></div>}
              <Button onClick={() => setEditing(true)} className="w-full">Edit Profile</Button>
            </>
          )}
          {profile?.role === 'vendor' && <LicenseUpload />}
          <Button variant="destructive" onClick={handleSignOut} className="w-full"><LogOut className="w-4 h-4 mr-2" />Sign Out</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};