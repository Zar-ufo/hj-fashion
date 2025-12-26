import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

const PASSWORD_HASH_PASSWORD = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // password: password

async function ensureCustomer(email: string, first_name: string, last_name: string) {
  return prisma.user.upsert({
    where: { email },
    update: {
      first_name,
      last_name,
      role: 'CUSTOMER',
      email_verified: true,
    },
    create: {
      email,
      password_hash: PASSWORD_HASH_PASSWORD,
      first_name,
      last_name,
      role: 'CUSTOMER',
      email_verified: true,
    },
  });
}

function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

async function main() {
  console.log('🌱 Seeding sample orders (no deletes)...');

  const productCount = await prisma.product.count();
  if (productCount === 0) {
    throw new Error('No products found. Run the main seed first (npm run db:seed).');
  }

  const products = await prisma.product.findMany({
    take: 6,
    orderBy: { created_at: 'desc' },
    select: { id: true, name: true, price: true },
  });

  if (products.length === 0) {
    throw new Error('Could not load products to attach to orders.');
  }

  const customers = [
    await ensureCustomer('sample.customer1@example.com', 'Sample', 'Customer1'),
    await ensureCustomer('sample.customer2@example.com', 'Sample', 'Customer2'),
    await ensureCustomer('sample.customer3@example.com', 'Sample', 'Customer3'),
  ];

  let created = 0;

  for (const [index, customer] of customers.entries()) {
    const existing = await prisma.order.count({
      where: { user_id: customer.id },
    });

    if (existing > 0) {
      console.log(`ℹ️  Skipping ${customer.email} (already has ${existing} order(s))`);
      continue;
    }

    const first = products[(index * 2) % products.length];
    const second = products[(index * 2 + 1) % products.length];

    const order1Total = first.price * 1 + second.price * 2;
    await prisma.order.create({
      data: {
        user_id: customer.id,
        status: 'DELIVERED',
        payment_status: 'PAID',
        payment_method: 'DEMO',
        total: order1Total,
        shipping_address: 'Sample Address Line 1, Apt 2B',
        shipping_city: 'New York',
        shipping_postal_code: '10001',
        shipping_country: 'US',
        notes: 'Seeded sample order',
        created_at: daysAgo(21 + index),
        items: {
          create: [
            { product_id: first.id, quantity: 1, size: 'M', price: first.price },
            { product_id: second.id, quantity: 2, size: 'L', price: second.price },
          ],
        },
      },
    });

    const third = products[(index * 2 + 2) % products.length];
    const order2Total = third.price * 1;
    await prisma.order.create({
      data: {
        user_id: customer.id,
        status: 'PROCESSING',
        payment_status: 'PENDING',
        payment_method: 'DEMO',
        total: order2Total,
        shipping_address: 'Sample Address Line 2',
        shipping_city: 'Los Angeles',
        shipping_postal_code: '90001',
        shipping_country: 'US',
        notes: 'Seeded sample order',
        created_at: daysAgo(3 + index),
        items: {
          create: [{ product_id: third.id, quantity: 1, size: 'S', price: third.price }],
        },
      },
    });

    created += 2;
    console.log(`✅ Created 2 sample orders for ${customer.email}`);
  }

  console.log(`✅ Done. Created ${created} sample order(s).`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding sample orders:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end().catch(() => undefined);
  });
