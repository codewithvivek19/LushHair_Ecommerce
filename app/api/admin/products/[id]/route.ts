import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get a specific product (admin)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // No auth check needed for direct access
    
    const id = params.id;

    // Get the product with relations
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        colors: true,
        lengths: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product (admin):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update a product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // No auth check needed for direct access
    
    const id = params.id;
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

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    console.log('Updating product with data:', { 
      id, name, description, price, category, 
      colorsCount: colors?.length,
      lengthsCount: lengths?.length
    });

    // Update the product with transaction
    await prisma.$transaction(async (tx) => {
      // Update the product
      await tx.product.update({
        where: { id },
        data: {
          name,
          description,
          price: parseFloat(price),
          images,
          category,
          featured,
          stock: parseInt(stock),
        },
      });

      // Update colors if provided
      if (colors) {
        // Delete existing colors
        await tx.productColor.deleteMany({
          where: { productId: id },
        });

        // Add new colors
        for (const color of colors) {
          await tx.productColor.create({
            data: {
              name: color.name,
              value: color.value,
              productId: id,
            },
          });
        }
      }

      // Update lengths if provided
      if (lengths) {
        // Delete existing lengths
        await tx.productLength.deleteMany({
          where: { productId: id },
        });

        // Add new lengths
        for (const lengthItem of lengths) {
          await tx.productLength.create({
            data: {
              // Handle both formats: { length: "value" } or "value"
              length: typeof lengthItem === 'object' ? lengthItem.length : lengthItem,
              productId: id,
            },
          });
        }
      }
    });

    // Get the updated product with relations
    const updatedProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        colors: true,
        lengths: true,
      },
    });

    return NextResponse.json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete a product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // No auth check needed for direct access
    
    const id = params.id;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if product is used in any orders
    const orderItemsWithProduct = await prisma.orderItem.findFirst({
      where: { productId: id },
    });

    if (orderItemsWithProduct) {
      return NextResponse.json(
        { error: 'Cannot delete product that has been ordered. Consider updating its stock to 0 instead.' },
        { status: 400 }
      );
    }

    // Delete the product with transaction
    await prisma.$transaction(async (tx) => {
      // Delete related colors
      await tx.productColor.deleteMany({
        where: { productId: id },
      });

      // Delete related lengths
      await tx.productLength.deleteMany({
        where: { productId: id },
      });

      // Delete the product
      await tx.product.delete({
        where: { id },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 