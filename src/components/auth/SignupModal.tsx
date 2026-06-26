import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, User, Chrome, Facebook } from 'lucide-react';

interface SignupModalProps {
  open: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const SignupModal: React.FC<SignupModalProps> = ({ open, onClose, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle, signInWithFacebook } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);
    
    if (error) {
      toast({ title: 'Signup Failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success!', description: 'Check your email to verify your account.' });
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input id="fullName" placeholder="John Doe" className="pl-10" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input id="email" type="email" placeholder="you@example.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input id="password" type="password" placeholder="••••••••" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating account...' : 'Sign Up'}</Button>
        </form>
        <div className="relative my-4"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or continue with</span></div></div>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={signInWithGoogle}><Chrome className="mr-2 h-4 w-4" />Google</Button>
          <Button variant="outline" onClick={signInWithFacebook}><Facebook className="mr-2 h-4 w-4" />Facebook</Button>
        </div>
        <p className="text-center text-sm">Already have an account? <Button variant="link" className="px-1" onClick={onSwitchToLogin}>Log in</Button></p>
      </DialogContent>
    </Dialog>
  );
};
