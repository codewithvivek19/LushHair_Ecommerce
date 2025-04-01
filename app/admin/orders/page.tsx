"use client"

import { useState, useEffect, useId } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import AdminLayout from "@/components/admin/AdminLayout"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Order, OrderStatus } from "@prisma/client"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

type OrderWithRelations = Order & {
  user: {
    id: string
    name: string
    email: string
  }
  items: Array<{
    id: string
    quantity: number
    price: number
    product: {
      id: string
      name: string
    }
  }>
}

type OrdersResponse = {
  orders: OrderWithRelations[]
  pagination: {
    total: number
    pages: number
    page: number
    limit: number
  }
}

// Define status colors outside of the component to avoid hydration issues
const statusColors = {
  [OrderStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [OrderStatus.PROCESSING]: "bg-blue-100 text-blue-800",
  [OrderStatus.SHIPPED]: "bg-purple-100 text-purple-800",
  [OrderStatus.DELIVERED]: "bg-green-100 text-green-800",
  [OrderStatus.CANCELLED]: "bg-red-100 text-red-800",
}

export default function AdminOrdersPage() {
  const formId = useId()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orders, setOrders] = useState<OrderWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    page: 1,
    limit: 10,
  })
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [initialized, setInitialized] = useState(false)

  // Get current page from URL or default to 1
  const currentPage = searchParams ? parseInt(searchParams.get("page") || "1") : 1
  
  useEffect(() => {
    setInitialized(true)
    fetchOrders()
  }, [currentPage, statusFilter])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      let url = `/api/admin/orders?page=${currentPage}&limit=${pagination.limit}`
      
      if (statusFilter) {
        url += `&status=${statusFilter}`
      }
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }
      
      const data: OrdersResponse = await response.json()
      setOrders(data.orders)
      setPagination(data.pagination)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
    router.push("/admin/orders?page=1")
  }

  const handlePageChange = (page: number) => {
    router.push(`/admin/orders?page=${page}${statusFilter ? `&status=${statusFilter}` : ""}`)
  }

  // Prevent rendering until client-side code has initialized
  if (!initialized) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all orders in the system, including customer information and status.
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div>
            <label htmlFor={`${formId}-status`} className="mr-2 text-sm font-medium text-gray-700">Filter by status:</label>
            <select
              id={`${formId}-status`}
              value={statusFilter}
              onChange={handleStatusChange}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              suppressHydrationWarning
            >
              <option value="">All Statuses</option>
              {Object.values(OrderStatus).map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="mt-8 flex flex-col">
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            Order ID
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Customer
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Date
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Total
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Status
                          </th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {orders.length > 0 ? (
                          orders.map((order) => (
                            <tr key={order.id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                {order.id.substring(0, 8)}...
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {order.user?.name || "N/A"}
                                <div className="text-xs text-gray-400">{order.user?.email}</div>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {formatDate(order.createdAt)}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {formatCurrency(order.total)}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <Link 
                                  href={`/admin/orders/${order.id}`}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  View<span className="sr-only">, {order.id}</span>
                                </Link>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center py-4 text-sm text-gray-500">
                              No orders found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                    }`}
                    suppressHydrationWarning
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(Math.min(pagination.pages, currentPage + 1))}
                    disabled={currentPage === pagination.pages}
                    className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                      currentPage === pagination.pages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                    }`}
                    suppressHydrationWarning
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * pagination.limit + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * pagination.limit, pagination.total)}
                      </span>{' '}
                      of <span className="font-medium">{pagination.total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 ${
                          currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                        }`}
                        suppressHydrationWarning
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {/* Generate page buttons - simplified to reduce hydration issues */}
                      {pagination.pages <= 7 ? (
                        // Show all pages if there are 7 or fewer
                        Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`relative inline-flex items-center border ${
                              page === currentPage
                                ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                                : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                            } px-4 py-2 text-sm font-medium`}
                            suppressHydrationWarning
                          >
                            {page}
                          </button>
                        ))
                      ) : (
                        // More complex pagination with ellipsis
                        <>
                          {/* First page */}
                          <button
                            onClick={() => handlePageChange(1)}
                            className={`relative inline-flex items-center border ${
                              1 === currentPage
                                ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                                : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                            } px-4 py-2 text-sm font-medium`}
                            suppressHydrationWarning
                          >
                            1
                          </button>
                          
                          {/* Left ellipsis */}
                          {currentPage > 3 && (
                            <span className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                              ...
                            </span>
                          )}
                          
                          {/* Pages around current page */}
                          {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                            .filter(page => 
                              page !== 1 && 
                              page !== pagination.pages && 
                              (page >= currentPage - 1 && page <= currentPage + 1)
                            )
                            .map(page => (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`relative inline-flex items-center border ${
                                  page === currentPage
                                    ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                                    : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                                } px-4 py-2 text-sm font-medium`}
                                suppressHydrationWarning
                              >
                                {page}
                              </button>
                            ))
                          }
                          
                          {/* Right ellipsis */}
                          {currentPage < pagination.pages - 2 && (
                            <span className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                              ...
                            </span>
                          )}
                          
                          {/* Last page */}
                          {pagination.pages > 1 && (
                            <button
                              onClick={() => handlePageChange(pagination.pages)}
                              className={`relative inline-flex items-center border ${
                                pagination.pages === currentPage
                                  ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                                  : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                              } px-4 py-2 text-sm font-medium`}
                              suppressHydrationWarning
                            >
                              {pagination.pages}
                            </button>
                          )}
                        </>
                      )}
                      
                      <button
                        onClick={() => handlePageChange(Math.min(pagination.pages, currentPage + 1))}
                        disabled={currentPage === pagination.pages}
                        className={`relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 ${
                          currentPage === pagination.pages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                        }`}
                        suppressHydrationWarning
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  )
}

