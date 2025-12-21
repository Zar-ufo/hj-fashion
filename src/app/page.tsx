import Link from 'next/link';
import { ArrowRight, Star, Truck, Shield, Heart, Instagram, Mail, ChevronRight, Quote } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { createServerSupabaseClient } from '@/lib/supabase';
import { QuickAddToCart } from '@/components/QuickAddToCart';
import { HeroSlider } from '@/components/HeroSlider';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default async function Home() {
  const supabase = createServerSupabaseClient();

  // Fetch featured products (Best Sellers)
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('is_featured', true)
    .limit(8);

  // Fetch new arrivals
  const { data: newArrivals } = await supabase
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })
    .limit(8);

  // Fetch all 9 categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  const occasions = [
    { name: 'Weddings', slug: 'weddings', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000' },
    { name: 'Eid', slug: 'eid', image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=1000' },
    { name: 'Parties', slug: 'parties', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000' },
    { name: 'Casual', slug: 'casual', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000' },
    { name: 'Formal', slug: 'formal', image: 'https://images.unsplash.com/photo-1507679799987-c7377457a18b?q=80&w=1000' },
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
        <section className="py-24 container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900">Shop by Category</h2>
            <p className="text-stone-500 max-w-xl mx-auto">Explore our curated collections across all categories of premium Pakistani and Indian fashion.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categories?.map((category) => (
              <Link key={category.id} href={`/shop?category=${category.slug}`} className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-stone-100 shadow-sm hover:shadow-xl transition-all duration-500">
                <img
                  src={category.image_url || 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000'}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2 transform group-hover:-translate-y-2 transition-transform duration-500">{category.name}</h3>
                  <div className="h-1 w-12 bg-white mb-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  <p className="text-sm font-medium uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center">
                    Discover <ChevronRight className="ml-1 h-4 w-4" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="py-24 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="space-y-4">
                <h2 className="text-4xl font-serif font-bold text-stone-900">New Arrivals</h2>
                <p className="text-stone-500 max-w-xl">Fresh off the loom. Check out our latest festive and seasonal collections direct from top designers.</p>
              </div>
              <Button asChild variant="outline" className="rounded-full border-stone-300 hover:bg-stone-900 hover:text-white transition-all">
                <Link href="/shop">View All New Arrivals</Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {newArrivals?.map((product) => (
                <div key={product.id} className="group flex flex-col space-y-4">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-lg">
                    <img
                      src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000'}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3">
                      <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-stone-900 shadow-sm transition-colors hover:bg-stone-900 hover:text-white">
                        <Heart className="h-5 w-5" />
                      </button>
                    </div>
                    {product.original_price && (
                      <div className="absolute top-3 left-3 rounded-full bg-stone-900 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
                        Sale
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
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
                  <div className="flex flex-col space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">{product.categories?.name}</span>
                    <Link href={`/product/${product.slug}`} className="text-base font-serif font-bold text-stone-900 hover:text-stone-600 truncate transition-colors">
                      {product.name}
                    </Link>
                    <div className="flex items-center space-x-2">
                       <span className="text-base font-bold text-stone-900">${product.price}</span>
                       {product.original_price && (
                         <span className="text-xs text-stone-400 line-through">${product.original_price}</span>
                       )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Shop by Occasion */}
        <section className="py-24 container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-serif font-bold text-stone-900">Shop by Occasion</h2>
            <p className="text-stone-500 max-w-xl mx-auto">Find the perfect outfit for every event in your calendar.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {occasions.map((occasion) => (
              <Link key={occasion.slug} href={`/shop?occasion=${occasion.slug}`} className="group relative aspect-square overflow-hidden rounded-xl">
                 <img
                  src={occasion.image}
                  alt={occasion.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xl font-serif font-bold border-b-2 border-white/0 group-hover:border-white transition-all duration-300">{occasion.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Best Sellers Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-serif font-bold text-stone-900">Our Best Sellers</h2>
              <p className="text-stone-500 max-w-xl mx-auto">Most-loved styles that our customers are raving about.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {featuredProducts?.map((product) => (
                <div key={product.id} className="group flex flex-col space-y-4">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-stone-50 shadow-sm transition-shadow hover:shadow-lg">
                    <img
                      src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000'}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                       <div className="flex h-8 items-center space-x-1 rounded-full bg-white/90 backdrop-blur-sm px-2 text-stone-900 text-xs font-bold shadow-sm">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{product.ratings || 4.9}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
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
                  <div className="flex flex-col space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">{product.categories?.name}</span>
                    <Link href={`/product/${product.slug}`} className="text-base font-serif font-bold text-stone-900 hover:text-stone-600 truncate transition-colors">
                      {product.name}
                    </Link>
                    <span className="text-base font-bold text-stone-900">${product.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose HJ Fashion USA (Trust Section) */}
        <section className="py-24 bg-stone-900 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="h-20 w-20 rounded-2xl bg-stone-800 flex items-center justify-center text-stone-200 transition-transform hover:scale-110 duration-500">
                  <Star className="h-10 w-10" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-bold">Authentic Fashion</h3>
                  <p className="text-sm text-stone-400 leading-relaxed font-light">100% original Pakistani & Indian designer wear sourced directly from high-end labels.</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="h-20 w-20 rounded-2xl bg-stone-800 flex items-center justify-center text-stone-200 transition-transform hover:scale-110 duration-500">
                  <Truck className="h-10 w-10" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-bold">US-Based Fast Shipping</h3>
                  <p className="text-sm text-stone-400 leading-relaxed font-light">Inventory stored in USA for lightning-fast delivery across the states. No customs stress.</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="h-20 w-20 rounded-2xl bg-stone-800 flex items-center justify-center text-stone-200 transition-transform hover:scale-110 duration-500">
                  <ShieldCheck className="h-10 w-10" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-bold">Quality Guaranteed</h3>
                  <p className="text-sm text-stone-400 leading-relaxed font-light">Every piece undergoes rigorous quality checks to ensure perfect stitching and fabric quality.</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="h-20 w-20 rounded-2xl bg-stone-800 flex items-center justify-center text-stone-200 transition-transform hover:scale-110 duration-500">
                  <Heart className="h-10 w-10" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-serif font-bold">Secure & Easy Returns</h3>
                  <p className="text-sm text-stone-400 leading-relaxed font-light">Shop with confidence. Secure checkout and a hassle-free 14-day return policy.</p>
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
