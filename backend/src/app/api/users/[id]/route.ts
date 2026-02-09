import { NextResponse } from 'next/server';
import { getUserById, updateUser } from '@/lib/db-queries';
import { getCurrentUser } from '@/lib/auth';

// Only allow safe fields to be updated by users (no role, is_blocked, etc.)
const ALLOWED_USER_UPDATE_FIELDS = [
  'first_name', 'last_name', 'phone', 'address', 'city', 'postal_code', 'country',
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Users can only view their own profile; admins can view any
    if (currentUser.role !== 'ADMIN' && currentUser.userId !== id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const user = await getUserById(id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Users can only update their own profile; admins can update any
    if (currentUser.role !== 'ADMIN' && currentUser.userId !== id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    // Non-admin users can only update safe fields (prevent privilege escalation)
    if (currentUser.role !== 'ADMIN') {
      const sanitized: Record<string, unknown> = {};
      for (const key of ALLOWED_USER_UPDATE_FIELDS) {
        if (key in body) {
          sanitized[key] = body[key];
        }
      }
      const user = await updateUser(id, sanitized);
      return NextResponse.json(user);
    }

    const user = await updateUser(id, body);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
