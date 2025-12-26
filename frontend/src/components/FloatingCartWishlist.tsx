'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, X, Trash2, Minus, Plus, ArrowRight, ChevronUp } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import Link from 'next/link';

type ActivePanel = 'none' | 'cart' | 'wishlist';

export function FloatingCartWishlist() {
  const [activePanel, setActivePanel] = useState<ActivePanel>('none');
  const [mounted, setMounted] = useState(false);
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    totalItems, 
    totalPrice,
    wishlist,
    removeFromWishlist,
    moveToCart
  } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  const togglePanel = (panel: 'cart' | 'wishlist') => {
    setActivePanel(activePanel === panel ? 'none' : panel);
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Wishlist Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => togglePanel('wishlist')}
          className={`relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-colors ${
            activePanel === 'wishlist' 
              ? 'bg-rose-500 text-white' 
              : 'bg-white text-stone-700 hover:bg-rose-50'
          }`}
        >
          <Heart className={`w-6 h-6 ${activePanel === 'wishlist' ? 'fill-white' : ''}`} />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </motion.button>

        {/* Cart Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => togglePanel('cart')}
          className={`relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-colors ${
            activePanel === 'cart' 
              ? 'bg-stone-900 text-white' 
              : 'bg-white text-stone-700 hover:bg-stone-50'
          }`}
        >
          <ShoppingBag className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-stone-900 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </motion.button>
      </div>

      {/* Slide-up Panels */}
      <AnimatePresence>
        {activePanel !== 'none' && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePanel('none')}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 right-0 w-full sm:w-[420px] max-h-[70vh] bg-white rounded-t-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  {activePanel === 'cart' ? (
                    <>
                      <ShoppingBag className="w-5 h-5 text-stone-700" />
                      <h3 className="font-serif text-lg font-bold text-stone-900">Your Cart</h3>
                      <span className="text-sm text-stone-500">({totalItems} items)</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                      <h3 className="font-serif text-lg font-bold text-stone-900">Wishlist</h3>
                      <span className="text-sm text-stone-500">({wishlist.length} items)</span>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setActivePanel('none')}
                  className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {activePanel === 'cart' ? (
                  cart.length > 0 ? (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex gap-4 p-3 bg-stone-50 rounded-xl">
                          <div className="w-16 h-20 flex-shrink-0 overflow-hidden rounded-lg bg-white">
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c'}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-stone-900 text-sm truncate">{item.name}</h4>
                            {item.size && (
                              <p className="text-xs text-stone-500 mt-0.5">Size: {item.size}</p>
                            )}
                            <p className="text-sm font-bold text-stone-900 mt-1">${item.price}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center border border-stone-200 rounded-full bg-white">
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="p-1.5 text-stone-400 hover:text-rose-500 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <ShoppingBag className="w-12 h-12 text-stone-300 mb-4" />
                      <p className="text-stone-500">Your cart is empty</p>
                      <Link 
                        href="/shop"
                        onClick={() => setActivePanel('none')}
                        className="mt-4 text-sm font-medium text-stone-900 hover:underline"
                      >
                        Continue Shopping
                      </Link>
                    </div>
                  )
                ) : (
                  wishlist.length > 0 ? (
                    <div className="space-y-4">
                      {wishlist.map((item) => (
                        <div key={item.id} className="flex gap-4 p-3 bg-rose-50/50 rounded-xl">
                          <Link 
                            href={item.slug ? `/product/${item.slug}` : '/shop'}
                            onClick={() => setActivePanel('none')}
                            className="w-16 h-20 flex-shrink-0 overflow-hidden rounded-lg bg-white"
                          >
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c'}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link 
                              href={item.slug ? `/product/${item.slug}` : '/shop'}
                              onClick={() => setActivePanel('none')}
                            >
                              <h4 className="font-medium text-stone-900 text-sm truncate hover:text-rose-600 transition-colors">{item.name}</h4>
                            </Link>
                            <p className="text-sm font-bold text-stone-900 mt-1">${item.price}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <button 
                                onClick={() => moveToCart(item)}
                                className="flex-1 text-xs font-medium bg-stone-900 text-white py-1.5 px-3 rounded-full hover:bg-stone-800 transition-colors"
                              >
                                Add to Cart
                              </button>
                              <button 
                                onClick={() => removeFromWishlist(item.productId)}
                                className="p-1.5 text-stone-400 hover:text-rose-500 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Heart className="w-12 h-12 text-stone-300 mb-4" />
                      <p className="text-stone-500">Your wishlist is empty</p>
                      <Link 
                        href="/shop"
                        onClick={() => setActivePanel('none')}
                        className="mt-4 text-sm font-medium text-stone-900 hover:underline"
                      >
                        Discover Products
                      </Link>
                    </div>
                  )
                )}
              </div>

              {/* Footer - Only for Cart */}
              {activePanel === 'cart' && cart.length > 0 && (
                <div className="border-t border-stone-100 p-4 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-stone-500">Subtotal</span>
                    <span className="text-lg font-bold text-stone-900">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-3">
                    <Link 
                      href="/cart"
                      onClick={() => setActivePanel('none')}
                      className="flex-1 text-center py-3 px-4 border border-stone-200 rounded-full font-medium text-stone-900 hover:bg-stone-50 transition-colors"
                    >
                      View Cart
                    </Link>
                    <Link 
                      href="/checkout"
                      onClick={() => setActivePanel('none')}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-stone-900 text-white rounded-full font-medium hover:bg-stone-800 transition-colors"
                    >
                      Checkout <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Footer - Only for Wishlist */}
              {activePanel === 'wishlist' && wishlist.length > 0 && (
                <div className="border-t border-stone-100 p-4 bg-white">
                  <Link 
                    href="/shop"
                    onClick={() => setActivePanel('none')}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-rose-500 text-white rounded-full font-medium hover:bg-rose-600 transition-colors"
                  >
                    Continue Shopping <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
