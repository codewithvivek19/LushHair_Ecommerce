"use client"

import { useState, useEffect, useId } from 'react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Order, OrderStatus } from '@prisma/client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

type OrderWithRelations = Order & {
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
    };
  }>;
};

type OrdersResponse = {
  orders: OrderWithRelations[];
  pagination?: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
};

// Define status colors outside of component to avoid hydration issues
const statusColors = {
  [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.PROCESSING]: 'bg-blue-100 text-blue-800',
  [OrderStatus.SHIPPED]: 'bg-purple-100 text-purple-800',
  [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
  [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const formId = useId();
  const [orders, setOrders] = useState<OrderWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setInitialized(true);
    async function fetchOrders() {
      try {
        const response = await fetch('/api/orders');
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data: OrdersResponse = await response.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Error loading orders');
      } finally {
        setLoading(false);
      }
    }
    
    fetchOrders();
  }, []);

  // Prevent rendering until client-side code has initialized
  if (!initialized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-3xl font-bold">My Orders</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
            suppressHydrationWarning
          >
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold">No Orders Yet</h2>
          <p className="mb-6 text-muted-foreground">You haven't placed any orders yet.</p>
          <Link
            href="/products"
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Order</th>
                <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
                <th scope="col" className="relative px-4 py-3.5">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
                    #{order.id.substring(0, 8)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                    <Link 
                      href={`/account/orders/${order.id}`} 
                      className="text-primary hover:text-primary/80"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

