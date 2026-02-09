import Link from 'next/link';
import { ArrowRight, Star, Truck, Shield, Heart, Instagram, Mail, ChevronRight, Quote } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { getFeaturedProducts, getNewArrivals } from '@/lib/mock-data';
import { QuickAddToCart } from '@/components/QuickAddToCart';
import { WishlistButton } from '@/components/WishlistButton';
import { HeroSlider } from '@/components/HeroSlider';
import { ShopByCategoryCarousel } from '@/components/ShopByCategoryCarousel';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export const dynamic = 'force-dynamic';

async function fetchApi<T>(path: string): Promise<T> {
  const backendUrl = process.env.BACKEND_URL || 'https://hj-fashion-3.onrender.com';
  const res = await fetch(`${backendUrl}${path}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export default async function Home() {
  // Fetch data from backend API (frontend is DB-free)
  const categories = await fetchApi<any[]>('/api/categories');
  const occasionCategories = await fetchApi<any[]>('/api/categories?occasion=true');
  const featuredEvent = await fetchApi<any | null>('/api/events/featured');

  const getShopByCategoryImage = (category: { slug: string; image_url?: string | null }) => {
    if (category.slug === 'shoes') return '/shoes.jpeg';
    if (category.slug === 'accessories') return '/accesories.png';
    return category.image_url || 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000';
  };
  
  // Use mock data for products (until products are fully migrated)
  const featuredProducts = getFeaturedProducts();
  const newArrivals = getNewArrivals(8);

  // Build occasions array from database
  const occasions = [
    // Featured event as the main banner
    ...(featuredEvent ? [{
      name: featuredEvent.name,
      slug: featuredEvent.id,
      image: featuredEvent.image_url || 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=1000',
      featured: true,
      subtitle: featuredEvent.description?.substring(0, 30) || 'Limited Time Offer',
      countdown: `${featuredEvent.discount_percent}% OFF - Shop Now`
    }] : []),
    // Occasion categories from database
    ...occasionCategories.map(cat => ({
      name: cat.name,
      slug: cat.slug,
      image: cat.image_url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000',
      featured: false
    }))
  ];

  const testimonials = [
    { name: "Ayesha K.", location: "New York, NY", text: "The quality of the lawn suit I ordered is exceptional. Shipping was incredibly fast, and the packaging was beautiful.", rating: 5 },
    { name: "Sana M.", location: "Houston, TX", text: "Finally found an authentic Pakistani boutique in the US! The Anarkali suit fits perfectly and the embroidery is stunning.", rating: 5 },
    { name: "Zainab R.", location: "Chicago, IL", text: "Excellent customer service. They helped me with sizing and even suggested matching accessories. My go-to for Eid outfits now.", rating: 5 },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSlider />

        {/* Featured Categories Grid */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <span className="text-xs uppercase tracking-[0.4em] text-black/40 font-medium">Curated Collections</span>
              <h2 className="text-4xl md:text-5xl font-serif font-light text-black tracking-wide">Shop by Category</h2>
              <div className="flex items-center justify-center gap-4 pt-2">
                <div className="h-[1px] w-12 bg-black/20" />
                <div className="h-1.5 w-1.5 bg-black rotate-45" />
                <div className="h-[1px] w-12 bg-black/20" />
              </div>
              <p className="text-black/50 max-w-xl mx-auto font-light">Explore our curated collections across all categories of premium Pakistani and Indian fashion.</p>
            </div>
            
            {/* Auto-Sliding Category Carousel */}
            <ShopByCategoryCarousel
              categories={(categories || []).slice(0, 6).map((category) => ({
                id: category.id,
                name: category.name,
                slug: category.slug,
                image: getShopByCategoryImage(category),
              }))}
            />

            {/* View All Categories Button */}
            <div className="flex justify-center mt-12">
              <Link 
                href="/shop" 
                className="group inline-flex items-center gap-3 border-2 border-black px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-black hover:text-white transition-all duration-300"
              >
                View All Categories
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Shop by Occasion */}
        <section className="py-24 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-serif font-bold text-stone-900">Shop by Occasion</h2>
              <p className="text-stone-500 max-w-xl mx-auto">Find the perfect outfit for every event in your calendar.</p>
            </div>
            
            {/* Featured Upcoming Event - Large Grid */}
            {occasions.filter(o => o.featured).map((occasion) => (
              <Link 
                key={occasion.slug} 
                href={`/shop?occasion=${occasion.slug}`} 
                className="group relative block w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden mb-6 border-2 border-black"
              >
                <img
                  src={occasion.image}
                  alt={occasion.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                  <span className="text-white/80 text-xs md:text-sm uppercase tracking-[0.3em] mb-3 border border-white/30 px-4 py-1.5">
                    {occasion.subtitle}
                  </span>
                  <h3 className="text-white text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 tracking-wide">
                    {occasion.name}
                  </h3>
                  <div className="h-[1px] w-24 bg-white mb-6" />
                  <span className="text-white text-sm md:text-base uppercase tracking-[0.2em] border-b border-white pb-1 group-hover:pb-2 transition-all">
                    {occasion.countdown}
                  </span>
                </div>
                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/50" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/50" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/50" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/50" />
              </Link>
            ))}

            {/* Other Occasions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {occasions.filter(o => !o.featured).map((occasion) => (
                <Link 
                  key={occasion.slug} 
                  href={`/shop?occasion=${occasion.slug}`} 
                  className="group relative aspect-[3/4] overflow-hidden border-2 border-black hover:border-black transition-all"
                >
                  <img
                    src={occasion.image}
                    alt={occasion.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <span className="text-white text-lg md:text-xl lg:text-2xl font-serif font-bold text-center tracking-wide">
                      {occasion.name}
                    </span>
                    <div className="h-[1px] w-8 bg-white mt-3 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </div>
                  {/* Inner border accent */}
                  <div className="absolute inset-3 border border-white/20 pointer-events-none group-hover:border-white/40 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-[0.4em] text-black/40 font-medium">Fresh Drops</span>
                <h2 className="text-4xl md:text-5xl font-serif font-light text-black tracking-wide">New Arrivals</h2>
                <div className="h-[1px] w-16 bg-black"></div>
                <p className="text-black/50 max-w-xl font-light">Fresh off the loom. Check out our latest festive and seasonal collections direct from top designers.</p>
              </div>
              <Link 
                href="/shop" 
                className="group inline-flex items-center gap-3 border-2 border-black px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-black hover:text-white transition-all duration-300"
              >
                View All
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {newArrivals?.map((product, index) => (
                <div key={product.id} className="group flex flex-col">
                  <div className="relative aspect-[3/4] overflow-hidden bg-black border-2 border-black mb-4">
                    <img
                      src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000'}
                      alt={product.name}
                      className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-90"
                    />
                    {/* Inner border */}
                    <div className="absolute inset-3 border border-white/20 pointer-events-none group-hover:border-white/40 transition-all duration-500" />
                    
                    {/* Wishlist button */}
                    <div className="absolute top-4 right-4 z-10">
                      <WishlistButton
                        product={{
                          id: product.id,
                          name: product.name,
                          slug: product.slug,
                          price: product.price,
                          image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000'
                        }}
                        className="h-9 w-9 bg-white/90 hover:bg-white border-0"
                      />
                    </div>
                    
                    {/* Sale badge */}
                    {product.original_price && (
                      <div className="absolute top-4 left-4 bg-black text-white px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.2em]">
                        Sale
                      </div>
                    )}
                    
                    {/* New badge for first 2 items */}
                    {index < 2 && !product.original_price && (
                      <div className="absolute top-4 left-4 bg-white text-black px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.2em] border border-black">
                        New
                      </div>
                    )}
                    
                    {/* Quick add overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <QuickAddToCart 
                        product={{
                          id: product.id,
                          name: product.name,
                          slug: product.slug,
                          price: product.price,
                          image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000'
                        }} 
                      />
                    </div>
                  </div>
                  
                  {/* Product info */}
                  <div className="flex flex-col space-y-2 px-1">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-medium">{product.categories?.name}</span>
                    <Link href={`/product/${product.slug}`} className="text-sm md:text-base font-serif font-light text-black hover:text-black/60 truncate transition-colors tracking-wide">
                      {product.name}
                    </Link>
                    <div className="flex items-center space-x-3">
                      <span className="text-base font-medium text-black">${product.price}</span>
                      {product.original_price && (
                        <span className="text-sm text-black/30 line-through">${product.original_price}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Best Sellers Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <span className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-medium">Customer Favorites</span>
              <h2 className="text-4xl md:text-5xl font-serif font-light text-black tracking-wide">Our Best Sellers</h2>
              <div className="h-[1px] w-16 bg-black mx-auto"></div>
              <p className="text-black/50 max-w-xl mx-auto font-light">Most-loved styles that our customers are raving about.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredProducts?.map((product, index) => (
                <div key={product.id} className="group">
                  <div className="relative aspect-[3/4] overflow-hidden border-2 border-black bg-black mb-4">
                    <img
                      src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000'}
                      alt={product.name}
                      className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                    />
                    {/* Inner border */}
                    <div className="absolute inset-3 border border-white/20 pointer-events-none group-hover:border-white/40 transition-all" />
                    
                    {/* Rating badge */}
                    <div className="absolute top-3 right-3">
                       <div className="flex h-7 items-center space-x-1 bg-white px-2.5 text-black text-[10px] font-medium tracking-wide">
                        <Star className="h-3 w-3 fill-black" />
                        <span>{product.ratings || 4.9}</span>
                      </div>
                    </div>
                    
                    {/* Bestseller badge */}
                    {index === 0 && (
                      <div className="absolute top-3 left-3 bg-black text-white text-[9px] font-medium uppercase tracking-[0.15em] px-3 py-1.5">
                        #1 Seller
                      </div>
                    )}
                    
                    {/* Quick add */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <QuickAddToCart 
                        product={{
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000'
                        }} 
                      />
                    </div>
                  </div>
                  <div className="space-y-2 px-1">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-medium">{product.categories?.name}</span>
                    <Link href={`/product/${product.slug}`} className="block text-sm font-serif font-light text-black hover:text-black/60 truncate transition-colors tracking-wide">
                      {product.name}
                    </Link>
                    <span className="text-sm font-medium text-black">${product.price}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* View All Button */}
            <div className="flex justify-center mt-14">
              <Link 
                href="/shop?sort=bestselling" 
                className="group inline-flex items-center gap-3 border-2 border-black px-10 py-4 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-black hover:text-white transition-all duration-300"
              >
                Shop All Best Sellers
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose HJ Fashion USA (Trust Section) */}
        <section className="py-24 bg-black text-white relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px'}} />
          </div>
          
          <div className="container mx-auto px-4 relative">
            {/* Section Header */}
            <div className="text-center mb-20 space-y-4">
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-medium">Why Choose Us</span>
              <h2 className="text-3xl md:text-4xl font-serif font-light tracking-wide">The HJ Difference</h2>
              <div className="h-[1px] w-16 bg-white/30 mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              <div className="group flex flex-col items-center text-center space-y-6 p-8 border border-white/10 hover:border-white/30 transition-all duration-500 relative">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-white/30" />
                <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-white/30" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-white/30" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-white/30" />
                
                <div className="h-16 w-16 border border-white/30 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-500">
                  <Star className="h-6 w-6" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-serif font-light tracking-wide">Authentic Fashion</h3>
                  <p className="text-[13px] text-white/50 leading-relaxed font-light">100% original Pakistani & Indian designer wear sourced directly from high-end labels.</p>
                </div>
              </div>
              
              <div className="group flex flex-col items-center text-center space-y-6 p-8 border border-white/10 hover:border-white/30 transition-all duration-500 relative">
                <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-white/30" />
                <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-white/30" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-white/30" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-white/30" />
                
                <div className="h-16 w-16 border border-white/30 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-500">
                  <Truck className="h-6 w-6" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-serif font-light tracking-wide">US-Based Fast Shipping</h3>
                  <p className="text-[13px] text-white/50 leading-relaxed font-light">Inventory stored in USA for lightning-fast delivery across the states. No customs stress.</p>
                </div>
              </div>
              
              <div className="group flex flex-col items-center text-center space-y-6 p-8 border border-white/10 hover:border-white/30 transition-all duration-500 relative">
                <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-white/30" />
                <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-white/30" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-white/30" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-white/30" />
                
                <div className="h-16 w-16 border border-white/30 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-500">
                  <Shield className="h-6 w-6" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-serif font-light tracking-wide">Quality Guaranteed</h3>
                  <p className="text-[13px] text-white/50 leading-relaxed font-light">Every piece undergoes rigorous quality checks to ensure perfect stitching and fabric quality.</p>
                </div>
              </div>
              
              <div className="group flex flex-col items-center text-center space-y-6 p-8 border border-white/10 hover:border-white/30 transition-all duration-500 relative">
                <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-white/30" />
                <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-white/30" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-white/30" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-white/30" />
                
                <div className="h-16 w-16 border border-white/30 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-500">
                  <Heart className="h-6 w-6" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-serif font-light tracking-wide">Secure & Easy Returns</h3>
                  <p className="text-[13px] text-white/50 leading-relaxed font-light">Shop with confidence. Secure checkout and a hassle-free 14-day return policy.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Testimonials */}
        <section className="py-24 bg-stone-50 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-serif font-bold text-stone-900">What Our Customers Say</h2>
              <p className="text-stone-500">Real reviews from our community of fashion enthusiasts.</p>
            </div>

            <Carousel className="max-w-4xl mx-auto">
              <CarouselContent>
                {testimonials.map((t, i) => (
                  <CarouselItem key={i}>
                    <div className="flex flex-col items-center text-center space-y-8 px-12 pb-8">
                       <Quote className="h-12 w-12 text-stone-200 fill-stone-200" />
                       <p className="text-2xl md:text-3xl font-serif italic text-stone-700 leading-relaxed">"{t.text}"</p>
                       <div className="flex items-center gap-1">
                          {[...Array(t.rating)].map((_, j) => <Star key={j} className="h-4 w-4 fill-stone-900 text-stone-900" />)}
                       </div>
                       <div>
                          <p className="text-lg font-bold text-stone-900">{t.name}</p>
                          <p className="text-sm text-stone-500">{t.location}</p>
                       </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        {/* Instagram Feed / Social Proof */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
             <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
              <div className="text-center md:text-left space-y-2">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">Follow the Journey</h2>
                <p className="text-stone-500">Tag us in your looks @hjfashionusa for a chance to be featured.</p>
              </div>
              <Button variant="outline" className="rounded-full gap-2 border-stone-900 hover:bg-stone-900 hover:text-white">
                <Instagram className="h-5 w-5" /> Follow Us
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="aspect-square bg-stone-100 rounded-lg overflow-hidden relative group">
                    <img 
                      src={`https://images.unsplash.com/photo-${1580000000000 + i}?q=80&w=600`} 
                      alt="Social proof" 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Instagram className="text-white h-8 w-8" />
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-24 bg-white border-t border-stone-100">
           <div className="container mx-auto px-4 max-w-4xl">
              <div className="bg-stone-900 rounded-[3rem] p-8 md:p-16 text-center text-white relative overflow-hidden">
                 <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-stone-800 opacity-50 blur-3xl" />
                 <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-stone-800 opacity-50 blur-3xl" />
                 
                 <div className="relative z-10 space-y-8 px-4">
                    <Mail className="h-12 w-12 mx-auto text-stone-400" />
                    <div className="space-y-4">
                      <h2 className="text-4xl font-serif font-bold">Treat Yourself to 10% Off</h2>
                      <p className="text-stone-400 text-lg font-light max-w-lg mx-auto">Join the HJ Fashion inner circle for exclusive early access to drops and a special gift on your first order.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        className="flex-grow rounded-2xl bg-stone-800 border-none px-6 py-4 focus:ring-2 focus:ring-white/20 outline-none transition-all text-white placeholder:text-stone-500"
                      />
                      <Button className="rounded-2xl px-8 bg-white text-stone-900 hover:bg-stone-100 font-bold transition-all py-6 h-auto">
                        Join Now
                      </Button>
                    </div>
                    <p className="text-[10px] text-stone-500 uppercase tracking-[0.2em] pt-4">By joining, you agree to our Terms & Privacy Policy.</p>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
