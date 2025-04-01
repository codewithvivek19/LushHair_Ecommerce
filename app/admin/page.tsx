"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"

export default function AdminPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Use the direct access API to get admin access immediately
    async function getDirectAccess() {
      try {
        const response = await fetch('/api/admin/auth/direct-access')
        const data = await response.json()
        
        if (response.ok && data.success) {
          // Direct access granted, redirect to dashboard
          router.push("/admin/dashboard")
        } else {
          // If there was an error, display it
          setError(data.error || "Failed to access admin area")
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Failed to get direct admin access:', error)
        setError("Network error accessing admin area")
        setIsLoading(false)
      }
    }
    
    getDirectAccess()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" className="mb-4" />
          <h2 className="text-xl font-medium">Accessing Admin Dashboard...</h2>
        </div>
      </div>
    )
  }

  // Display error if there was a problem
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Admin Access Error</h1>
          <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // This should not be displayed normally as we redirect on success
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin Access</h1>
        <p className="mb-6 text-muted-foreground">
          Direct access to admin dashboard, bypassing authentication for development.
        </p>
        <button 
          onClick={() => router.push("/admin/dashboard")} 
          className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Enter Admin Dashboard
        </button>
      </div>
    </div>
  )
}

