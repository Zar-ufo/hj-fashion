'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

type DashboardStats = {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: Array<{
    id: string;
    total: number;
    status: string;
    created_at: string;
    user: { email: string; first_name: string | null; last_name: string | null };
  }>;
};

type AdminUserRow = {
  id: string;
  role: 'CUSTOMER' | 'ADMIN';
  email_verified?: boolean;
  created_at: string;
};

type AdminEventRow = {
  id: string;
  name: string;
  is_active: boolean;
  is_featured?: boolean;
  discount_percent: number;
  start_date: string;
  end_date: string;
};

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function AdminAnalyticsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [events, setEvents] = useState<AdminEventRow[]>([]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'ADMIN') {
      router.push('/account');
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [statsRes, usersRes, eventsRes] = await Promise.all([
          fetch('/api/admin', { credentials: 'include' }),
          fetch('/api/admin/users', { credentials: 'include' }),
          fetch('/api/admin/events', { credentials: 'include' }),
        ]);

        if (!cancelled) {
          if (statsRes.ok) setStats(await statsRes.json());
          if (usersRes.ok) setUsers(await usersRes.json());
          if (eventsRes.ok) setEvents(await eventsRes.json());
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [authLoading, user, router]);

  const kpi = useMemo(() => {
    const totalRevenue = stats?.totalRevenue ?? 0;
    const totalOrders = stats?.totalOrders ?? 0;
    const totalUsers = stats?.totalUsers ?? 0;
    const totalProducts = stats?.totalProducts ?? 0;

    const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const admins = users.filter((u) => u.role === 'ADMIN').length;
    const verified = users.filter((u) => u.email_verified).length;
    const verificationRate = users.length > 0 ? (verified / users.length) * 100 : 0;

    const activeEvents = events.filter((e) => e.is_active).length;
    const featuredEvents = events.filter((e) => e.is_featured).length;

    return {
      totalRevenue,
      totalOrders,
      totalUsers,
      totalProducts,
      aov,
      admins,
      verificationRate,
      activeEvents,
      featuredEvents,
    };
  }, [stats, users, events]);

  const timeseries = useMemo(() => {
    const now = new Date();
    const end = startOfDay(now);
    const start = addDays(end, -13);

    const buckets = new Map<string, { day: string; revenue: number; orders: number }>();
    for (let i = 0; i < 14; i++) {
      const d = addDays(start, i);
      const key = formatDayKey(d);
      buckets.set(key, { day: key, revenue: 0, orders: 0 });
    }

    for (const o of stats?.recentOrders ?? []) {
      const d = startOfDay(new Date(o.created_at));
      const key = formatDayKey(d);
      const bucket = buckets.get(key);
      if (!bucket) continue;
      bucket.revenue += Number(o.total) || 0;
      bucket.orders += 1;
    }

    return Array.from(buckets.values());
  }, [stats]);

  const statusPie = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of stats?.recentOrders ?? []) {
      map.set(o.status, (map.get(o.status) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([status, value]) => ({ status, value }));
  }, [stats]);

  const eventsPie = useMemo(() => {
    const active = events.filter((e) => e.is_active).length;
    const inactive = Math.max(0, events.length - active);
    return [
      { label: 'Active', value: active },
      { label: 'Inactive', value: inactive },
    ];
  }, [events]);

  const chartConfig: ChartConfig = {
    revenue: { label: 'Revenue', color: 'var(--chart-1)' },
    orders: { label: 'Orders', color: 'var(--chart-2)' },
    aov: { label: 'AOV', color: 'var(--chart-3)' },
    active: { label: 'Active', color: 'var(--chart-4)' },
    inactive: { label: 'Inactive', color: 'var(--chart-5)' },
  };

  if (authLoading || loading) {
    return (
      <div className="dark min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 w-64 rounded bg-muted" />
              <div className="h-4 w-96 rounded bg-muted" />
            </div>
            <div className="h-10 w-28 rounded bg-muted" />
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-card border border-border" />
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="h-[360px] rounded-2xl bg-card border border-border" />
            <div className="h-[360px] rounded-2xl bg-card border border-border" />
            <div className="h-[360px] rounded-2xl bg-card border border-border" />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="h-[420px] rounded-2xl bg-card border border-border" />
            <div className="h-[420px] rounded-2xl bg-card border border-border" />
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <>
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 opacity-40">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-muted blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-muted blur-3xl" />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Admin Analytics</h1>
            <Badge variant="secondary" className="border-border/60 bg-card">Live</Badge>
          </div>
          <p className="text-muted-foreground">Analytics overview for your store.</p>
        </div>

        {/* KPIs */}
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-2xl border-border/60 bg-card/80 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">${kpi.totalRevenue.toFixed(2)}</div>
              <div className="mt-2 text-xs text-muted-foreground">Based on recent orders</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/60 bg-card/80 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{kpi.totalOrders}</div>
              <div className="mt-2 text-xs text-muted-foreground">AOV ${kpi.aov.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/60 bg-card/80 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{kpi.totalUsers}</div>
              <div className="mt-2 text-xs text-muted-foreground">Verified {kpi.verificationRate.toFixed(0)}%</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/60 bg-card/80 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">Catalog</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{kpi.totalProducts}</div>
              <div className="mt-2 text-xs text-muted-foreground">Active events {kpi.activeEvents}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts row */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Card className="rounded-2xl border-border/60 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-sm">Revenue (14 days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <AreaChart data={timeseries} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="day" tickMargin={8} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tickMargin={8} tickFormatter={(v) => `$${v}`} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    fill="var(--color-revenue)"
                    fillOpacity={0.18}
                    strokeWidth={2}
                    isAnimationActive
                    animationDuration={900}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/60 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-sm">Orders (14 days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <BarChart data={timeseries} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="day" tickMargin={8} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tickMargin={8} allowDecimals={false} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                  <Bar
                    dataKey="orders"
                    fill="var(--color-orders)"
                    radius={[8, 8, 0, 0]}
                    isAnimationActive
                    animationDuration={900}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/60 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-sm">Order status mix</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="status" />} />
                  <Pie
                    data={statusPie}
                    dataKey="value"
                    nameKey="status"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                    isAnimationActive
                    animationDuration={950}
                  >
                    {statusPie.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={
                          idx % 5 === 0
                            ? 'var(--chart-1)'
                            : idx % 5 === 1
                              ? 'var(--chart-2)'
                              : idx % 5 === 2
                                ? 'var(--chart-3)'
                                : idx % 5 === 3
                                  ? 'var(--chart-4)'
                                  : 'var(--chart-5)'
                        }
                      />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={28} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* More charts */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card className="rounded-2xl border-border/60 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-sm">Revenue vs Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeseries} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="day" tickMargin={8} tickFormatter={(v) => v.slice(5)} />
                    <YAxis yAxisId="left" tickMargin={8} tickFormatter={(v) => `$${v}`} />
                    <YAxis yAxisId="right" orientation="right" tickMargin={8} allowDecimals={false} />
                    <Tooltip />
                    <Legend verticalAlign="top" height={28} />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--chart-1)"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive
                      animationDuration={900}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="orders"
                      stroke="var(--chart-2)"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive
                      animationDuration={900}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/60 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-sm">Events active/inactive</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[340px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
                  <Pie
                    data={eventsPie}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={6}
                    isAnimationActive
                    animationDuration={950}
                  >
                    <Cell fill="var(--color-active)" />
                    <Cell fill="var(--color-inactive)" />
                  </Pie>
                  <Legend verticalAlign="bottom" height={28} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Footer note */}
        <div className="mt-10 text-xs text-muted-foreground">
          Tip: this page is intentionally standalone (no site navbar/footer).
        </div>
      </div>
    </>
  );
}
