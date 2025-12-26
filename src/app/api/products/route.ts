import { NextResponse } from 'next/server';
import { getProducts, filterProducts } from '@/lib/db-queries';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const categorySlug = searchParams.get('category') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const searchQuery = searchParams.get('search') || undefined;
    const sort = searchParams.get('sort') || undefined;
    
    // If any filters are applied, use filterProducts
    if (categorySlug || minPrice || maxPrice || searchQuery || sort) {
      const products = await filterProducts({
        categorySlug,
        minPrice,
        maxPrice,
        searchQuery,
        sort,
      });
      return NextResponse.json(products);
    }
    
    // Otherwise, get all products
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
