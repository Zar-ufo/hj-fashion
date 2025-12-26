'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ChevronLeft, Lock, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, isLoading: authLoading, isAuthenticated, resendVerificationEmail } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderSummary, setOrderSummary] = useState<null | {
    id: string;
    total: number;
    shipping_address: string;
    shipping_city: string;
    shipping_postal_code: string;
    shipping_country: string;
    created_at: string;
    items: Array<{
      id: string;
      quantity: number;
      size: string;
      price: number;
      product?: { name: string };
    }>;
  }>(null);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
  });
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [authLoading, isAuthenticated, router]);

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

  const handlePlaceOrder = async () => {
    // Check if user is authenticated and email is verified
    if (!isAuthenticated) {
      setError('Please log in to place an order.');
      return;
    }

    if (!user?.email_verified) {
      setError('Please verify your email address before placing an order.');
      return;
    }

    if (!shippingAddress.name || !shippingAddress.line1 || !shippingAddress.city) {
      setError('Please fill in all required shipping fields.');
      return;
    }

    if (!shippingAddress.postal_code) {
      setError('Please enter a ZIP code.');
      return;
    }

    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const shipping_address = [
        shippingAddress.name,
        shippingAddress.line1,
        shippingAddress.line2,
        shippingAddress.state,
      ]
        .filter(Boolean)
        .join(', ');

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.productId,
            productSlug: item.slug,
            quantity: item.quantity,
            size: item.size || 'M',
            price: item.price,
            name: item.name,
          })),
          shipping_address,
          shipping_city: shippingAddress.city,
          shipping_postal_code: shippingAddress.postal_code,
          shipping_country: shippingAddress.country,
          payment_method: 'DEMO',
          notes: 'Demo checkout (no payment processed)',
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error || 'Failed to place order. Please try again.');
        setIsLoading(false);
        return;
      }

      setOrderId(data?.id || null);
      setOrderSummary(data);
      setSuccess(true);
      clearCart();
      toast.success('Order placed!');
    } catch {
      setError('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-stone-400" />
        </main>
        <Footer />
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  };

  if (success) {
    const addressLines = [
      orderSummary?.shipping_address,
      [orderSummary?.shipping_city, orderSummary?.shipping_postal_code].filter(Boolean).join(' '),
      orderSummary?.shipping_country,
    ].filter(Boolean);

    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center py-12 space-y-6 max-w-md">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-serif font-bold text-stone-900">Order Confirmed!</h2>
              <p className="text-stone-500">Thank you for shopping with HJ Fashion USA.</p>
              <p className="text-stone-400 text-sm">(Demo mode - no payment was processed)</p>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl inline-block border border-stone-100">
              <p className="text-sm font-bold text-stone-900 uppercase tracking-widest">Order ID: {orderId || '—'}</p>
            </div>

            {orderSummary && (
              <div className="text-left p-6 bg-stone-50 rounded-3xl border border-stone-100 space-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Shipping Address</p>
                  <div className="mt-2 space-y-1 text-sm text-stone-900">
                    {addressLines.map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Total</p>
                    <p className="text-lg font-bold text-stone-900">${Number(orderSummary.total || 0).toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Placed</p>
                    <p className="text-sm text-stone-600">{new Date(orderSummary.created_at).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Items</p>
                  <div className="mt-2 space-y-2">
                    {orderSummary.items?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-bold text-stone-900">
                            {item.product?.name || 'Product'}
                          </div>
                          <div className="text-xs text-stone-400 uppercase tracking-widest">
                            Size {item.size} × {item.quantity}
                          </div>
                        </div>
                        <div className="text-sm font-bold text-stone-900">
                          ${(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6">
              <Button asChild className="rounded-full bg-stone-900 px-8">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center space-y-6 max-w-md">
            <h2 className="text-3xl font-serif font-bold text-stone-900">Your bag is empty</h2>
            <p className="text-stone-500">Please add some items to your bag before checking out.</p>
            <Button asChild className="rounded-full bg-stone-900 px-8">
              <Link href="/shop">Explore Collections</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12 lg:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <Link href="/cart" className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors">
              <ChevronLeft className="mr-1 h-4 w-4" /> Back to Bag
            </Link>
            <h1 className="text-4xl font-serif font-bold text-stone-900 mt-4">Checkout</h1>
            <p className="text-stone-400 text-sm mt-2">(Demo mode - no payment processing)</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left Column: Forms */}
            <div className="lg:col-span-7 space-y-12">
              {/* Email verification warning */}
              {user && !user.email_verified && (
                <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-bold text-amber-800">Email Verification Required</h3>
                      <p className="text-sm text-amber-700 mt-1">
                        Please verify your email address ({user.email}) before placing an order.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResendVerification}
                        disabled={resendingEmail}
                        className="mt-3 border-amber-300 text-amber-700 hover:bg-amber-100"
                      >
                        {resendingEmail ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          'Resend Verification Email'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <section className="space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-white font-bold">1</div>
                  <h2 className="text-2xl font-serif font-bold text-stone-900">Shipping Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-stone-50 rounded-3xl border border-stone-100 shadow-sm">
                  <div className="md:col-span-2">
                    <Label htmlFor="name" className="text-xs uppercase tracking-widest font-bold text-stone-500">Full Name *</Label>
                    <Input
                      id="name"
                      value={shippingAddress.name}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                      placeholder="Recipient Name"
                      className="mt-2 h-12 rounded-xl border-stone-200"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="line1" className="text-xs uppercase tracking-widest font-bold text-stone-500">Street Address *</Label>
                    <Input
                      id="line1"
                      value={shippingAddress.line1}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, line1: e.target.value })}
                      placeholder="123 Luxury Lane"
                      className="mt-2 h-12 rounded-xl border-stone-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-xs uppercase tracking-widest font-bold text-stone-500">City *</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      placeholder="City"
                      className="mt-2 h-12 rounded-xl border-stone-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-xs uppercase tracking-widest font-bold text-stone-500">State *</Label>
                    <Input
                      id="state"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      placeholder="State"
                      className="mt-2 h-12 rounded-xl border-stone-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postal_code" className="text-xs uppercase tracking-widest font-bold text-stone-500">ZIP Code *</Label>
                    <Input
                      id="postal_code"
                      value={shippingAddress.postal_code}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postal_code: e.target.value })}
                      placeholder="00000"
                      className="mt-2 h-12 rounded-xl border-stone-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-xs uppercase tracking-widest font-bold text-stone-500">Country</Label>
                    <Input
                      id="country"
                      value="United States"
                      disabled
                      className="mt-2 h-12 rounded-xl border-stone-200 bg-stone-100"
                    />
                  </div>

                  {error && (
                    <div className="md:col-span-2 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="md:col-span-2 pt-4">
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isLoading}
                      className="w-full h-14 rounded-full bg-stone-900 text-white hover:bg-stone-800 text-lg shadow-lg"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Lock className="mr-2 h-4 w-4" /> Place Order
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Summary */}
            <div className="lg:col-span-5">
              <div className="sticky top-32 space-y-8">
                <Card className="rounded-3xl border-stone-100 shadow-sm overflow-hidden">
                  <CardHeader className="bg-stone-50 py-6 px-8 border-b border-stone-100">
                    <CardTitle className="text-xl font-serif font-bold text-stone-900">Your Selection</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2">
                      {cart.map((item) => (
                        <div key={item.id} className="flex space-x-4">
                          <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-stone-50">
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-grow flex flex-col justify-center">
                            <h4 className="text-sm font-bold text-stone-900">{item.name}</h4>
                            <p className="text-xs text-stone-400 uppercase tracking-widest mt-1">Size: {item.size || 'N/A'} × {item.quantity}</p>
                            <p className="text-sm font-bold text-stone-900 mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-stone-100 space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-stone-500">Subtotal</span>
                        <span className="text-stone-900 font-bold">${totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-stone-500">Shipping (US Standard)</span>
                        <span className="text-emerald-600 font-bold uppercase tracking-widest text-[10px]">Complimentary</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold text-stone-900 pt-2">
                        <span>Grand Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="p-6 bg-stone-900 rounded-3xl text-white space-y-4 shadow-xl">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-6 w-6 text-stone-400" />
                    <div>
                      <h4 className="text-sm font-bold">Demo Mode</h4>
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest">No real payment processing</p>
                    </div>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed font-light">
                    This is a demo checkout. No payments are processed, but an order record is created so admins can review orders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
