import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getFeaturedProducts } from "@/lib/api"
import { ProductCard } from "@/components/product-card"
import { ArrowRight, Check, Star, Shield } from "lucide-react"

export default function Home() {
  const featuredProducts = getFeaturedProducts()

  return (
    <div className="flex flex-col gap-12 pb-8">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=2274&auto=format&fit=crop"
          alt="Beautiful hair extensions"
          width={2000}
          height={1200}
          className="absolute inset-0 h-full w-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Transform Your Look Today
          </h1>
          <p className="mb-8 max-w-lg text-lg text-white/90">
            Premium quality, ethically sourced hair extensions that blend seamlessly with your natural hair.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full bg-white/10 px-8 text-white hover:bg-white/20"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Shop by Category</h2>
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/products">
              View All Categories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CategoryCard
            title="Clip-In Extensions"
            description="Easy to apply and remove"
            image="https://images.unsplash.com/photo-1595499280981-344efa0c3fd1?q=80&w=2370&auto=format&fit=crop"
            href="/products?category=clip-in"
          />
          <CategoryCard
            title="Tape-In Extensions"
            description="Seamless and natural look"
            image="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=2369&auto=format&fit=crop"
            href="/products?category=tape-in"
          />
          <CategoryCard
            title="Wigs & Hairpieces"
            description="Full coverage solutions"
            image="https://images.unsplash.com/photo-1595514535215-8a5b0fad470f?q=80&w=2370&auto=format&fit=crop"
            href="/products?category=wigs"
          />
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button asChild variant="outline">
              <Link href="/products">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Why Choose Lush Hair</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            We're committed to providing the highest quality hair extensions with exceptional customer service.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <BenefitCard
            title="100% Remy Human Hair"
            description="Our extensions are made from the finest quality human hair, ensuring a natural look and feel."
          />
          <BenefitCard
            title="Ethically Sourced"
            description="We ensure all our hair is ethically sourced and that donors are fairly compensated."
          />
          <BenefitCard
            title="Expert Color Matching"
            description="Our color specialists ensure your extensions blend seamlessly with your natural hair."
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-r from-primary/5 to-primary/10 py-16">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">What Our Customers Say</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <TestimonialCard
              quote="The quality of these extensions is amazing. They blend perfectly with my natural hair!"
              author="Sarah J."
              rating={5}
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2187&auto=format&fit=crop"
            />
            <TestimonialCard
              quote="I've tried many brands, but Lush Hair extensions last longer and look more natural than any others."
              author="Michelle T."
              rating={5}
              image="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop"
            />
            <TestimonialCard
              quote="The customer service is exceptional. They helped me find the perfect match for my hair color."
              author="Jessica R."
              rating={4}
              image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop"
            />
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="container py-16">
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-3xl font-bold">Follow Us on Instagram</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Tag your photos with #LushHairExtensions for a chance to be featured
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Link
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-md"
              style={{ position: 'relative' }}
            >
              <Image
                src={`https://images.unsplash.com/photo-${1580618672591 + i}-eb180b1a973f?q=80&w=800&auto=format&fit=crop`}
                alt={`Instagram post ${i}`}
                width={300}
                height={300}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20"></div>
            </Link>
          ))}
        </div>
      </section>

      {/* Admin Access Section */}
      <AdminAccessSection />
    </div>
  )
}

function CategoryCard({
  title,
  description,
  image,
  href,
}: {
  title: string
  description: string
  image: string
  href: string
}) {
  return (
    <Card className="group overflow-hidden">
      <div className="relative h-64" style={{ position: 'relative' }}>
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 p-6 text-white">
          <h3 className="mb-1 text-xl font-semibold">{title}</h3>
          <p className="mb-4 text-white/80">{description}</p>
          <Button
            asChild
            variant="outline"
            className="border-white bg-transparent text-white hover:bg-white hover:text-black"
          >
            <Link href={href}>Shop Now</Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}

function BenefitCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Check className="h-8 w-8" />
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

function TestimonialCard({
  quote,
  author,
  rating,
  image,
}: {
  quote: string
  author: string
  rating: number
  image: string
}) {
  return (
    <Card className="h-full overflow-hidden">
      <CardContent className="flex h-full flex-col p-6">
        <div className="mb-4 flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`}
            />
          ))}
        </div>
        <div className="mb-6 flex-1 text-lg italic">"{quote}"</div>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-full">
            <Image
              src={image || "/placeholder.svg"}
              alt={author}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="font-medium">— {author}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function AdminAccessSection() {
  return (
    <section className="container py-8 border-t">
      <div className="flex flex-col items-center text-center max-w-md mx-auto">
        <h3 className="text-xl font-semibold mb-4">Admin Access</h3>
        <p className="text-muted-foreground mb-6">
          Quick access to the admin dashboard for store management.
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link href="/admin/dashboard">
            <Shield className="h-5 w-5" />
            <span>Access Admin Dashboard</span>
          </Link>
        </Button>
      </div>
    </section>
  )
}

