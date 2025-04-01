'use client';

import { useState, useEffect, useId } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Order, OrderItem, OrderStatus } from '@prisma/client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

type OrderWithRelations = Order & {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  items: Array<OrderItem & {
    product: {
      id: string;
      name: string;
      images: string[];
      stock: number;
    };
  }>;
};

// Map of status to colors for consistent rendering
const statusColors = {
  [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.PROCESSING]: 'bg-blue-100 text-blue-800',
  [OrderStatus.SHIPPED]: 'bg-purple-100 text-purple-800',
  [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
  [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
};

export default function AdminOrderDetailsPage({ params }: { params: { id: string } }) {
  const formId = useId(); // Stable ID for form elements
  const router = useRouter();
  const [order, setOrder] = useState<OrderWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingCarrier, setTrackingCarrier] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }
      
      const data = await response.json();
      setOrder(data);
      setStatus(data.status);
      setTrackingNumber(data.trackingNumber || '');
      setTrackingCarrier(data.trackingCarrier || '');
      setTrackingUrl(data.trackingUrl || '');
      setNotes(data.notes || '');
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          trackingNumber,
          trackingCarrier,
          trackingUrl,
          notes,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update order');
      }
      
      const data = await response.json();
      setOrder(data.order);
      setSuccess('Order updated successfully');
      
      // Refresh after 2 seconds
      setTimeout(() => {
        setSuccess('');
      }, 2000);
    } catch (error: any) {
      console.error('Error updating order:', error);
      setError(error.message || 'Failed to update order');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner />
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Order not found</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>The order you are looking for does not exist or has been deleted.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => router.push('/admin/orders')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Return to Orders
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Only proceed with actual content rendering once data is loaded
  // This prevents hydration errors from inconsistent rendering
  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Order {order.id.substring(0, 8)}...
            </h2>
            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {formatDate(order.createdAt)}
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || ''}`}>
                  {order.status}
                </span>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {formatCurrency(order.total)}
              </div>
            </div>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              onClick={() => router.push('/admin/orders')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Orders
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>{success}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Customer Information */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Customer Information</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.user?.name || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.user?.email || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{order.user?.phone || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Shipping Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {order.shippingAddress || 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Order Management */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Order Management</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <form onSubmit={handleUpdateOrder}>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor={`${formId}-status`} className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      id={`${formId}-status`}
                      name="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as OrderStatus)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      required
                      suppressHydrationWarning
                    >
                      {Object.values(OrderStatus).map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption.charAt(0) + statusOption.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor={`${formId}-tracking-number`} className="block text-sm font-medium text-gray-700">Tracking Number</label>
                    <input
                      type="text"
                      name="tracking-number"
                      id={`${formId}-tracking-number`}
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      suppressHydrationWarning
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor={`${formId}-tracking-carrier`} className="block text-sm font-medium text-gray-700">Tracking Carrier</label>
                    <input
                      type="text"
                      name="tracking-carrier"
                      id={`${formId}-tracking-carrier`}
                      value={trackingCarrier}
                      onChange={(e) => setTrackingCarrier(e.target.value)}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      suppressHydrationWarning
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor={`${formId}-tracking-url`} className="block text-sm font-medium text-gray-700">Tracking URL</label>
                    <input
                      type="text"
                      name="tracking-url"
                      id={`${formId}-tracking-url`}
                      value={trackingUrl}
                      onChange={(e) => setTrackingUrl(e.target.value)}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      suppressHydrationWarning
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor={`${formId}-notes`} className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                      id={`${formId}-notes`}
                      name="notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      suppressHydrationWarning
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={updating}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${updating ? 'opacity-75 cursor-not-allowed' : ''}`}
                    suppressHydrationWarning
                  >
                    {updating ? 'Updating...' : 'Update Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Order Items</h3>
            <p className="text-sm font-medium text-gray-500">Total: {formatCurrency(order.total)}</p>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <li key={item.id} className="p-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {item.product.images && item.product.images.length > 0 ? (
                        <div className="flex-shrink-0 h-16 w-16 relative">
                          <img
                            className="h-16 w-16 rounded-md object-cover"
                            src={item.product.images[0]}
                            alt={item.product.name}
                          />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                          <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                        <div className="text-sm text-gray-500">
                          <span>Quantity: {item.quantity}</span>
                          {item.color && <span className="ml-2">Color: {item.color}</span>}
                          {item.length && <span className="ml-2">Length: {item.length}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(item.price)} x {item.quantity} = {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 