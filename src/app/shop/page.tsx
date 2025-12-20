import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { createServerSupabaseClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, ShoppingBag, Heart } from 'lucide-react';
import Link from 'next/link';
import { QuickAddToCart } from '@/components/QuickAddToCart';

interface ShopPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const categorySlug = typeof params.category === 'string' ? params.category : undefined;
  const searchQuery = typeof params.q === 'string' ? params.q : undefined;

  const supabase = createServerSupabaseClient();

  // Fetch all categories for the filter sidebar
  const { data: categories } = await supabase.from('categories').select('*');

  // Build the product query
  let query = supabase.from('products').select('*, categories(name, slug)');

  if (categorySlug) {
    query = query.eq('categories.slug', categorySlug);
  }

  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`);
  }

  const { data: products } = await query;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Page Header */}
        <div className="bg-stone-50 py-12 border-b border-stone-100">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2 text-center">
              {categorySlug ? categories?.find(c => c.slug === categorySlug)?.name : 'Shop All Collections'}
            </h1>
            <p className="text-stone-500 text-center max-w-2xl mx-auto">
              Browse our curated selection of authentic Pakistani premium wear, from daily essentials to festive masterpieces.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-64 space-y-10">
              {/* Search */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900">Search</h3>
                <form action="/shop" className="relative">
                  <Input 
                    name="q"
                    defaultValue={searchQuery}
                    placeholder="Find your style..." 
                    className="pl-10 rounded-full border-stone-200"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                </form>
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900">Categories</h3>
                <div className="flex flex-col space-y-2">
                  <Link 
                    href="/shop" 
                    className={`text-sm py-1 transition-colors ${!categorySlug ? 'font-bold text-stone-900' : 'text-stone-500 hover:text-stone-900'}`}
                  >
                    All Collections
                  </Link>
                  {categories?.map((cat) => (
                    <Link 
                      key={cat.id} 
                      href={`/shop?category=${cat.slug}`}
                      className={`text-sm py-1 transition-colors ${categorySlug === cat.slug ? 'font-bold text-stone-900' : 'text-stone-500 hover:text-stone-900'}`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Price Range (UI placeholder) */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Input placeholder="Min" className="h-8 text-xs border-stone-200" />
                    <span className="text-stone-300">—</span>
                    <Input placeholder="Max" className="h-8 text-xs border-stone-200" />
                  </div>
                  <Button variant="outline" size="sm" className="w-full rounded-full border-stone-200 text-xs">Apply</Button>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-stone-100">
                <p className="text-sm text-stone-500">
                  Showing <span className="font-bold text-stone-900">{products?.length || 0}</span> products
                </p>
                <div className="flex items-center space-x-2 text-sm text-stone-500">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Sort by:</span>
                  <select className="bg-transparent font-bold text-stone-900 outline-none cursor-pointer">
                    <option>Featured</option>
                    <option>Newest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                </div>
              </div>

              {products && products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <div key={product.id} className="group flex flex-col space-y-4">
                      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-stone-50 transition-shadow hover:shadow-xl">
                        <img
                          src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000'}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-4 right-4">
                          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-stone-900 shadow-sm transition-colors hover:bg-stone-900 hover:text-white">
                            <Heart className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <QuickAddToCart 
                            product={{
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000'
                            }} 
                          />
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1 px-1">
                        <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                          {product.categories?.name || 'Collection'}
                        </span>
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
              ) : (
                <div className="py-24 text-center space-y-4">
                  <div className="h-20 w-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-stone-300">
                    <ShoppingBag className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-stone-900">No products found</h3>
                  <p className="text-stone-500">We couldn't find any products matching your criteria.</p>
                  <Button asChild className="rounded-full bg-stone-900">
                    <Link href="/shop">Clear All Filters</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
