"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart-provider"

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()
  const [couponCode, setCouponCode] = useState("")

  const subtotal = cart.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)

  const shipping = subtotal > 0 ? 10 : 0
  const discount = couponCode === "LUSH20" ? subtotal * 0.2 : 0
  const total = subtotal + shipping - discount

  if (cart.length === 0) {
    return (
      <div className="container flex h-[70vh] flex-col items-center justify-center py-8">
        <h1 className="mb-4 text-2xl font-bold">Your Cart is Empty</h1>
        <p className="mb-8 text-center text-muted-foreground">
          Looks like you haven't added any products to your cart yet.
        </p>
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border">
            <div className="grid grid-cols-6 gap-4 p-4 font-medium text-muted-foreground">
              <div className="col-span-3">Product</div>
              <div className="text-center">Price</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Total</div>
            </div>
            <Separator />

            {cart.map((item) => (
              <div key={`${item.id}-${item.selectedOptions?.color}-${item.selectedOptions?.length}`}>
                <div className="grid grid-cols-6 gap-4 p-4">
                  <div className="col-span-3 flex gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-md bg-muted">
                      <Image src={item.images[0] || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        <Link href={`/products/${item.id}`} className="hover:underline">
                          {item.name}
                        </Link>
                      </h3>
                      {item.selectedOptions && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.selectedOptions.length}, {item.selectedOptions.color}
                        </p>
                      )}
                      <button
                        onClick={() => removeFromCart(item)}
                        className="mt-2 flex items-center text-sm text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">${item.price.toFixed(2)}</div>
                  <div className="flex items-center justify-center">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item, Number.parseInt(e.target.value))}
                      className="w-16 text-center"
                    />
                  </div>
                  <div className="flex items-center justify-end font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
                <Separator />
              </div>
            ))}

            <div className="flex justify-between p-4">
              <Button variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
              <Button asChild variant="outline">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-bold">Order Summary</h2>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-4">
                <label htmlFor="coupon" className="mb-2 block text-sm font-medium">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <Input
                    id="coupon"
                    placeholder="Enter coupon"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button variant="outline" onClick={() => {}}>
                    Apply
                  </Button>
                </div>
                {couponCode === "LUSH20" && <p className="mt-1 text-sm text-green-600">20% discount applied!</p>}
              </div>

              <Button asChild className="w-full">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

