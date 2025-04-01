"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect to the admin dashboard
    router.push("/admin/dashboard")
  }, [router])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="large" className="mb-4" />
        <h2 className="text-xl font-medium">Accessing Admin Dashboard...</h2>
      </div>
    </div>
  )
}

