import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getCategories, filterProducts, getCategoryBySlug, getProducts, type Product } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, ShoppingBag, LayoutGrid, List, Star, ArrowUpRight, Sparkles } from 'lucide-react';
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
  const allProducts = getProducts();
  const products = filterProducts({
    categorySlug,
    occasion,
    minPrice,
    maxPrice,
    searchQuery,
    sort,
  });

  const activeCategory = categorySlug ? getCategoryBySlug(categorySlug) : null;
  const showCategoryLayout = !categorySlug && !subcategory && !occasion && !searchQuery && !minPrice && !maxPrice;
  const productsByCategory = categories.map((category) => ({
    category,
    items: allProducts.filter((product) => product.categories.slug === category.slug),
  }));
  const categoryCounts = productsByCategory.reduce<Record<string, number>>((acc, group) => {
    acc[group.category.slug] = group.items.length;
    return acc;
  }, {});

  const renderProductCard = (product: Product) => (
    <div key={product.id} className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-black border-2 border-black mb-5">
        <Link href={`/product/${product.slug}`}>
          <img
            src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000'}
            alt={product.name}
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
          />
        </Link>
        <div className="absolute inset-3 border border-white/20 pointer-events-none group-hover:border-white/40 transition-all duration-500" />
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
  );

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Category-First Header */}
        <div className="relative overflow-hidden bg-[#0f0e0c] text-white">
          <div className="absolute inset-0">
            <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-[#c9a36a]/30 blur-[120px]" />
            <div className="absolute -bottom-48 left-0 h-[28rem] w-[28rem] rounded-full bg-[#f6d7b0]/20 blur-[140px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_55%)]" />
          </div>
          <div className="container mx-auto px-4 py-20 md:py-28 relative">
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

            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-white/60 mb-6">
                <span className="h-[1px] w-10 bg-white/40" />
                Shop by Category
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-light text-white mb-6 tracking-wide">
                {subcategory || occasion || activeCategory?.name || 'Everyday to Bridal'}
              </h1>
              <p className="text-white/65 max-w-2xl font-light text-lg leading-relaxed">
                {activeCategory?.description || "Explore curated Pakistani fashion by category, with spotlight edits and handpicked highlights."}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {categories.slice(0, 5).map((category) => (
                  <Link
                    key={category.id}
                    href={`/shop?category=${category.slug}`}
                    className="inline-flex items-center gap-2 border border-white/30 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80 hover:border-white hover:text-white transition"
                  >
                    {category.name}
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {showCategoryLayout ? (
          <div className="container mx-auto px-4 py-16">
            <section className="relative -mt-24 mb-16">
              <div className="rounded-[2.5rem] border border-black/10 bg-white/90 shadow-[0_30px_120px_-60px_rgba(0,0,0,0.6)] p-8 md:p-12">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                  <div className="space-y-4">
                    <span className="text-xs uppercase tracking-[0.3em] text-black/40">Curated edits</span>
                    <h2 className="text-3xl md:text-4xl font-serif font-light text-black">Shop by category</h2>
                    <p className="text-black/60 max-w-2xl">
                      Scroll into each collection with a tailored mood, bestseller selection, and category-specific highlights.
                    </p>
                  </div>
                  <form action="/shop" className="relative w-full md:w-80">
                    <Input
                      name="q"
                      defaultValue={searchQuery}
                      placeholder="Search across categories"
                      className="pl-10 border-black/20 focus:border-black bg-white text-sm"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-black/40" />
                  </form>
                </div>
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
                  {categories.map((category, index) => (
                    <Link
                      key={category.id}
                      href={`/shop?category=${category.slug}`}
                      className="group relative overflow-hidden rounded-[2rem] border border-black/10 bg-black text-white h-full min-h-[280px]"
                    >
                      <div className="absolute inset-0">
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent" />
                      </div>
                      <div className="relative z-10 flex h-full flex-col justify-between p-6">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-[0.3em] text-white/60">Category</span>
                          <span className="rounded-full border border-white/30 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/80">
                            {categoryCounts[category.slug] || 0} pieces
                          </span>
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-2xl font-serif font-light text-white">
                            {category.name}
                          </h3>
                          <p className="text-sm text-white/70 line-clamp-2">{category.description}</p>
                          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/90">
                            Explore
                            <ArrowUpRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                      {index === 0 && (
                        <div className="absolute right-6 top-6 flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
                          <Sparkles className="h-3 w-3" />
                          Top picks
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-16">
              {productsByCategory.map((group) => (
                group.items.length > 0 && (
                  <div key={group.category.id} className="space-y-8">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                      <div className="space-y-3">
                        <span className="text-xs uppercase tracking-[0.3em] text-black/40">Category Edit</span>
                        <h3 className="text-2xl md:text-3xl font-serif font-light text-black">{group.category.name}</h3>
                        <p className="text-black/60 max-w-2xl">{group.category.description}</p>
                      </div>
                      <Link
                        href={`/shop?category=${group.category.slug}`}
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-black/70 hover:text-black"
                      >
                        View full collection
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {group.items.slice(0, 4).map((product) => renderProductCard(product))}
                    </div>
                  </div>
                )
              ))}
            </section>
          </div>
        ) : (
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
                      {products.map((product) => renderProductCard(product))}
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
        )}
      </main>

      <Footer />
    </div>
  );
}
