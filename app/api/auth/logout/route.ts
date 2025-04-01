import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Get the session token from the cookie
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('session_token')?.value;
    
    // Clear the auth cookie
    await clearAuthCookie();
    
    // Delete the session from the database if it exists
    if (sessionToken) {
      await prisma.session.deleteMany({
        where: { token: sessionToken },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 