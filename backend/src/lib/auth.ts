import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const INSECURE_DEFAULT_SECRET = 'dev-only-insecure-secret-change-me';
const FORBIDDEN_PRODUCTION_SECRET = 'baba0ba33358889d325c18c41cfee4c9';
const textEncoder = new TextEncoder();

let warnedInsecureSecret = false;

export class AuthConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthConfigurationError';
  }
}

export function isAuthConfigurationError(error: unknown): error is AuthConfigurationError {
  return error instanceof AuthConfigurationError;
}

function encodeSecret(secret: string): Uint8Array {
  return textEncoder.encode(secret);
}

function getJwtSecret(): Uint8Array {
  const rawSecret = process.env.JWT_SECRET;
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

  if (!rawSecret || rawSecret === FORBIDDEN_PRODUCTION_SECRET) {
    if (process.env.NODE_ENV === 'production' && !isBuildPhase) {
      throw new AuthConfigurationError('JWT_SECRET must be set to a strong, unique value in production.');
    }

    if (!warnedInsecureSecret) {
      const mode = isBuildPhase ? 'build' : 'development';
      console.warn(`WARNING: JWT_SECRET is not set. Using an insecure fallback during ${mode} only.`);
      warnedInsecureSecret = true;
    }

    return encodeSecret(INSECURE_DEFAULT_SECRET);
  }

  return encodeSecret(rawSecret);
}

function getCookieValueFromHeader(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;

  for (const item of cookieHeader.split(';')) {
    const [rawName, ...rawValue] = item.trim().split('=');
    if (rawName === name) {
      return decodeURIComponent(rawValue.join('='));
    }
  }

  return null;
}

export function getBearerTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null;

  const [scheme, token] = authHeader.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token.trim();
}

const COOKIE_NAME = 'auth-token';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 1 day (default)
const REMEMBER_ME_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days (remember me)

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  rememberMe?: boolean;
  exp?: number;
}

// Generate a secure random token for password reset/email verification
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Create a JWT token with optional remember me duration
export async function createToken(payload: Omit<JWTPayload, 'exp'>, rememberMe: boolean = false): Promise<string> {
  const expirationTime = rememberMe ? '30d' : '1d';
  return new SignJWT({ ...payload, rememberMe })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(getJwtSecret());
}

// Verify and decode a JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

// Set the auth cookie with optional remember me duration
export async function setAuthCookie(token: string, rememberMe: boolean = false): Promise<void> {
  const cookieStore = await cookies();
  const maxAge = rememberMe ? REMEMBER_ME_DURATION / 1000 : SESSION_DURATION / 1000;
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge, // Convert to seconds
    path: '/',
  });
}

// Get the auth cookie
export async function getAuthCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  return cookie?.value || null;
}

// Remove the auth cookie
export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Get current user from session or Authorization header
export async function getCurrentUser(request?: Request | NextRequest): Promise<JWTPayload | null> {
  if (request) {
    const bearerToken = getBearerTokenFromHeader(request.headers.get('authorization'));
    if (bearerToken) {
      return verifyToken(bearerToken);
    }

    const cookieToken = getCookieValueFromHeader(request.headers.get('cookie'), COOKIE_NAME);
    if (cookieToken) {
      return verifyToken(cookieToken);
    }
  }

  const token = await getAuthCookie();
  if (!token) return null;
  return verifyToken(token);
}

// Middleware helper to verify auth
export async function verifyAuth(request: any): Promise<{
  isAuthenticated: boolean;
  user: JWTPayload | null;
}> {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return { isAuthenticated: false, user: null };
  }

  const user = await verifyToken(token);
  return { isAuthenticated: !!user, user };
}

// Create authenticated response with updated cookie
export function createAuthenticatedResponse(
  data: Record<string, unknown>,
  token: string,
  rememberMe: boolean = false,
  status = 200
) {
  const response = NextResponse.json(data, { status });
  const maxAge = rememberMe ? REMEMBER_ME_DURATION / 1000 : SESSION_DURATION / 1000;

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/',
  });

  return response;
}

// Create logout response
export function createLogoutResponse() {
  const response = NextResponse.json({ message: 'Logged out successfully' });

  response.cookies.delete(COOKIE_NAME);

  return response;
}

// Password validation
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return { valid: errors.length === 0, errors };
}

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
