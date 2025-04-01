// Mock data for the ecommerce store
// In a real app, this would be replaced with API calls to Supabase

// Products
const products = [
  {
    id: "p1",
    name: "Silky Straight Clip-In Extensions",
    description:
      "Premium quality clip-in hair extensions made from 100% Remy human hair. These extensions blend seamlessly with your natural hair and can be styled, cut, and colored just like your own hair.",
    price: 129.99,
    images: ["https://images.unsplash.com/photo-1595499280981-344efa0c3fd1?q=80&w=800&auto=format&fit=crop"],
    category: "Clip-In Extensions",
    featured: true,
    rating: 4.8,
    reviewCount: 124,
    stock: 50,
    colors: [
      { name: "Jet Black", value: "#000000" },
      { name: "Dark Brown", value: "#3b2314" },
      { name: "Medium Brown", value: "#6a4e42" },
      { name: "Light Brown", value: "#a67c52" },
      { name: "Blonde", value: "#e6be8a" },
    ],
    lengths: ["14 inches", "16 inches", "18 inches", "20 inches", "24 inches"],
  },
  {
    id: "p2",
    name: "Wavy Tape-In Extensions",
    description:
      "These premium tape-in extensions are made from 100% Remy human hair with a natural wave pattern. They're lightweight, comfortable, and virtually undetectable.",
    price: 149.99,
    images: ["https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=800&auto=format&fit=crop"],
    category: "Tape-In Extensions",
    featured: true,
    rating: 4.7,
    reviewCount: 98,
    stock: 35,
    colors: [
      { name: "Jet Black", value: "#000000" },
      { name: "Dark Brown", value: "#3b2314" },
      { name: "Medium Brown", value: "#6a4e42" },
      { name: "Light Brown", value: "#a67c52" },
      { name: "Blonde", value: "#e6be8a" },
    ],
    lengths: ["14 inches", "16 inches", "18 inches", "20 inches"],
  },
  {
    id: "p3",
    name: "Full Lace Wig - Natural Curl",
    description:
      "This full lace wig features a natural curl pattern and is made from 100% human hair. The lace is virtually undetectable and provides a natural-looking hairline.",
    price: 299.99,
    images: ["https://images.unsplash.com/photo-1595514535215-8a5b0fad470f?q=80&w=800&auto=format&fit=crop"],
    category: "Wigs",
    featured: true,
    rating: 4.9,
    reviewCount: 76,
    stock: 15,
    colors: [
      { name: "Jet Black", value: "#000000" },
      { name: "Dark Brown", value: "#3b2314" },
      { name: "Medium Brown", value: "#6a4e42" },
    ],
    lengths: ["16 inches", "18 inches", "20 inches"],
  },
  {
    id: "p4",
    name: "Ombre Clip-In Extensions",
    description:
      "These ombre clip-in extensions transition from a darker root to lighter ends for a trendy, dimensional look. Made from 100% Remy human hair.",
    price: 159.99,
    images: ["https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=800&auto=format&fit=crop"],
    category: "Clip-In Extensions",
    featured: true,
    rating: 4.6,
    reviewCount: 87,
    stock: 40,
    colors: [
      { name: "Black to Brown", value: "#000000" },
      { name: "Brown to Blonde", value: "#6a4e42" },
      { name: "Dark Brown to Light Brown", value: "#3b2314" },
    ],
    lengths: ["16 inches", "18 inches", "20 inches", "24 inches"],
  },
  {
    id: "p5",
    name: "Keratin Bond Extensions",
    description:
      "These keratin bond extensions are applied using a hot fusion method for a long-lasting, secure attachment. Made from 100% Remy human hair.",
    price: 189.99,
    images: ["https://images.unsplash.com/photo-1580421383874-7e83a1fe9e52?q=80&w=800&auto=format&fit=crop"],
    category: "Keratin Extensions",
    featured: false,
    rating: 4.5,
    reviewCount: 62,
    stock: 25,
    colors: [
      { name: "Jet Black", value: "#000000" },
      { name: "Dark Brown", value: "#3b2314" },
      { name: "Medium Brown", value: "#6a4e42" },
      { name: "Light Brown", value: "#a67c52" },
      { name: "Blonde", value: "#e6be8a" },
    ],
    lengths: ["16 inches", "18 inches", "20 inches", "24 inches"],
  },
  {
    id: "p6",
    name: "Halo Hair Extensions",
    description:
      "These innovative halo extensions are easy to apply and remove with no clips, glue, or heat required. Made from 100% Remy human hair.",
    price: 169.99,
    images: ["https://images.unsplash.com/photo-1595499280981-344efa0c3fd1?q=80&w=800&auto=format&fit=crop"],
    category: "Halo Extensions",
    featured: false,
    rating: 4.7,
    reviewCount: 54,
    stock: 30,
    colors: [
      { name: "Jet Black", value: "#000000" },
      { name: "Dark Brown", value: "#3b2314" },
      { name: "Medium Brown", value: "#6a4e42" },
      { name: "Light Brown", value: "#a67c52" },
      { name: "Blonde", value: "#e6be8a" },
    ],
    lengths: ["16 inches", "18 inches", "20 inches", "24 inches"],
  },
  {
    id: "p7",
    name: "Curly Clip-In Extensions",
    description:
      "These curly clip-in extensions add volume and texture to your natural hair. Made from 100% Remy human hair that can be styled and colored.",
    price: 139.99,
    images: ["https://images.unsplash.com/photo-1580421383874-7e83a1fe9e52?q=80&w=800&auto=format&fit=crop"],
    category: "Clip-In Extensions",
    featured: false,
    rating: 4.6,
    reviewCount: 48,
    stock: 45,
    colors: [
      { name: "Jet Black", value: "#000000" },
      { name: "Dark Brown", value: "#3b2314" },
      { name: "Medium Brown", value: "#6a4e42" },
      { name: "Light Brown", value: "#a67c52" },
    ],
    lengths: ["14 inches", "16 inches", "18 inches", "20 inches"],
  },
  {
    id: "p8",
    name: "Lace Front Wig - Straight",
    description:
      "This lace front wig features a natural-looking hairline and straight, sleek hair. Made from 100% human hair that can be styled and colored.",
    price: 249.99,
    images: ["https://images.unsplash.com/photo-1595514535215-8a5b0fad470f?q=80&w=800&auto=format&fit=crop"],
    category: "Wigs",
    featured: false,
    rating: 4.8,
    reviewCount: 39,
    stock: 20,
    colors: [
      { name: "Jet Black", value: "#000000" },
      { name: "Dark Brown", value: "#3b2314" },
      { name: "Medium Brown", value: "#6a4e42" },
      { name: "Light Brown", value: "#a67c52" },
      { name: "Blonde", value: "#e6be8a" },
    ],
    lengths: ["16 inches", "18 inches", "20 inches", "24 inches"],
  },
]

// Orders
const orders = [
  {
    id: "ORD-7893",
    customer: {
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      id: "cust-001",
    },
    date: "2023-06-12",
    total: 129.99,
    status: "delivered",
    items: [
      {
        productId: "p1",
        quantity: 1,
        price: 129.99,
        name: "Silky Straight Clip-In Extensions",
        color: "Dark Brown",
        length: "18 inches",
      },
    ],
    shipping: {
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
    },
    payment: {
      method: "Credit Card",
      last4: "4242",
      brand: "Visa",
    },
    tracking: {
      number: "TRK123456789",
      carrier: "UPS",
      url: "https://www.ups.com/track?tracknum=TRK123456789",
    },
  },
  {
    id: "ORD-7892",
    customer: {
      name: "Michael Chen",
      email: "michael.c@example.com",
      id: "cust-002",
    },
    date: "2023-06-12",
    total: 329.98,
    status: "shipped",
    items: [
      {
        productId: "p7",
        quantity: 1,
        price: 139.99,
        name: "Curly Clip-In Extensions",
        color: "Medium Brown",
        length: "16 inches",
      },
      {
        productId: "p5",
        quantity: 1,
        price: 189.99,
        name: "Keratin Bond Extensions",
        color: "Dark Brown",
        length: "20 inches",
      },
    ],
    shipping: {
      address: "456 Oak Ave",
      city: "San Francisco",
      state: "CA",
      zip: "94107",
      country: "United States",
    },
    payment: {
      method: "PayPal",
      email: "michael.c@example.com",
    },
    tracking: {
      number: "TRK987654321",
      carrier: "FedEx",
      url: "https://www.fedex.com/track?tracknum=TRK987654321",
    },
  },
  {
    id: "ORD-7891",
    customer: {
      name: "Jessica Williams",
      email: "jessica.w@example.com",
      id: "cust-003",
    },
    date: "2023-06-11",
    total: 149.99,
    status: "processing",
    items: [
      {
        productId: "p2",
        quantity: 1,
        price: 149.99,
        name: "Wavy Tape-In Extensions",
        color: "Blonde",
        length: "18 inches",
      },
    ],
    shipping: {
      address: "789 Pine St",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      country: "United States",
    },
    payment: {
      method: "Credit Card",
      last4: "1234",
      brand: "Mastercard",
    },
  },
  {
    id: "ORD-7890",
    customer: {
      name: "David Rodriguez",
      email: "david.r@example.com",
      id: "cust-004",
    },
    date: "2023-06-11",
    total: 159.99,
    status: "pending",
    items: [
      {
        productId: "p4",
        quantity: 1,
        price: 159.99,
        name: "Ombre Clip-In Extensions",
        color: "Brown to Blonde",
        length: "20 inches",
      },
    ],
    shipping: {
      address: "321 Elm St",
      city: "Miami",
      state: "FL",
      zip: "33101",
      country: "United States",
    },
    payment: {
      method: "Credit Card",
      last4: "5678",
      brand: "Discover",
    },
  },
  {
    id: "ORD-7889",
    customer: {
      name: "Emily Taylor",
      email: "emily.t@example.com",
      id: "cust-005",
    },
    date: "2023-06-10",
    total: 299.99,
    status: "delivered",
    items: [
      {
        productId: "p3",
        quantity: 1,
        price: 299.99,
        name: "Full Lace Wig - Natural Curl",
        color: "Jet Black",
        length: "18 inches",
      },
    ],
    shipping: {
      address: "654 Maple Ave",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "United States",
    },
    payment: {
      method: "Credit Card",
      last4: "9012",
      brand: "Amex",
    },
    tracking: {
      number: "TRK456789123",
      carrier: "USPS",
      url: "https://tools.usps.com/go/TrackConfirmAction?tLabels=TRK456789123",
    },
  },
]

// Users
const users = [
  {
    id: "cust-001",
    name: "Sarah Johnson",
    email: "user@example.com",
    phone: "212-555-1234",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
    },
    orders: ["ORD-7893"],
  },
  {
    id: "admin-001",
    name: "Admin User",
    email: "admin@example.com",
    phone: "800-555-0000",
    address: {
      street: "1 Admin Plaza",
      city: "San Francisco",
      state: "CA",
      zip: "94107",
      country: "United States",
    },
    orders: [],
  },
  {
    id: "cust-002",
    name: "Michael Chen",
    email: "michael.c@example.com",
    phone: "415-555-5678",
    address: {
      street: "456 Oak Ave",
      city: "San Francisco",
      state: "CA",
      zip: "94107",
      country: "United States",
    },
    orders: ["ORD-7892"],
  },
  {
    id: "cust-003",
    name: "Jessica Williams",
    email: "jessica.w@example.com",
    phone: "312-555-9012",
    address: {
      street: "789 Pine St",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      country: "United States",
    },
    orders: ["ORD-7891"],
  },
  {
    id: "cust-004",
    name: "David Rodriguez",
    email: "david.r@example.com",
    phone: "305-555-3456",
    address: {
      street: "321 Elm St",
      city: "Miami",
      state: "FL",
      zip: "33101",
      country: "United States",
    },
    orders: ["ORD-7890"],
  },
  {
    id: "cust-005",
    name: "Emily Taylor",
    email: "emily.t@example.com",
    phone: "213-555-7890",
    address: {
      street: "654 Maple Ave",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "United States",
    },
    orders: ["ORD-7889"],
  },
]

// API functions
export function getAllProducts(category?: string) {
  if (category) {
    return products.filter((product) => product.category.toLowerCase().includes(category.toLowerCase()))
  }
  return products
}

export function getFeaturedProducts() {
  return products.filter((product) => product.featured)
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id)
}

export function getRelatedProducts(id: string) {
  const product = getProductById(id)
  if (!product) return []

  return products.filter((p) => p.id !== id && p.category === product.category).slice(0, 4)
}

export function getOrders() {
  return orders
}

export function getOrderById(id: string) {
  return orders.find((order) => order.id === id)
}

export function getOrdersByCustomerId(customerId: string) {
  return orders.filter((order) => order.customer.id === customerId)
}

export function getUserById(id: string) {
  return users.find((user) => user.id === id)
}

export function getUserByEmail(email: string) {
  return users.find((user) => user.email === email)
}

