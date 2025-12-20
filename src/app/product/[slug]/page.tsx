import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { createServerSupabaseClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { ProductActions } from '@/components/ProductActions';
import { Star, ShieldCheck, Truck, RefreshCcw, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabase = createServerSupabaseClient();

  const { data: product } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('slug', slug)
    .single();

  if (!product) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center space-x-2 text-xs uppercase tracking-widest text-stone-400">
            <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/shop" className="hover:text-stone-900 transition-colors">Shop</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/shop?category=${product.categories?.slug}`} className="hover:text-stone-900 transition-colors">{product.categories?.name}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-stone-900 font-bold">{product.name}</span>
          </nav>
        </div>

        <section className="container mx-auto px-4 py-8 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Product Images */}
            <div className="space-y-6">
              <div className="aspect-[3/4] overflow-hidden rounded-3xl bg-stone-50 shadow-sm">
                <img
                  src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c'}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {Array.isArray(product.images) && product.images.map((img: string, i: number) => (
                  <div key={i} className="aspect-square overflow-hidden rounded-xl bg-stone-50 border border-stone-100 cursor-pointer hover:border-stone-900 transition-colors">
                    <img src={img} alt={`${product.name} view ${i+1}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col space-y-8">
              <div className="space-y-4 pb-8 border-b border-stone-100">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
                      {product.categories?.name}
                    </span>
                    <h1 className="text-4xl font-serif font-bold text-stone-900 leading-tight">
                      {product.name}
                    </h1>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center space-x-1 text-amber-500 mb-1">
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                    <span className="text-xs text-stone-400 uppercase tracking-widest font-bold">12 Reviews</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-stone-900">${product.price}</span>
                  {product.original_price && (
                    <span className="text-xl text-stone-300 line-through">${product.original_price}</span>
                  )}
                  {product.original_price && (
                    <span className="rounded-full bg-stone-900 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      Save ${ (product.original_price - product.price).toFixed(2) }
                    </span>
                  )}
                </div>
              </div>

              <ProductActions product={product} />

              <Tabs defaultValue="description" className="w-full pt-8">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto">
                  <TabsTrigger 
                    value="description" 
                    className="rounded-none border-b-2 border-transparent px-6 py-4 text-sm font-bold uppercase tracking-widest text-stone-500 data-[state=active]:border-stone-900 data-[state=active]:bg-transparent data-[state=active]:text-stone-900"
                  >
                    Details
                  </TabsTrigger>
                  <TabsTrigger 
                    value="fabric" 
                    className="rounded-none border-b-2 border-transparent px-6 py-4 text-sm font-bold uppercase tracking-widest text-stone-500 data-[state=active]:border-stone-900 data-[state=active]:bg-transparent data-[state=active]:text-stone-900"
                  >
                    Fabric & Care
                  </TabsTrigger>
                  <TabsTrigger 
                    value="shipping" 
                    className="rounded-none border-b-2 border-transparent px-6 py-4 text-sm font-bold uppercase tracking-widest text-stone-500 data-[state=active]:border-stone-900 data-[state=active]:bg-transparent data-[state=active]:text-stone-900"
                  >
                    Shipping
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="py-8 space-y-4">
                  <p className="text-stone-600 leading-relaxed font-light">
                    {product.description || 'No description available for this masterpiece.'}
                  </p>
                  <ul className="grid grid-cols-2 gap-y-4 pt-4 text-sm">
                    <li className="flex items-center text-stone-900 font-medium">
                      <ChevronRight className="h-4 w-4 mr-2 text-stone-400" />
                      Hand-embroidered
                    </li>
                    <li className="flex items-center text-stone-900 font-medium">
                      <ChevronRight className="h-4 w-4 mr-2 text-stone-400" />
                      Original Designer Wear
                    </li>
                    <li className="flex items-center text-stone-900 font-medium">
                      <ChevronRight className="h-4 w-4 mr-2 text-stone-400" />
                      Color: {product.color || 'As Shown'}
                    </li>
                    <li className="flex items-center text-stone-900 font-medium">
                      <ChevronRight className="h-4 w-4 mr-2 text-stone-400" />
                      Premium Finish
                    </li>
                  </ul>
                </TabsContent>
                <TabsContent value="fabric" className="py-8 space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-stone-900">Fabric</h4>
                    <p className="text-stone-600 font-light">{product.fabric || 'Premium Quality Material'}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-stone-900">Care Instructions</h4>
                    <p className="text-stone-600 font-light">{product.care_instructions || 'Dry clean only to maintain the delicate craftsmanship.'}</p>
                  </div>
                </TabsContent>
                <TabsContent value="shipping" className="py-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex items-start space-x-4">
                      <Truck className="h-6 w-6 text-stone-400 mt-1" />
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-stone-900">Express US Delivery</h4>
                        <p className="text-xs text-stone-500">Shipping within 3-5 business days across the United States.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <RefreshCcw className="h-6 w-6 text-stone-400 mt-1" />
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-stone-900">14-Day Returns</h4>
                        <p className="text-xs text-stone-500">Easy returns if you are not completely satisfied with your purchase.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Similar Products Placeholder */}
        <section className="py-24 bg-stone-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-12 text-center">You May Also Like</h2>
            {/* ... product grid would go here ... */}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
