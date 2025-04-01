const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding demo users...");

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
  });

  if (!existingAdmin) {
    // Create admin user
    await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@example.com",
        password: "admin123", // In production, this would be hashed
        role: "ADMIN",
      },
    });
    console.log("✅ Admin user created");
  } else {
    console.log("ℹ️ Admin user already exists");
  }

  // Check if regular user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: "user@example.com" },
  });

  if (!existingUser) {
    // Create regular user
    await prisma.user.create({
      data: {
        name: "Regular User",
        email: "user@example.com",
        password: "password123", // In production, this would be hashed
        role: "USER",
      },
    });
    console.log("✅ Regular user created");
  } else {
    console.log("ℹ️ Regular user already exists");
  }

  console.log("✅ Seed completed successfully");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding users:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 