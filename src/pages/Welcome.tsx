import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  ChefHat, Mail, Lock, User, Eye, EyeOff,
  Car, ShoppingBag, Heart, ArrowRight,
  CheckCircle, AlertCircle
} from 'lucide-react';

type Mode = 'landing' | 'login' | 'signup';
type Role = 'customer' | 'vendor' | 'driver';

const COMMUNITY_SCRIPTS = [
  '家常菜', 'घर का खाना', 'בית מטבח', 'مطبخ البيت',
  'Sabor Latino', 'Irie Kitchen', 'Ìdáná Ilé', 'อาหารบ้าน'
];

const ROLE_OPTIONS = [
  {
    role: 'customer' as Role,
    emoji: '🛍️',
    title: 'Order Food & Shop',
    description: 'Browse and order from local home cooks and makers',
    color: 'border-orange-400 bg-orange-50',
    activeColor: 'bg-orange-500',
  },
  {
    role: 'vendor' as Role,
    emoji: '👩‍🍳',
    title: 'Sell My Food or Goods',
    description: 'List your homemade food, crafts, beauty products & more',
    color: 'border-green-400 bg-green-50',
    activeColor: 'bg-green-500',
  },
  {
    role: 'driver' as Role,
    emoji: '🚗',
    title: 'Drive & Earn',
    description: 'Deliver orders and earn flexible income in your community',
    color: 'border-blue-400 bg-blue-50',
    activeColor: 'bg-blue-500',
  },
];

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle, signInWithFacebook, user, profile } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>('landing');
  const [role, setRole] = useState<Role>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scriptIndex, setScriptIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Rotate cultural scripts
  useEffect(() => {
    const timer = setInterval(() => {
      setScriptIndex(i => (i + 1) % COMMUNITY_SCRIPTS.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user && profile) {
      redirectByRole(profile.role);
    }
  }, [user, profile]);

  const redirectByRole = (userRole: string) => {
    if (userRole === 'vendor' && profile?.application_status === 'approved') {
      navigate('/vendor-dashboard');
    } else if (userRole === 'driver') {
      navigate('/driver');
    } else if (userRole === 'admin' || profile?.is_admin) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (mode === 'signup') {
      if (!form.fullName) newErrors.fullName = 'Your name is required';
      if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { error } = await signIn(form.email, form.password);
      if (error) {
        toast({
          title: 'Login Failed',
          description: error.message === 'Invalid login credentials'
            ? 'Email or password is incorrect. Please try again.'
            : error.message,
          variant: 'destructive'
        });
      } else {
        toast({ title: '👋 Welcome back!', description: 'You are now signed in.' });
      }
    } catch {
      toast({ title: 'Something went wrong', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { error } = await signUp(form.email, form.password, form.fullName, role);
      if (error) {
        if (error.message?.includes('already registered')) {
          toast({
            title: 'Email already registered',
            description: 'This email has an account. Try signing in instead.',
            variant: 'destructive'
          });
          setMode('login');
        } else {
          toast({ title: 'Signup Failed', description: error.message, variant: 'destructive' });
        }
      } else {
        toast({
          title: '🎉 Welcome to Homemade Connect!',
          description: role === 'vendor'
            ? 'Account created! Let\'s set up your vendor profile.'
            : role === 'driver'
            ? 'Account created! You can now start accepting deliveries.'
            : 'Account created! Start browsing local home cooks.',
        });
        // Redirect based on role
        setTimeout(() => {
          if (role === 'vendor') navigate('/vendor-application');
          else if (role === 'driver') navigate('/driver');
          else navigate('/');
        }, 1000);
      }
    } catch {
      toast({ title: 'Something went wrong', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch {
      toast({ title: 'Google login failed', variant: 'destructive' });
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signInWithFacebook();
    } catch {
      toast({ title: 'Facebook login failed', variant: 'destructive' });
    }
  };

  const updateForm = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // ── LANDING PAGE ─────────────────────────────────────────────────────────────
  if (mode === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-12">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mb-5 shadow-2xl backdrop-blur-sm border border-white/30">
              <ChefHat className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-black text-white text-center leading-tight">
              Homemade Connect
            </h1>
            <p className="text-2xl font-bold text-white/90 mt-1">Delivery</p>

            {/* Rotating cultural script */}
            <div className="mt-3 h-8 flex items-center">
              <p className="text-white/70 text-lg transition-all duration-500"
                style={{ fontFamily: 'serif' }}>
                {COMMUNITY_SCRIPTS[scriptIndex]}
              </p>
            </div>

            <p className="text-white/80 text-center mt-3 text-base leading-relaxed max-w-xs">
              Fresh homemade food & handcrafted goods from your neighbors — delivered same day
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mb-8">
            {[
              { value: '12+', label: 'Communities' },
              { value: '4', label: 'States' },
              { value: '$0', label: 'Delivery w/ Plan' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="text-white/70 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Role cards */}
          <div className="w-full max-w-sm space-y-2 mb-6">
            {ROLE_OPTIONS.map(({ role: r, emoji, title }) => (
              <button
                key={r}
                onClick={() => { setRole(r); setMode('signup'); }}
                className="w-full bg-white/15 hover:bg-white/25 border border-white/30 rounded-2xl px-4 py-3 flex items-center gap-3 text-left transition-all"
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-white font-semibold">{title}</span>
                <ArrowRight className="w-4 h-4 text-white/70 ml-auto" />
              </button>
            ))}
          </div>

          {/* Sign in link */}
          <p className="text-white/80 text-sm">
            Already have an account?{' '}
            <button onClick={() => setMode('login')} className="text-white font-bold underline">
              Sign in
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="relative bg-black/20 backdrop-blur-sm px-6 py-3 text-center">
          <p className="text-white/70 text-xs">
            🏘️ Serving Illinois · Georgia · Wisconsin · Michigan
          </p>
          <p className="text-white/50 text-xs mt-0.5">
            www.homemadeconnectdelivery.com · info@homemadeconnectdelivery.com
          </p>
        </div>
      </div>
    );
  }

  // ── LOGIN / SIGNUP ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 flex flex-col relative">
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="relative flex-1 flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">

          {/* Card header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-5 text-center">
            <ChefHat className="w-8 h-8 text-white mx-auto mb-2" />
            <h2 className="text-xl font-black text-white">
              {mode === 'login' ? 'Welcome Back!' : 'Join Homemade Connect'}
            </h2>
            <p className="text-white/80 text-sm mt-0.5">
              {mode === 'login' ? 'Sign in to your account' : 'Create your free account'}
            </p>
          </div>

          <div className="p-5 space-y-4">

            {/* Social login buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={handleGoogleLogin}
                className="h-10 rounded-xl border-gray-200 text-sm">
                <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button variant="outline" onClick={handleFacebookLogin}
                className="h-10 rounded-xl border-gray-200 text-sm">
                <svg className="w-4 h-4 mr-1.5 fill-blue-600" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400">or with email</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Role selection — signup only */}
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-600">I am joining as a...</Label>
                <div className="grid grid-cols-3 gap-1.5">
                  {ROLE_OPTIONS.map(({ role: r, emoji, title }) => (
                    <button key={r} type="button" onClick={() => setRole(r)}
                      className={`p-2 rounded-xl border-2 text-center transition-all ${
                        role === r ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-gray-200 hover:border-orange-300'
                      }`}>
                      <div className="text-xl mb-0.5">{emoji}</div>
                      <div className="text-xs font-medium text-gray-700 leading-tight">
                        {r === 'customer' ? 'Customer' : r === 'vendor' ? 'Vendor' : 'Driver'}
                      </div>
                    </button>
                  ))}
                </div>
                {/* First 100 vendor bonus */}
                {role === 'vendor' && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-2.5 text-center">
                    <p className="text-orange-700 font-bold text-xs">🎉 First 100 Vendors Bonus!</p>
                    <p className="text-orange-600 text-xs">Get <strong>$10 credit</strong> on your first month</p>
                  </div>
                )}
              </div>
            )}

            {/* Full name — signup only */}
            {mode === 'signup' && (
              <div>
                <Label className="text-xs font-semibold text-gray-600">Full Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Your full name"
                    value={form.fullName}
                    onChange={e => updateForm('fullName', e.target.value)}
                    className={`pl-9 h-11 rounded-xl ${errors.fullName ? 'border-red-400' : 'border-gray-200'} focus:border-orange-400`}
                  />
                </div>
                {errors.fullName && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.fullName}</p>}
              </div>
            )}

            {/* Email */}
            <div>
              <Label className="text-xs font-semibold text-gray-600">Email Address</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => updateForm('email', e.target.value)}
                  className={`pl-9 h-11 rounded-xl ${errors.email ? 'border-red-400' : 'border-gray-200'} focus:border-orange-400`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center">
                <Label className="text-xs font-semibold text-gray-600">Password</Label>
                {mode === 'login' && (
                  <button onClick={() => navigate('/reset-password')}
                    className="text-xs text-orange-600 hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => updateForm('password', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleSignup())}
                  className={`pl-9 pr-10 h-11 rounded-xl ${errors.password ? 'border-red-400' : 'border-gray-200'} focus:border-orange-400`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.password}</p>}
            </div>

            {/* Confirm password — signup only */}
            {mode === 'signup' && (
              <div>
                <Label className="text-xs font-semibold text-gray-600">Confirm Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={e => updateForm('confirmPassword', e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSignup()}
                    className={`pl-9 h-11 rounded-xl ${errors.confirmPassword ? 'border-red-400' : 'border-gray-200'} focus:border-orange-400`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.confirmPassword}</p>}
              </div>
            )}

            {/* Submit button */}
            <Button
              onClick={mode === 'login' ? handleLogin : handleSignup}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 rounded-2xl text-base shadow-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : mode === 'login' ? (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Sign In
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4" /> Create My Account
                </span>
              )}
            </Button>

          {/* Help notice */}
            {mode === 'login' && (
              <p className="text-center text-xs text-gray-500">
                Having trouble signing in? Email us at{' '}
                <a href="mailto:info@homemadeconnectdelivery.com" className="text-orange-600 font-semibold hover:underline">
                  info@homemadeconnectdelivery.com
                </a>{' '}
                with your name, business name, and signup email — we'll get you back in, usually within 24 hours.
              </p>
            )} 
            {/* Switch mode */}
            <p className="text-center text-sm text-gray-500">
              {mode === 'login' ? (
                <>Don't have an account?{' '}
                  <button onClick={() => { setMode('signup'); setErrors({}); }}
                    className="text-orange-600 font-bold hover:underline">
                    Sign up free
                  </button>
                </>
              ) : (
                <>Already have an account?{' '}
                  <button onClick={() => { setMode('login'); setErrors({}); }}
                    className="text-orange-600 font-bold hover:underline">
                    Sign in
                  </button>
                </>
              )}
            </p>

            <button onClick={() => setMode('landing')}
              className="w-full text-center text-gray-400 text-xs hover:text-gray-600 py-1">
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
