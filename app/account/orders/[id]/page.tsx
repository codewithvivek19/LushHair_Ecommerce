"use client"

import { useState, useEffect, useId } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronRight, Download, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Invoice } from "@/components/invoice"
import { Order, OrderStatus } from "@prisma/client"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { formatCurrency, formatDate } from "@/lib/utils"

// Define types for what comes from API
type OrderItem = {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  color?: string
  length?: string
  product: {
    id: string
    name: string
    images: string[]
  }
}

type OrderDetails = Order & {
  items: OrderItem[]
  user: {
    id: string
    name: string
    email: string
  }
}

const statusStyles = {
  [OrderStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [OrderStatus.PROCESSING]: "bg-blue-100 text-blue-800",
  [OrderStatus.SHIPPED]: "bg-purple-100 text-purple-800",
  [OrderStatus.DELIVERED]: "bg-green-100 text-green-800",
  [OrderStatus.CANCELLED]: "bg-red-100 text-red-800",
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const formId = useId()
  const router = useRouter()
  const [showInvoice, setShowInvoice] = useState(false)
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(`/api/orders/${params.id}`)
        
        if (response.status === 404) {
          setOrder(null)
          setError("Order not found")
          return
        }
        
        if (!response.ok) {
          throw new Error("Failed to fetch order")
        }
        
        const data = await response.json()
        setOrder(data)
      } catch (err) {
        console.error("Error fetching order:", err)
        setError("Error loading order details")
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrder()
  }, [params.id])

  const handlePrintInvoice = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="container flex h-[70vh] flex-col items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container flex h-[70vh] flex-col items-center justify-center py-8">
        <h1 className="mb-4 text-2xl font-bold">Order Not Found</h1>
        <p className="mb-8 text-center text-muted-foreground">The order you are looking for does not exist or could not be loaded.</p>
        <Button asChild>
          <Link href="/account/orders">Back to Orders</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      {showInvoice ? (
        <div className="container py-8">
          <div className="mb-6 flex items-center justify-between">
            <Button variant="outline" onClick={() => setShowInvoice(false)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Order
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrintInvoice} suppressHydrationWarning>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button suppressHydrationWarning>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>

          <div className="bg-white p-8 shadow-md print:shadow-none">
            <Invoice order={order} />
          </div>
        </div>
      ) : (
        <div className="container py-8">
          <div className="mb-6 flex items-center text-sm text-muted-foreground">
            <Link href="/account" className="hover:text-foreground">
              Account
            </Link>
            <ChevronRight className="mx-1 h-4 w-4" />
            <Link href="/account/orders" className="hover:text-foreground">
              Orders
            </Link>
            <ChevronRight className="mx-1 h-4 w-4" />
            <span className="text-foreground">#{order.id.substring(0, 8)}</span>
          </div>

          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Order #{order.id.substring(0, 8)}</h1>
            <Button variant="outline" onClick={() => setShowInvoice(true)} suppressHydrationWarning>
              View Invoice
            </Button>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                  <CardDescription>Placed on {formatDate(order.createdAt)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-4 rounded-lg bg-muted/50 p-4">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-muted-foreground">Status</div>
                        <div className="mt-1">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusStyles[order.status]}`}>
                            {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                          </span>
                        </div>
                      </div>

                      {order.trackingNumber && (
                        <div className="flex-1">
                          <div className="text-sm font-medium text-muted-foreground">Tracking</div>
                          <div className="mt-1 font-medium">
                            {order.trackingCarrier || "Carrier"}: {order.trackingNumber}
                          </div>
                          {order.trackingUrl && (
                            <div className="mt-1">
                              <a
                                href={order.trackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline"
                              >
                                Track Package
                              </a>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="text-sm font-medium text-muted-foreground">Payment Method</div>
                        <div className="mt-1 font-medium">
                          {order.paymentMethod || "Credit Card"}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4 font-medium">Items</div>
                      <div className="rounded-lg border">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-4">
                            <div className="flex-1">
                              <div className="font-medium">{item.product.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {item.color && `${item.color}`} {item.length && `${item.length}`} • Qty: {item.quantity}
                              </div>
                            </div>
                            <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
                          </div>
                        ))}

                        <Separator />

                        <div className="space-y-2 p-4">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{formatCurrency(order.subtotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Shipping</span>
                            <span>{formatCurrency(order.shippingCost || 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tax</span>
                            <span>{formatCurrency(order.tax || 0)}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-medium">
                            <span>Total</span>
                            <span>{formatCurrency(order.total)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <p className="font-medium">{order.user.name}</p>
                    <p>{order.shippingAddress}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button asChild variant="outline" className="w-full" suppressHydrationWarning>
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full" suppressHydrationWarning>
                    <Link href="/returns">Return Policy</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

