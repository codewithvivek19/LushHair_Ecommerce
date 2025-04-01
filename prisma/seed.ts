import { PrismaClient, UserRole } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Clean up existing data (be careful with this in production)
  await prisma.orderItem.deleteMany({})
  await prisma.order.deleteMany({})
  await prisma.productLength.deleteMany({})
  await prisma.productColor.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.user.deleteMany({})

  // Create users with consistent salt and hash
  const SALT_ROUNDS = 10
  const passwordHash = await bcrypt.hash('password123', SALT_ROUNDS)
  const adminPasswordHash = await bcrypt.hash('admin123', SALT_ROUNDS)

  // Log the created password hashes for debugging
  console.log('User password hash:', passwordHash)
  console.log('Admin password hash:', adminPasswordHash)

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPasswordHash,
      role: UserRole.ADMIN,
      phone: '800-555-0000',
      street: '1 Admin Plaza',
      city: 'San Francisco',
      state: 'CA',
      zip: '94107',
      country: 'United States',
    },
  })

  const user = await prisma.user.create({
    data: {
      name: 'Sarah Johnson',
      email: 'user@example.com',
      password: passwordHash,
      role: UserRole.USER,
      phone: '212-555-1234',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
    },
  })

  console.log('Users created:', {
    admin: { id: adminUser.id, email: adminUser.email },
    user: { id: user.id, email: user.email }
  })

  // Create products
  const products = [
    {
      name: 'Silky Straight Clip-In Extensions',
      description:
        'Premium quality clip-in hair extensions made from 100% Remy human hair. These extensions blend seamlessly with your natural hair and can be styled, cut, and colored just like your own hair.',
      price: 129.99,
      images: ['https://images.unsplash.com/photo-1595499280981-344efa0c3fd1?q=80&w=800&auto=format&fit=crop'],
      category: 'Clip-In Extensions',
      featured: true,
      rating: 4.8,
      reviewCount: 124,
      stock: 50,
      colors: [
        { name: 'Jet Black', value: '#000000' },
        { name: 'Dark Brown', value: '#3b2314' },
        { name: 'Medium Brown', value: '#6a4e42' },
        { name: 'Light Brown', value: '#a67c52' },
        { name: 'Blonde', value: '#e6be8a' },
      ],
      lengths: ['14 inches', '16 inches', '18 inches', '20 inches', '24 inches'],
    },
    {
      name: 'Wavy Tape-In Extensions',
      description:
        'These premium tape-in extensions are made from 100% Remy human hair with a natural wave pattern. They\'re lightweight, comfortable, and virtually undetectable.',
      price: 149.99,
      images: ['https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=800&auto=format&fit=crop'],
      category: 'Tape-In Extensions',
      featured: true,
      rating: 4.7,
      reviewCount: 98,
      stock: 35,
      colors: [
        { name: 'Jet Black', value: '#000000' },
        { name: 'Dark Brown', value: '#3b2314' },
        { name: 'Medium Brown', value: '#6a4e42' },
        { name: 'Light Brown', value: '#a67c52' },
        { name: 'Blonde', value: '#e6be8a' },
      ],
      lengths: ['14 inches', '16 inches', '18 inches', '20 inches'],
    },
    {
      name: 'Full Lace Wig - Natural Curl',
      description:
        'This full lace wig features a natural curl pattern and is made from 100% human hair. The lace is virtually undetectable and provides a natural-looking hairline.',
      price: 299.99,
      images: ['https://images.unsplash.com/photo-1595514535215-8a5b0fad470f?q=80&w=800&auto=format&fit=crop'],
      category: 'Wigs',
      featured: true,
      rating: 4.9,
      reviewCount: 76,
      stock: 15,
      colors: [
        { name: 'Jet Black', value: '#000000' },
        { name: 'Dark Brown', value: '#3b2314' },
        { name: 'Medium Brown', value: '#6a4e42' },
      ],
      lengths: ['16 inches', '18 inches', '20 inches'],
    },
    {
      name: 'Ombre Clip-In Extensions',
      description:
        'These ombre clip-in extensions transition from a darker root to lighter ends for a trendy, dimensional look. Made from 100% Remy human hair.',
      price: 159.99,
      images: ['https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=800&auto=format&fit=crop'],
      category: 'Clip-In Extensions',
      featured: true,
      rating: 4.6,
      reviewCount: 87,
      stock: 40,
      colors: [
        { name: 'Black to Brown', value: '#000000' },
        { name: 'Brown to Blonde', value: '#6a4e42' },
        { name: 'Dark Brown to Light Brown', value: '#3b2314' },
      ],
      lengths: ['16 inches', '18 inches', '20 inches', '24 inches'],
    },
    {
      name: 'Keratin Bond Extensions',
      description:
        'These keratin bond extensions are applied using a hot fusion method for a long-lasting, secure attachment. Made from 100% Remy human hair.',
      price: 189.99,
      images: ['https://images.unsplash.com/photo-1580421383874-7e83a1fe9e52?q=80&w=800&auto=format&fit=crop'],
      category: 'Keratin Extensions',
      featured: false,
      rating: 4.5,
      reviewCount: 62,
      stock: 25,
      colors: [
        { name: 'Jet Black', value: '#000000' },
        { name: 'Dark Brown', value: '#3b2314' },
        { name: 'Medium Brown', value: '#6a4e42' },
        { name: 'Light Brown', value: '#a67c52' },
        { name: 'Blonde', value: '#e6be8a' },
      ],
      lengths: ['16 inches', '18 inches', '20 inches', '24 inches'],
    },
  ]

  for (const productData of products) {
    const { colors, lengths, ...data } = productData
    
    const product = await prisma.product.create({
      data: {
        ...data,
      },
    })

    // Add colors
    for (const color of colors) {
      await prisma.productColor.create({
        data: {
          name: color.name,
          value: color.value,
          productId: product.id,
        },
      })
    }

    // Add lengths
    for (const length of lengths) {
      await prisma.productLength.create({
        data: {
          length,
          productId: product.id,
        },
      })
    }
  }

  console.log('Products created')

  // Create a sample order for the user
  const product = await prisma.product.findFirst({
    include: {
      colors: true,
      lengths: true,
    },
  })

  if (product) {
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: product.price,
        status: 'DELIVERED',
        street: user.street!,
        city: user.city!,
        state: user.state!,
        zip: user.zip!,
        country: user.country!,
        paymentMethod: 'Credit Card',
        paymentLast4: '4242',
        paymentBrand: 'Visa',
        trackingNumber: 'TRK123456789',
        trackingCarrier: 'UPS',
        trackingUrl: 'https://www.ups.com/track?tracknum=TRK123456789',
        items: {
          create: {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            color: product.colors[0]?.name,
            length: product.lengths[0]?.length,
          },
        },
      },
    })

    console.log('Sample order created:', order.id)
  }

  console.log('Seeding completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 