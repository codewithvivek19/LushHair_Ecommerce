import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Lush Hair</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Premium quality hair extensions for every style and occasion.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" asChild>
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://instagram.com" target="_blank" rel="noreferrer">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://twitter.com" target="_blank" rel="noreferrer">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </a>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products?category=clip-in" className="text-muted-foreground hover:text-foreground">
                  Clip-In Extensions
                </Link>
              </li>
              <li>
                <Link href="/products?category=tape-in" className="text-muted-foreground hover:text-foreground">
                  Tape-In Extensions
                </Link>
              </li>
              <li>
                <Link href="/products?category=wigs" className="text-muted-foreground hover:text-foreground">
                  Wigs & Hairpieces
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="text-muted-foreground hover:text-foreground">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/products?category=care" className="text-muted-foreground hover:text-foreground">
                  Hair Care
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-muted-foreground hover:text-foreground">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Newsletter</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Subscribe to our newsletter for the latest products and offers.
            </p>
            <div className="flex gap-2">
              <Input placeholder="Your email" className="h-9" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          <div className="mb-4 flex flex-wrap justify-center gap-4">
            <Link href="/terms" className="hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/shipping" className="hover:text-foreground">
              Shipping Policy
            </Link>
            <Link href="/returns" className="hover:text-foreground">
              Returns & Refunds
            </Link>
            <Link href="/faq" className="hover:text-foreground">
              FAQ
            </Link>
          </div>
          <p>&copy; {new Date().getFullYear()} Lush Hair. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

