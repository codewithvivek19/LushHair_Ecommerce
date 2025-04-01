import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CheckoutSuccessPage() {
  return (
    <div className="container flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary">
        <Check className="h-12 w-12 text-primary-foreground" />
      </div>

      <h1 className="mb-2 text-3xl font-bold">Thank You for Your Order!</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        Your order has been placed successfully. We've sent a confirmation email with all the details.
      </p>

      <div className="mb-8 w-full max-w-md rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-bold">Order #LH78945</h2>
        <div className="mb-4 space-y-2 text-left">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span>customer@example.com</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total</span>
            <span>$157.30</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Method</span>
            <span>Credit Card</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          You will receive shipping confirmation and tracking number by email once your order ships.
        </p>
      </div>

      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link href="/products">Continue Shopping</Link>
        </Button>
        <Button asChild>
          <Link href="/account/orders">View Orders</Link>
        </Button>
      </div>
    </div>
  )
}

