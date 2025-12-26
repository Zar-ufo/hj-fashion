import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getProducts, createProduct, updateProduct, deleteProduct, getAllCategories } from '@/lib/db-queries';

// GET all products with categories
export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'categories') {
      const categories = await getAllCategories();
      return NextResponse.json(categories);
    }

    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST create new product
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, description, price, original_price, images, category_id, is_featured, sizes, fabric, color, care_instructions } = body;

    if (!name || !slug || !description || !price || !category_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const product = await createProduct({
      name,
      slug,
      description,
      price: parseFloat(price),
      original_price: original_price ? parseFloat(original_price) : undefined,
      images: images || [],
      category_id,
      is_featured: is_featured || false,
      sizes: sizes || [],
      fabric,
      color,
      care_instructions,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

// PATCH update product
export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, ...updateData } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    // Parse numbers if present
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.original_price) updateData.original_price = parseFloat(updateData.original_price);

    const product = await updateProduct(productId, updateData);
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    await deleteProduct(productId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
