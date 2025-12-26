'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type OrderItem = {
  id: string;
  quantity: number;
  size: string;
  price: number;
  product: {
    name: string;
    images: string[];
  };
};

type AdminOrder = {
  id: string;
  status: string;
  payment_status: string;
  total: number;
  created_at: string;
  user: {
    email: string;
    first_name: string | null;
    last_name: string | null;
  };
  items: OrderItem[];
};

function formatMoney(amount: number) {
  return `$${amount.toFixed(2)}`;
}

export default function AdminOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function markDelivered(orderId: string) {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'DELIVERED' }),
        }
      );

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.error || `Failed to update order (HTTP ${res.status})`);
        return;
      }

      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'DELIVERED' } : o)));
      toast.success('Order marked as DELIVERED');
    } finally {
      setUpdatingId(null);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await fetch('/api/admin/orders', { credentials: 'include' });
        if (!res.ok) {
          const maybeJson = await res.json().catch(() => null);
          const message =
            (maybeJson && typeof maybeJson === 'object' && 'error' in maybeJson && typeof (maybeJson as any).error === 'string'
              ? (maybeJson as any).error
              : null) || `Failed to load orders (HTTP ${res.status})`;
          setOrders([]);
          setLoadError(message);
          return;
        }
        const data = (await res.json()) as AdminOrder[];
        if (!cancelled) setOrders(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const totals = useMemo(() => {
    const count = orders.length;
    const revenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    return { count, revenue };
  }, [orders]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          All orders placed by users. Total: {totals.count} • Gross: {formatMoney(totals.revenue)}
        </p>
      </div>

      <Card className="rounded-2xl border-border/60 bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-sm">All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-16 text-center text-sm text-muted-foreground">Loading orders…</div>
          ) : loadError ? (
            <div className="py-16 text-center text-sm text-destructive">{loadError}</div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">No orders found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const customerName = [order.user.first_name, order.user.last_name].filter(Boolean).join(' ');

                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.id.slice(0, 10)}</TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="text-sm">{customerName || 'Customer'}</div>
                          <div className="text-xs text-muted-foreground">{order.user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="border-border/60 bg-card">
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={order.payment_status === 'PAID' ? 'default' : 'secondary'}>
                          {order.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatMoney(Number(order.total) || 0)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {order.status !== 'DELIVERED' && (
                            <Button
                              size="sm"
                              variant="default"
                              className="rounded-full"
                              onClick={() => markDelivered(order.id)}
                              disabled={updatingId === order.id}
                            >
                              {updatingId === order.id ? 'Updating…' : 'Mark Delivered'}
                            </Button>
                          )}

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="rounded-full">
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Order {order.id}</DialogTitle>
                              </DialogHeader>

                              <div className="space-y-4">
                                <div className="grid gap-2 sm:grid-cols-2">
                                  <div className="rounded-xl border border-border/60 bg-card p-4">
                                    <div className="text-xs text-muted-foreground">Customer</div>
                                    <div className="font-medium">{customerName || 'Customer'}</div>
                                    <div className="text-sm text-muted-foreground">{order.user.email}</div>
                                  </div>
                                  <div className="rounded-xl border border-border/60 bg-card p-4">
                                    <div className="text-xs text-muted-foreground">Total</div>
                                    <div className="text-xl font-semibold">{formatMoney(Number(order.total) || 0)}</div>
                                    <div className="mt-1 flex gap-2">
                                      <Badge variant="secondary">{order.status}</Badge>
                                      <Badge variant={order.payment_status === 'PAID' ? 'default' : 'secondary'}>
                                        {order.payment_status}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                <div className="rounded-2xl border border-border/60 bg-card p-4">
                                  <div className="mb-3 text-sm font-medium">Items ({order.items.length})</div>
                                  <div className="space-y-3">
                                    {order.items.map((item) => (
                                      <div key={item.id} className="flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                          <div className="truncate font-medium">{item.product?.name || 'Product'}</div>
                                          <div className="text-xs text-muted-foreground">
                                            Size {item.size} • Qty {item.quantity}
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <div className="font-medium">{formatMoney(item.price)}</div>
                                          <div className="text-xs text-muted-foreground">
                                            Line: {formatMoney(item.price * item.quantity)}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
