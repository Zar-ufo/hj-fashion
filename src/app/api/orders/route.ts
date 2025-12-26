import { NextResponse } from 'next/server';
import { createOrder, getOrdersByUserId } from '@/lib/db-queries';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Create a new order
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const {
      items,
      shipping_address,
      shipping_city,
      shipping_postal_code,
      shipping_country,
      payment_method,
      notes,
    } = body;
    
    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user is blocked
    const user = await prisma.user.findUnique({
      where: { id: currentUser.userId },
      select: { is_blocked: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.is_blocked) {
      return NextResponse.json(
        { error: 'Your account has been blocked. You cannot place orders.' },
        { status: 403 }
      );
    }
    
    // Resolve products server-side to avoid FK errors (e.g. stale cart IDs after reseed)
    // and compute totals from DB prices.
    const normalizedItems = (Array.isArray(items) ? items : []).map((item: any) => {
      const productId = item?.product_id || item?.productId || item?.id || null;
      const productSlug = item?.productSlug || item?.slug || null;
      return {
        productId: typeof productId === 'string' ? productId : null,
        productSlug: typeof productSlug === 'string' ? productSlug : null,
        quantity: Number(item?.quantity) || 1,
        size: typeof item?.size === 'string' && item.size ? item.size : 'M',
        name: typeof item?.name === 'string' ? item.name : null,
      };
    });

    const missing: Array<{ productId: string | null; productSlug: string | null; name: string | null }> = [];
    const resolvedItems: Array<{ product_id: string; quantity: number; size: string; price: number }> = [];

    for (const item of normalizedItems) {
      let product: { id: string; price: number } | null = null;

      if (item.productId) {
        product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { id: true, price: true },
        });
      }

      if (!product && item.productSlug) {
        product = await prisma.product.findUnique({
          where: { slug: item.productSlug },
          select: { id: true, price: true },
        });
      }

      if (!product) {
        missing.push({ productId: item.productId, productSlug: item.productSlug, name: item.name });
        continue;
      }

      resolvedItems.push({
        product_id: product.id,
        quantity: Math.max(1, item.quantity),
        size: item.size,
        price: Number(product.price) || 0,
      });
    }

    if (missing.length > 0) {
      return NextResponse.json(
        {
          error:
            'Some items in your cart are no longer available (often caused by reseeding the database, which changes product IDs). Please remove them from the cart and add them again.',
          missing,
        },
        { status: 400 }
      );
    }

    const total = resolvedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await createOrder({
      user_id: currentUser.userId,
      total,
      shipping_address,
      shipping_city,
      shipping_postal_code,
      shipping_country,
      payment_method,
      notes,
      items: resolvedItems,
    });
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// Get orders for a user
export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await getOrdersByUserId(currentUser.userId);
    return NextResponse.json(orders, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
