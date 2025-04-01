import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { createSession, setAuthCookie } from '@/lib/auth';

/**
 * This is a special development-only endpoint to bypass normal authentication
 * and directly access the admin dashboard without login.
 * DO NOT USE IN PRODUCTION.
 */
export async function GET(req: NextRequest) {
  try {
    // Find an admin user (or create one if none exists)
    let adminUser = await prisma.user.findFirst({
      where: { role: UserRole.ADMIN },
    });

    if (!adminUser) {
      // Create a default admin if none exists
      adminUser = await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@example.com',
          password: '$2a$10$XQE3G/68XJdQ2QjrL0hDaeE8V0QeO.Bg2S3OvgQPLnJ5JqOLGOgYe', // hashed 'password'
          role: UserRole.ADMIN,
        },
      });
    }

    // Create a session for the admin user
    try {
      const token = await createSession(adminUser.id);
      await setAuthCookie(token);

      return NextResponse.json({
        success: true,
        message: 'Direct admin access granted',
      });
    } catch (error) {
      console.error('Direct admin access error:', error);
      
      // Provide a direct token for development
      await setAuthCookie('development_admin_token');
      
      return NextResponse.json({
        success: true,
        message: 'Fallback direct admin access granted',
        error: String(error),
      });
    }
  } catch (error) {
    console.error('Direct admin access error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 