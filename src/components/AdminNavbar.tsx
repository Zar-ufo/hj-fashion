'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';

const navItems = [
  { href: '/admin', label: 'Analytics' },
  { href: '/admin/manage', label: 'Manage' },
  { href: '/admin/orders', label: 'Orders' },
];

export function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="font-semibold tracking-tight">
            HJ Admin
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    className={cn('rounded-full', isActive && 'bg-card')}
                  >
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden text-xs text-muted-foreground sm:block">{user?.email}</div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={async () => {
              await logout();
              router.push('/login');
            }}
          >
            Sign out
          </Button>
        </div>
      </div>

      <nav className="flex items-center gap-1 px-4 pb-3 sm:hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                size="sm"
                className={cn('w-full rounded-full', isActive && 'bg-card')}
              >
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
