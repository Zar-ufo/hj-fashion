import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { createServerSupabaseClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { SignOutButton } from '@/components/SignOutButton';
import { Package, Calendar, Tag, ChevronRight, User } from 'lucide-react';

export default async function AccountPage() {
  const supabase = createServerSupabaseClient();
  
  // Get current user session
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const user = session.user;

  // Fetch orders for this user
  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*, products(*))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12 lg:py-24">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-stone-100">
            <div className="flex items-center space-x-6">
              <div className="h-20 w-20 rounded-full bg-stone-900 flex items-center justify-center text-white">
                <User className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-3xl font-serif font-bold text-stone-900">{user.user_metadata?.full_name || 'My Account'}</h1>
                <p className="text-stone-500 font-light">{user.email}</p>
              </div>
            </div>
            <SignOutButton />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main Content: Orders */}
            <div className="lg:col-span-2 space-y-8">
              <h2 className="text-2xl font-serif font-bold text-stone-900">Order History</h2>
              
              {orders && orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="group border border-stone-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                      <div className="bg-stone-50 p-6 flex flex-wrap justify-between items-center gap-4">
                        <div className="flex items-center space-x-6">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Order Date</p>
                            <p className="text-sm font-bold text-stone-900">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Total Amount</p>
                            <p className="text-sm font-bold text-stone-900">${order.total_amount}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Status</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-600'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-stone-400 font-mono">#{order.id.slice(0, 8)}</p>
                      </div>

                      <div className="p-6 space-y-6">
                        {order.order_items?.map((item: any) => (
                          <div key={item.id} className="flex items-center space-x-4">
                            <div className="h-16 w-12 rounded-lg bg-stone-50 overflow-hidden flex-shrink-0">
                              <img src={item.products?.images?.[0]} alt={item.products?.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-grow">
                              <h4 className="text-sm font-bold text-stone-900">{item.products?.name}</h4>
                              <p className="text-xs text-stone-400 uppercase tracking-widest mt-1">Size: {item.size} × {item.quantity}</p>
                            </div>
                            <p className="text-sm font-bold text-stone-900">${item.price}</p>
                          </div>
                        ))}
                      </div>

                      <div className="p-6 pt-0 flex justify-end">
                        <button className="text-xs font-bold uppercase tracking-widest text-stone-900 hover:text-stone-600 transition-colors flex items-center">
                          Track Package <ChevronRight className="ml-1 h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center space-y-6 bg-stone-50 rounded-3xl border border-dashed border-stone-200">
                  <Package className="h-12 w-12 text-stone-200 mx-auto" />
                  <div className="space-y-2">
                    <p className="text-lg font-serif font-bold text-stone-900">No orders yet</p>
                    <p className="text-sm text-stone-500 max-w-xs mx-auto">When you make your first purchase, it will appear here.</p>
                  </div>
                  <button className="rounded-full bg-stone-900 text-white px-8 py-3 text-sm font-bold">
                    Start Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar: Profile Summary */}
            <div className="space-y-8">
              <div className="bg-stone-50 rounded-3xl p-8 space-y-8">
                <h3 className="text-xl font-serif font-bold text-stone-900">My Profile</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-stone-400 shadow-sm">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Member Since</p>
                      <p className="text-sm font-bold text-stone-900">{new Date(user.created_at).getFullYear()}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-stone-400 shadow-sm">
                      <Tag className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Total Orders</p>
                      <p className="text-sm font-bold text-stone-900">{orders?.length || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-stone-200">
                  <button className="w-full py-4 rounded-xl border border-stone-200 text-sm font-bold text-stone-600 hover:bg-white hover:text-stone-900 transition-all">
                    Edit Profile Details
                  </button>
                </div>
              </div>

              <div className="bg-stone-900 rounded-3xl p-8 text-white space-y-4">
                <h3 className="text-lg font-serif font-bold">Exclusive Benefits</h3>
                <ul className="space-y-4 text-xs font-light text-stone-400 uppercase tracking-widest">
                  <li className="flex items-center"><ChevronRight className="h-3 w-3 mr-2" /> Early Access to Sales</li>
                  <li className="flex items-center"><ChevronRight className="h-3 w-3 mr-2" /> Personalized Style Tips</li>
                  <li className="flex items-center"><ChevronRight className="h-3 w-3 mr-2" /> Birthday Surprise</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
