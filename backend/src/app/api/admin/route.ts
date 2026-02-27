import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { getDashboardStats, getAllOrders } from '@/lib/db-queries';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { user: currentUser, error } = await requireAdmin(request);
    if (error) {
      return error;
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    if (type === 'orders') {
      const orders = await getAllOrders();
      return NextResponse.json(orders, {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }
    
    // Default: return dashboard stats
    const stats = await getDashboardStats();
    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin data' },
      { status: 500 }
    );
  }
}
