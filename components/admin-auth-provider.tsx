"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export interface AdminUser {
  id: string
  name: string
  email: string
  role: "ADMIN"
}

interface AdminAuthContextType {
  admin: AdminUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing admin session on mount
  useEffect(() => {
    const getAdminFromCookie = async () => {
      try {
        const response = await fetch('/api/admin/auth/me')
        const data = await response.json()
        
        if (response.ok && data.authenticated) {
          setAdmin(data.admin)
        } else {
          setAdmin(null)
        }
      } catch (error) {
        console.error('Failed to get admin from cookie:', error)
        setAdmin(null)
      } finally {
        setIsLoading(false)
      }
    }

    getAdminFromCookie()
  }, [])

  // Protect admin routes
  useEffect(() => {
    if (!isLoading) {
      // Redirect from admin pages if not authenticated as admin
      if (pathname?.startsWith("/admin") && !admin && pathname !== "/admin") {
        console.log("Redirecting to admin login because not authenticated")
        router.push("/admin")
      }
    }
  }, [pathname, admin, isLoading, router])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setAdmin(data.user)
        setIsLoading(false)
        return true
      } else {
        console.error('Admin login failed:', data.error || 'Unknown error')
        toast({
          title: "Login failed",
          description: data.error || "Authentication failed",
          variant: "destructive"
        })
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error('Admin login error:', error)
      toast({
        title: "Login error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
      setIsLoading(false)
      return false
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
      })
      setAdmin(null)
      router.push("/admin")
    } catch (error) {
      console.error('Admin logout error:', error)
      toast({
        title: "Logout error",
        description: "An unexpected error occurred during logout",
        variant: "destructive"
      })
    }
  }

  const isAuthenticated = !!admin

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isLoading,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
} 