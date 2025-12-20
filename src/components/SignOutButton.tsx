'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Signed out successfully');
      router.push('/');
      router.refresh();
    }
  };

  return (
    <Button 
      variant="ghost" 
      onClick={handleSignOut}
      className="text-stone-500 hover:text-stone-900 hover:bg-stone-50 rounded-full px-6"
    >
      <LogOut className="mr-2 h-4 w-4" /> Sign Out
    </Button>
  );
}
