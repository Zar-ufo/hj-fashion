import { NextResponse } from 'next/server';
import { getCurrentUser, removeAuthCookie } from '@/lib/auth';
import { getUserById } from '@/lib/db-queries';

// Server start timestamp for detecting backend restarts
const SERVER_VERSION = Date.now().toString();

// Helper to add version header to response
function addVersionHeader(response: NextResponse) {
  response.headers.set('x-server-version', SERVER_VERSION);
  return response;
}

// Get current session/user
export async function GET() {
  try {
    const jwtUser = await getCurrentUser();

    if (!jwtUser) {
      return addVersionHeader(NextResponse.json(
        { authenticated: false, user: null },
        { status: 200 }
      ));
    }

    // Get fresh user data from database
    const user = await getUserById(jwtUser.userId);

    if (!user) {
      // User was deleted, clear cookie
      await removeAuthCookie();
      return addVersionHeader(NextResponse.json(
        { authenticated: false, user: null },
        { status: 200 }
      ));
    }

    // If user is blocked, log them out immediately
    if (user.is_blocked) {
      await removeAuthCookie();
      return addVersionHeader(NextResponse.json(
        { authenticated: false, user: null, error: 'Account suspended' },
        { status: 200 }
      ));
    }

    return addVersionHeader(NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        phone: user.phone,
        address: user.address,
        city: user.city,
        postal_code: user.postal_code,
        country: user.country,
        email_verified: user.email_verified,
        created_at: user.created_at,
      },
    }));
  } catch (error) {
    console.error('Error getting session:', error);
    return addVersionHeader(NextResponse.json(
      { authenticated: false, user: null, error: 'Failed to get session' },
      { status: 500 }
    ));
  }
}

// Logout - DELETE session
export async function DELETE() {
  try {
    await removeAuthCookie();
    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json(
      { error: 'Failed to log out' },
      { status: 500 }
    );
  }
}
