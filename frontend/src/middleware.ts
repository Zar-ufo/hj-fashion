import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'auth-token';

// Routes that require authentication
const PROTECTED_ROUTES = ['/account', '/checkout'];
// Routes that only logged-out users should access
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];
// Routes that require ADMIN role
const ADMIN_ROUTES = ['/admin'];

function hasAuthCookie(request: NextRequest): boolean {
  return Boolean(request.cookies.get(COOKIE_NAME)?.value);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = hasAuthCookie(request);

  // --- Admin routes: require authentication (role checks are handled server/client-side) ---
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!authenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // --- Protected routes: require any authenticated user ---
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!authenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // --- Auth routes: redirect logged-in users ---
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (authenticated) {
      return NextResponse.redirect(new URL('/account', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
    '/checkout/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ],
};
