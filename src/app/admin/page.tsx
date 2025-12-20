import { createServerSupabaseClient } from '@/lib/supabase';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign, Users, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = createServerSupabaseClient();

  // Fetch stats
  const { data: orders } = await supabase.from('orders').select('*');
  const { data: products } = await supabase.from('products').select('*, categories(name)');
  
  const totalSales = orders?.reduce((sum, order) => sum + (order.status === 'paid' ? Number(order.total_amount) : 0), 0) || 0;
  const totalOrders = orders?.length || 0;
  const totalProducts = products?.length || 0;

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-stone-900">Admin Dashboard</h1>
          <Button asChild className="rounded-full bg-stone-900">
            <Link href="/admin/products/new"><Plus className="mr-2 h-4 w-4" /> Add New Product</Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="rounded-2xl border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-stone-400">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-stone-900">${totalSales.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-stone-400">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-stone-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-stone-900">{totalOrders}</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-stone-400">Products</CardTitle>
              <Package className="h-4 w-4 text-stone-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-stone-900">{totalProducts}</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-stone-400">Customers</CardTitle>
              <Users className="h-4 w-4 text-stone-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-stone-900">124</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Recent Orders */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-serif font-bold text-stone-900">Recent Orders</h2>
              <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest text-stone-400">View All</Button>
            </div>
            <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-white">
                  <TableRow>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest">Order ID</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest">Amount</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest">Status</TableHead>
                    <TableHead className="font-bold text-[10px] uppercase tracking-widest">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                  {orders?.slice(0, 5).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
                      <TableCell className="font-bold">${order.total_amount}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'
                        }`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-stone-500 text-xs">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>

          {/* Product Management Snippet */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-serif font-bold text-stone-900">Products</h2>
              <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest text-stone-400">View All</Button>
            </div>
            <Card className="rounded-3xl border-none shadow-sm p-6 space-y-6 bg-white">
              {products?.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center space-x-4 pb-4 border-b border-stone-50 last:border-0 last:pb-0">
                  <div className="h-12 w-10 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0">
                    <img src={product.images?.[0]} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-bold text-stone-900 line-clamp-1">{product.name}</h4>
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest">{product.categories?.name}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-stone-300 hover:text-stone-900 transition-colors"><Edit className="h-4 w-4" /></button>
                    <button className="p-2 text-stone-300 hover:text-rose-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
