'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await forgotPassword(email);

      if (result.success) {
        setEmailSent(true);
        toast.success('Password reset email sent!');
      } else {
        toast.error(result.error || 'Failed to send reset email');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {emailSent ? (
              // Success state
              <div className="text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-serif font-bold text-stone-900">
                    Check Your Email
                  </h1>
                  <p className="text-stone-500 font-light">
                    We&apos;ve sent a password reset link to <strong>{email}</strong>. 
                    The link will expire in 1 hour.
                  </p>
                </div>
                <div className="space-y-4 pt-4">
                  <p className="text-sm text-stone-400">
                    Didn&apos;t receive the email? Check your spam folder or try again.
                  </p>
                  <Button
                    onClick={() => setEmailSent(false)}
                    variant="outline"
                    className="w-full h-12 rounded-full"
                  >
                    Try Another Email
                  </Button>
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className="w-full h-12 rounded-full"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              // Form state
              <>
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-serif font-bold text-stone-900">
                    Forgot Password?
                  </h1>
                  <p className="text-stone-500 font-light">
                    No worries! Enter your email and we&apos;ll send you a reset link.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
                      Email Address
                    </Label>
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

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-14 rounded-full bg-stone-900 text-white hover:bg-stone-800 text-lg shadow-lg active:scale-95 transition-all"
                  >
                    {isLoading ? 'Sending...' : (
                      <span className="flex items-center">
                        Send Reset Link <ArrowRight className="ml-2 h-5 w-5" />
                      </span>
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <Link 
                    href="/login" 
                    className="text-sm text-stone-500 hover:text-stone-900 inline-flex items-center"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
