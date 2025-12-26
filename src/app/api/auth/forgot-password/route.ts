import { NextResponse } from 'next/server';
import { getUserByEmail, createPasswordResetToken } from '@/lib/db-queries';
import { sendPasswordResetEmail } from '@/lib/email';
import { generateSecureToken, validateEmail } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await getUserByEmail(email);

    // Always return success to prevent email enumeration attacks
    // But only actually send email if user exists
    if (user) {
      // Generate reset token
      const token = generateSecureToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store token in database
      await createPasswordResetToken({
        token,
        user_id: user.id,
        expires_at: expiresAt,
      });

      // Send email
      await sendPasswordResetEmail(email, token, user.first_name || undefined);
    }

    return NextResponse.json({
      message: 'If an account with that email exists, we have sent a password reset link.',
    });
  } catch (error) {
    console.error('Error in forgot password:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}
