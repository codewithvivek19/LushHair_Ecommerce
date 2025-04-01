"use client"

import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCart } from "@/components/cart-provider"
import { formatCurrency } from "@/lib/utils"
import { useState, useEffect } from "react"

export function CartSheet() {
  const { cart, updateQuantity, removeFromCart } = useCart()
  const [mounted, setMounted] = useState(false)

  // Only render the cart when mounted to prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  const subtotal = cart.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)

  // If not mounted yet, return a placeholder with the same structure
  if (!mounted) {
    return (
      <div className="flex h-full flex-col">
        <SheetHeader className="px-1">
          <SheetTitle>Shopping Cart (0)</SheetTitle>
        </SheetHeader>
        <div className="flex-1"></div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <SheetHeader className="px-1">
        <SheetTitle>Shopping Cart ({cart.length})</SheetTitle>
      </SheetHeader>

      {cart.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center space-y-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <X className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground">Add items to your cart to see them here.</p>
          </div>
          <Button asChild suppressHydrationWarning>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-1 px-1">
            <div className="space-y-4 py-4">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.selectedOptions?.color}-${item.selectedOptions?.length}`}
                  className="flex gap-4"
                >
                  <div className="relative h-20 w-20 overflow-hidden rounded-md bg-muted">
                    <Image src={item.images[0] || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">
                          <Link href={`/products/${item.id}`} className="hover:underline">
                            {item.name}
                          </Link>
                        </h4>
                        {item.selectedOptions && (
                          <p className="text-sm text-muted-foreground">
                            {item.selectedOptions.length}, {item.selectedOptions.color}
                          </p>
                        )}
                      </div>
                      <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                          suppressHydrationWarning
                        >
                          <Minus className="h-3 w-3" />
                          <span className="sr-only">Decrease quantity</span>
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item, item.quantity + 1)}
                          suppressHydrationWarning
                        >
                          <Plus className="h-3 w-3" />
                          <span className="sr-only">Increase quantity</span>
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => removeFromCart(item)}
                        suppressHydrationWarning
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-1">
            <Separator className="my-4" />
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="grid gap-2">
                <Button asChild size="sm" suppressHydrationWarning>
                  <Link href="/checkout">Checkout</Link>
                </Button>
                <Button asChild variant="outline" size="sm" suppressHydrationWarning>
                  <Link href="/cart">View Cart</Link>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

