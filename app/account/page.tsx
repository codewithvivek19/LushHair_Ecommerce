"use client"
import Link from "next/link"
import { Package, ShoppingBag, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getOrdersByCustomerId, getUserById } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"

export default function AccountPage() {
  const { user } = useAuth()

  // Get orders for the authenticated user
  const orders = user ? getOrdersByCustomerId(user.id) : []

  if (!user) {
    return (
      <div className="container flex h-[70vh] flex-col items-center justify-center py-8">
        <h1 className="mb-4 text-2xl font-bold">Account Not Found</h1>
        <p className="mb-8 text-center text-muted-foreground">Please sign in to view your account.</p>
        <Button asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    )
  }

  const recentOrders = orders.slice(0, 3)
  const userData = getUserById(user.id)

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">My Account</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Welcome back, {user.name}!</CardTitle>
              <CardDescription>Manage your orders, profile, and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="orders">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="addresses">Addresses</TabsTrigger>
                </TabsList>

                <TabsContent value="orders" className="mt-6">
                  {recentOrders.length > 0 ? (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <div className="font-medium">Order #{order.id}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(order.date).toLocaleDateString()} • ${order.total.toFixed(2)}
                            </div>
                            <div className="mt-1">
                              <OrderStatusBadge status={order.status} />
                            </div>
                          </div>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/account/orders/${order.id}`}>View Details</Link>
                          </Button>
                        </div>
                      ))}

                      <div className="mt-4 text-center">
                        <Button asChild variant="outline">
                          <Link href="/account/orders">View All Orders</Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                      <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="mb-2 text-lg font-medium">No orders yet</h3>
                      <p className="mb-4 text-sm text-muted-foreground">You haven't placed any orders yet.</p>
                      <Button asChild>
                        <Link href="/products">Start Shopping</Link>
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="profile" className="mt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Name</div>
                        <div>{user.name}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Email</div>
                        <div>{user.email}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Phone</div>
                        <div>{userData?.phone || "Not provided"}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button asChild>
                        <Link href="/account/profile">Edit Profile</Link>
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="addresses" className="mt-6">
                  {userData?.address ? (
                    <div className="rounded-lg border p-4">
                      <div className="font-medium">Default Address</div>
                      <div className="mt-2 text-sm">
                        {userData.address.street}
                        <br />
                        {userData.address.city}, {userData.address.state} {userData.address.zip}
                        <br />
                        {userData.address.country}
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Button asChild variant="outline" size="sm">
                          <Link href="/account/addresses">Manage Addresses</Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                      <h3 className="mb-2 text-lg font-medium">No addresses saved</h3>
                      <p className="mb-4 text-sm text-muted-foreground">You haven't added any addresses yet.</p>
                      <Button asChild>
                        <Link href="/account/addresses/new">Add Address</Link>
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/account/orders" className="flex items-center">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    My Orders
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/account/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/products" className="flex items-center">
                    <Package className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }

  const style = statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800"

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

