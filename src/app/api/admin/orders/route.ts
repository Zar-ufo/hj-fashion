import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getAllOrders } from '@/lib/db-queries';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET all orders (admin only)
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
