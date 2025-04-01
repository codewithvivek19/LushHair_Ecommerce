// Create admin user with fresh bcrypt hash
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Delete existing admin users
    await prisma.user.deleteMany({
      where: {
        email: 'admin@example.com'
      }
    });

    // Create fresh hash
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    
    console.log('Generated hash:', hash);
    
    // Verify hash works
    const verify = await bcrypt.compare(password, hash);
    console.log('Hash verification:', verify);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hash,
        role: 'ADMIN',
        phone: '800-555-0000',
        street: '1 Admin Plaza',
        city: 'San Francisco',
        state: 'CA',
        zip: '94107',
        country: 'United States',
      }
    });

    console.log('Admin user created successfully!');
    console.log('Admin user:', admin.email);
    
    // Verify DB password
    const dbUser = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });
    
    const dbVerify = await bcrypt.compare(password, dbUser.password);
    console.log('DB password verification:', dbVerify);

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser(); 