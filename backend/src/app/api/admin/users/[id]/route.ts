import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { getUserWithOrders } from '@/lib/db-queries';

// GET single user with orders
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user: currentUser, error } = await requireAdmin(request);
    if (error) {
      return error;
    }

    const { id } = await params;
    const user = await getUserWithOrders(id);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
