// Script to create test users with known password hashes
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    // Delete existing test users
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['test@example.com', 'testadmin@example.com']
        }
      }
    });

    // Create a regular test user
    // Password is "test123"
    const userHash = '$2a$10$8Zo9YHFTRqQvl8wLdE6zmuqvJAi7AUt93NohWDEpzOLzUMfYBbNka';

    await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: userHash,
        role: 'USER'
      }
    });

    // Create a test admin
    // Password is "admin123"
    const adminHash = '$2a$10$2MO.YUaJPRsMW4LZAiwJ7.2ZQd0PWv54e7S6ZD1O38fXcr7.ngcwC';

    await prisma.user.create({
      data: {
        name: 'Test Admin',
        email: 'testadmin@example.com',
        password: adminHash,
        role: 'ADMIN'
      }
    });

    console.log('Test users created successfully!');
    console.log('Regular user: test@example.com / test123');
    console.log('Admin user: testadmin@example.com / admin123');

    // Verify we can authenticate with these credentials
    const testUser = await prisma.user.findUnique({
      where: { email: 'testadmin@example.com' }
    });

    const passwordMatch = await bcrypt.compare('admin123', testUser.password);
    console.log('Password verification result:', passwordMatch);

  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers(); 