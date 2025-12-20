'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/lib/cart-context';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex flex-shrink-0 items-center">
            <Link href="/" className="group flex flex-col items-center">
              <span className="text-2xl font-serif font-bold tracking-tighter text-stone-900">
                HJ FASHION USA
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500 group-hover:text-stone-800 transition-colors">
                Pakistani Premium Wear
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:space-x-8">
            <Link href="/shop" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">Shop All</Link>
            <Link href="/shop?category=shalwar-kameez" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">Shalwar Kameez</Link>
            <Link href="/shop?category=anarkali-suits" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">Anarkali</Link>
            <Link href="/shop?category=lehenga" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">Lehenga</Link>
            <Link href="/about" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">Our Story</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-stone-400" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-40 pl-9 h-9 text-sm border-stone-200 focus:ring-stone-400 focus:border-stone-400 rounded-full bg-stone-50"
                />
              </div>
            </div>
            <Link href="/account">
              <User className="h-6 w-6 text-stone-600 hover:text-stone-900 cursor-pointer transition-colors" />
            </Link>
            <Link href="/cart" className="relative group">
              <ShoppingBag className="h-6 w-6 text-stone-600 group-hover:text-stone-900 cursor-pointer transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-stone-900 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t bg-white">
          <div className="space-y-1 px-4 pt-2 pb-6">
            <Link href="/shop" className="block py-3 text-base font-medium text-stone-800 border-b border-stone-50">Shop All</Link>
            <Link href="/shop?category=shalwar-kameez" className="block py-3 text-base font-medium text-stone-800 border-b border-stone-50">Shalwar Kameez</Link>
            <Link href="/shop?category=anarkali-suits" className="block py-3 text-base font-medium text-stone-800 border-b border-stone-50">Anarkali Suits</Link>
            <Link href="/shop?category=lehenga" className="block py-3 text-base font-medium text-stone-800 border-b border-stone-50">Lehenga</Link>
            <Link href="/about" className="block py-3 text-base font-medium text-stone-800">Our Story</Link>
            <div className="pt-4 flex justify-between items-center">
              <Button variant="outline" className="w-full mr-2 rounded-full border-stone-200">Sign In</Button>
              <Button className="w-full ml-2 rounded-full bg-stone-900">Cart</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
