import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, images, category, featured, stock, colors, lengths } = body

    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Name, description, price, and category are required' },
        { status: 400 }
      )
    }

    // Create the new product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        images: images || [],
        category,
        featured: featured || false,
        stock: parseInt(stock) || 0,
        rating: 0,
        reviewCount: 0,
      },
    })

    // Add colors if provided
    if (colors && colors.length > 0) {
      for (const color of colors) {
        await prisma.productColor.create({
          data: {
            name: color.name,
            value: color.value,
            productId: product.id,
          },
        })
      }
    }

    // Add lengths if provided
    if (lengths && lengths.length > 0) {
      for (const length of lengths) {
        await prisma.productLength.create({
          data: {
            length,
            productId: product.id,
          },
        })
      }
    }

    // Return the created product with colors and lengths
    const productWithRelations = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        colors: true,
        lengths: true,
      },
    })

    return NextResponse.json(productWithRelations)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 