import { Separator } from "@/components/ui/separator"

interface OrderItem {
  productId: string
  name: string
  quantity: number
  price: number
  color: string
  length: string
}

interface Order {
  id: string
  customer: {
    name: string
    email: string
    id: string
  }
  date: string
  total: number
  status: string
  items: OrderItem[]
  shipping: {
    address: string
    city: string
    state: string
    zip: string
    country: string
  }
  payment: {
    method: string
    last4?: string
    brand?: string
    email?: string
  }
  tracking?: {
    number: string
    carrier: string
    url: string
  }
}

export function Invoice({ order }: { order: Order }) {
  return (
    <div className="print:text-black">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold">Lush Hair</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">INVOICE</div>
          <div className="text-sm text-muted-foreground">#{order.id}</div>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="text-sm font-medium text-muted-foreground">Bill To</div>
          <div className="mt-1">
            <div className="font-medium">{order.customer.name}</div>
            <div>{order.shipping.address}</div>
            <div>
              {order.shipping.city}, {order.shipping.state} {order.shipping.zip}
            </div>
            <div>{order.shipping.country}</div>
            <div className="mt-1">{order.customer.email}</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-medium text-muted-foreground">Invoice Details</div>
          <div className="mt-1">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium text-muted-foreground">Invoice Number:</div>
              <div className="text-right">{order.id}</div>

              <div className="text-sm font-medium text-muted-foreground">Date Issued:</div>
              <div className="text-right">{new Date(order.date).toLocaleDateString()}</div>

              <div className="text-sm font-medium text-muted-foreground">Payment Method:</div>
              <div className="text-right">
                {order.payment.method}
                {order.payment.last4 && ` ending in ${order.payment.last4}`}
              </div>

              <div className="text-sm font-medium text-muted-foreground">Order Status:</div>
              <div className="text-right">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2 text-sm font-medium text-muted-foreground">Item</th>
              <th className="pb-2 text-right text-sm font-medium text-muted-foreground">Qty</th>
              <th className="pb-2 text-right text-sm font-medium text-muted-foreground">Price</th>
              <th className="pb-2 text-right text-sm font-medium text-muted-foreground">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-3">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.color}, {item.length}
                  </div>
                </td>
                <td className="py-3 text-right">{item.quantity}</td>
                <td className="py-3 text-right">${item.price.toFixed(2)}</td>
                <td className="py-3 text-right">${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <div className="w-60">
          <div className="flex justify-between border-b py-2">
            <div className="text-sm font-medium text-muted-foreground">Subtotal</div>
            <div>${order.total.toFixed(2)}</div>
          </div>
          <div className="flex justify-between border-b py-2">
            <div className="text-sm font-medium text-muted-foreground">Shipping</div>
            <div>$0.00</div>
          </div>
          <div className="flex justify-between border-b py-2">
            <div className="text-sm font-medium text-muted-foreground">Tax</div>
            <div>$0.00</div>
          </div>
          <div className="flex justify-between py-2 font-medium">
            <div>Total</div>
            <div>${order.total.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      <div className="text-center text-sm text-muted-foreground">
        <p>Thank you for your purchase!</p>
        <p className="mt-1">If you have any questions, please contact us at support@lushhair.com</p>
        <p className="mt-4">Lush Hair Inc. • 123 Hair Street, Beauty City, BC 12345 • www.lushhair.com</p>
      </div>
    </div>
  )
}

