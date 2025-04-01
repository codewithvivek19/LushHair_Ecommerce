import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession, setAuthCookie, validatePassword } from '@/lib/auth';
import { UserRole, UserStatus } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if the user has admin privileges
    if (user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    // Check if the user is suspended
    if (user.status === UserStatus.SUSPENDED) {
      return NextResponse.json(
        { error: 'Account is suspended. Please contact support.' },
        { status: 403 }
      );
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await validatePassword(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create a session for the admin
    const token = await createSession(user.id);
    
    // Set the session token in a cookie
    await setAuthCookie(token);

    // Create a user object without sensitive information
    const { password: _, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 