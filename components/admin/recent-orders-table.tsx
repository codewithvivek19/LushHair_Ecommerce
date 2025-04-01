"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Order } from "@prisma/client"

type OrderWithCustomer = {
  id: string
  customer: string
  date: string
  total: number
  status: string
}

export function RecentOrdersTable() {
  const [isClient, setIsClient] = useState(false)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<OrderWithCustomer[]>([])
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    setIsClient(true)
    
    async function fetchRecentOrders() {
      try {
        const response = await fetch('/api/admin/orders?limit=5')
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders')
        }
        
        const data = await response.json()
        
        // Transform the data for display
        const formattedOrders = data.orders.map((order: any) => ({
          id: order.id,
          customer: order.user?.name || 'Unknown Customer',
          date: new Date(order.createdAt).toISOString().split('T')[0],
          total: order.total,
          status: order.status.toLowerCase(),
        }))
        
        setOrders(formattedOrders)
      } catch (error) {
        console.error('Error fetching orders:', error)
        setError('Failed to load recent orders')
      } finally {
        setLoading(false)
      }
    }
    
    if (isClient) {
      fetchRecentOrders()
    }
  }, [isClient])
  
  // Only render after client-side hydration to prevent mismatch
  if (!isClient) {
    return <div className="min-h-[200px] bg-muted/20"></div>
  }
  
  if (loading) {
    return <div className="min-h-[200px] bg-muted/20 animate-pulse"></div>
  }
  
  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }
  
  // If no orders yet, show a message
  if (orders.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No orders found</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <Link href={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                #{order.id.substring(0, 8)}
              </Link>
            </TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell>{order.date}</TableCell>
            <TableCell>${order.total.toFixed(2)}</TableCell>
            <TableCell>
              <OrderStatusBadge status={order.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    processing: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    shipped: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    delivered: "bg-green-100 text-green-800 hover:bg-green-100",
    cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
  }

  const style = statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800"

  return (
    <Badge variant="outline" className={style}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

