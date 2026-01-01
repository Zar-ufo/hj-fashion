import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getProductBySlug, getProductsByCategory, products } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { ProductActions } from '@/components/ProductActions';
import { Star, Truck, RefreshCcw, ChevronRight, Shield, Clock, Package } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WishlistButton } from '@/components/WishlistButton';
import { QuickAddToCart } from '@/components/QuickAddToCart';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  // Use mock data instead of backend
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Get related products from the same category
  const relatedProducts = getProductsByCategory(product.category_id)
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  // If not enough related products, get some featured ones
  const additionalProducts = relatedProducts.length < 4 
    ? products.filter(p => p.id !== product.id && !relatedProducts.find(rp => rp.id === p.id)).slice(0, 4 - relatedProducts.length)
    : [];
  
  const suggestedProducts = [...relatedProducts, ...additionalProducts];

  // Calculate star rating display
  const fullStars = Math.floor(product.ratings || 5);
  const hasHalfStar = (product.ratings || 5) % 1 >= 0.5;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Breadcrumbs */}
        <div className="border-b border-black/5">
          <div className="container mx-auto px-4 py-5">
            <nav className="flex items-center space-x-3 text-[10px] uppercase tracking-[0.2em] text-black/40">
              <Link href="/" className="hover:text-black transition-colors">Home</Link>
              <span className="text-black/20">—</span>
              <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
              <span className="text-black/20">—</span>
              <Link href={`/shop?category=${product.categories?.slug}`} className="hover:text-black transition-colors">{product.categories?.name}</Link>
              <span className="text-black/20">—</span>
              <span className="text-black font-medium">{product.name}</span>
            </nav>
          </div>
        </div>

        <section className="container mx-auto px-4 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-[3/4] overflow-hidden bg-black border-2 border-black relative group">
                <img
                  src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c'}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Inner border */}
                <div className="absolute inset-4 border border-white/20 pointer-events-none" />
                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l border-t border-white/40" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r border-t border-white/40" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l border-b border-white/40" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r border-b border-white/40" />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {Array.isArray(product.images) && product.images.map((img: string, i: number) => (
                  <div key={i} className="aspect-square overflow-hidden border-2 border-black/20 cursor-pointer hover:border-black transition-colors">
                    <img src={img} alt={`${product.name} view ${i+1}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col space-y-8">
              {/* Shareable Link Button */}
              <div className="flex justify-end mb-2">
                <button
                  className="flex items-center gap-2 px-3 py-1.5 border border-black/20 rounded text-xs text-black/60 hover:bg-black/5 transition"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      navigator.clipboard.writeText(window.location.origin + `/product/${product.slug}`);
                      alert('Product link copied!');
                    }
                  }}
                  type="button"
                  title="Copy product link"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 010 5.656m-3.656-3.656a4 4 0 015.656 0m-7.778 7.778a4 4 0 005.656 0l1.414-1.414a4 4 0 000-5.656m-7.778-7.778a4 4 0 015.656 0l1.414 1.414a4 4 0 010 5.656" /></svg>
                  Share
                </button>
              </div>
              <div className="space-y-6 pb-8 border-b border-black/10">
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-black/40">
                      {product.categories?.name}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-serif font-light text-black leading-tight tracking-wide">
                      {product.name}
                    </h1>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center space-x-1 text-black mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3.5 w-3.5 ${i < fullStars ? 'fill-current' : 'fill-none stroke-current opacity-30'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-black/40 uppercase tracking-[0.2em]">
                      {product.ratings?.toFixed(1)} Rating
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 pt-2">
                  <span className="text-3xl font-light text-black">${product.price}</span>
                  {product.original_price && (
                    <span className="text-xl text-black/30 line-through">${product.original_price}</span>
                  )}
                  {product.original_price && (
                    <span className="bg-black text-white px-4 py-1.5 text-[9px] font-medium uppercase tracking-[0.2em]">
                      Save ${ (product.original_price - product.price).toFixed(0) }
                    </span>
                  )}
                </div>
              </div>

              <ProductActions product={product} />

              <Tabs defaultValue="description" className="w-full pt-6">
                <TabsList className="w-full justify-start bg-transparent p-0 h-auto border-b border-black/10">
                  <TabsTrigger 
                    value="description" 
                    className="rounded-none border-b-2 border-transparent px-0 mr-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-black/40 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-black"
                  >
                    Details
                  </TabsTrigger>
                  <TabsTrigger 
                    value="fabric" 
                    className="rounded-none border-b-2 border-transparent px-0 mr-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-black/40 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-black"
                  >
                    Fabric & Care
                  </TabsTrigger>
                  <TabsTrigger 
                    value="shipping" 
                    className="rounded-none border-b-2 border-transparent px-0 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-black/40 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-black"
                  >
                    Shipping
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="py-8 space-y-6">
                  <p className="text-black/60 leading-relaxed font-light">
                    {product.description || 'An exquisite piece crafted with precision and care, designed to make you stand out at any occasion.'}
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="border border-black/10 p-4">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-black/40 block mb-1">Fabric</span>
                      <span className="text-sm text-black">{product.fabric || 'Premium Quality'}</span>
                    </div>
                    <div className="border border-black/10 p-4">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-black/40 block mb-1">Color</span>
                      <span className="text-sm text-black">{product.color || 'As Shown'}</span>
                    </div>
                    <div className="border border-black/10 p-4">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-black/40 block mb-1">Sizes</span>
                      <span className="text-sm text-black">{product.sizes?.join(', ') || 'Free Size'}</span>
                    </div>
                    <div className="border border-black/10 p-4">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-black/40 block mb-1">Style</span>
                      <span className="text-sm text-black">Original Designer</span>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="fabric" className="py-8 space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-medium uppercase tracking-[0.2em] text-black">Material</h4>
                    <p className="text-black/60 font-light">{product.fabric || 'Premium Quality Material'}</p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-medium uppercase tracking-[0.2em] text-black">Care Instructions</h4>
                    <p className="text-black/60 font-light">{product.care_instructions || 'Dry clean only to maintain the delicate craftsmanship.'}</p>
                  </div>
                </TabsContent>
                <TabsContent value="shipping" className="py-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-4 p-4 border border-black/10">
                      <Truck className="h-5 w-5 text-black mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-black">Express US Delivery</h4>
                        <p className="text-xs text-black/50">Shipping within 3-5 business days.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 p-4 border border-black/10">
                      <RefreshCcw className="h-5 w-5 text-black mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-black">14-Day Returns</h4>
                        <p className="text-xs text-black/50">Easy returns if not satisfied.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-16 border-t border-b border-black/5 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 border border-black flex items-center justify-center">
                  <Truck className="h-5 w-5 text-black" />
                </div>
                <div>
                  <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] text-black">Free Shipping</h4>
                  <p className="text-[10px] text-black/40 mt-1">On orders over $200</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 border border-black flex items-center justify-center">
                  <RefreshCcw className="h-5 w-5 text-black" />
                </div>
                <div>
                  <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] text-black">Easy Returns</h4>
                  <p className="text-[10px] text-black/40 mt-1">14 day return policy</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 border border-black flex items-center justify-center">
                  <Shield className="h-5 w-5 text-black" />
                </div>
                <div>
                  <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] text-black">Secure Payment</h4>
                  <p className="text-[10px] text-black/40 mt-1">SSL encrypted checkout</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 border border-black flex items-center justify-center">
                  <Package className="h-5 w-5 text-black" />
                </div>
                <div>
                  <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] text-black">Authentic</h4>
                  <p className="text-[10px] text-black/40 mt-1">100% genuine products</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {suggestedProducts.length > 0 && (
          <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16 space-y-4">
                <span className="text-[10px] uppercase tracking-[0.4em] text-black/40 font-medium">Complete Your Look</span>
                <h2 className="text-3xl md:text-4xl font-serif font-light text-black tracking-wide">You May Also Like</h2>
                <div className="h-[1px] w-16 bg-black mx-auto"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {suggestedProducts.map((relatedProduct) => (
                  <div key={relatedProduct.id} className="group">
                    <div className="relative aspect-[3/4] overflow-hidden border-2 border-black mb-4">
                      <Link href={`/product/${relatedProduct.slug}`}>
                        <img
                          src={Array.isArray(relatedProduct.images) && relatedProduct.images.length > 0 
                            ? relatedProduct.images[0] 
                            : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c'}
                          alt={relatedProduct.name}
                          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                        />
                      </Link>
                      {/* Inner border */}
                      <div className="absolute inset-3 border border-white/20 pointer-events-none group-hover:border-white/40 transition-all" />
                      <div className="absolute top-3 right-3">
                        <WishlistButton product={relatedProduct} className="bg-white/90 hover:bg-white border-0" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <QuickAddToCart product={relatedProduct} />
                      </div>
                      {relatedProduct.original_price && (
                        <div className="absolute top-3 left-3 bg-black text-white text-[9px] font-medium uppercase tracking-[0.15em] px-3 py-1.5">
                          Sale
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 px-1">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-medium">
                        {relatedProduct.categories?.name}
                      </p>
                      <Link href={`/product/${relatedProduct.slug}`}>
                        <h3 className="text-sm font-serif font-light text-black group-hover:text-black/60 transition-colors line-clamp-1 tracking-wide">
                          {relatedProduct.name}
                        </h3>
                      </Link>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-black">${relatedProduct.price}</span>
                        {relatedProduct.original_price && (
                          <span className="text-xs text-black/30 line-through">${relatedProduct.original_price}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-16">
                <Link 
                  href={`/shop?category=${product.categories?.slug}`}
                  className="inline-block border-2 border-black text-black px-10 py-4 text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all"
                >
                  View All {product.categories?.name}
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
