import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Get a single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        colors: true,
        lengths: true,
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update a product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()
    const { name, description, price, images, category, featured, stock, colors, lengths } = body

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        images,
        category,
        featured,
        stock,
      },
    })

    // Handle colors update
    if (colors) {
      // Delete existing colors
      await prisma.productColor.deleteMany({
        where: { productId: id },
      })

      // Add new colors
      for (const color of colors) {
        await prisma.productColor.create({
          data: {
            name: color.name,
            value: color.value,
            productId: id,
          },
        })
      }
    }

    // Handle lengths update
    if (lengths) {
      // Delete existing lengths
      await prisma.productLength.deleteMany({
        where: { productId: id },
      })

      // Add new lengths
      for (const length of lengths) {
        await prisma.productLength.create({
          data: {
            length,
            productId: id,
          },
        })
      }
    }

    // Return the updated product with colors and lengths
    const productWithRelations = await prisma.product.findUnique({
      where: { id },
      include: {
        colors: true,
        lengths: true,
      },
    })

    return NextResponse.json(productWithRelations)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Delete the product (cascades to colors and lengths due to onDelete: Cascade)
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 