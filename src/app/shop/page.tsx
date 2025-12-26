import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getCategories, filterProducts, getCategoryBySlug } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, ShoppingBag, Heart, LayoutGrid, List, ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';
import { QuickAddToCart } from '@/components/QuickAddToCart';
import { WishlistButton } from '@/components/WishlistButton';
import { SortSelect } from '@/components/SortSelect';
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

  // Use mock data instead of backend
  const categories = getCategories();
  const products = filterProducts({
    categorySlug,
    occasion,
    minPrice,
    maxPrice,
    searchQuery,
    sort,
  });

  const activeCategory = categorySlug ? getCategoryBySlug(categorySlug) : null;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Luxury Header */}
        <div className="bg-black text-white">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <Breadcrumb className="mb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-white/50 hover:text-white text-xs uppercase tracking-[0.2em]">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/30" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/shop" className="text-white/50 hover:text-white text-xs uppercase tracking-[0.2em]">Shop</BreadcrumbLink>
                </BreadcrumbItem>
                {activeCategory && (
                  <>
                    <BreadcrumbSeparator className="text-white/30" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-white text-xs uppercase tracking-[0.2em]">{activeCategory.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
                {subcategory && (
                  <>
                    <BreadcrumbSeparator className="text-white/30" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-white text-xs uppercase tracking-[0.2em]">{subcategory}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
                 {occasion && (
                  <>
                    <BreadcrumbSeparator className="text-white/30" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-white text-xs uppercase tracking-[0.2em]">{occasion.charAt(0).toUpperCase() + occasion.slice(1)}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>

            <div className="max-w-3xl">
              <span className="text-xs uppercase tracking-[0.4em] text-white/40 font-medium mb-4 block">Our Collection</span>
              <h1 className="text-4xl md:text-6xl font-serif font-light text-white mb-6 tracking-wide">
                {subcategory || occasion || activeCategory?.name || 'Shop All'}
              </h1>
              <div className="h-[1px] w-20 bg-white/30 mb-6"></div>
              <p className="text-white/60 max-w-2xl font-light text-lg leading-relaxed">
                {activeCategory?.description || "Browse our curated selection of authentic Pakistani premium wear, from daily essentials to festive masterpieces."}
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-72 space-y-10">
              {/* Search */}
              <div className="space-y-4">
                <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-black flex items-center pb-3 border-b border-black">
                  Search
                </h3>
                <form action="/shop" className="relative">
                  <Input 
                    name="q"
                    defaultValue={searchQuery}
                    placeholder="Find your style..." 
                    className="pl-10 border-black/20 focus:border-black bg-transparent text-sm"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-black/40" />
                  {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
                </form>
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-black flex items-center pb-3 border-b border-black">
                  Categories
                </h3>
                <div className="flex flex-col space-y-3">
                  <Link 
                    href="/shop" 
                    className={`text-sm py-1 transition-colors tracking-wide ${!categorySlug ? 'font-medium text-black' : 'text-black/50 hover:text-black'}`}
                  >
                    {!categorySlug && <span className="inline-block w-2 h-[1px] bg-black mr-2"></span>}
                    All Collections
                  </Link>
                  {categories?.map((cat) => (
                    <Link 
                      key={cat.id} 
                      href={`/shop?category=${cat.slug}`}
                      className={`text-sm py-1 transition-colors tracking-wide ${categorySlug === cat.slug ? 'font-medium text-black' : 'text-black/50 hover:text-black'}`}
                    >
                      {categorySlug === cat.slug && <span className="inline-block w-2 h-[1px] bg-black mr-2"></span>}
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Occasion */}
              <div className="space-y-4">
                <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-black flex items-center pb-3 border-b border-black">
                  Occasion
                </h3>
                <div className="flex flex-col space-y-3">
                  {['weddings', 'eid', 'parties', 'casual', 'formal'].map((occ) => (
                    <Link 
                      key={occ} 
                      href={`/shop?occasion=${occ}${categorySlug ? `&category=${categorySlug}` : ''}`}
                      className={`text-sm py-1 transition-colors tracking-wide ${occasion === occ ? 'font-medium text-black' : 'text-black/50 hover:text-black'}`}
                    >
                      {occasion === occ && <span className="inline-block w-2 h-[1px] bg-black mr-2"></span>}
                      {occ.charAt(0).toUpperCase() + occ.slice(1)}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-black flex items-center pb-3 border-b border-black">
                  Price Range
                </h3>
                <form action="/shop" className="space-y-4">
                  {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
                  {occasion && <input type="hidden" name="occasion" value={occasion} />}
                  <div className="flex items-center space-x-3">
                    <Input name="minPrice" placeholder="Min $" className="h-10 text-sm border-black/20 focus:border-black bg-transparent" />
                    <span className="text-black/30">—</span>
                    <Input name="maxPrice" placeholder="Max $" className="h-10 text-sm border-black/20 focus:border-black bg-transparent" />
                  </div>
                  <Button type="submit" className="w-full bg-black hover:bg-black/90 text-white text-xs uppercase tracking-[0.15em] h-11">Apply Filter</Button>
                </form>
              </div>

              {/* Size Filter */}
              <div className="space-y-4">
                <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-black flex items-center pb-3 border-b border-black">
                  Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <button key={size} className="h-10 w-10 border border-black/20 text-xs font-medium hover:border-black hover:bg-black hover:text-white transition-all">
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-black/10 gap-4">
                <p className="text-black/50 text-sm tracking-wide">
                  Showing <span className="font-medium text-black">{products?.length || 0}</span> products
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center space-x-2 border-r border-black/10 pr-6 mr-2 hidden sm:flex">
                    <button className="p-2 bg-black text-white">
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-black/40 hover:text-black transition-colors">
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-black/50">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="hidden sm:inline text-xs uppercase tracking-wide">Sort:</span>
                    <SortSelect defaultValue={sort} />
                  </div>
                </div>
              </div>

              {products && products.length > 0 ? (
                <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product, index) => (
                    <div key={product.id} className="group">
                      <div className="relative aspect-[3/4] overflow-hidden bg-black border-2 border-black mb-5">
                        <Link href={`/product/${product.slug}`}>
                          <img
                            src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000'}
                            alt={product.name}
                            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                          />
                        </Link>
                        {/* Inner border */}
                        <div className="absolute inset-3 border border-white/20 pointer-events-none group-hover:border-white/40 transition-all duration-500" />
                        
                        {/* Corner accents */}
                        <div className="absolute top-3 left-3 w-5 h-5 border-l border-t border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute top-3 right-14 w-5 h-5 border-r border-t border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-16 left-3 w-5 h-5 border-l border-b border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-16 right-3 w-5 h-5 border-r border-b border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="absolute top-4 right-4">
                          <WishlistButton
                            product={{
                              id: product.id,
                              name: product.name,
                              slug: product.slug,
                              price: product.price,
                              image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000'
                            }}
                            className="bg-white/90 hover:bg-white border-0"
                          />
                        </div>
                        
                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {product.original_price && (
                            <div className="bg-black text-white px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.15em]">
                              Sale
                            </div>
                          )}
                          {product.is_featured && !product.original_price && (
                            <div className="bg-white text-black px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.15em]">
                              Featured
                            </div>
                          )}
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-out">
                          <QuickAddToCart 
                            product={{
                              id: product.id,
                              name: product.name,
                              slug: product.slug,
                              price: product.price,
                              image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000'
                            }} 
                          />
                        </div>
                      </div>
                      <div className="space-y-2 px-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-medium">
                            {product.categories?.name}
                          </span>
                          <span className="text-[10px] uppercase font-medium text-black/40 flex items-center gap-1">
                            <Star className="h-2.5 w-2.5 fill-black text-black" /> {product.ratings || 4.9}
                          </span>
                        </div>
                        <Link href={`/product/${product.slug}`} className="block text-sm font-serif font-light text-black hover:text-black/60 transition-colors leading-tight tracking-wide line-clamp-2">
                          {product.name}
                        </Link>
                        <div className="flex items-center space-x-3 pt-1">
                          <span className="text-base font-medium text-black">${product.price}</span>
                          {product.original_price && (
                            <span className="text-sm text-black/30 line-through">${product.original_price}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Products Count Footer */}
                <div className="mt-16 pt-10 border-t border-black/10 text-center space-y-6">
                  <p className="text-sm text-black/40 tracking-wide">
                    Showing all <span className="font-medium text-black">{products.length}</span> products
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="h-[1px] w-12 bg-black/10" />
                    <div className="h-1.5 w-1.5 bg-black/20 rotate-45" />
                    <div className="h-[1px] w-12 bg-black/10" />
                  </div>
                </div>
              </>
              ) : (
                <div className="py-32 text-center space-y-8">
                  <div className="h-24 w-24 border-2 border-black/10 flex items-center justify-center mx-auto">
                    <ShoppingBag className="h-10 w-10 text-black/20" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-serif font-light text-black">No products found</h3>
                    <p className="text-black/50 max-w-xs mx-auto font-light">We couldn't find any products matching your selection.</p>
                  </div>
                  <Link 
                    href="/shop"
                    className="inline-block border-2 border-black px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-black hover:text-white transition-all"
                  >
                    Clear All Filters
                  </Link>
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
