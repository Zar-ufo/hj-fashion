import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail, createEmailVerificationToken } from '@/lib/db-queries';
import { createToken, createAuthenticatedResponse, validatePassword, validateEmail, generateSecureToken } from '@/lib/auth';
import { sendEmailVerificationEmail, sendWelcomeEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, first_name, last_name } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
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
    const existingUser = await getUserByEmail(email);
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
      email,
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

    // Send verification email
    const verificationSent = await sendEmailVerificationEmail(email, verificationToken, first_name);

    // Send welcome email (non-blocking for registration success)
    await sendWelcomeEmail(email, first_name);

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
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
