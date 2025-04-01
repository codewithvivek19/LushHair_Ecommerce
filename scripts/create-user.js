// Create regular user with fresh bcrypt hash
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createRegularUser() {
  try {
    // Delete existing user
    await prisma.user.deleteMany({
      where: {
        email: 'user@example.com'
      }
    });

    // Create fresh hash
    const password = 'password123';
    const hash = await bcrypt.hash(password, 10);
    
    console.log('Generated hash:', hash);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name: 'Sarah Johnson',
        email: 'user@example.com',
        password: hash,
        role: 'USER',
        phone: '212-555-1234',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'United States',
      }
    });

    console.log('Regular user created successfully!');
    console.log('User:', user.email);
    
    // Verify password
    const dbUser = await prisma.user.findUnique({
      where: { email: 'user@example.com' }
    });
    
    const verify = await bcrypt.compare(password, dbUser.password);
    console.log('Password verification:', verify);

  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createRegularUser(); 