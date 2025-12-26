'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, Menu, X, ChevronDown, Heart, Phone, Mail, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { cn } from "@/lib/utils"

const categories = [
  { name: 'Sarees', slug: 'sarees' },
  { name: 'Pakistani Suits', slug: 'pakistani-shalwar-kameez', subcategories: [
    { name: 'Shalwar Kameez', slug: 'shalwar-kameez' },
    { name: 'Anarkali Suits', slug: 'anarkali-suits' },
    { name: 'Sharara & Gharara', slug: 'sharara-gharara' },
    { name: 'Kurti Collection', slug: 'kurti-collection' },
    { name: 'Lehenga', slug: 'lehenga' },
  ]},
  { name: 'Lawn Suits', slug: 'lawn-suits' },
  { name: 'Bags', slug: 'bags' },
  { name: 'Shoes', slug: 'shoes' },
  { name: 'Accessories', slug: 'accessories' },
  { name: 'Dupattas', slug: 'dupattas-scarves' },
  { name: 'Undergarments', slug: 'undergarments' },
  { name: 'Sports Wear', slug: 'sports-wear' },
];

const quickLinks = [
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Size Guide', href: '/size-guide' },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Luxury Top Bar */}
      <div className="hidden lg:block bg-black text-white py-2.5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.03)_50%,transparent_100%)]"></div>
        <div className="container mx-auto px-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-8 text-xs tracking-wider">
            <span className="flex items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer">
              <Phone className="h-3 w-3" /> +1 (555) 123-4567
            </span>
            <span className="flex items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer">
              <Mail className="h-3 w-3" /> hello@hjfashion.com
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-light tracking-[0.2em] uppercase text-white/90">
              Complimentary Shipping on Orders Over $150
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs tracking-wider">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-white/70 hover:text-white transition-colors uppercase">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500 border-b",
        scrolled 
          ? "bg-white/95 backdrop-blur-xl shadow-sm border-black/5" 
          : "bg-white border-black/10"
      )}>
        {/* Logo Section */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-5">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center"
            >
              <div className="relative w-6 h-5 flex flex-col justify-between">
                <span className={cn(
                  "block h-[1.5px] bg-black transition-all duration-300 origin-center",
                  isMenuOpen ? "rotate-45 translate-y-[9px]" : ""
                )} />
                <span className={cn(
                  "block h-[1.5px] bg-black transition-all duration-300",
                  isMenuOpen ? "opacity-0 scale-0" : ""
                )} />
                <span className={cn(
                  "block h-[1.5px] bg-black transition-all duration-300 origin-center",
                  isMenuOpen ? "-rotate-45 -translate-y-[9px]" : ""
                )} />
              </div>
            </button>

            {/* Logo */}
            <Link href="/" className="group flex flex-col items-center relative">
              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="relative bg-black text-white px-4 py-2">
                      <span className="text-xl font-light tracking-[0.3em]">HJ</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-2xl md:text-3xl font-light tracking-[0.15em] text-black uppercase">
                      Fashion
                    </span>
                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-black/50 font-light">
                      Premium Pakistani Wear
                    </span>
                  </div>
                </div>
                <div className="absolute -bottom-2 left-0 right-0 h-[1px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            </Link>

            {/* Desktop Actions */}
            <div className="flex items-center gap-1">
              {/* Search Toggle */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={cn(
                  "relative p-3 transition-all duration-300 group",
                  isSearchOpen 
                    ? "bg-black text-white" 
                    : "hover:bg-black/5"
                )}
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Wishlist */}
              <Link 
                href="/account" 
                className="relative p-3 hover:bg-black/5 transition-all duration-300 group hidden sm:flex"
              >
                <Heart className="h-5 w-5" />
              </Link>

              {/* Account */}
              <Link 
                href={isAuthenticated ? "/account" : "/login"} 
                className="relative p-3 hover:bg-black/5 transition-all duration-300 group"
                title={isAuthenticated ? user?.first_name || 'Account' : 'Sign In'}
              >
                <User className="h-5 w-5" />
                {isAuthenticated && !isLoading && (
                  <span className="absolute bottom-1 right-1 w-2 h-2 bg-emerald-500 rounded-full border border-white" />
                )}
              </Link>

              {/* Cart */}
              <Link 
                href="/cart" 
                className="relative p-3 hover:bg-black/5 transition-all duration-300 group"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center bg-black text-[10px] font-medium text-white">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Search Bar - Expandable */}
        <div className={cn(
          "overflow-hidden transition-all duration-500 ease-out bg-white border-t border-black/5",
          isSearchOpen ? "max-h-20 py-4" : "max-h-0 py-0"
        )}>
          <div className="container mx-auto px-4">
            <div className="relative max-w-2xl mx-auto">
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-4 w-4 text-black/40" />
                <Input
                  type="search"
                  placeholder="Search our collection..."
                  className="w-full pl-12 pr-4 h-12 text-sm border-black/20 focus:border-black bg-transparent placeholder:text-black/40 tracking-wide"
                  autoFocus={isSearchOpen}
                />
                <Button className="absolute right-1 h-10 px-6 bg-black hover:bg-black/90 text-white text-xs tracking-wider uppercase">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Navigation Bar */}
        <div className="hidden lg:block border-t border-black/5 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-1">
              {/* Home Link */}
              <Link 
                href="/" 
                className="relative px-5 py-4 text-xs font-medium tracking-[0.15em] uppercase text-black/70 hover:text-black transition-colors group"
              >
                <span className="relative z-10">Home</span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-300" />
              </Link>

              {/* Shop All */}
              <Link 
                href="/shop" 
                className="relative px-5 py-4 text-xs font-medium tracking-[0.15em] uppercase text-black/70 hover:text-black transition-colors group"
              >
                <span className="relative z-10">Shop All</span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-300" />
              </Link>

              {/* Categories */}
              {categories.map((cat) => (
                <div 
                  key={cat.slug}
                  className="relative"
                  onMouseEnter={() => setActiveCategory(cat.slug)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <Link 
                    href={`/shop?category=${cat.slug}`}
                    className="relative px-4 py-4 text-xs font-medium tracking-[0.1em] uppercase text-black/70 hover:text-black transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="relative z-10">{cat.name}</span>
                    {cat.subcategories && (
                      <ChevronDown className={cn(
                        "h-3 w-3 transition-transform duration-300",
                        activeCategory === cat.slug ? "rotate-180" : ""
                      )} />
                    )}
                    <span className={cn(
                      "absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-black transition-all duration-300",
                      activeCategory === cat.slug ? "w-full" : "w-0"
                    )} />
                  </Link>

                  {/* Dropdown for subcategories */}
                  {cat.subcategories && (
                    <div className={cn(
                      "absolute top-full left-1/2 -translate-x-1/2 pt-0 transition-all duration-300",
                      activeCategory === cat.slug 
                        ? "opacity-100 visible translate-y-0" 
                        : "opacity-0 invisible -translate-y-2"
                    )}>
                      <div className="relative bg-white border border-black/10 shadow-xl p-6 min-w-[280px]">
                        <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-[1px] bg-black" />
                        <div className="relative z-10 space-y-1">
                          {cat.subcategories.map((sub) => (
                            <Link
                              key={sub.slug}
                              href={`/shop?category=${cat.slug}&subcategory=${sub.slug}`}
                              className="block px-4 py-3 text-xs tracking-[0.1em] uppercase text-black/60 hover:text-black hover:bg-black/[0.02] transition-colors border-b border-black/5 last:border-0"
                            >
                              {sub.name}
                            </Link>
                          ))}
                          <div className="pt-4 mt-2">
                            <Link
                              href={`/shop?category=${cat.slug}`}
                              className="block px-4 py-3 bg-black text-white text-xs tracking-[0.15em] uppercase text-center hover:bg-black/90 transition-all"
                            >
                              View All {cat.name}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <div className={cn(
        "lg:hidden fixed inset-0 z-[60] transition-all duration-500",
        isMenuOpen ? "visible" : "invisible"
      )}>
        {/* Backdrop */}
        <div 
          className={cn(
            "absolute inset-0 bg-black/60 transition-opacity duration-500",
            isMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div className={cn(
          "absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-out overflow-hidden",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          {/* Menu Header */}
          <div className="relative bg-black px-6 py-8">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white text-black px-3 py-1.5">
                  <span className="text-lg font-light tracking-[0.3em]">HJ</span>
                </div>
                <div>
                  <div className="text-white font-light text-xl tracking-[0.15em] uppercase">Fashion</div>
                  <div className="text-white/50 text-[9px] tracking-[0.3em] uppercase">Premium Pakistani Wear</div>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  type="search"
                  placeholder="Search collection..."
                  className="w-full pl-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm tracking-wide"
                />
              </div>
            </div>
          </div>

          {/* Menu Content */}
          <div className="overflow-y-auto h-[calc(100%-220px)] py-6">
            {/* Quick Links */}
            <div className="px-6 mb-6">
              <div className="flex gap-2">
                <Link 
                  href="/" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 py-3 border border-black/20 text-center text-xs tracking-[0.1em] uppercase text-black hover:bg-black hover:text-white transition-colors"
                >
                  Home
                </Link>
                <Link 
                  href="/shop" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 py-3 bg-black text-center text-xs tracking-[0.1em] uppercase text-white hover:bg-black/90 transition-colors"
                >
                  Shop All
                </Link>
              </div>
            </div>

            {/* Categories */}
            <div className="px-6 space-y-1">
              <div className="text-[10px] font-medium text-black/40 uppercase tracking-[0.2em] px-2 mb-4">
                Categories
              </div>
              {categories.map((cat) => (
                <div key={cat.slug} className="space-y-1">
                  <Link 
                    href={`/shop?category=${cat.slug}`}
                    onClick={() => !cat.subcategories && setIsMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3.5 hover:bg-black/[0.02] transition-colors border-b border-black/5"
                  >
                    <span className="text-xs tracking-[0.1em] uppercase text-black/80">{cat.name}</span>
                    {cat.subcategories && (
                      <ChevronDown className="h-3.5 w-3.5 text-black/40" />
                    )}
                  </Link>
                  {cat.subcategories && (
                    <div className="pl-6 space-y-0">
                      {cat.subcategories.map((sub) => (
                        <Link 
                          key={sub.slug}
                          href={`/shop?category=${cat.slug}&subcategory=${sub.slug}`}
                          onClick={() => setIsMenuOpen(false)}
                          className="block py-2.5 px-4 text-[11px] tracking-[0.1em] uppercase text-black/50 hover:text-black transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <div className="px-6 mt-8 pt-6 border-t border-black/10">
              <div className="text-[10px] font-medium text-black/40 uppercase tracking-[0.2em] px-2 mb-4">
                Information
              </div>
              <div className="space-y-1">
                <Link 
                  href="/about" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3 px-4 text-xs tracking-[0.1em] uppercase text-black/60 hover:text-black transition-colors"
                >
                  About Us
                </Link>
                <Link 
                  href="/contact" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3 px-4 text-xs tracking-[0.1em] uppercase text-black/60 hover:text-black transition-colors"
                >
                  Contact
                </Link>
                <Link 
                  href="/size-guide" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3 px-4 text-xs tracking-[0.1em] uppercase text-black/60 hover:text-black transition-colors"
                >
                  Size Guide
                </Link>
              </div>
            </div>
          </div>

          {/* Menu Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-black/10">
            <div className="flex gap-2">
              <Link 
                href="/account" 
                onClick={() => setIsMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-black/20 text-xs tracking-[0.1em] uppercase text-black hover:bg-black hover:text-white transition-colors"
              >
                <User className="h-4 w-4" />
                Account
              </Link>
              <Link 
                href="/cart" 
                onClick={() => setIsMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-black text-xs tracking-[0.1em] uppercase text-white hover:bg-black/90 transition-colors relative"
              >
                <ShoppingBag className="h-4 w-4" />
                Cart
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-black text-[10px] flex items-center justify-center font-medium border border-black">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
