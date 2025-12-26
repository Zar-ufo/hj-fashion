import { NextResponse } from 'next/server';
import { getCategoryBySlug, getProductsByCategory } from '@/lib/db-queries';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    const products = await getProductsByCategory(slug);
    
    return NextResponse.json({
      category,
      products,
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}
