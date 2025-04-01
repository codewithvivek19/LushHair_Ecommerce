import { NextRequest, NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Get all products (admin view)
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const authCheck = await adminAuthMiddleware(request);
    if (authCheck) return authCheck;

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    const sort = searchParams.get('sort') || 'name';
    const order = searchParams.get('order') || 'asc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build filters
    let where: any = {};

    if (category) {
      where.category = { contains: category, mode: 'insensitive' };
    }

    if (featured) {
      where.featured = true;
    }

    // Get count for pagination
    const totalCount = await prisma.product.count({ where });

    // Get the products
    const products = await prisma.product.findMany({
      where,
      include: {
        colors: true,
        lengths: true,
      },
      orderBy: {
        [sort]: order,
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      products,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products (admin):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create a new product (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const authCheck = await adminAuthMiddleware(request);
    if (authCheck) return authCheck;

    const body = await request.json();
    const { 
      name, 
      description, 
      price, 
      images, 
      category, 
      featured, 
      stock, 
      colors, 
      lengths 
    } = body;

    // Validate required fields
    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Name, description, price, and category are required' },
        { status: 400 }
      );
    }

    // Create the product with transaction to ensure all related data is created correctly
    const product = await prisma.$transaction(async (tx) => {
      // Create the product
      const newProduct = await tx.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          images: images || [],
          category,
          featured: featured || false,
          stock: parseInt(stock) || 0,
        },
      });

      // Add colors
      if (colors && colors.length > 0) {
        for (const color of colors) {
          await tx.productColor.create({
            data: {
              name: color.name,
              value: color.value,
              productId: newProduct.id,
            },
          });
        }
      }

      // Add lengths
      if (lengths && lengths.length > 0) {
        for (const length of lengths) {
          await tx.productLength.create({
            data: {
              length,
              productId: newProduct.id,
            },
          });
        }
      }

      return newProduct;
    });

    // Get the complete product with relations
    const completeProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        colors: true,
        lengths: true,
      },
    });

    return NextResponse.json({
      success: true,
      product: completeProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 