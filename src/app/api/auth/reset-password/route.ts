import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {
  getPasswordResetToken,
  markPasswordResetTokenUsed,
  updateUserPassword,
} from '@/lib/db-queries';
import { sendPasswordChangedEmail } from '@/lib/email';
import { validatePassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    // Validate inputs
    if (!token) {
      return NextResponse.json(
        { error: 'Reset token is required' },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: 'New password is required' },
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

    // Get token from database
    const resetToken = await getPasswordResetToken(token);

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset link' },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (resetToken.expires_at < new Date()) {
      return NextResponse.json(
        { error: 'This reset link has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check if token has already been used
    if (resetToken.used) {
      return NextResponse.json(
        { error: 'This reset link has already been used' },
        { status: 400 }
      );
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update user's password
    await updateUserPassword(resetToken.user_id, passwordHash);

    // Mark token as used
    await markPasswordResetTokenUsed(token);

    // Send confirmation email
    await sendPasswordChangedEmail(
      resetToken.user.email,
      resetToken.user.first_name || undefined
    );

    return NextResponse.json({
      message: 'Your password has been reset successfully. You can now log in with your new password.',
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}

// GET request to validate token
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

    const resetToken = await getPasswordResetToken(token);

    if (!resetToken) {
      return NextResponse.json(
        { valid: false, error: 'Invalid reset link' },
        { status: 400 }
      );
    }

    if (resetToken.expires_at < new Date()) {
      return NextResponse.json(
        { valid: false, error: 'This reset link has expired' },
        { status: 400 }
      );
    }

    if (resetToken.used) {
      return NextResponse.json(
        { valid: false, error: 'This reset link has already been used' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      email: resetToken.user.email,
    });
  } catch (error) {
    console.error('Error validating reset token:', error);
    return NextResponse.json(
      { valid: false, error: 'Failed to validate token' },
      { status: 500 }
    );
  }
}
