import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession, setAuthCookie } from '@/lib/auth';
import { UserRole } from '@prisma/client';

// This is a simplified admin access route that can be used for development
// It should be removed or protected in production
export async function GET(request: NextRequest) {
  try {
    // Find admin user - assuming the first admin in the system
    const admin = await prisma.user.findFirst({
      where: { role: UserRole.ADMIN },
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'No admin user found in the system' },
        { status: 404 }
      );
    }

    // Create a session for the admin
    const token = await createSession(admin.id);
    
    // Set the session token in a cookie
    await setAuthCookie(token);

    // Create a user object without sensitive information
    const { password: _, ...safeAdmin } = admin;

    return NextResponse.json({
      success: true,
      admin: safeAdmin,
      message: 'Admin access granted successfully. Redirecting to dashboard...'
    });
  } catch (error) {
    console.error('Direct admin access error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 