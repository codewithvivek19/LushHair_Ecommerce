import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromSession } from '@/lib/auth';
import { UserRole } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromSession();

    if (!user) {
      return NextResponse.json({ 
        authenticated: false,
        admin: null
      });
    }

    // Only return admin data if user is an admin
    if (user.role !== UserRole.ADMIN) {
      return NextResponse.json({ 
        authenticated: false,
        admin: null
      });
    }

    // Create a safe admin object without sensitive information
    const { password: _, ...safeAdmin } = user;

    return NextResponse.json({
      authenticated: true,
      admin: safeAdmin,
    });

  } catch (error) {
    console.error('Error checking admin session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 