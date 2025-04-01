import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json({ user: null });
    }

    // Remove sensitive information
    const { password, ...safeUser } = user;
    
    return NextResponse.json({ user: safeUser });
  } catch (error) {
    console.error('Error getting current user:', error);
    return NextResponse.json(
      { error: 'Internal server error', user: null },
      { status: 500 }
    );
  }
} 