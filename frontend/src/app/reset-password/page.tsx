'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, ArrowRight, CheckCircle, XCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

function ResetPasswordContent() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { resetPassword } = useAuth();

  // Validate token on mount
  useEffect(() => {
    async function validateToken() {
      if (!token) {
        setTokenError('No reset token provided');
        setIsValidating(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/reset-password?token=${token}`);
        const data = await response.json();

        if (data.valid) {
          setIsValidToken(true);
        } else {
          setTokenError(data.error || 'Invalid or expired reset link');
        }
      } catch {
        setTokenError('Failed to validate reset link');
      } finally {
        setIsValidating(false);
      }
    }

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(token!, password);

      if (result.success) {
        setResetSuccess(true);
        toast.success('Password reset successful!');
      } else {
        toast.error(result.error || 'Failed to reset password');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isValidating) {
    return (
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-stone-400" />
        <p className="text-stone-500">Validating reset link...</p>
      </div>
    );
  }

  // Invalid token state
  if (!isValidToken && !resetSuccess) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-stone-900">
            Invalid Reset Link
          </h1>
          <p className="text-stone-500 font-light">
            {tokenError || 'This password reset link is invalid or has expired.'}
          </p>
        </div>
        <Link href="/forgot-password">
          <Button className="w-full h-14 rounded-full bg-stone-900 text-white hover:bg-stone-800">
            Request New Reset Link
          </Button>
        </Link>
      </div>
    );
  }

  // Success state
  if (resetSuccess) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-stone-900">
            Password Reset!
          </h1>
          <p className="text-stone-500 font-light">
            Your password has been successfully reset. You can now log in with your new password.
          </p>
        </div>
        <Button
          onClick={() => router.push('/login')}
          className="w-full h-14 rounded-full bg-stone-900 text-white hover:bg-stone-800"
        >
          Go to Login
        </Button>
      </div>
    );
  }

  // Form state
  return (
    <>
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-serif font-bold text-stone-900">
          Reset Your Password
        </h1>
        <p className="text-stone-500 font-light">
          Enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
            New Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-stone-300" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
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
          <p className="text-xs text-stone-400">
            At least 8 characters with uppercase, lowercase, and a number
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
            Confirm New Password
          </Label>
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

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-14 rounded-full bg-stone-900 text-white hover:bg-stone-800 text-lg shadow-lg active:scale-95 transition-all"
        >
          {isLoading ? 'Resetting...' : (
            <span className="flex items-center">
              Reset Password <ArrowRight className="ml-2 h-5 w-5" />
            </span>
          )}
        </Button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Suspense fallback={
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-stone-400" />
                <p className="text-stone-500">Loading...</p>
              </div>
            }>
              <ResetPasswordContent />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
