"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  images: string[]
  quantity: number
  selectedOptions?: {
    color: string
    length: string
  }
  [key: string]: any
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  updateQuantity: (item: CartItem, quantity: number) => void
  removeFromCart: (item: CartItem) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      // Check if the item already exists in the cart with the same options
      const existingItemIndex = prevCart.findIndex(
        (cartItem) =>
          cartItem.id === item.id &&
          cartItem.selectedOptions?.color === item.selectedOptions?.color &&
          cartItem.selectedOptions?.length === item.selectedOptions?.length,
      )

      if (existingItemIndex !== -1) {
        // If it exists, update the quantity
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].quantity += item.quantity
        return updatedCart
      } else {
        // If it doesn't exist, add it to the cart
        return [...prevCart, item]
      }
    })
  }

  const updateQuantity = (item: CartItem, quantity: number) => {
    setCart((prevCart) => {
      return prevCart.map((cartItem) => {
        if (
          cartItem.id === item.id &&
          cartItem.selectedOptions?.color === item.selectedOptions?.color &&
          cartItem.selectedOptions?.length === item.selectedOptions?.length
        ) {
          return { ...cartItem, quantity }
        }
        return cartItem
      })
    })
  }

  const removeFromCart = (item: CartItem) => {
    setCart((prevCart) => {
      return prevCart.filter(
        (cartItem) =>
          !(
            cartItem.id === item.id &&
            cartItem.selectedOptions?.color === item.selectedOptions?.color &&
            cartItem.selectedOptions?.length === item.selectedOptions?.length
          ),
      )
    })
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

