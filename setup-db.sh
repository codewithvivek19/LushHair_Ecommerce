#!/bin/bash

echo "Setting up the database..."

# 1. Create the Prisma migration
echo "Creating migration..."
npx prisma migrate dev --name init

# 2. Seed the database with initial data
echo "Seeding the database..."
npm run db:seed

echo "Database setup complete!" 