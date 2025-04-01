import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // Get total revenue from all orders
    const totalRevenueResult = await prisma.order.aggregate({
      _sum: {
        total: true
      }
    })
    
    // Get total number of orders
    const totalOrders = await prisma.order.count()
    
    // Get total number of products
    const totalProducts = await prisma.product.count()
    
    // Get total number of customers (users with USER role)
    const totalCustomers = await prisma.user.count({
      where: {
        role: 'USER'
      }
    })
    
    // Get orders created in the current month
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    
    const ordersThisMonth = await prisma.order.count({
      where: {
        createdAt: {
          gte: firstDayOfMonth
        }
      }
    })
    
    // Get orders created in the previous month
    const firstDayOfPrevMonth = new Date(currentYear, currentMonth - 1, 1)
    const lastDayOfPrevMonth = new Date(currentYear, currentMonth, 0)
    
    const ordersLastMonth = await prisma.order.count({
      where: {
        createdAt: {
          gte: firstDayOfPrevMonth,
          lt: firstDayOfMonth
        }
      }
    })
    
    // Get revenue from the current month
    const revenueThisMonth = await prisma.order.aggregate({
      _sum: {
        total: true
      },
      where: {
        createdAt: {
          gte: firstDayOfMonth
        }
      }
    })
    
    // Get revenue from the previous month
    const revenueLastMonth = await prisma.order.aggregate({
      _sum: {
        total: true
      },
      where: {
        createdAt: {
          gte: firstDayOfPrevMonth,
          lt: firstDayOfMonth
        }
      }
    })
    
    // Get products created in the current month
    const productsThisMonth = await prisma.product.count({
      where: {
        createdAt: {
          gte: firstDayOfMonth
        }
      }
    })
    
    // Get customers created in the current month
    const customersThisMonth = await prisma.user.count({
      where: {
        role: 'USER',
        createdAt: {
          gte: firstDayOfMonth
        }
      }
    })
    
    // Get customers created in the previous month
    const customersLastMonth = await prisma.user.count({
      where: {
        role: 'USER',
        createdAt: {
          gte: firstDayOfPrevMonth,
          lt: firstDayOfMonth
        }
      }
    })
    
    // Calculate growth percentages
    const orderGrowth = ordersLastMonth === 0 
      ? 100  // If no orders last month, growth is 100%
      : ((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100
    
    const revenueGrowth = (!revenueLastMonth._sum.total || revenueLastMonth._sum.total === 0)
      ? 100  // If no revenue last month, growth is 100%
      : (((revenueThisMonth._sum.total || 0) - (revenueLastMonth._sum.total || 0)) / (revenueLastMonth._sum.total || 1)) * 100
    
    const customerGrowth = customersLastMonth === 0
      ? 100  // If no customers last month, growth is 100%
      : ((customersThisMonth - customersLastMonth) / customersLastMonth) * 100
    
    return NextResponse.json({
      totalRevenue: totalRevenueResult._sum.total || 0,
      totalOrders,
      totalProducts,
      totalCustomers,
      revenueGrowth,
      orderGrowth,
      newProducts: productsThisMonth,
      customerGrowth
    })
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 