import type React from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, DollarSign, Package, ShoppingCart, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentOrdersTable } from "@/components/admin/recent-orders-table"
import { SalesChart } from "@/components/admin/sales-chart"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button>
          <Package className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value="$12,548.42"
          description="+12.5% from last month"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatsCard
          title="Orders"
          value="324"
          description="+8.2% from last month"
          icon={<ShoppingCart className="h-5 w-5" />}
        />
        <StatsCard
          title="Products"
          value="56"
          description="4 added this month"
          icon={<Package className="h-5 w-5" />}
        />
        <StatsCard
          title="Customers"
          value="1,429"
          description="+24.5% from last month"
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>View your sales data for the past 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <SalesChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Orders Overview</CardTitle>
              <CardDescription>View your order data for the past 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <SalesChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="customers" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Growth</CardTitle>
              <CardDescription>View your customer acquisition data</CardDescription>
            </CardHeader>
            <CardContent>
              <SalesChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>You have 12 new orders today</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/orders">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <RecentOrdersTable />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <QuickActionCard
          title="Add New Product"
          description="Create a new product listing"
          href="/admin/products/new"
        />
        <QuickActionCard
          title="Process Orders"
          description="View and process pending orders"
          href="/admin/orders?status=pending"
        />
        <QuickActionCard title="Update Inventory" description="Check and update stock levels" href="/admin/inventory" />
      </div>
    </div>
  )
}

function StatsCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="rounded-md bg-primary/10 p-2">{icon}</div>
          <div className="text-right">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-green-600">
          <ArrowUpRight className="mr-1 h-4 w-4" />
          {description}
        </div>
      </CardContent>
    </Card>
  )
}

function QuickActionCard({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={href}>
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

