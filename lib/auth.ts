import { prisma } from './prisma';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { User, UserRole } from '@prisma/client';

const TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

// Create a session token for a user
export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY);
  
  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });
  
  return token;
}

// Validate a user's password
export async function validatePassword(
  inputPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(inputPassword, hashedPassword);
}

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Get the current user from the session token
export async function getCurrentUser(req?: NextRequest): Promise<User | null> {
  try {
    const cookieStore = cookies();
    const sessionToken = req 
      ? req.cookies.get('session_token')?.value
      : cookieStore.get('session_token')?.value;
      
    if (!sessionToken) {
      return null;
    }
    
    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
      include: { user: true },
    });
    
    if (!session || session.expiresAt < new Date()) {
      // If session expired, delete it
      if (session) {
        await prisma.session.delete({ where: { id: session.id } });
      }
      return null;
    }
    
    return session.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Authentication middleware for protected routes
export async function authMiddleware(req: NextRequest, requiredRole?: UserRole): Promise<NextResponse | null> {
  const user = await getCurrentUser(req);
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  return null; // Continue with the request
}

// Admin authentication middleware
export async function adminAuthMiddleware(req: NextRequest): Promise<NextResponse | null> {
  return authMiddleware(req, UserRole.ADMIN);
}

// User authentication middleware
export async function userAuthMiddleware(req: NextRequest): Promise<NextResponse | null> {
  const middleware = await authMiddleware(req);
  if (middleware) return middleware;
  
  const user = await getCurrentUser(req);
  
  // Don't allow admin users to access user-specific routes
  if (user?.role === UserRole.ADMIN) {
    return NextResponse.json({ error: 'Forbidden for admin users' }, { status: 403 });
  }
  
  return null; // Continue with the request
}

// Function to set authentication cookie
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = cookies();
  
  await cookieStore.set({
    name: 'session_token',
    value: token,
    httpOnly: true, 
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: TOKEN_EXPIRY / 1000, // Convert to seconds for cookie
    sameSite: 'strict',
  });
}

// Function to clear authentication cookie
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = cookies();
  await cookieStore.delete('session_token');
} 