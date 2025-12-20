import Link from 'next/link';
import { ArrowRight, Star, ShoppingBag, Truck, ShieldCheck, Heart } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { createServerSupabaseClient } from '@/lib/supabase';

export default async function Home() {
  const supabase = createServerSupabaseClient();

  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('is_featured', true)
    .limit(4);

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .limit(6);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[85vh] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=2000"
              alt="Pakistani Fashion Hero"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-stone-900/40" />
          </div>
          
          <div className="relative flex h-full items-center justify-center text-center px-4">
            <div className="max-w-3xl space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-stone-200">
                New Arrival: Festive Collection 2025
              </h2>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight">
                Timeless Elegance, <br /> Rooted in Tradition
              </h1>
              <p className="text-lg md:text-xl text-stone-100 font-light max-w-2xl mx-auto">
                Discover the finest authentic Pakistani couture, meticulously crafted for the modern woman in the USA.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" className="rounded-full px-8 bg-white text-stone-900 hover:bg-stone-100 border-none transition-all">
                  <Link href="/shop">Shop Collection <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-white text-white hover:bg-white/10 transition-all">
                  <Link href="/about">Our Story</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-24 container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-serif font-bold text-stone-900">Explore Collections</h2>
              <p className="text-stone-500">Curated styles for every occasion, from casual kurtis to bridal lehengas.</p>
            </div>
            <Link href="/shop" className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b-2 border-stone-900 pb-1 hover:text-stone-600 hover:border-stone-400 transition-colors hidden md:block">
              View All Categories
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories?.map((category) => (
              <Link key={category.id} href={`/shop?category=${category.slug}`} className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-stone-100">
                <img
                  src={category.image_url || 'https://images.unsplash.com/photo-1560060139-73d0c24256dc'}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white">{category.name}</h3>
                    <p className="text-sm text-stone-300 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      Explore Now
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-24 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-serif font-bold text-stone-900">Featured Masterpieces</h2>
              <p className="text-stone-500 max-w-xl mx-auto">Handpicked selections representing the pinnacle of Pakistani craftsmanship and modern fashion trends.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts?.map((product) => (
                <div key={product.id} className="group flex flex-col space-y-4">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-xl">
                    <img
                      src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c'}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 space-y-2">
                      <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-stone-900 shadow-sm transition-colors hover:bg-stone-900 hover:text-white">
                        <Heart className="h-5 w-5" />
                      </button>
                    </div>
                    {product.original_price && (
                      <div className="absolute top-4 left-4 rounded-full bg-stone-900 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                        Sale
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <Button className="w-full rounded-full bg-stone-900 text-white hover:bg-stone-800">
                        <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1 px-1">
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">{product.categories?.name}</span>
                    <Link href={`/product/${product.slug}`} className="text-lg font-serif font-bold text-stone-900 hover:text-stone-600 transition-colors">
                      {product.name}
                    </Link>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-stone-900">${product.price}</span>
                      {product.original_price && (
                        <span className="text-sm text-stone-400 line-through">${product.original_price}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 border-y border-stone-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-stone-50 flex items-center justify-center text-stone-900">
                  <Truck className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-serif font-bold">Fast US Shipping</h3>
                <p className="text-sm text-stone-500 leading-relaxed">Swift delivery across the United States. Free shipping on orders over $150.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-stone-50 flex items-center justify-center text-stone-900">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-serif font-bold">Authenticity Guarantee</h3>
                <p className="text-sm text-stone-500 leading-relaxed">Directly sourced from top Pakistani designers, ensuring 100% original quality and fabrics.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-stone-50 flex items-center justify-center text-stone-900">
                  <Star className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-serif font-bold">Premium Customer Support</h3>
                <p className="text-sm text-stone-500 leading-relaxed">Our dedicated team is here to help with sizing, styling, and any questions you may have.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-24 bg-stone-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto space-y-8">
              <h2 className="text-4xl font-serif font-bold">Join the HJ Fashion Elite</h2>
              <p className="text-stone-400 font-light">Subscribe to receive updates on new arrivals, exclusive early access to sales, and styling tips from our experts.</p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-grow rounded-full bg-stone-800 border-none px-6 py-4 focus:ring-2 focus:ring-stone-400 outline-none transition-all"
                />
                <Button className="rounded-full px-8 bg-white text-stone-900 hover:bg-stone-100 font-bold transition-all py-6">
                  Subscribe
                </Button>
              </div>
              <p className="text-[10px] text-stone-500 uppercase tracking-widest">By subscribing, you agree to our Terms & Privacy Policy.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
