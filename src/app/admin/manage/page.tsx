'use client';

import { useState, useEffect, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign, Users, Plus, Trash2, Shield, Ban, Eye, Calendar, Tag, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: 'CUSTOMER' | 'ADMIN';
  is_blocked: boolean;
  email_verified: boolean;
  created_at: string;
  _count: { orders: number };
}

interface UserWithOrders extends User {
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  orders: Order[];
}

interface Order {
  id: string;
  status: string;
  total: number;
  payment_status: string;
  created_at: string;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  quantity: number;
  size: string;
  price: number;
  product: {
    name: string;
    images: string[];
  };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price: number | null;
  images: string[];
  is_featured: boolean;
  ratings: number;
  sizes: string[];
  fabric: string | null;
  color: string | null;
  care_instructions: string | null;
  category_id: string;
  category: { name: string; slug: string };
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Event {
  id: string;
  name: string;
  description: string | null;
  discount_percent: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  applies_to: 'ALL' | 'CATEGORY' | 'PRICE_RANGE';
  category_id: string | null;
  min_price: number | null;
  max_price: number | null;
  created_at: string;
}

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: Array<{
    id: string;
    total: number;
    status: string;
    created_at: string;
    user: { email: string; first_name: string | null; last_name: string | null };
  }>;
}

export default function AdminManageDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithOrders | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Fetch functions wrapped in useCallback
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/products?type=categories')
      ]);
      if (productsRes.ok) setProducts(await productsRes.json());
      if (categoriesRes.ok) setCategories(await categoriesRes.json());
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/events');
      if (res.ok) setEvents(await res.json());
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (user.role !== 'ADMIN') {
      router.push('/account');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchUsers(), fetchProducts(), fetchEvents()]);
      setLoading(false);
    };
    
    loadData();
  }, [user, authLoading, router, fetchStats, fetchUsers, fetchProducts, fetchEvents]);

  const fetchUserDetails = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedUser(data);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // User actions
  const handleUserAction = async (userId: string, action: 'role' | 'block', value: string | boolean) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action, value }),
      });
      if (res.ok) {
        toast.success(action === 'role' ? 'User role updated' : (value ? 'User blocked' : 'User unblocked'));
        fetchUsers();
        if (selectedUser?.id === userId) {
          fetchUserDetails(userId);
        }
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('User deleted');
        fetchUsers();
        if (selectedUser?.id === userId) setSelectedUser(null);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  // Product actions
  const handleProductSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const productData = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      price: formData.get('price') as string,
      original_price: formData.get('original_price') as string || undefined,
      images: (formData.get('images') as string).split(',').map(s => s.trim()).filter(Boolean),
      category_id: formData.get('category_id') as string,
      is_featured: formData.get('is_featured') === 'on',
      sizes: (formData.get('sizes') as string).split(',').map(s => s.trim()).filter(Boolean),
      fabric: formData.get('fabric') as string || undefined,
      color: formData.get('color') as string || undefined,
      care_instructions: formData.get('care_instructions') as string || undefined,
    };

    try {
      const res = await fetch('/api/admin/products', {
        method: editingProduct ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct ? { productId: editingProduct.id, ...productData } : productData),
      });

      if (res.ok) {
        toast.success(editingProduct ? 'Product updated' : 'Product created');
        setProductDialogOpen(false);
        setEditingProduct(null);
        fetchProducts();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/admin/products?productId=${productId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Product deleted');
        fetchProducts();
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  // Event actions
  const handleEventSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const eventData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
      discount_percent: formData.get('discount_percent') as string,
      start_date: formData.get('start_date') as string,
      end_date: formData.get('end_date') as string,
      applies_to: formData.get('applies_to') as string,
      category_id: formData.get('category_id') as string || undefined,
      min_price: formData.get('min_price') as string || undefined,
      max_price: formData.get('max_price') as string || undefined,
    };

    try {
      const res = await fetch('/api/admin/events', {
        method: editingEvent ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEvent ? { eventId: editingEvent.id, ...eventData } : eventData),
      });

      if (res.ok) {
        toast.success(editingEvent ? 'Event updated' : 'Event created');
        setEventDialogOpen(false);
        setEditingEvent(null);
        fetchEvents();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save event');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const res = await fetch(`/api/admin/events?eventId=${eventId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Event deleted');
        fetchEvents();
      } else {
        toast.error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const handleToggleEventActive = async (eventId: string, isActive: boolean) => {
    try {
      const res = await fetch('/api/admin/events', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, is_active: !isActive }),
      });
      if (res.ok) {
        toast.success(isActive ? 'Event deactivated' : 'Event activated');
        fetchEvents();
      }
    } catch (error) {
      console.error('Error toggling event:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground/60"></div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Admin Management</h1>
      </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="rounded-2xl border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-stone-400">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-stone-900">${stats?.totalRevenue?.toFixed(2) || '0.00'}</div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-stone-400">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-stone-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-stone-900">{stats?.totalOrders || 0}</div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-stone-400">Products</CardTitle>
                  <Package className="h-4 w-4 text-stone-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-stone-900">{stats?.totalProducts || 0}</div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-stone-400">Users</CardTitle>
                  <Users className="h-4 w-4 text-stone-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-stone-900">{stats?.totalUsers || 0}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="rounded-3xl border-none shadow-sm">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats?.recentOrders?.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
                        <TableCell>{order.user.first_name} {order.user.last_name}</TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === 'DELIVERED' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* USERS TAB */}
          <TabsContent value="users" className="space-y-6">
            {selectedUser ? (
              <div className="space-y-6">
                <Button variant="ghost" onClick={() => setSelectedUser(null)} className="mb-4">
                  <ChevronLeft className="h-4 w-4 mr-2" /> Back to Users
                </Button>
                
                <Card className="rounded-3xl border-none shadow-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl">
                          {selectedUser.first_name} {selectedUser.last_name}
                        </CardTitle>
                        <p className="text-stone-500">{selectedUser.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={selectedUser.email_verified ? 'default' : 'destructive'}>
                          {selectedUser.email_verified ? 'Verified' : 'Unverified'}
                        </Badge>
                        <Badge variant={selectedUser.role === 'ADMIN' ? 'default' : 'secondary'}>
                          {selectedUser.role}
                        </Badge>
                        {selectedUser.is_blocked && (
                          <Badge variant="destructive">Blocked</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-stone-500">Phone:</span> {selectedUser.phone || 'N/A'}
                      </div>
                      <div>
                        <span className="text-stone-500">Address:</span> {selectedUser.address || 'N/A'}
                      </div>
                      <div>
                        <span className="text-stone-500">City:</span> {selectedUser.city || 'N/A'}
                      </div>
                      <div>
                        <span className="text-stone-500">Country:</span> {selectedUser.country || 'N/A'}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        size="sm"
                        variant={selectedUser.role === 'ADMIN' ? 'destructive' : 'default'}
                        onClick={() => handleUserAction(selectedUser.id, 'role', selectedUser.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN')}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        {selectedUser.role === 'ADMIN' ? 'Demote to Customer' : 'Promote to Admin'}
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedUser.is_blocked ? 'default' : 'destructive'}
                        onClick={() => handleUserAction(selectedUser.id, 'block', !selectedUser.is_blocked)}
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        {selectedUser.is_blocked ? 'Unblock User' : 'Block User'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-sm">
                  <CardHeader>
                    <CardTitle>Order History ({selectedUser.orders.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedUser.orders.length === 0 ? (
                      <p className="text-stone-500">No orders found</p>
                    ) : (
                      <div className="space-y-4">
                        {selectedUser.orders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="font-mono text-sm">{order.id}</p>
                                <p className="text-sm text-stone-500">{new Date(order.created_at).toLocaleString()}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">${order.total.toFixed(2)}</p>
                                <Badge variant={order.status === 'DELIVERED' ? 'default' : 'secondary'}>
                                  {order.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                  <span>{item.product.name} x{item.quantity} ({item.size})</span>
                                  <span>${item.price.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="rounded-3xl border-none shadow-sm">
                <CardHeader>
                  <CardTitle>All Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>{u.first_name} {u.last_name}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>
                            <Badge variant={u.email_verified ? 'default' : 'destructive'}>
                              {u.email_verified ? 'Yes' : 'No'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={u.role === 'ADMIN' ? 'default' : 'secondary'}>
                              {u.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={u.is_blocked ? 'destructive' : 'default'}>
                              {u.is_blocked ? 'Blocked' : 'Active'}
                            </Badge>
                          </TableCell>
                          <TableCell>{u._count.orders}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" onClick={() => fetchUserDetails(u.id)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleUserAction(u.id, 'block', !u.is_blocked)}
                              >
                                <Ban className={`h-4 w-4 ${u.is_blocked ? 'text-green-600' : 'text-red-600'}`} />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="ghost" className="text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete User?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete the user and all their data. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteUser(u.id)}>Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* PRODUCTS TAB */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={productDialogOpen} onOpenChange={(open) => {
                setProductDialogOpen(open);
                if (!open) setEditingProduct(null);
              }}>
                <DialogTrigger asChild>
                  <Button className="rounded-full bg-stone-900">
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                    <DialogDescription>Fill in the product details below.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input id="name" name="name" defaultValue={editingProduct?.name} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slug">Slug *</Label>
                        <Input id="slug" name="slug" defaultValue={editingProduct?.slug} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea id="description" name="description" defaultValue={editingProduct?.description} required rows={3} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price *</Label>
                        <Input id="price" name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="original_price">Original Price</Label>
                        <Input id="original_price" name="original_price" type="number" step="0.01" defaultValue={editingProduct?.original_price || ''} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category_id">Category *</Label>
                        <Select name="category_id" defaultValue={editingProduct?.category_id}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="images">Image URLs (comma-separated)</Label>
                      <Textarea id="images" name="images" defaultValue={editingProduct?.images?.join(', ')} rows={2} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sizes">Sizes (comma-separated)</Label>
                        <Input id="sizes" name="sizes" defaultValue={editingProduct?.sizes?.join(', ')} placeholder="XS, S, M, L, XL" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="color">Color</Label>
                        <Input id="color" name="color" defaultValue={editingProduct?.color || ''} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fabric">Fabric</Label>
                        <Input id="fabric" name="fabric" defaultValue={editingProduct?.fabric || ''} />
                      </div>
                      <div className="space-y-2 flex items-end">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" name="is_featured" defaultChecked={editingProduct?.is_featured} />
                          <span>Featured Product</span>
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="care_instructions">Care Instructions</Label>
                      <Textarea id="care_instructions" name="care_instructions" defaultValue={editingProduct?.care_instructions || ''} rows={2} />
                    </div>
                    <Button type="submit" className="w-full">{editingProduct ? 'Update Product' : 'Create Product'}</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="rounded-3xl border-none shadow-sm">
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {product.images[0] && (
                              <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded" />
                            )}
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-stone-500">{product.slug}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{product.category.name}</TableCell>
                        <TableCell>
                          ${product.price.toFixed(2)}
                          {product.original_price && (
                            <span className="text-xs text-stone-400 line-through ml-2">${product.original_price.toFixed(2)}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.is_featured ? 'default' : 'secondary'}>
                            {product.is_featured ? 'Yes' : 'No'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingProduct(product);
                                setProductDialogOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost" className="text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the product. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* EVENTS TAB */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={eventDialogOpen} onOpenChange={(open) => {
                setEventDialogOpen(open);
                if (!open) setEditingEvent(null);
              }}>
                <DialogTrigger asChild>
                  <Button className="rounded-full bg-stone-900">
                    <Plus className="mr-2 h-4 w-4" /> Add Event/Promotion
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event/Promotion'}</DialogTitle>
                    <DialogDescription>Create a discount event for your products.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleEventSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="event_name">Event Name *</Label>
                      <Input id="event_name" name="name" defaultValue={editingEvent?.name} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event_description">Description</Label>
                      <Textarea id="event_description" name="description" defaultValue={editingEvent?.description || ''} rows={2} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discount_percent">Discount Percentage *</Label>
                      <Input id="discount_percent" name="discount_percent" type="number" min="0" max="100" defaultValue={editingEvent?.discount_percent} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start_date">Start Date *</Label>
                        <Input id="start_date" name="start_date" type="datetime-local" defaultValue={editingEvent?.start_date ? new Date(editingEvent.start_date).toISOString().slice(0, 16) : ''} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end_date">End Date *</Label>
                        <Input id="end_date" name="end_date" type="datetime-local" defaultValue={editingEvent?.end_date ? new Date(editingEvent.end_date).toISOString().slice(0, 16) : ''} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="applies_to">Applies To *</Label>
                      <Select name="applies_to" defaultValue={editingEvent?.applies_to || 'ALL'}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All Products</SelectItem>
                          <SelectItem value="CATEGORY">Specific Category</SelectItem>
                          <SelectItem value="PRICE_RANGE">Price Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event_category_id">Category (if applicable)</Label>
                      <Select name="category_id" defaultValue={editingEvent?.category_id || ''}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="min_price">Min Price (if range)</Label>
                        <Input id="min_price" name="min_price" type="number" step="0.01" defaultValue={editingEvent?.min_price || ''} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="max_price">Max Price (if range)</Label>
                        <Input id="max_price" name="max_price" type="number" step="0.01" defaultValue={editingEvent?.max_price || ''} />
                      </div>
                    </div>
                    <Button type="submit" className="w-full">{editingEvent ? 'Update Event' : 'Create Event'}</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="rounded-3xl border-none shadow-sm">
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Applies To</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => {
                      const now = new Date();
                      const startDate = new Date(event.start_date);
                      const endDate = new Date(event.end_date);
                      const isOngoing = event.is_active && now >= startDate && now <= endDate;
                      const isUpcoming = now < startDate;
                      const isExpired = now > endDate;

                      return (
                        <TableRow key={event.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {event.applies_to === 'ALL' ? (
                                <Tag className="h-4 w-4 text-purple-500" />
                              ) : (
                                <Calendar className="h-4 w-4 text-blue-500" />
                              )}
                              <div>
                                <p className="font-medium">{event.name}</p>
                                {event.description && <p className="text-xs text-stone-500">{event.description}</p>}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="default" className="bg-green-600">{event.discount_percent}% OFF</Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            <div>{new Date(event.start_date).toLocaleDateString()}</div>
                            <div className="text-stone-500">to {new Date(event.end_date).toLocaleDateString()}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {event.applies_to === 'ALL' && 'All Products'}
                              {event.applies_to === 'CATEGORY' && 'Category'}
                              {event.applies_to === 'PRICE_RANGE' && `$${event.min_price || 0} - $${event.max_price || '∞'}`}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {isOngoing && <Badge className="bg-green-600">Active</Badge>}
                            {isUpcoming && <Badge variant="secondary">Upcoming</Badge>}
                            {isExpired && <Badge variant="destructive">Expired</Badge>}
                            {!event.is_active && !isExpired && <Badge variant="outline">Disabled</Badge>}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleToggleEventActive(event.id, event.is_active)}
                              >
                                {event.is_active ? 'Disable' : 'Enable'}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingEvent(event);
                                  setEventDialogOpen(true);
                                }}
                              >
                                Edit
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="ghost" className="text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Event?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete the event. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteEvent(event.id)}>Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {events.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-stone-500 py-8">
                          No events yet. Create your first promotion!
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  );
}
