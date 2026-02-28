import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail, createEmailVerificationToken } from '@/lib/db-queries';
import { isDatabaseConfigurationError } from '@/lib/db';
import { createToken, createAuthenticatedResponse, validatePassword, validateEmail, generateSecureToken, isAuthConfigurationError } from '@/lib/auth';
import { sendEmailVerificationEmail, sendWelcomeEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { email, password, first_name, last_name } = body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    // Validate required fields
    if (!normalizedEmail || typeof password !== 'string' || password.length === 0) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.errors.join('. ') },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(normalizedEmail);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create user
    const user = await createUser({
      email: normalizedEmail,
      password_hash,
      first_name,
      last_name,
    });

    // Create email verification token
    const verificationToken = generateSecureToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await createEmailVerificationToken({
      token: verificationToken,
      user_id: user.id,
      expires_at: expiresAt,
    });

    // Send verification email (don't let email failure break registration)
    let verificationSent = false;
    try {
      verificationSent = await sendEmailVerificationEmail(normalizedEmail, verificationToken, first_name);
    } catch (emailErr) {
      console.error('Failed to send verification email:', emailErr);
    }

    // Send welcome email (non-blocking, best-effort)
    sendWelcomeEmail(normalizedEmail, first_name).catch((err) =>
      console.error('Failed to send welcome email:', err)
    );

    // Create JWT token
    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Return user without password hash
    const { password_hash: _, ...userWithoutPassword } = user;

    return createAuthenticatedResponse(
      { 
        message: verificationSent
          ? 'Registration successful! Please check your email to verify your account.'
          : 'Registration successful, but we could not send the verification email. Please double-check SMTP settings and try resending verification from the Verify Email page.',
        user: userWithoutPassword,
        email_verification_sent: verificationSent,
      },
      token,
      false,
      201
    );
  } catch (error) {
    if (isAuthConfigurationError(error)) {
      console.error('Auth configuration error during registration:', error.message);
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
      console.error('Database configuration error during registration:', error.message);
      return NextResponse.json(
        {
          error: 'Database service is misconfigured. Set DATABASE_URL in backend environment variables.',
          code: 'DB_CONFIG_ERROR',
          missingEnv: ['DATABASE_URL'],
        },
        { status: 503 }
      );
    }

    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
