import { prisma } from './prisma';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { User, UserRole } from '@prisma/client';

const TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

// Simple validation (no hashing)
export function validatePassword(
  inputPassword: string,
  storedPassword: string
): boolean {
  return inputPassword === storedPassword;
}

// Get the current user from the cookie
export async function getCurrentUser(req?: NextRequest): Promise<User | null> {
  try {
    const cookieStore = cookies();
    const userEmail = req 
      ? req.cookies.get('user_email')?.value
      : cookieStore.get('user_email')?.value;
      
    if (!userEmail) {
      return null;
    }
    
    // Look up the user by email
    const user = await prisma.user.findUnique({
      where: { email: decodeURIComponent(userEmail) }
    });
    
    return user;
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
export async function setAuthCookie(userEmail: string): Promise<void> {
  const cookieStore = cookies();
  
  await cookieStore.set({
    name: 'user_email',
    value: encodeURIComponent(userEmail),
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
  await cookieStore.delete('user_email');
} 