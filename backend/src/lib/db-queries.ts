import prisma from './db';

// Product queries
export async function getProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });
}

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: {
      is_featured: true,
    },
    include: {
      category: true,
    },
  });
}

export async function getNewArrivals(limit = 8) {
  return prisma.product.findMany({
    take: limit,
    include: {
      category: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });
}

export async function getProductsByCategory(categorySlug: string) {
  return prisma.product.findMany({
    where: {
      category: {
        slug: categorySlug,
      },
    },
    include: {
      category: true,
    },
  });
}

export async function searchProducts(query: string) {
  return prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: {
      category: true,
    },
  });
}

export async function filterProducts(options: {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  sort?: string;
}) {
  const where: Record<string, unknown> = {};

  if (options.categorySlug) {
    where.category = { slug: options.categorySlug };
  }

  if (options.minPrice !== undefined || options.maxPrice !== undefined) {
    where.price = {};
    if (options.minPrice !== undefined) {
      (where.price as Record<string, number>).gte = options.minPrice;
    }
    if (options.maxPrice !== undefined) {
      (where.price as Record<string, number>).lte = options.maxPrice;
    }
  }

  if (options.searchQuery) {
    where.OR = [
      { name: { contains: options.searchQuery, mode: 'insensitive' } },
      { description: { contains: options.searchQuery, mode: 'insensitive' } },
    ];
  }

  let orderBy: Record<string, string> = {};
  switch (options.sort) {
    case 'newest':
      orderBy = { created_at: 'desc' };
      break;
    case 'price-low':
      orderBy = { price: 'asc' };
      break;
    case 'price-high':
      orderBy = { price: 'desc' };
      break;
    default:
      orderBy = { is_featured: 'desc' };
  }

  return prisma.product.findMany({
    where,
    include: {
      category: true,
    },
    orderBy,
  });
}

// Category queries
export async function getCategories() {
  return prisma.category.findMany({
    where: {
      parent_id: null,
      is_occasion: false,
    },
    include: {
      children: {
        orderBy: {
          display_order: 'asc',
        },
      },
    },
    orderBy: {
      display_order: 'asc',
    },
  });
}

export async function getAllCategories() {
  return prisma.category.findMany({
    include: {
      children: true,
      parent: true,
    },
    orderBy: {
      display_order: 'asc',
    },
  });
}

export async function getOccasionCategories() {
  return prisma.category.findMany({
    where: {
      is_occasion: true,
    },
    orderBy: {
      display_order: 'asc',
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      children: true,
      parent: true,
    },
  });
}

export async function getCategoryWithParent(categoryId: string) {
  return prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      parent: true,
    },
  });
}

export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  is_occasion?: boolean;
  display_order?: number;
}) {
  return prisma.category.create({
    data,
  });
}

export async function updateCategory(id: string, data: {
  name?: string;
  slug?: string;
  description?: string;
  image_url?: string;
  parent_id?: string | null;
  is_occasion?: boolean;
  display_order?: number;
}) {
  return prisma.category.update({
    where: { id },
    data,
  });
}

export async function deleteCategory(id: string) {
  return prisma.category.delete({
    where: { id },
  });
}

// Get featured event
export async function getFeaturedEvent() {
  const now = new Date();
  return prisma.event.findFirst({
    where: {
      is_active: true,
      is_featured: true,
      start_date: { lte: now },
      end_date: { gte: now },
    },
  });
}

// User queries
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function createUser(data: {
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
}) {
  return prisma.user.create({
    data,
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      phone: true,
      address: true,
      city: true,
      postal_code: true,
      country: true,
      role: true,
      is_blocked: true,
      email_verified: true,
      email_verified_at: true,
      created_at: true,
    },
  });
}

export async function updateUser(id: string, data: {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
}) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

// Order queries
export async function createOrder(data: {
  user_id: string;
  total: number;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  payment_method?: string;
  notes?: string;
  items: {
    product_id: string;
    quantity: number;
    size: string;
    price: number;
  }[];
}) {
  const { items, ...orderData } = data;
  
  return prisma.order.create({
    data: {
      ...orderData,
      items: {
        create: items,
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function getOrdersByUserId(userId: string) {
  return prisma.order.findMany({
    where: {
      user_id: userId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });
}

export async function getOrderById(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: {
        select: {
          email: true,
          first_name: true,
          last_name: true,
        },
      },
    },
  });
}

export async function updateOrderStatus(orderId: string, status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED') {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
}

// Admin queries
export async function getAllOrders() {
  return prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: {
        select: {
          email: true,
          first_name: true,
          last_name: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });
}

export async function getDashboardStats() {
  const [totalProducts, totalOrders, totalUsers, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: {
            email: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    }),
  ]);

  const revenue = await prisma.order.aggregate({
    _sum: {
      total: true,
    },
    where: {
      payment_status: 'PAID',
    },
  });

  return {
    totalProducts,
    totalOrders,
    totalUsers,
    totalRevenue: revenue._sum.total || 0,
    recentOrders,
  };
}

// Product management (Admin)
export async function createProduct(data: {
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  images: string[];
  category_id: string;
  is_featured?: boolean;
  sizes: string[];
  fabric?: string;
  color?: string;
  care_instructions?: string;
}) {
  return prisma.product.create({
    data,
    include: {
      category: true,
    },
  });
}

export async function updateProduct(id: string, data: {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  original_price?: number;
  images?: string[];
  category_id?: string;
  is_featured?: boolean;
  sizes?: string[];
  fabric?: string;
  color?: string;
  care_instructions?: string;
}) {
  return prisma.product.update({
    where: { id },
    data,
    include: {
      category: true,
    },
  });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({
    where: { id },
  });
}

// ============================================
// Password Reset Token Queries
// ============================================

export async function createPasswordResetToken(data: {
  token: string;
  user_id: string;
  expires_at: Date;
}) {
  // Invalidate any existing tokens for this user
  await prisma.passwordResetToken.updateMany({
    where: { user_id: data.user_id, used: false },
    data: { used: true },
  });

  return prisma.passwordResetToken.create({
    data,
  });
}

export async function getPasswordResetToken(token: string) {
  return prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });
}

export async function markPasswordResetTokenUsed(token: string) {
  return prisma.passwordResetToken.update({
    where: { token },
    data: { used: true },
  });
}

export async function deleteExpiredPasswordResetTokens() {
  return prisma.passwordResetToken.deleteMany({
    where: {
      OR: [
        { used: true },
        { expires_at: { lt: new Date() } },
      ],
    },
  });
}

// ============================================
// Email Verification Token Queries
// ============================================

export async function createEmailVerificationToken(data: {
  token: string;
  user_id: string;
  expires_at: Date;
}) {
  // Invalidate any existing tokens for this user
  await prisma.emailVerificationToken.updateMany({
    where: { user_id: data.user_id, used: false },
    data: { used: true },
  });

  return prisma.emailVerificationToken.create({
    data,
  });
}

export async function getEmailVerificationToken(token: string) {
  return prisma.emailVerificationToken.findUnique({
    where: { token },
    include: { user: true },
  });
}

export async function markEmailVerificationTokenUsed(token: string) {
  return prisma.emailVerificationToken.update({
    where: { token },
    data: { used: true },
  });
}

export async function verifyUserEmail(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      email_verified: true,
      email_verified_at: new Date(),
    },
  });
}

// ============================================
// Session Queries
// ============================================

export async function createSession(data: {
  session_token: string;
  user_id: string;
  expires_at: Date;
}) {
  return prisma.session.create({
    data,
  });
}

export async function getSession(sessionToken: string) {
  return prisma.session.findUnique({
    where: { session_token: sessionToken },
    include: { user: true },
  });
}

export async function deleteSession(sessionToken: string) {
  return prisma.session.delete({
    where: { session_token: sessionToken },
  });
}

export async function deleteUserSessions(userId: string) {
  return prisma.session.deleteMany({
    where: { user_id: userId },
  });
}

export async function deleteExpiredSessions() {
  return prisma.session.deleteMany({
    where: {
      expires_at: { lt: new Date() },
    },
  });
}

// ============================================
// Extended User Queries for Auth
// ============================================

export async function updateUserPassword(userId: string, passwordHash: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { password_hash: passwordHash },
  });
}

export async function getUserWithAuthDetails(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password_hash: true,
      first_name: true,
      last_name: true,
      role: true,
      is_blocked: true,
      email_verified: true,
      email_verified_at: true,
      created_at: true,
    },
  });
}

// ============================================
// Admin User Management Queries
// ============================================

export async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      phone: true,
      role: true,
      is_blocked: true,
      email_verified: true,
      created_at: true,
      _count: {
        select: {
          orders: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });
}

export async function getUserWithOrders(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      phone: true,
      address: true,
      city: true,
      postal_code: true,
      country: true,
      role: true,
      is_blocked: true,
      email_verified: true,
      created_at: true,
      orders: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      },
    },
  });
}

export async function updateUserRole(userId: string, role: 'CUSTOMER' | 'ADMIN') {
  return prisma.user.update({
    where: { id: userId },
    data: { role },
  });
}

export async function updateUserBlockStatus(userId: string, isBlocked: boolean) {
  return prisma.user.update({
    where: { id: userId },
    data: { is_blocked: isBlocked },
  });
}

export async function deleteUser(userId: string) {
  // Delete user and cascade all related data
  return prisma.user.delete({
    where: { id: userId },
  });
}

// ============================================
// Event/Promotion Management Queries
// ============================================

export async function createEvent(data: {
  name: string;
  description?: string;
  discount_percent: number;
  start_date: Date;
  end_date: Date;
  is_active?: boolean;
  applies_to?: 'ALL' | 'CATEGORY' | 'PRICE_RANGE';
  category_id?: string;
  min_price?: number;
  max_price?: number;
}) {
  return prisma.event.create({
    data,
  });
}

export async function getAllEvents() {
  return prisma.event.findMany({
    orderBy: {
      created_at: 'desc',
    },
  });
}

export async function getActiveEvents() {
  const now = new Date();
  return prisma.event.findMany({
    where: {
      is_active: true,
      start_date: { lte: now },
      end_date: { gte: now },
    },
  });
}

export async function getEventById(eventId: string) {
  return prisma.event.findUnique({
    where: { id: eventId },
  });
}

export async function updateEvent(eventId: string, data: {
  name?: string;
  description?: string;
  discount_percent?: number;
  start_date?: Date;
  end_date?: Date;
  is_active?: boolean;
  applies_to?: 'ALL' | 'CATEGORY' | 'PRICE_RANGE';
  category_id?: string;
  min_price?: number;
  max_price?: number;
}) {
  return prisma.event.update({
    where: { id: eventId },
    data,
  });
}

export async function deleteEvent(eventId: string) {
  return prisma.event.delete({
    where: { id: eventId },
  });
}

// Get product with applicable discount
export async function getProductWithDiscount(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { category: true },
  });
  
  if (!product) return null;
  
  const now = new Date();
  const activeEvents = await prisma.event.findMany({
    where: {
      is_active: true,
      start_date: { lte: now },
      end_date: { gte: now },
    },
  });
  
  let maxDiscount = 0;
  for (const event of activeEvents) {
    if (event.applies_to === 'ALL') {
      maxDiscount = Math.max(maxDiscount, event.discount_percent);
    } else if (event.applies_to === 'CATEGORY' && event.category_id === product.category_id) {
      maxDiscount = Math.max(maxDiscount, event.discount_percent);
    } else if (event.applies_to === 'PRICE_RANGE') {
      const minPrice = event.min_price || 0;
      const maxPrice = event.max_price || Infinity;
      if (product.price >= minPrice && product.price <= maxPrice) {
        maxDiscount = Math.max(maxDiscount, event.discount_percent);
      }
    }
  }
  
  return {
    ...product,
    discountPercent: maxDiscount,
    discountedPrice: maxDiscount > 0 ? product.price * (1 - maxDiscount / 100) : null,
  };
}

