import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserWithAuthDetails } from '@/lib/db-queries';
import { isDatabaseConfigurationError } from '@/lib/db';
import { createToken, createAuthenticatedResponse, validateEmail, isAuthConfigurationError } from '@/lib/auth';

// Simple in-memory rate limiter for login attempts
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { email, password, rememberMe = false } = body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    // Validate required fields and types
    if (!normalizedEmail || typeof password !== 'string' || password.length === 0) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const rememberSession = Boolean(rememberMe);

    // Validate email format
    if (!validateEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Find user by email with auth details
    const user = await getUserWithAuthDetails(normalizedEmail);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create JWT token with remember me support
    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    }, rememberSession);

    // Return user without password hash with auth cookie
    const { password_hash: _, ...userWithoutPassword } = user;

    return createAuthenticatedResponse(
      {
        message: 'Login successful',
        user: userWithoutPassword,
      },
      token,
      rememberSession
    );
  } catch (error) {
    if (isAuthConfigurationError(error)) {
      console.error('Auth configuration error during login:', error.message);
      return NextResponse.json(
        {
          error: 'Authentication service is misconfigured. Set JWT_SECRET in backend environment variables.',
          code: 'AUTH_CONFIG_ERROR',
          missingEnv: ['JWT_SECRET'],
        },
        { status: 503 }
      );
    }

    if (isDatabaseConfigurationError(error)) {
      console.error('Database configuration error during login:', error.message);
      return NextResponse.json(
        {
          error: 'Database service is misconfigured. Set DATABASE_URL in backend environment variables.',
          code: 'DB_CONFIG_ERROR',
          missingEnv: ['DATABASE_URL'],
        },
        { status: 503 }
      );
    }

    console.error('Error logging in:', error);
    return NextResponse.json(
      { error: 'Failed to log in' },
      { status: 500 }
    );
  }
}
