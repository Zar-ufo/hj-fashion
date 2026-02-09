import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me'
);

const COOKIE_NAME = 'auth-token';

// Routes that require authentication
const PROTECTED_ROUTES = ['/account', '/checkout'];
// Routes that only logged-out users should access
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];
// Routes that require ADMIN role
const ADMIN_ROUTES = ['/admin'];

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

async function getTokenPayload(request: NextRequest): Promise<TokenPayload | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = await getTokenPayload(request);

  // --- Admin routes: require ADMIN role ---
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/account', request.url));
    }
    return NextResponse.next();
  }

  // --- Protected routes: require any authenticated user ---
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // If an ADMIN tries to access /account, redirect to /admin
    if (pathname.startsWith('/account') && user.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // --- Auth routes: redirect logged-in users ---
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (user) {
      const destination = user.role === 'ADMIN' ? '/admin' : '/account';
      return NextResponse.redirect(new URL(destination, request.url));
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
