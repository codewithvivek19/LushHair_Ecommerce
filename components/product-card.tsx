import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: string
  name: string
  price: number
  images: string[]
  category: string
  rating: number
  reviewCount: number
  stock: number
  [key: string]: any
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <Image
            src={
              product.images[0] ||
              "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=800&auto=format&fit=crop"
            }
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {product.stock <= 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Badge variant="destructive" className="text-sm font-medium">
                Out of Stock
              </Badge>
            </div>
          )}
          {product.stock > 0 && product.stock <= 10 && (
            <Badge className="absolute right-2 top-2 bg-yellow-500 text-white">Low Stock</Badge>
          )}
        </Link>
      </div>
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground">{product.category}</div>
        <Link href={`/products/${product.id}`} className="group">
          <h3 className="line-clamp-1 text-lg font-medium group-hover:text-primary">{product.name}</h3>
        </Link>
        <div className="mt-1 flex items-center justify-between">
          <div className="font-semibold">${product.price.toFixed(2)}</div>
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="mr-1 text-yellow-500">★</span>
            {product.rating.toFixed(1)} ({product.reviewCount})
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full gap-2 rounded-full">
          <Link href={`/products/${product.id}`}>
            <ShoppingCart className="h-4 w-4" />
            View Product
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

