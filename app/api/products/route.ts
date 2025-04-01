import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured') === 'true'

    let whereClause = {}

    if (category) {
      whereClause = {
        ...whereClause,
        category: {
          contains: category,
          mode: 'insensitive',
        },
      }
    }

    if (featured) {
      whereClause = {
        ...whereClause,
        featured: true,
      }
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        colors: true,
        lengths: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 