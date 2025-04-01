import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function MobileNav() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-xl font-bold">Lush Hair</span>
      </Link>

      <div className="space-y-3">
        <div>
          <Link
            href="/"
            className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Home
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div>
          <Link
            href="/products"
            className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Shop All
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div>
          <div className="px-3 py-2 text-sm font-medium">Categories</div>
          <div className="ml-4 space-y-1">
            <Link
              href="/products?category=clip-in"
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted"
            >
              Clip-In Extensions
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products?category=tape-in"
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted"
            >
              Tape-In Extensions
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products?category=wigs"
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted"
            >
              Wigs & Hairpieces
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products?category=accessories"
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted"
            >
              Accessories
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products?category=care"
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted"
            >
              Hair Care
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div>
          <Link
            href="/about"
            className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            About
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div>
          <Link
            href="/contact"
            className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Contact
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div>
          <Link
            href="/account"
            className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Account
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

