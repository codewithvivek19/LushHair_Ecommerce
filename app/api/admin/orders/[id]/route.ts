import { NextRequest, NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

// Get a specific order (admin)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authentication
    const authCheck = await adminAuthMiddleware(request);
    if (authCheck) return authCheck;

    const id = params.id;

    // Get the order with relations
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                stock: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order (admin):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update a specific order (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authentication
    const authCheck = await adminAuthMiddleware(request);
    if (authCheck) return authCheck;

    const id = params.id;
    const body = await request.json();
    const { 
      status, 
      trackingNumber, 
      trackingCarrier, 
      trackingUrl,
      notes
    } = body;

    // Check if the status is valid
    if (status && !Object.values(OrderStatus).includes(status as OrderStatus)) {
      return NextResponse.json(
        { error: 'Invalid order status' },
        { status: 400 }
      );
    }

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update the order
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: status as OrderStatus,
        trackingNumber,
        trackingCarrier,
        trackingUrl,
        notes,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                stock: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order (admin):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 