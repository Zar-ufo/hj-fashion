'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { AdminNavbar } from '@/components/AdminNavbar';
import { useAuth } from '@/lib/auth-context';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'ADMIN') {
      router.push('/account');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user || user.role !== 'ADMIN') {
    return (
      <div className="dark min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="h-8 w-56 rounded bg-muted" />
          <div className="mt-4 h-4 w-80 rounded bg-muted" />
          <div className="mt-10 h-48 rounded-2xl border border-border bg-card" />
        </div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <AdminNavbar />
      <main className="mx-auto max-w-7xl px-4 py-10">{children}</main>
    </div>
  );
}
