"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ArrowRight, ArrowUpRight, DollarSign, Package, ShoppingCart, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentOrdersTable } from "@/components/admin/recent-orders-table"
import { SalesChart } from "@/components/admin/sales-chart"

// Adding useId hook to generate stable IDs for elements
import { useId } from "react"

// Dashboard stats type
interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueGrowth: number;
  orderGrowth: number;
  newProducts: number;
  customerGrowth: number;
}

// Default stats for loading state
const defaultStats: DashboardStats = {
  totalRevenue: 0,
  totalOrders: 0,
  totalProducts: 0,
  totalCustomers: 0,
  revenueGrowth: 0,
  orderGrowth: 0,
  newProducts: 0,
  customerGrowth: 0
};

export default function AdminDashboardPage() {
  const [isClient, setIsClient] = useState(false)
  const [stats, setStats] = useState<DashboardStats>(defaultStats)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Generate stable IDs for tabs
  const salesTabId = useId()
  const ordersTabId = useId()
  const customersTabId = useId()
  
  useEffect(() => {
    setIsClient(true)
    
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/admin/dashboard/stats')
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard statistics')
        }
        
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        setError('Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (isClient) {
      fetchDashboardData()
    }
  }, [isClient])
  
  // Only render after client-side hydration to prevent mismatch
  if (!isClient) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <div className="min-h-[400px] bg-muted/20 animate-pulse rounded-md"></div>
      </div>
    )
  }

  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Package className="mr-2 h-4 w-4" />
            Add New Product
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={isLoading ? "Loading..." : formatCurrency(stats.totalRevenue)}
          description={`${stats.revenueGrowth > 0 ? '+' : ''}${stats.revenueGrowth.toFixed(1)}% from last month`}
          icon={<DollarSign className="h-5 w-5" />}
          isPositive={stats.revenueGrowth >= 0}
        />
        <StatsCard
          title="Orders"
          value={isLoading ? "Loading..." : stats.totalOrders.toString()}
          description={`${stats.orderGrowth > 0 ? '+' : ''}${stats.orderGrowth.toFixed(1)}% from last month`}
          icon={<ShoppingCart className="h-5 w-5" />}
          isPositive={stats.orderGrowth >= 0}
        />
        <StatsCard
          title="Products"
          value={isLoading ? "Loading..." : stats.totalProducts.toString()}
          description={`${stats.newProducts} added this month`}
          icon={<Package className="h-5 w-5" />}
          isPositive={stats.newProducts > 0}
        />
        <StatsCard
          title="Customers"
          value={isLoading ? "Loading..." : stats.totalCustomers.toString()}
          description={`${stats.customerGrowth > 0 ? '+' : ''}${stats.customerGrowth.toFixed(1)}% from last month`}
          icon={<Users className="h-5 w-5" />}
          isPositive={stats.customerGrowth >= 0}
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales" id={salesTabId}>Sales</TabsTrigger>
          <TabsTrigger value="orders" id={ordersTabId}>Orders</TabsTrigger>
          <TabsTrigger value="customers" id={customersTabId}>Customers</TabsTrigger>
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
            <CardDescription>Latest orders from your customers</CardDescription>
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
        <QuickActionCard title="Update Inventory" description="Check and update stock levels" href="/admin/products" />
      </div>
    </div>
  )
}

function StatsCard({
  title,
  value,
  description,
  icon,
  isPositive = true,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  isPositive?: boolean
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
        <div className={`mt-4 flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <ArrowUpRight className="mr-1 h-4 w-4" /> : <ArrowUpRight className="mr-1 h-4 w-4 rotate-180" />}
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

