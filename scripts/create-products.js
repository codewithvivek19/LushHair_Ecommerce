// Script to add sample products to the database
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createProducts() {
  try {
    // Clean up existing product data
    await prisma.orderItem.deleteMany({});
    await prisma.productLength.deleteMany({});
    await prisma.productColor.deleteMany({});
    await prisma.product.deleteMany({});

    // Sample products data
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
    ];

    console.log('Creating products...');
    let count = 0;

    // Create each product with its colors and lengths
    for (const productData of products) {
      const { colors, lengths, ...data } = productData;
      
      const product = await prisma.product.create({
        data: {
          ...data,
        },
      });

      // Add colors
      for (const color of colors) {
        await prisma.productColor.create({
          data: {
            name: color.name,
            value: color.value,
            productId: product.id,
          },
        });
      }

      // Add lengths
      for (const length of lengths) {
        await prisma.productLength.create({
          data: {
            length,
            productId: product.id,
          },
        });
      }

      count++;
    }

    console.log(`Successfully created ${count} products!`);

  } catch (error) {
    console.error('Error creating products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createProducts(); 