'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, Search, User, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/lib/cart-context';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

const categories = [
  { name: 'Sarees', slug: 'sarees' },
  { name: 'Pakistani Shalwar Kameez', slug: 'pakistani-shalwar-kameez', subcategories: [
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
  { name: 'Dupattas & Scarves', slug: 'dupattas-scarves' },
  { name: 'Undergarments', slug: 'undergarments' },
  { name: 'Sports Wear', slug: 'sports-wear' },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md">
      <div className="container mx-auto px-4">
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
              <span className="text-xl md:text-2xl font-serif font-bold tracking-tighter text-stone-900">
                HJ FASHION USA
              </span>
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-stone-500 group-hover:text-stone-800 transition-colors">
                Pakistani Premium Wear
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link href="/" className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
                        Home
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                
                {categories.map((cat) => (
                  <NavigationMenuItem key={cat.slug}>
                    {cat.subcategories ? (
                      <>
                        <NavigationMenuTrigger className="bg-transparent">{cat.name}</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {cat.subcategories.map((sub) => (
                              <li key={sub.slug}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={`/shop?category=${cat.slug}&subcategory=${sub.slug}`}
                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-stone-100 hover:text-stone-900"
                                  >
                                    <div className="text-sm font-medium leading-none">{sub.name}</div>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                            <li className="col-span-2">
                              <NavigationMenuLink asChild>
                                <Link
                                  href={`/shop?category=${cat.slug}`}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-stone-900 hover:text-white mt-2 bg-stone-50"
                                >
                                  <div className="text-sm font-bold text-center">View All {cat.name}</div>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          </ul>
                        </NavigationMenuContent>
                      </>
                      ) : (
                        <Link href={`/shop?category=${cat.slug}`} passHref>
                          <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
                            {cat.name}
                          </NavigationMenuLink>
                        </Link>
                      )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden sm:block">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-stone-400" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-32 lg:w-40 pl-9 h-9 text-sm border-stone-200 focus:ring-stone-400 focus:border-stone-400 rounded-full bg-stone-50"
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
        <div className="lg:hidden fixed inset-0 top-20 z-50 bg-white overflow-y-auto">
          <div className="flex flex-col p-4 space-y-4">
             <div className="sm:hidden pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
                <Input
                  type="search"
                  placeholder="Search fashion..."
                  className="w-full pl-10 h-11 text-base border-stone-200 rounded-xl bg-stone-50"
                />
              </div>
            </div>
            
            <Link 
              href="/" 
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-medium text-stone-800 border-b border-stone-100 pb-2"
            >
              Home
            </Link>

            {categories.map((cat) => (
              <div key={cat.slug} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Link 
                    href={`/shop?category=${cat.slug}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-medium text-stone-800"
                  >
                    {cat.name}
                  </Link>
                </div>
                {cat.subcategories && (
                  <div className="pl-4 flex flex-col space-y-2 border-l-2 border-stone-100 ml-1">
                    {cat.subcategories.map((sub) => (
                      <Link 
                        key={sub.slug} 
                        href={`/shop?category=${cat.slug}&subcategory=${sub.slug}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="text-stone-500 text-sm py-1"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <div className="pt-6 mt-6 border-t border-stone-100 flex flex-col gap-3">
              <Button asChild variant="outline" className="w-full rounded-xl border-stone-200 h-12">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>My Account</Link>
              </Button>
              <Button asChild className="w-full rounded-xl bg-stone-900 h-12">
                <Link href="/cart" onClick={() => setIsMenuOpen(false)}>View Cart ({totalItems})</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
