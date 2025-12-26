'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  productId: string;
  slug?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image?: string;
  slug?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  wishlist: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, 'id'>) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCart: (item: WishlistItem, size?: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('hj-fashion-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    const savedWishlist = localStorage.getItem('hj-fashion-wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Failed to parse wishlist', e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage on changes (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('hj-fashion-cart', JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  // Save wishlist to localStorage on changes (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('hj-fashion-wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isHydrated]);

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    setCart((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item.productId === newItem.productId && item.size === newItem.size
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prev];
        updatedCart[existingItemIndex].quantity += newItem.quantity;
        return updatedCart;
      }

      return [...prev, { ...newItem, id: Math.random().toString(36).substr(2, 9) }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Wishlist functions
  const addToWishlist = (newItem: Omit<WishlistItem, 'id'>) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.productId === newItem.productId);
      if (exists) return prev;
      return [...prev, { ...newItem, id: Math.random().toString(36).substr(2, 9) }];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.productId !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.productId === productId);
  };

  const moveToCart = (item: WishlistItem, size?: string) => {
    addToCart({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      size: size || 'M',
    });
    removeFromWishlist(item.productId);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        moveToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
