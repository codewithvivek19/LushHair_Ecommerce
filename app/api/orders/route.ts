import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

// Get all orders for a user
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const userCookie = await cookieStore.get('lush_hair_user')
    
    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(userCookie.value)
    const userId = user.id

    // Get query parameters for pagination
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // For admin users, return all orders
    if (user.role === 'ADMIN') {
      const orders = await prisma.order.findMany({
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      })
      
      // Get total count for pagination
      const total = await prisma.order.count()
      
      return NextResponse.json({
        orders,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page,
          limit,
        },
      })
    }

    // For regular users, return only their orders
    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    })
    
    // Get total count for pagination
    const total = await prisma.order.count({
      where: {
        userId,
      },
    })

    return NextResponse.json({
      orders,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, shipping, payment, total } = body

    const cookieStore = cookies()
    const userCookie = await cookieStore.get('lush_hair_user')
    
    if (!userCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(userCookie.value)
    const userId = user.id

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        subtotal: total, // Set subtotal same as total for now
        status: 'PENDING',
        shippingAddress: shipping.street + 
          (shipping.apt ? `, ${shipping.apt}` : '') + 
          `, ${shipping.city}, ${shipping.state} ${shipping.zip}, ${shipping.country}`,
        paymentMethod: payment.method,
        paymentLast4: payment.last4,
        paymentBrand: payment.brand,
        paymentEmail: payment.email,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            color: item.selectedOptions?.color,
            length: item.selectedOptions?.length,
          })),
        },
      },
    })

    // Return the created order with items
    const orderWithItems = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(orderWithItems)
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 