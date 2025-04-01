import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Testing Prisma client...");
  
  // Log available enums
  console.log("Available Prisma Types:", Object.keys(prisma));
  
  // Check if we can create a user without status
  const user = await prisma.user.create({
    data: {
      name: "Test User",
      email: "test-user-" + Date.now() + "@example.com",
      password: "testpassword",
      role: "USER",
    },
  });
  
  console.log("Created test user:", user);
  
  // Clean up
  await prisma.user.delete({
    where: { id: user.id }
  });
  
  console.log("Test complete!");
}

main()
  .catch((e) => {
    console.error("Error testing Prisma:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 