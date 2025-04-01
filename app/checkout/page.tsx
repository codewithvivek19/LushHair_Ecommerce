"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/components/cart-provider"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { cart, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subtotal = cart.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)

  const shipping = subtotal > 0 ? 10 : 0
  const tax = subtotal * 0.07
  const total = subtotal + shipping + tax

  if (cart.length === 0) {
    return (
      <div className="container flex h-[70vh] flex-col items-center justify-center py-8">
        <h1 className="mb-4 text-2xl font-bold">Your Cart is Empty</h1>
        <p className="mb-8 text-center text-muted-foreground">
          You need to add items to your cart before checking out.
        </p>
        <Button asChild>
          <Link href="/products">Shop Now</Link>
        </Button>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Order placed successfully!",
      description: "Thank you for your purchase. Your order has been received.",
    })

    clearCart()
    router.push("/checkout/success")
    setIsSubmitting(false)
  }

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="mx-1 h-4 w-4" />
        <Link href="/cart" className="hover:text-foreground">
          Cart
        </Link>
        <ChevronRight className="mx-1 h-4 w-4" />
        <span className="text-foreground">Checkout</span>
      </div>

      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Contact Information */}
              <div>
                <h2 className="mb-4 text-xl font-bold">Contact Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" required />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Shipping Address */}
              <div>
                <h2 className="mb-4 text-xl font-bold">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input id="address" required />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" required />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input id="state" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" required />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" defaultValue="United States" required />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Payment Method */}
              <div>
                <h2 className="mb-4 text-xl font-bold">Payment Method</h2>
                <Tabs defaultValue="card">
                  <TabsList className="w-full">
                    <TabsTrigger value="card" className="flex-1">
                      Credit Card
                    </TabsTrigger>
                    <TabsTrigger value="paypal" className="flex-1">
                      PayPal
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="card" className="mt-4 space-y-4">
                    <div>
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" required />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" required />
                      </div>
                      <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" required />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="paypal" className="mt-4">
                    <p className="text-muted-foreground">
                      You will be redirected to PayPal to complete your purchase securely.
                    </p>
                  </TabsContent>
                </Tabs>
              </div>

              <Separator />

              {/* Shipping Method */}
              <div>
                <h2 className="mb-4 text-xl font-bold">Shipping Method</h2>
                <RadioGroup defaultValue="standard">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="flex-1">
                      <div className="flex justify-between">
                        <span>Standard Shipping (3-5 business days)</span>
                        <span>$10.00</span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express" className="flex-1">
                      <div className="flex justify-between">
                        <span>Express Shipping (1-2 business days)</span>
                        <span>$25.00</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="lg:hidden">
                <OrderSummary cart={cart} subtotal={subtotal} shipping={shipping} tax={tax} total={total} />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : `Place Order • $${total.toFixed(2)}`}
              </Button>
            </div>
          </form>
        </div>

        <div className="hidden lg:block">
          <OrderSummary cart={cart} subtotal={subtotal} shipping={shipping} tax={tax} total={total} />
        </div>
      </div>
    </div>
  )
}

function OrderSummary({
  cart,
  subtotal,
  shipping,
  tax,
  total,
}: {
  cart: any[]
  subtotal: number
  shipping: number
  tax: number
  total: number
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="mb-4 text-xl font-bold">Order Summary</h2>

        <div className="mb-4 max-h-[300px] overflow-auto">
          {cart.map((item) => (
            <div
              key={`${item.id}-${item.selectedOptions?.color}-${item.selectedOptions?.length}`}
              className="mb-3 flex justify-between"
            >
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-muted-foreground">
                  {item.selectedOptions?.length}, {item.selectedOptions?.color} × {item.quantity}
                </div>
              </div>
              <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <Separator className="mb-4" />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

