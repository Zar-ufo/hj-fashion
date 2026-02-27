import { NextResponse } from 'next/server';

import { getCurrentUser, type JWTPayload } from '@/lib/auth';

type RequireAdminResult =
  | { user: JWTPayload; error: null }
  | { user: null; error: NextResponse };

export async function requireAdmin(request: Request): Promise<RequireAdminResult> {
  const currentUser = await getCurrentUser(request);
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return {
      user: null,
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  return { user: currentUser, error: null };
}
