"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"

export function DirectAdminAccess() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleDirectAccess = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/auth/direct-access")
      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Admin access granted",
          description: "Redirecting to admin dashboard...",
        })
        router.push("/admin/dashboard")
      } else {
        toast({
          title: "Access failed",
          description: data.error || "Could not grant admin access",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Direct admin access error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant="default" 
      size="lg" 
      onClick={handleDirectAccess} 
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="small" />
          <span>Accessing...</span>
        </>
      ) : (
        <>
          <Shield className="h-5 w-5" />
          <span>Direct Admin Access</span>
        </>
      )}
    </Button>
  )
} 