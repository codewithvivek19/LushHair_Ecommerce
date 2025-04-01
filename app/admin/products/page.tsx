"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Edit, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"

type Product = {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  colors: { id: string; name: string; value: string }[]
  lengths: { id: string; length: string }[]
  featured: boolean
  stock: number
}

export default function AdminProductsPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [initialized, setInitialized] = useState(false)
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, pages: 1 })

  useEffect(() => {
    setInitialized(true)
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      let url = "/api/admin/products?limit=100" // Fetch more products at once
      
      // Add filters if needed
      if (categoryFilter !== "all") {
        url += `&category=${encodeURIComponent(categoryFilter)}`
      }
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }
      
      const data = await response.json()
      setProducts(data.products || [])
      setPagination(data.pagination || { total: 0, page: 1, limit: 20, pages: 1 })
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Error loading products")
    } finally {
      setLoading(false)
    }
  }

  // Apply client-side filters after getting data from API
  const filteredProducts = products.filter((product) => {
    // Filter by search query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    // Category is now handled by the API, but we keep it here for immediate UI filtering
    if (categoryFilter !== "all" && product.category !== categoryFilter) {
      return false
    }
    
    // Filter by stock status
    if (stockFilter === "in-stock" && product.stock <= 10) {
      return false
    } else if (stockFilter === "low-stock" && (product.stock <= 0 || product.stock > 10)) {
      return false
    } else if (stockFilter === "out-of-stock" && product.stock > 0) {
      return false
    }
    
    return true
  })

  // Get unique categories from products
  const categories = Array.from(new Set(products.map(product => product.category)))

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id))
    }
  }

  const handleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete product")
      }
      
      // Remove product from state
      setProducts(products.filter((p) => p.id !== productId))
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
      
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully.",
      })
    } catch (err: any) {
      console.error("Error deleting product:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to delete product. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleBulkDelete = async () => {
    // This would ideally be a batch operation on the backend
    // For now, we'll delete one by one
    let successCount = 0
    let failCount = 0
    
    for (const productId of selectedProducts) {
      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          successCount++
        } else {
          failCount++
        }
      } catch (err) {
        console.error(`Error deleting product ${productId}:`, err)
        failCount++
      }
    }
    
    if (successCount > 0) {
      // Update local state to remove deleted products
      setProducts(products.filter((p) => !selectedProducts.includes(p.id)))
      setSelectedProducts([])
      
      toast({
        title: `${successCount} products deleted`,
        description: failCount > 0 ? `${failCount} products could not be deleted.` : `All selected products have been deleted.`,
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to delete products. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Handle category filter change with API refresh
  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value)
    // If changing to a server-side filter, refresh from API
    if (value !== "all" && categoryFilter === "all") {
      setTimeout(() => fetchProducts(), 0)
    } else if (value === "all" && categoryFilter !== "all") {
      setTimeout(() => fetchProducts(), 0)
    }
  }

  // Prevent rendering until client-side code has initialized
  if (!initialized) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <Card>
        {loading ? (
          <div className="flex h-[300px] items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="flex h-[200px] flex-col items-center justify-center text-center">
            <p className="text-red-500">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={fetchProducts}
            >
              Retry
            </Button>
          </div>
        ) : (
          <div>
            {/* Filters and search */}
            <div className="flex flex-col space-y-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="flex flex-1 items-center space-x-2">
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 w-[150px] lg:w-[250px]"
                />
                <Select value={categoryFilter} onValueChange={handleCategoryFilterChange}>
                  <SelectTrigger className="h-8 w-[130px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={stockFilter} onValueChange={setStockFilter}>
                  <SelectTrigger className="h-8 w-[130px]">
                    <SelectValue placeholder="Stock" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stock</SelectItem>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="low-stock">Low Stock (≤ 10)</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedProducts.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedProducts.length} selected
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="h-8 gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              )}
            </div>

            {/* Products table */}
            <div className="border-t">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={
                          filteredProducts.length > 0 &&
                          selectedProducts.length === filteredProducts.length
                        }
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all products"
                      />
                    </TableHead>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-[100px] text-center">
                        No products found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={() => handleSelectProduct(product.id)}
                            aria-label={`Select ${product.name}`}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="h-[40px] w-[40px] overflow-hidden rounded-md">
                            <img
                              src={product.images[0] || "https://placehold.co/400?text=No+Image"}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <span
                            className={
                              product.stock === 0
                                ? "text-red-500"
                                : product.stock <= 10
                                ? "text-amber-500"
                                : ""
                            }
                          >
                            {product.stock}
                          </span>
                        </TableCell>
                        <TableCell>
                          {product.featured ? (
                            <span className="inline-flex h-6 items-center rounded-full bg-green-100 px-2 text-xs font-medium text-green-800">
                              Yes
                            </span>
                          ) : (
                            <span className="inline-flex h-6 items-center rounded-full bg-gray-100 px-2 text-xs font-medium text-gray-800">
                              No
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/products/${product.id}`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {/* Pagination info */}
              <div className="flex items-center justify-between p-4">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredProducts.length} of {pagination.total} products
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

