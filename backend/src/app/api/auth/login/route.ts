import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserWithAuthDetails } from '@/lib/db-queries';
import { createToken, createAuthenticatedResponse, validateEmail } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, rememberMe = false } = body;

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

    // Find user by email with auth details
    const user = await getUserWithAuthDetails(email);
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
    }, rememberMe);

    // Return user without password hash with auth cookie
    const { password_hash: _, ...userWithoutPassword } = user;

    return createAuthenticatedResponse(
      {
        message: 'Login successful',
        user: userWithoutPassword,
      },
      token,
      rememberMe
    );
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { error: 'Failed to log in' },
      { status: 500 }
    );
  }
}
