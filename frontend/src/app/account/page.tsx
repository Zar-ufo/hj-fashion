'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Package, Calendar, Tag, ChevronRight, User, LogOut, Mail, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

interface Order {
  id: string;
  created_at: string;
  total: number;
  status: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_postal_code?: string;
  shipping_country?: string;
  items?: OrderItem[];
}

interface OrderItem {
  id: string;
  size: string;
  quantity: number;
  price: number;
  product?: {
    name: string;
    images: string[];
  };
}

export default function AccountPage() {
  const { user, isLoading, isAuthenticated, logout, resendVerificationEmail, refreshSession } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: '',
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      
      try {
        const response = await fetch('/api/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoadingOrders(false);
      }
    }

    if (user) {
      fetchOrders();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setProfileForm({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      postal_code: user.postal_code || '',
      country: user.country || '',
    });
  }, [user]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const handleResendVerification = async () => {
    if (!user?.email) return;
    
    setResendingEmail(true);
    const result = await resendVerificationEmail(user.email);
    
    if (result.success) {
      toast.success(result.message || 'Verification email sent!');
    } else {
      toast.error(result.error || 'Failed to send verification email');
    }
    setResendingEmail(false);
  };

  const handleProfileInputChange = (field: keyof typeof profileForm, value: string) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancelEditProfile = () => {
    if (user) {
      setProfileForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postal_code: user.postal_code || '',
        country: user.country || '',
      });
    }
    setIsEditingProfile(false);
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    setSavingProfile(true);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          first_name: profileForm.first_name.trim() || null,
          last_name: profileForm.last_name.trim() || null,
          phone: profileForm.phone.trim() || null,
          address: profileForm.address.trim() || null,
          city: profileForm.city.trim() || null,
          postal_code: profileForm.postal_code.trim() || null,
          country: profileForm.country.trim() || null,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        toast.error(data?.error || 'Failed to update profile');
        return;
      }

      await refreshSession();
      setIsEditingProfile(false);
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-stone-400" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-stone-400" />
        </main>
        <Footer />
      </div>
    );
  }

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'My Account';

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12 lg:py-24">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Email Verification Banner */}
          {user && !user.email_verified && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-amber-900">Verify your email</h3>
                  <p className="text-sm text-amber-700">
                    Please verify your email address to access all features.
                  </p>
                </div>
              </div>
              <Button
                onClick={handleResendVerification}
                disabled={resendingEmail}
                variant="outline"
                className="rounded-full border-amber-300 text-amber-900 hover:bg-amber-100"
              >
                {resendingEmail ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Mail className="h-4 w-4 mr-2" />
                )}
                Resend Email
              </Button>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-stone-100">
            <div className="flex items-center space-x-6">
              <div className="h-20 w-20 rounded-full bg-stone-900 flex items-center justify-center text-white">
                <User className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-3xl font-serif font-bold text-stone-900">{fullName}</h1>
                <p className="text-stone-500 font-light">{user.email}</p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="rounded-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main Content: Orders */}
            <div className="lg:col-span-2 space-y-8">
              <h2 className="text-2xl font-serif font-bold text-stone-900">Order History</h2>
              
              {loadingOrders ? (
                <div className="py-24 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-stone-400 mx-auto" />
                </div>
              ) : orders && orders.length > 0 ? (
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
                            <p className="text-sm font-bold text-stone-900">${order.total}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Status</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' : 
                              order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                              order.status === 'PROCESSING' ? 'bg-amber-100 text-amber-700' :
                              'bg-stone-200 text-stone-600'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-stone-400 font-mono">#{order.id}</p>
                      </div>

                      {(order.shipping_address || order.shipping_city || order.shipping_postal_code || order.shipping_country) && (
                        <div className="px-6 pt-6">
                          <div className="p-4 rounded-2xl bg-white border border-stone-100">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Shipping Address</p>
                            <div className="mt-2 space-y-1 text-sm text-stone-700">
                              {order.shipping_address && <div>{order.shipping_address}</div>}
                              {(order.shipping_city || order.shipping_postal_code) && (
                                <div>
                                  {[order.shipping_city, order.shipping_postal_code].filter(Boolean).join(' ')}
                                </div>
                              )}
                              {order.shipping_country && <div>{order.shipping_country}</div>}
                            </div>
                          </div>
                        </div>
                      )}

                      {order.items && order.items.length > 0 && (
                        <div className="p-6 space-y-6">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4">
                              <div className="h-16 w-12 rounded-lg bg-stone-50 overflow-hidden flex-shrink-0">
                                {item.product?.images?.[0] && (
                                  <img src={item.product.images[0]} alt={item.product?.name} className="h-full w-full object-cover" />
                                )}
                              </div>
                              <div className="flex-grow">
                                <h4 className="text-sm font-bold text-stone-900">{item.product?.name}</h4>
                                <p className="text-xs text-stone-400 uppercase tracking-widest mt-1">Size: {item.size} × {item.quantity}</p>
                              </div>
                              <p className="text-sm font-bold text-stone-900">${item.price}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="p-6 pt-0 flex justify-end">
                        <div className="text-xs font-bold uppercase tracking-widest text-stone-400 flex items-center">
                          Details shown above <ChevronRight className="ml-1 h-3 w-3" />
                        </div>
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
                  <Link href="/shop">
                    <Button className="rounded-full bg-stone-900 text-white px-8 py-3 text-sm font-bold">
                      Start Shopping
                    </Button>
                  </Link>
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
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-stone-400 shadow-sm">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Account Type</p>
                      <p className="text-sm font-bold text-stone-900 capitalize">{user.role.toLowerCase()}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-stone-200 space-y-5">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Profile Details</p>

                  {isEditingProfile ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="profile-first-name" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">First Name</Label>
                          <Input
                            id="profile-first-name"
                            value={profileForm.first_name}
                            onChange={(e) => handleProfileInputChange('first_name', e.target.value)}
                            className="h-10 rounded-xl border-stone-200"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="profile-last-name" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Last Name</Label>
                          <Input
                            id="profile-last-name"
                            value={profileForm.last_name}
                            onChange={(e) => handleProfileInputChange('last_name', e.target.value)}
                            className="h-10 rounded-xl border-stone-200"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="profile-phone" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Phone</Label>
                        <Input
                          id="profile-phone"
                          value={profileForm.phone}
                          onChange={(e) => handleProfileInputChange('phone', e.target.value)}
                          className="h-10 rounded-xl border-stone-200"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="profile-address" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Address</Label>
                        <Input
                          id="profile-address"
                          value={profileForm.address}
                          onChange={(e) => handleProfileInputChange('address', e.target.value)}
                          className="h-10 rounded-xl border-stone-200"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="profile-city" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">City</Label>
                          <Input
                            id="profile-city"
                            value={profileForm.city}
                            onChange={(e) => handleProfileInputChange('city', e.target.value)}
                            className="h-10 rounded-xl border-stone-200"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="profile-postal" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Postal Code</Label>
                          <Input
                            id="profile-postal"
                            value={profileForm.postal_code}
                            onChange={(e) => handleProfileInputChange('postal_code', e.target.value)}
                            className="h-10 rounded-xl border-stone-200"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="profile-country" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Country</Label>
                        <Input
                          id="profile-country"
                          value={profileForm.country}
                          onChange={(e) => handleProfileInputChange('country', e.target.value)}
                          className="h-10 rounded-xl border-stone-200"
                        />
                      </div>

                      <div className="flex gap-2 pt-1">
                        <Button
                          type="button"
                          onClick={handleSaveProfile}
                          disabled={savingProfile}
                          className="flex-1 rounded-xl bg-stone-900 text-white hover:bg-stone-800"
                        >
                          {savingProfile ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancelEditProfile}
                          disabled={savingProfile}
                          className="flex-1 rounded-xl"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Full Name</p>
                        <p className="text-sm text-stone-700">{fullName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Phone</p>
                        <p className="text-sm text-stone-700">{user.phone || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Address</p>
                        <p className="text-sm text-stone-700">{user.address || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">City</p>
                        <p className="text-sm text-stone-700">{user.city || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Postal Code</p>
                        <p className="text-sm text-stone-700">{user.postal_code || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Country</p>
                        <p className="text-sm text-stone-700">{user.country || 'Not set'}</p>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditingProfile(true)}
                        className="w-full rounded-xl"
                      >
                        Edit Profile Details
                      </Button>
                    </div>
                  )}
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
