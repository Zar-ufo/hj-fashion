import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { createServerSupabaseClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, ShoppingBag, Heart, LayoutGrid, List, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { QuickAddToCart } from '@/components/QuickAddToCart';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface ShopPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const categorySlug = typeof params.category === 'string' ? params.category : undefined;
  const subcategory = typeof params.subcategory === 'string' ? params.subcategory : undefined;
  const occasion = typeof params.occasion === 'string' ? params.occasion : undefined;
  const searchQuery = typeof params.q === 'string' ? params.q : undefined;
  const sort = typeof params.sort === 'string' ? params.sort : 'featured';
  const minPrice = typeof params.minPrice === 'string' ? parseInt(params.minPrice) : undefined;
  const maxPrice = typeof params.maxPrice === 'string' ? parseInt(params.maxPrice) : undefined;

  const supabase = createServerSupabaseClient();

  // Fetch all categories for the filter sidebar
  const { data: categories } = await supabase.from('categories').select('*').order('name');

  // Build the product query
  let query = supabase.from('products').select('*, categories!inner(name, slug)');

  if (categorySlug) {
    query = query.eq('categories.slug', categorySlug);
  }

  if (subcategory) {
    query = query.eq('subcategory', subcategory);
  }

  if (occasion) {
    query = query.eq('occasion', occasion);
  }

  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`);
  }

  if (minPrice) {
    query = query.gte('price', minPrice);
  }

  if (maxPrice) {
    query = query.lte('price', maxPrice);
  }

  // Sorting
  if (sort === 'newest') {
    query = query.order('created_at', { ascending: false });
  } else if (sort === 'price-low') {
    query = query.order('price', { ascending: true });
  } else if (sort === 'price-high') {
    query = query.order('price', { ascending: false });
  } else {
    query = query.order('is_featured', { ascending: false });
  }

  const { data: products } = await query;

  const activeCategory = categorySlug ? categories?.find(c => c.slug === categorySlug) : null;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Breadcrumbs & Header */}
        <div className="bg-stone-50 border-b border-stone-100">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/shop">Shop</BreadcrumbLink>
                </BreadcrumbItem>
                {activeCategory && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{activeCategory.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
                {subcategory && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{subcategory}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
                 {occasion && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{occasion.charAt(0).toUpperCase() + occasion.slice(1)}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>

            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">
              {subcategory || occasion || activeCategory?.name || 'Shop All Collections'}
            </h1>
            <p className="text-stone-500 max-w-2xl font-light text-lg">
              {activeCategory?.description || "Browse our curated selection of authentic Pakistani premium wear, from daily essentials to festive masterpieces."}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-72 space-y-12">
              {/* Search */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900 flex items-center">
                  Search <ChevronRight className="ml-auto h-4 w-4" />
                </h3>
                <form action="/shop" className="relative">
                  <Input 
                    name="q"
                    defaultValue={searchQuery}
                    placeholder="Find your style..." 
                    className="pl-10 rounded-xl border-stone-200 focus:ring-stone-400 bg-stone-50"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                  {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
                </form>
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900 flex items-center">
                  Categories <ChevronRight className="ml-auto h-4 w-4" />
                </h3>
                <div className="flex flex-col space-y-2">
                  <Link 
                    href="/shop" 
                    className={`text-sm py-1 transition-colors ${!categorySlug ? 'font-bold text-stone-900 underline underline-offset-4' : 'text-stone-500 hover:text-stone-900'}`}
                  >
                    All Collections
                  </Link>
                  {categories?.map((cat) => (
                    <Link 
                      key={cat.id} 
                      href={`/shop?category=${cat.slug}`}
                      className={`text-sm py-1 transition-colors ${categorySlug === cat.slug ? 'font-bold text-stone-900 underline underline-offset-4' : 'text-stone-500 hover:text-stone-900'}`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Occasion */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900 flex items-center">
                  Occasion <ChevronRight className="ml-auto h-4 w-4" />
                </h3>
                <div className="flex flex-col space-y-2">
                  {['weddings', 'eid', 'parties', 'casual', 'formal'].map((occ) => (
                    <Link 
                      key={occ} 
                      href={`/shop?occasion=${occ}${categorySlug ? `&category=${categorySlug}` : ''}`}
                      className={`text-sm py-1 transition-colors ${occasion === occ ? 'font-bold text-stone-900' : 'text-stone-500 hover:text-stone-900'}`}
                    >
                      {occ.charAt(0).toUpperCase() + occ.slice(1)}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900 flex items-center">
                  Price Range <ChevronRight className="ml-auto h-4 w-4" />
                </h3>
                <form action="/shop" className="space-y-4">
                  {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
                  {occasion && <input type="hidden" name="occasion" value={occasion} />}
                  <div className="flex items-center space-x-4">
                    <Input name="minPrice" placeholder="Min $" className="h-10 text-sm border-stone-200 rounded-xl bg-stone-50" />
                    <span className="text-stone-300">—</span>
                    <Input name="maxPrice" placeholder="Max $" className="h-10 text-sm border-stone-200 rounded-xl bg-stone-50" />
                  </div>
                  <Button type="submit" variant="outline" className="w-full rounded-xl border-stone-900 bg-white hover:bg-stone-900 hover:text-white transition-all">Apply Filter</Button>
                </form>
              </div>

              {/* Size Filter (UI Placeholder) */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900 flex items-center">
                  Size <ChevronRight className="ml-auto h-4 w-4" />
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <button key={size} className="h-10 w-10 rounded-lg border border-stone-200 text-xs font-medium hover:border-stone-900 hover:bg-stone-50 transition-all">
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-stone-100 gap-4">
                <p className="text-stone-500 font-light italic">
                  Showing <span className="font-bold text-stone-900 not-italic">{products?.length || 0}</span> products
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center space-x-2 border-r border-stone-200 pr-6 mr-2 hidden sm:flex">
                    <button className="p-2 bg-stone-900 text-white rounded-md shadow-sm">
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-stone-400 hover:text-stone-900 transition-colors">
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-stone-500">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="hidden sm:inline">Sort:</span>
                    <form>
                      <select 
                        name="sort" 
                        defaultValue={sort}
                        onChange={(e) => {
                          const url = new URL(window.location.href);
                          url.searchParams.set('sort', e.target.value);
                          window.location.href = url.toString();
                        }}
                        className="bg-transparent font-bold text-stone-900 outline-none cursor-pointer focus:ring-0 border-none px-0"
                      >
                        <option value="featured">Featured</option>
                        <option value="newest">Newest First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                      </select>
                    </form>
                  </div>
                </div>
              </div>

              {products && products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {products.map((product) => (
                    <div key={product.id} className="group flex flex-col space-y-5">
                      <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-stone-100 transition-all duration-500 hover:shadow-2xl">
                        <Link href={`/product/${product.slug}`}>
                          <img
                            src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000'}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </Link>
                        <div className="absolute top-5 right-5">
                          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-stone-900 shadow-md transition-all hover:bg-stone-900 hover:text-white active:scale-90">
                            <Heart className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-out opacity-0 group-hover:opacity-100">
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
                      <div className="flex flex-col space-y-2 px-2">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-black">
                            {product.categories?.name}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-stone-500 flex items-center gap-1">
                            <Star className="h-2 w-2 fill-stone-900 text-stone-900" /> {product.ratings || 4.9}
                          </span>
                        </div>
                        <Link href={`/product/${product.slug}`} className="text-lg font-serif font-bold text-stone-900 hover:text-stone-600 transition-colors leading-tight">
                          {product.name}
                        </Link>
                        <div className="flex items-center space-x-3">
                          <span className="text-xl font-black text-stone-900">${product.price}</span>
                          {product.original_price && (
                            <span className="text-sm text-stone-400 line-through">${product.original_price}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-32 text-center space-y-6">
                  <div className="h-24 w-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-stone-200">
                    <ShoppingBag className="h-12 w-12" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-serif font-bold text-stone-900">No treasures found</h3>
                    <p className="text-stone-500 max-w-xs mx-auto">We couldn't find any products matching your specific selection at this time.</p>
                  </div>
                  <Button asChild className="rounded-full bg-stone-900 px-8 h-12 shadow-lg hover:scale-105 transition-all">
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
