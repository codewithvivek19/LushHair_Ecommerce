"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Minus, Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/components/cart-provider"
import { getProductById, getRelatedProducts } from "@/lib/api"
import { ProductCard } from "@/components/product-card"

export default function ProductPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedLength, setSelectedLength] = useState<string | null>(null)

  // In a real app, this would fetch from the API
  const product = getProductById(params.id)
  const relatedProducts = getRelatedProducts(params.id)

  if (!product) {
    return (
      <div className="container flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <p className="mt-2 text-muted-foreground">The product you are looking for does not exist.</p>
          <Button asChild className="mt-4">
            <Link href="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!selectedColor) {
      toast({
        title: "Please select a color",
        variant: "destructive",
      })
      return
    }

    if (!selectedLength) {
      toast({
        title: "Please select a length",
        variant: "destructive",
      })
      return
    }

    addToCart({
      ...product,
      quantity,
      selectedOptions: {
        color: selectedColor,
        length: selectedLength,
      },
    })

    toast({
      title: "Added to cart",
      description: `${product.name} (${selectedLength}, ${selectedColor}) x ${quantity}`,
    })
  }

  return (
    <div className="container py-8">
      {/* Breadcrumbs */}
      <div className="mb-6 flex items-center text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="mx-1 h-4 w-4" />
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>
        <ChevronRight className="mx-1 h-4 w-4" />
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Images */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="mt-2 flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < product.rating ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
          </div>

          <div className="mt-4 text-2xl font-bold">${product.price.toFixed(2)}</div>

          <Separator className="my-6" />

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-medium">Color</h3>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`h-10 w-10 rounded-full border-2 ${
                    selectedColor === color.name ? "border-primary" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
            {selectedColor && <p className="mt-2 text-sm">{selectedColor}</p>}
          </div>

          {/* Length Selection */}
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-medium">Length</h3>
            <div className="flex flex-wrap gap-2">
              {product.lengths.map((length) => (
                <button
                  key={length}
                  onClick={() => setSelectedLength(length)}
                  className={`rounded-md border px-3 py-1 text-sm ${
                    selectedLength === length
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-background hover:bg-muted"
                  }`}
                >
                  {length}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-medium">Quantity</h3>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart */}
          <Button size="lg" className="mt-2 w-full" onClick={handleAddToCart} disabled={product.stock <= 0}>
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </Button>

          <Separator className="my-8" />

          {/* Product Information Tabs */}
          <Tabs defaultValue="description">
            <TabsList className="w-full">
              <TabsTrigger value="description" className="flex-1">
                Description
              </TabsTrigger>
              <TabsTrigger value="details" className="flex-1">
                Details
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1">
                Reviews
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <p className="text-muted-foreground">{product.description}</p>
            </TabsContent>
            <TabsContent value="details" className="mt-4">
              <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                <li>100% Remy human hair</li>
                <li>Double drawn for thickness from top to bottom</li>
                <li>Multiple wefts for full head coverage</li>
                <li>Can be colored, cut, and styled</li>
                <li>Lasts up to 12 months with proper care</li>
              </ul>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Jennifer L.</span>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < 5 ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    These extensions are amazing! They blend perfectly with my natural hair and feel so soft.
                  </p>
                </div>
                <Separator />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Ashley T.</span>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < 4 ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Great quality for the price. The color match was perfect and they're easy to apply.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

