import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/auth';
import { getOrderById, updateOrderStatus } from '@/lib/db-queries';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ALLOWED_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const;

type AllowedStatus = (typeof ALLOWED_STATUSES)[number];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error fetching admin order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => null);
    const status = body?.status as AllowedStatus | undefined;

    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatus(id, status);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating admin order status:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
