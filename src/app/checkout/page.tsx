'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/lib/cart-context';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ChevronLeft, Lock } from 'lucide-react';
import Link from 'next/link';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function CheckoutForm({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { clearCart } = useCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/order-confirmation?orderId=' + orderId,
      },
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message || 'An error occurred');
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setSuccess(true);
      setMessage('Payment successful! Your order has been placed.');
      clearCart();
    } else {
      setMessage('Payment processing...');
    }

    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="text-center py-12 space-y-6">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-serif font-bold text-stone-900">Order Confirmed!</h2>
          <p className="text-stone-500">Thank you for shopping with HJ Fashion USA.</p>
        </div>
        <div className="p-4 bg-stone-50 rounded-2xl inline-block border border-stone-100">
          <p className="text-sm font-bold text-stone-900 uppercase tracking-widest">Order ID: {orderId}</p>
        </div>
        <div className="pt-6">
          <Button asChild className="rounded-full bg-stone-900 px-8">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-1">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {message && !success && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-sm">
          {message}
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || !elements || isLoading}
        className="w-full h-14 rounded-full bg-stone-900 text-white hover:bg-stone-800 text-lg shadow-xl transition-all active:scale-95"
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
            <Lock className="mr-2 h-4 w-4" /> Pay Securely
          </span>
        )}
      </Button>
    </form>
  );
}

export default function CheckoutPage() {
  const { cart, totalPrice } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
  });

  const handleInitiatePayment = async () => {
    if (!shippingAddress.name || !shippingAddress.line1 || !shippingAddress.city) {
      setError('Please fill in all required shipping fields.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          shippingAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize checkout.');
      }

      setClientSecret(data.clientSecret);
      setOrderId(data.orderId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.length === 0 && !orderId) {
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
            <h1 className="text-4xl font-serif font-bold text-stone-900 mt-4">Secure Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left Column: Forms */}
            <div className="lg:col-span-7 space-y-12">
              <section className="space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-white font-bold">1</div>
                  <h2 className="text-2xl font-serif font-bold text-stone-900">Shipping Details</h2>
                </div>

                {!clientSecret ? (
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
                        onClick={handleInitiatePayment}
                        disabled={isLoading}
                        className="w-full h-14 rounded-full bg-stone-900 text-white hover:bg-stone-800 text-lg shadow-lg"
                      >
                        {isLoading ? 'Processing...' : 'Continue to Payment'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-widest font-bold text-emerald-600">Shipping To</p>
                      <p className="text-stone-900 font-medium mt-1">{shippingAddress.name}</p>
                      <p className="text-stone-500 text-sm">{shippingAddress.line1}, {shippingAddress.city}</p>
                    </div>
                    <Button variant="ghost" onClick={() => setClientSecret(null)} className="text-emerald-700 hover:bg-emerald-100 rounded-full">
                      Edit
                    </Button>
                  </div>
                )}
              </section>

              <section className="space-y-8">
                <div className="flex items-center space-x-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${clientSecret ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-400'}`}>2</div>
                  <h2 className={`text-2xl font-serif font-bold ${clientSecret ? 'text-stone-900' : 'text-stone-300'}`}>Payment Information</h2>
                </div>

                {clientSecret && (
                  <div className="p-8 bg-white rounded-3xl border border-stone-100 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Elements
                      stripe={stripePromise}
                      options={{
                        clientSecret,
                        appearance: {
                          theme: 'stripe',
                          variables: {
                            colorPrimary: '#1c1917',
                            colorBackground: '#ffffff',
                            colorText: '#1c1917',
                            borderRadius: '12px',
                          },
                        },
                      }}
                    >
                      <CheckoutForm orderId={orderId!} />
                    </Elements>
                  </div>
                )}
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
                    <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
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
                    <ShieldCheck className="h-6 w-6 text-stone-400" />
                    <div>
                      <h4 className="text-sm font-bold">Secure Transactions</h4>
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest">End-to-end encrypted payments</p>
                    </div>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed font-light">
                    Your personal and payment data is protected. We use industry-leading encryption to ensure your safety.
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
