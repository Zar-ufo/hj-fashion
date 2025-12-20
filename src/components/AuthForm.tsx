'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function AuthForm({ type }: { type: 'login' | 'register' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (type === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        toast.success('Registration successful! Please check your email for verification.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Logged in successfully!');
        router.push('/account');
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message);
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
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-stone-300" />
              <Input
                id="fullName"
                placeholder="Hina Javed"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="pl-10 h-12 rounded-xl border-stone-200"
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
              <Link href="#" className="text-[10px] uppercase tracking-widest font-bold text-stone-400 hover:text-stone-900 transition-colors">Forgot Password?</Link>
            )}
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-stone-300" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          {isLoading ? 'Processing...' : (
            <span className="flex items-center">
              {type === 'login' ? 'Sign In' : 'Sign Up'} <ArrowRight className="ml-2 h-5 w-5" />
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
