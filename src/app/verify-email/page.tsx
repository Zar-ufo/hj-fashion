'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';

function VerifyEmailContent() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    async function verifyEmail() {
      if (!token) {
        setError('No verification token provided');
        setIsVerifying(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setIsSuccess(true);
          if (data.already_verified) {
            toast.info('Email was already verified');
          } else {
            toast.success('Email verified successfully!');
          }
        } else {
          setError(data.error || 'Failed to verify email');
        }
      } catch {
        setError('An unexpected error occurred');
      } finally {
        setIsVerifying(false);
      }
    }

    verifyEmail();
  }, [token]);

  // Loading state
  if (isVerifying) {
    return (
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-stone-400" />
        <p className="text-stone-500">Verifying your email...</p>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-stone-900">
            Email Verified!
          </h1>
          <p className="text-stone-500 font-light">
            Your email has been successfully verified. You now have full access to all features.
          </p>
        </div>
        <div className="space-y-4 pt-4">
          <Link href="/account">
            <Button className="w-full h-14 rounded-full bg-stone-900 text-white hover:bg-stone-800">
              Go to My Account
            </Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline" className="w-full h-12 rounded-full">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
        <XCircle className="h-8 w-8 text-red-600" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-serif font-bold text-stone-900">
          Verification Failed
        </h1>
        <p className="text-stone-500 font-light">
          {error || 'We could not verify your email address.'}
        </p>
      </div>
      <div className="space-y-4 pt-4">
        <p className="text-sm text-stone-400">
          The verification link may have expired or already been used.
        </p>
        <Link href="/login">
          <Button className="w-full h-14 rounded-full bg-stone-900 text-white hover:bg-stone-800">
            <Mail className="mr-2 h-5 w-5" />
            Login to Resend Verification
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
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
              <VerifyEmailContent />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
