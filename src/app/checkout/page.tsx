'use client';

import { useState } from 'react';
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

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
}

function CheckoutForm({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
        return_url: window.location.origin,
      },
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message || 'An error occurred');
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setSuccess(true);
      setMessage('Payment successful! Your order has been placed.');
    } else {
      setMessage('Payment processing...');
    }

    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-serif text-stone-800 mb-2">
          Thank You For Your Order!
        </h2>
        <p className="text-stone-600 mb-2">Order ID: {orderId}</p>
        <p className="text-stone-500">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="max-h-[400px] overflow-y-auto p-1">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {message && !success && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
          {message}
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || !elements || isLoading}
        className="w-full bg-stone-800 hover:bg-stone-900 text-white py-6 text-lg font-medium"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          'Complete Payment'
        )}
      </Button>
    </form>
  );
}

const DEMO_ITEMS: CartItem[] = [
  {
    productId: '00000000-0000-0000-0000-000000000001',
    name: 'Embroidered Lawn Suit',
    price: 129.99,
    quantity: 1,
    size: 'M',
  },
  {
    productId: '00000000-0000-0000-0000-000000000002',
    name: 'Chiffon Dupatta',
    price: 49.99,
    quantity: 2,
    size: 'One Size',
  },
];

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [items] = useState<CartItem[]>(DEMO_ITEMS);
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
  });

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleInitiatePayment = async () => {
    if (!shippingAddress.name || !shippingAddress.line1 || !shippingAddress.city) {
      setError('Please fill in required shipping details');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment');
      }

      setClientSecret(data.clientSecret);
      setOrderId(data.orderId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-stone-100">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif text-stone-800 mb-2">
            HJ Fashion USA
          </h1>
          <p className="text-stone-600 font-light tracking-wide">
            Premium Pakistani Women's Clothing
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
            <CardHeader className="border-b border-stone-100">
              <CardTitle className="font-serif text-stone-800">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start pb-4 border-b border-stone-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-stone-800">{item.name}</p>
                      <p className="text-sm text-stone-500">
                        Size: {item.size} | Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-stone-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200">
                <div className="flex justify-between text-lg font-semibold text-stone-800">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
            <CardHeader className="border-b border-stone-100">
              <CardTitle className="font-serif text-stone-800">
                {clientSecret ? 'Payment Details' : 'Shipping Address'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {!clientSecret ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={shippingAddress.name}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, name: e.target.value })
                      }
                      placeholder="Your full name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="line1">Address Line 1 *</Label>
                    <Input
                      id="line1"
                      value={shippingAddress.line1}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, line1: e.target.value })
                      }
                      placeholder="Street address"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="line2">Address Line 2</Label>
                    <Input
                      id="line2"
                      value={shippingAddress.line2}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, line2: e.target.value })
                      }
                      placeholder="Apt, suite, etc."
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, city: e.target.value })
                        }
                        placeholder="City"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={shippingAddress.state}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, state: e.target.value })
                        }
                        placeholder="State"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="postal_code">ZIP Code</Label>
                    <Input
                      id="postal_code"
                      value={shippingAddress.postal_code}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          postal_code: e.target.value,
                        })
                      }
                      placeholder="ZIP Code"
                      className="mt-1"
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    onClick={handleInitiatePayment}
                    disabled={isLoading}
                    className="w-full bg-stone-800 hover:bg-stone-900 text-white py-6 text-lg font-medium mt-4"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Continue to Payment'
                    )}
                  </Button>
                </div>
              ) : (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#292524',
                        colorBackground: '#ffffff',
                        colorText: '#1c1917',
                        fontFamily: 'system-ui, sans-serif',
                        borderRadius: '8px',
                      },
                    },
                  }}
                >
                  <CheckoutForm orderId={orderId!} />
                </Elements>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-stone-500">
          <p>Secure payment powered by Stripe</p>
          <p className="mt-1">
            Supports Cards, Apple Pay, Google Pay, and more
          </p>
        </div>
      </div>
    </div>
  );
}
