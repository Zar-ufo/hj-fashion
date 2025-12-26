import { NextRequest, NextResponse } from 'next/server';
import { getCategories, getAllCategories, getOccasionCategories } from '@/lib/db-queries';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';
    const occasion = searchParams.get('occasion') === 'true';
    
    const categories = occasion
      ? await getOccasionCategories()
      : all
        ? await getAllCategories()
        : await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
