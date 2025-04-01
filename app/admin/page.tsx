"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"

export default function AdminLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { login, isLoading, user } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (user?.role === "admin") {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const success = await login(email, password)

    if (success) {
      if (isAdmin) {
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard!",
        })
        router.push("/admin/dashboard")
      } else {
        toast({
          title: "Access denied",
          description: "You don't have admin privileges",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Authentication failed",
        description: "Invalid email or password",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p>Demo admin credentials:</p>
              <p>Email: admin@example.com</p>
              <p>Password: admin123</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

