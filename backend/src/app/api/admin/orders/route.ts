import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { getAllOrders } from '@/lib/db-queries';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET all orders (admin only)
export async function GET(request: Request) {
  try {
    const { user: currentUser, error } = await requireAdmin(request);
    if (error) {
      return error;
    }

    const orders = await getAllOrders();
    return NextResponse.json(orders, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
