"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MoreHorizontal, Plus, Search, Trash2, User, Edit } from "lucide-react"
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
import { formatDate } from "@/lib/utils"

type Customer = {
  id: string
  name: string
  email: string
  image: string | null
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
  role: string
  createdAt: string
  _count: {
    orders: number
  }
}

export default function AdminCustomersPage() {
  const { toast } = useToast()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [initialized, setInitialized] = useState(false)
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, pages: 1 })

  useEffect(() => {
    setInitialized(true)
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      let url = "/api/admin/users?limit=100" // Fetch more customers at once
      
      // Add filters if needed
      if (roleFilter !== "all") {
        url += `&role=${encodeURIComponent(roleFilter)}`
      }
      
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`
      }
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error("Failed to fetch customers")
      }
      
      const data = await response.json()
      setCustomers(data.users || [])
      setPagination(data.pagination || { total: 0, page: 1, limit: 20, pages: 1 })
    } catch (err) {
      console.error("Error fetching customers:", err)
      setError("Error loading customers")
    } finally {
      setLoading(false)
    }
  }

  // Filter customers client-side for immediate feedback
  const filteredCustomers = customers.filter((customer) => {
    // Role is handled by the API, but we keep this for immediate UI feedback
    if (roleFilter !== "all" && customer.role !== roleFilter) {
      return false
    }
    
    // Search is handled by the API, but keep for immediate UI feedback
    if (searchQuery && 
        !customer.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !customer.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    return true
  })

  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(filteredCustomers.map((c) => c.id))
    }
  }

  const handleSelectCustomer = (customerId: string) => {
    if (selectedCustomers.includes(customerId)) {
      setSelectedCustomers(selectedCustomers.filter((id) => id !== customerId))
    } else {
      setSelectedCustomers([...selectedCustomers, customerId])
    }
  }

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${customerId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete customer")
      }
      
      // Remove customer from state
      setCustomers(customers.filter((c) => c.id !== customerId))
      setSelectedCustomers(selectedCustomers.filter((id) => id !== customerId))
      
      toast({
        title: "Customer deleted",
        description: "The customer has been deleted successfully.",
      })
    } catch (err: any) {
      console.error("Error deleting customer:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to delete customer. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleBulkDelete = async () => {
    let successCount = 0
    let failCount = 0
    
    for (const customerId of selectedCustomers) {
      try {
        const response = await fetch(`/api/admin/users/${customerId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          successCount++
        } else {
          failCount++
        }
      } catch (err) {
        console.error(`Error deleting customer ${customerId}:`, err)
        failCount++
      }
    }
    
    if (successCount > 0) {
      // Update local state to remove deleted customers
      setCustomers(customers.filter((c) => !selectedCustomers.includes(c.id)))
      setSelectedCustomers([])
      
      toast({
        title: `${successCount} customers deleted`,
        description: failCount > 0 ? `${failCount} customers could not be deleted.` : `All selected customers have been deleted.`,
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to delete customers. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Handle filters with API refresh
  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value)
    setTimeout(() => {
      // Reset page and use new filters
      fetchCustomers()
    }, 0)
  }

  const handleSearchQueryChange = (value: string) => {
    setSearchQuery(value)
    // Debounce API calls
    if (value.length === 0 || value.length > 2) {
      setTimeout(() => {
        fetchCustomers()
      }, 300)
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
        <h1 className="text-3xl font-bold">Customers</h1>
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
              onClick={fetchCustomers}
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
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => handleSearchQueryChange(e.target.value)}
                  className="h-8 w-[150px] lg:w-[250px]"
                />
                <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
                  <SelectTrigger className="h-8 w-[130px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="USER">Customer</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedCustomers.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedCustomers.length} selected
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

            {/* Customers table */}
            <div className="border-t">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={
                          filteredCustomers.length > 0 &&
                          selectedCustomers.length === filteredCustomers.length
                        }
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all customers"
                      />
                    </TableHead>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-[100px] text-center">
                        No customers found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedCustomers.includes(customer.id)}
                            onCheckedChange={() => handleSelectCustomer(customer.id)}
                            aria-label={`Select ${customer.name}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                              {customer.image ? (
                                <img 
                                  src={customer.image} 
                                  alt={customer.name} 
                                  className="h-8 w-8 rounded-full object-cover"
                                />
                              ) : (
                                <User className="h-4 w-4 text-gray-500" />
                              )}
                            </div>
                            {customer.name}
                          </div>
                        </TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer._count.orders}</TableCell>
                        <TableCell>
                          {customer.role === "ADMIN" ? (
                            <span className="inline-flex h-6 items-center rounded-full bg-purple-100 px-2 text-xs font-medium text-purple-800">
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex h-6 items-center rounded-full bg-blue-100 px-2 text-xs font-medium text-blue-800">
                              Customer
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{formatDate(customer.createdAt)}</TableCell>
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
                                <Link href={`/admin/customers/${customer.id}`}>
                                  <User className="mr-2 h-4 w-4" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/customers/${customer.id}/edit`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteCustomer(customer.id)}
                                disabled={customer._count.orders > 0}
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
                  Showing {filteredCustomers.length} of {pagination.total} customers
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
} 