import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import {
  getEmailVerificationToken,
  markEmailVerificationTokenUsed,
  verifyUserEmail,
  createEmailVerificationToken,
  getUserByEmail,
} from '@/lib/db-queries';
import { sendEmailVerificationEmail } from '@/lib/email';
import { generateSecureToken, validateEmail } from '@/lib/auth';

// Verify email with token
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawToken = body?.token;
    const token = typeof rawToken === 'string' ? rawToken.trim() : '';

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Get token from database
    const verificationToken = await getEmailVerificationToken(token);

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Invalid verification link' },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (verificationToken.expires_at < new Date()) {
      return NextResponse.json(
        { error: 'This verification link has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check if token has already been used
    if (verificationToken.used) {
      return NextResponse.json(
        { error: 'This verification link has already been used' },
        { status: 400 }
      );
    }

    // Check if email is already verified
    if (verificationToken.user.email_verified) {
      return NextResponse.json({
        message: 'Your email is already verified.',
        already_verified: true,
      });
    }

    // Verify email
    await verifyUserEmail(verificationToken.user_id);

    // Mark token as used
    await markEmailVerificationTokenUsed(token);

    return NextResponse.json({
      message: 'Email verified successfully! You can now access all features.',
    });
  } catch (error) {
    // Convert common "record not found" errors into a user-friendly 400.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Invalid verification link' },
        { status: 400 }
      );
    }
    console.error('Error verifying email:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}

// Resend verification email
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const rawEmail = body?.email;
    const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';

    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email);

    if (!user) {
      // Don't reveal if user exists
      return NextResponse.json({
        message: 'If an account with that email exists, we have sent a verification email.',
      });
    }

    if (user.email_verified) {
      return NextResponse.json({
        message: 'Your email is already verified.',
        already_verified: true,
      });
    }

    // Generate new verification token
    const token = generateSecureToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await createEmailVerificationToken({
      token,
      user_id: user.id,
      expires_at: expiresAt,
    });

    // Send verification email
    const sent = await sendEmailVerificationEmail(email, token, user.first_name || undefined);
    if (!sent) {
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Verification email sent! Please check your inbox.',
    });
  } catch (error) {
    console.error('Error resending verification email:', error);
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}

// Validate verification token
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    const verificationToken = await getEmailVerificationToken(token);

    if (!verificationToken) {
      return NextResponse.json(
        { valid: false, error: 'Invalid verification link' },
        { status: 400 }
      );
    }

    if (verificationToken.expires_at < new Date()) {
      return NextResponse.json(
        { valid: false, error: 'This verification link has expired' },
        { status: 400 }
      );
    }

    if (verificationToken.used) {
      return NextResponse.json(
        { valid: false, error: 'This verification link has already been used' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      email: verificationToken.user.email,
    });
  } catch (error) {
    console.error('Error validating verification token:', error);
    return NextResponse.json(
      { valid: false, error: 'Failed to validate token' },
      { status: 500 }
    );
  }
}
