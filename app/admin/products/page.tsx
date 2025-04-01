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

  useEffect(() => {
    setInitialized(true)
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/products")
      
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

  const filteredProducts = products.filter((product) => {
    // Filter by search query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    // Filter by category
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
        throw new Error("Failed to delete product")
      }
      
      // Remove product from state
      setProducts(products.filter((p) => p.id !== productId))
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
      
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully.",
      })
    } catch (err) {
      console.error("Error deleting product:", err)
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleBulkDelete = async () => {
    // This would ideally be a batch operation on the backend
    // For now, we'll delete one by one
    let successCount = 0
    
    for (const productId of selectedProducts) {
      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          successCount++
        }
      } catch (err) {
        console.error(`Error deleting product ${productId}:`, err)
      }
    }
    
    if (successCount > 0) {
      // Update local state to remove deleted products
      setProducts(products.filter((p) => !selectedProducts.includes(p.id)))
      setSelectedProducts([])
      
      toast({
        title: "Products deleted",
        description: `${successCount} of ${selectedProducts.length} products have been deleted.`,
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to delete products. Please try again.",
        variant: "destructive"
      })
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
          <div className="flex h-[400px] items-center justify-center">
            <LoadingSpinner size="large" />
          </div>
        ) : error ? (
          <div className="flex h-[400px] flex-col items-center justify-center p-6">
            <div className="text-center">
              <h3 className="mb-2 text-lg font-medium text-red-500">{error}</h3>
              <Button onClick={fetchProducts} className="mt-4">Try Again</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full max-w-sm items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9"
                    suppressHydrationWarning
                  />
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Select 
                    value={categoryFilter} 
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="h-9 w-full sm:w-[150px]" suppressHydrationWarning>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select 
                    value={stockFilter} 
                    onValueChange={setStockFilter}
                  >
                    <SelectTrigger className="h-9 w-full sm:w-[150px]" suppressHydrationWarning>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="in-stock">In Stock</SelectItem>
                      <SelectItem value="low-stock">Low Stock</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                  {selectedProducts.length > 0 && (
                    <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="h-9" suppressHydrationWarning>
                      Delete ({selectedProducts.length})
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all products"
                        suppressHydrationWarning
                      />
                    </TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
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
                            suppressHydrationWarning
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {product.id.substring(0, 8)}...</div>
                        </TableCell>
                        <TableCell>{product.category.charAt(0).toUpperCase() + product.category.slice(1).replace('-', ' ')}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <div
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              product.stock > 10
                                ? "bg-green-100 text-green-800"
                                : product.stock > 0
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.stock > 10 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out of Stock"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" suppressHydrationWarning>
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
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
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 focus:text-red-600"
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
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

