# LushHair E-commerce Platform

A modern e-commerce platform for hair products built with Next.js, Prisma, TypeScript, and Tailwind CSS.

## Features

- **User Authentication**: Complete user registration, login, and profile management
- **Product Management**: Browse, filter, and search products by category, price, length, and color
- **Shopping Cart**: Add products to cart, manage quantities, and checkout
- **Order Processing**: Complete checkout flow with order confirmation
- **Admin Dashboard**: Comprehensive admin panel for managing products and orders
- **Responsive Design**: Mobile-first approach ensuring compatibility across all devices

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Custom JWT-based authentication
- **Styling**: Tailwind CSS with dark mode support

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- PostgreSQL database

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
# App
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-minimum-32-chars

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/lushhair_db"

# Auth
JWT_SECRET=your-jwt-secret-key-minimum-32-chars
JWT_EXPIRES_IN=7d

# Admin
ADMIN_EMAIL=admin@lushhair.com
ADMIN_PASSWORD=admin_secure_password
```

Replace the placeholder values with your actual credentials.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/codewithvivek19/LushHair_Ecommerce.git
   cd LushHair_Ecommerce
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Set up the database:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Database Schema

The application uses the following main data models:
- User
- Product (with relationships to Color and Length)
- Order and OrderItem
- Cart and CartItem

Run `npx prisma studio` to view and edit your database content through a visual interface.

## API Routes

### Public Endpoints

- `GET /api/products` - List all products with filtering options
- `GET /api/products/:id` - Get single product details
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - User logout
- `POST /api/orders` - Create a new order
- `GET /api/orders` - List user's orders

### Admin Endpoints

- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/products` - List all products (admin view)
- `POST /api/admin/products` - Create new product
- `GET /api/admin/products/:id` - Get product details
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - List all orders
- `GET /api/admin/orders/:id` - Get order details
- `PUT /api/admin/orders/:id` - Update order status

## Admin Access

To access the admin panel, navigate to `/admin` and use the following credentials:
- Email: admin@lushhair.com
- Password: admin_secure_password

## Deployment

This application can be deployed on Vercel, Netlify, or any other platform that supports Next.js.

### Vercel Deployment

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 