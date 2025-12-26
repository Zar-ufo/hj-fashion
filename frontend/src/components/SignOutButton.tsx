'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = () => {
    // Demo mode - no backend authentication
    toast.success('Demo: Signed out successfully!');
    router.push('/');
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
