"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"

type Product = {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  colors: { id: string; name: string; value: string }[]
  lengths: { id: string; value: string }[]
  featured: boolean
  stock: number
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const category = searchParams?.get("category")
  const featured = searchParams?.get("featured") === "true"
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    setInitialized(true)
    fetchProducts()
  }, [category, featured])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      let url = "/api/products"
      const params = new URLSearchParams()
      
      if (category) {
        params.append("category", category)
      }
      
      if (featured) {
        params.append("featured", "true")
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }
      
      const data = await response.json()
      setProducts(data.products || [])
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Error loading products")
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filters: any) => {
    // Build the URL with the selected filters
    const url = new URL(window.location.href)
    
    // Update or add category parameter
    if (filters.category) {
      url.searchParams.set("category", filters.category)
    } else {
      url.searchParams.delete("category")
    }
    
    // Update or add featured parameter
    if (filters.featured) {
      url.searchParams.set("featured", "true")
    } else {
      url.searchParams.delete("featured")
    }
    
    // Update the URL without reloading the page
    window.history.pushState({}, "", url.toString())
    
    // Fetch products with the new filters
    fetchProducts()
  }

  // Prevent rendering until client-side code has initialized
  if (!initialized) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {category ? `${category.replace("-", " ")} Extensions` : "All Products"}
          {featured ? " (Featured)" : ""}
        </h1>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading..." : `Showing ${products.length} products`}
          </p>
          <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden" suppressHydrationWarning>
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="py-4">
                <ProductFilters 
                  onFilterChange={handleFilterChange} 
                  initialCategory={category || undefined}
                  initialFeatured={featured}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="hidden lg:block">
          <ProductFilters 
            onFilterChange={handleFilterChange} 
            initialCategory={category || undefined}
            initialFeatured={featured}
          />
        </div>
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex h-[400px] w-full items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="flex h-[400px] w-full items-center justify-center rounded-md border border-dashed">
              <div className="text-center">
                <h3 className="mb-2 text-lg font-medium">Error loading products</h3>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button onClick={fetchProducts} suppressHydrationWarning>Try Again</Button>
              </div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex h-[400px] w-full items-center justify-center rounded-md border border-dashed">
              <div className="text-center">
                <h3 className="mb-2 text-lg font-medium">No products found</h3>
                <p className="text-sm text-muted-foreground">Try changing your filters or check back later.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

