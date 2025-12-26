'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export function AuthForm({ type }: { type: 'login' | 'register' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (type === 'register') {
        // Validate password confirmation
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          setIsLoading(false);
          return;
        }

        const result = await register({
          email,
          password,
          first_name: firstName || undefined,
          last_name: lastName || undefined,
        });

        if (result.success) {
          toast.success('Account created! Please check your email to verify your account.');
          router.push('/account');
        } else {
          toast.error(result.error || 'Registration failed');
        }
      } else {
        const result = await login(email, password, rememberMe);

        if (result.success) {
          toast.success('Welcome back!');
          router.push('/account');
        } else {
          toast.error(result.error || 'Invalid email or password');
        }
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-serif font-bold text-stone-900">
          {type === 'login' ? 'Welcome Back' : 'Create Your Account'}
        </h1>
        <p className="text-stone-500 font-light">
          {type === 'login' 
            ? 'Sign in to access your orders and saved collections.' 
            : 'Join HJ Fashion for exclusive access and faster checkout.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {type === 'register' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-stone-300" />
                <Input
                  id="firstName"
                  placeholder="Hina"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-stone-200"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Javed"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="h-12 rounded-xl border-stone-200"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-stone-300" />
            <Input
              id="email"
              type="email"
              placeholder="hina@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 h-12 rounded-xl border-stone-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Password</Label>
            {type === 'login' && (
              <Link href="/forgot-password" className="text-[10px] uppercase tracking-widest font-bold text-stone-400 hover:text-stone-900 transition-colors">
                Forgot Password?
              </Link>
            )}
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-stone-300" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={type === 'register' ? 8 : undefined}
              className="pl-10 pr-10 h-12 rounded-xl border-stone-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 h-5 w-5 text-stone-300 hover:text-stone-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {type === 'register' && (
            <p className="text-xs text-stone-400">
              At least 8 characters with uppercase, lowercase, and a number
            </p>
          )}
        </div>

        {type === 'login' && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-500 cursor-pointer"
            />
            <label htmlFor="rememberMe" className="text-sm text-stone-600 cursor-pointer select-none">
              Remember me for 30 days
            </label>
          </div>
        )}

        {type === 'register' && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-stone-300" />
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pl-10 h-12 rounded-xl border-stone-200"
              />
            </div>
          </div>
        )}

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-14 rounded-full bg-stone-900 text-white hover:bg-stone-800 text-lg shadow-lg active:scale-95 transition-all"
        >
          {isLoading ? 'Processing...' : (
            <span className="flex items-center">
              {type === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight className="ml-2 h-5 w-5" />
            </span>
          )}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-stone-500">
          {type === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
          <Link 
            href={type === 'login' ? '/register' : '/login'} 
            className="font-bold text-stone-900 hover:underline"
          >
            {type === 'login' ? 'Sign Up' : 'Sign In'}
          </Link>
        </p>
      </div>
    </div>
  );
}
