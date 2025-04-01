"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { BarChart3, Box, Home, LogOut, Package, Settings, ShoppingCart, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/auth-provider"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, logout, isAuthenticated, isAdmin } = useAuth()

  // Only render admin layout if we're in the admin section
  if (pathname === "/admin") {
    return children
  }

  // If not authenticated or not admin, show only the children (which should be the login page)
  if (!isAuthenticated || !isAdmin) {
    return children
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1">
          <header className="flex h-16 items-center justify-between border-b px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-xl font-bold">Lush Hair Admin</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <a href="/" target="_blank" rel="noreferrer">
                  View Store
                </a>
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <Sidebar>
      <SidebarHeader className="flex h-16 items-center px-4">
        <div className="flex items-center gap-2 font-bold">
          <Package className="h-6 w-6" />
          <span>Lush Hair</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/admin/dashboard"}>
              <a href="/admin/dashboard">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/admin/products"}>
              <a href="/admin/products">
                <Box className="h-4 w-4" />
                <span>Products</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/admin/orders"}>
              <a href="/admin/orders">
                <ShoppingCart className="h-4 w-4" />
                <span>Orders</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/admin/customers"}>
              <a href="/admin/customers">
                <Users className="h-4 w-4" />
                <span>Customers</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/admin/analytics"}>
              <a href="/admin/analytics">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/admin/settings"}>
              <a href="/admin/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Separator />
        <div className="p-4">
          <Button variant="outline" className="w-full justify-start" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

