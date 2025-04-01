# Lush Hair E-Commerce Platform

An e-commerce website for selling premium hair extensions built with Next.js, Prisma, and Supabase.

## Features

- User authentication (login, registration)
- Product browsing and filtering
- Shopping cart
- Checkout process
- Order history
- Admin dashboard for product and order management

## Technologies

- Next.js 15
- React 19
- Prisma ORM
- PostgreSQL (Supabase)
- TailwindCSS
- TypeScript

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd lush-hair-ecommerce
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure environment variables

Copy the `.env` file and update it with your Supabase credentials:

```bash
cp .env.example .env
```

Update the following values in your `.env` file:
- `DATABASE_URL`: Your Supabase PostgreSQL connection string (with pgBouncer for connection pooling)
- `DIRECT_URL`: Your direct Supabase PostgreSQL connection string (used for migrations)

### 4. Set up the database

Run the database migration and seeding script:

```bash
chmod +x setup-db.sh
./setup-db.sh
```

Alternatively, you can run the commands manually:

```bash
npx prisma migrate dev --name init
npm run db:seed
```

### 5. Start the development server

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the application.

## Demo Accounts

After running the seed script, you'll have access to these demo accounts:

- Regular User:
  - Email: user@example.com
  - Password: password123

- Admin User:
  - Email: admin@example.com
  - Password: admin123

## Project Structure

- `/app`: Next.js application routes and pages
- `/components`: React components
- `/prisma`: Prisma schema and migrations
- `/lib`: Utility functions
- `/public`: Static assets

## Admin Features

The admin dashboard is accessible at `/admin` for users with admin privileges. From there, you can:

1. Manage products (add, edit, delete)
2. View and update orders
3. See sales analytics 