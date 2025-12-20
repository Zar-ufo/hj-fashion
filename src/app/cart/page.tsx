'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Trash2, ArrowRight, Minus, Plus } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12 lg:py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-stone-900 mb-8">Your Shopping Bag</h1>

          {cart.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Cart Items List */}
              <div className="lg:col-span-2 space-y-8">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-6 pb-8 border-b border-stone-100 last:border-0">
                    <div className="h-32 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-stone-50">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c'}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    
                    <div className="flex flex-grow flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-serif font-bold text-stone-900">{item.name}</h3>
                          {item.size && (
                            <p className="text-sm text-stone-500 mt-1 uppercase tracking-widest">Size: {item.size}</p>
                          )}
                          <p className="text-sm font-bold text-stone-900 mt-2">${item.price}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-300 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-stone-100 rounded-full px-2 py-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-stone-400 hover:text-stone-900 transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-stone-400 hover:text-stone-900 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-stone-900 font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-32 bg-stone-50 rounded-3xl p-8 space-y-6">
                  <h2 className="text-xl font-serif font-bold text-stone-900 pb-4 border-b border-stone-200">Order Summary</h2>
                  
                  <div className="space-y-4 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-500">Subtotal ({totalItems} items)</span>
                      <span className="text-stone-900 font-bold">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-500">Shipping</span>
                      <span className="text-stone-900 font-bold">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-500">Tax</span>
                      <span className="text-stone-900 font-bold">Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-stone-200">
                    <div className="flex justify-between text-xl font-bold text-stone-900">
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button asChild className="w-full h-14 rounded-full bg-stone-900 text-white hover:bg-stone-800 text-lg shadow-xl">
                    <Link href="/checkout">
                      Checkout Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>

                  <p className="text-[10px] text-center text-stone-400 uppercase tracking-widest leading-relaxed">
                    By proceeding to checkout, you agree to our Terms & Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center space-y-8 bg-stone-50 rounded-3xl">
              <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-stone-200">
                <ShoppingBag className="h-12 w-12" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-serif font-bold text-stone-900">Your bag is empty</h2>
                <p className="text-stone-500 max-w-sm mx-auto">Looks like you haven't added anything to your collection yet.</p>
              </div>
              <Button asChild className="rounded-full px-8 bg-stone-900">
                <Link href="/shop">Start Shopping</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
