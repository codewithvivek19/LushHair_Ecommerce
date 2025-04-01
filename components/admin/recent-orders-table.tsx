import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function RecentOrdersTable() {
  const recentOrders = [
    {
      id: "ORD-7893",
      customer: "Sarah Johnson",
      date: "2023-06-12",
      total: 129.99,
      status: "delivered",
    },
    {
      id: "ORD-7892",
      customer: "Michael Chen",
      date: "2023-06-12",
      total: 89.95,
      status: "shipped",
    },
    {
      id: "ORD-7891",
      customer: "Jessica Williams",
      date: "2023-06-11",
      total: 149.99,
      status: "processing",
    },
    {
      id: "ORD-7890",
      customer: "David Rodriguez",
      date: "2023-06-11",
      total: 75.5,
      status: "pending",
    },
    {
      id: "ORD-7889",
      customer: "Emily Taylor",
      date: "2023-06-10",
      total: 210.75,
      status: "delivered",
    },
  ]

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
        {recentOrders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <Link href={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                #{order.id}
              </Link>
            </TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
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

