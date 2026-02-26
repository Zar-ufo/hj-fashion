// Database types - These mirror the Prisma schema for use in the application
// After running `prisma generate`, you can also import types directly from @prisma/client

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price: number | null;
  images: string[];
  // Optional convenience fields used by some UI components
  image?: string;
  stock?: number;
  is_featured: boolean;
  ratings: number;
  sizes: string[];
  fabric: string | null;
  color: string | null;
  care_instructions: string | null;
  created_at: Date;
  updated_at: Date;
  category_id: string;
  category?: Category;
}

export interface User {
  id: string;
  email: string;
  password_hash?: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  role: 'CUSTOMER' | 'ADMIN';
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  id: string;
  user_id: string;
  user?: Pick<User, 'email' | 'first_name' | 'last_name'>;
  status: OrderStatus;
  total: number;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  payment_method: string | null;
  payment_status: PaymentStatus;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  size: string;
  price: number;
  created_at: Date;
}

export type OrderStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'PROCESSING' 
  | 'SHIPPED' 
  | 'DELIVERED' 
  | 'CANCELLED';

export type PaymentStatus = 
  | 'PENDING' 
  | 'PAID' 
  | 'FAILED' 
  | 'REFUNDED';

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Dashboard stats
export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: Order[];
}

// Form types for creating/updating
export interface CreateProductInput {
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
}

export interface CreateOrderInput {
  user_id: string;
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
}

export interface RegisterInput {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
