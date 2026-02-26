'use client';

import { useState } from 'react';
import { ShoppingBag, Heart, Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';
import { toast } from 'sonner';

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    slug?: string;
    price: number;
    images: string[];
    sizes: string[];
    stock?: number;
  };
}

export function ProductActions({ product }: ProductActionsProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    setIsAdding(true);
    
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0],
      size: selectedSize,
    });

    setTimeout(() => {
      setIsAdding(false);
      toast.success(`${product.name} added to cart!`);
    }, 500);
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        slug: product.slug,
      });
      toast.success('Added to wishlist!');
    }
  };

  return (
    <div className="flex flex-col space-y-8">
      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900">Select Size</h3>
            <button className="text-xs text-stone-500 underline hover:text-stone-900 transition-colors">Size Guide</button>
          </div>
          <div className="flex flex-wrap gap-3">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`flex h-12 w-12 items-center justify-center rounded-full border text-sm font-medium transition-all ${
                  selectedSize === size
                    ? 'border-stone-900 bg-stone-900 text-white shadow-md scale-110'
                    : 'border-stone-200 text-stone-600 hover:border-stone-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Add to Cart */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900">Quantity</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center border border-stone-200 rounded-full h-12 px-2">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 text-stone-400 hover:text-stone-900 transition-colors"
            >
              —
            </button>
            <span className="w-8 text-center font-bold text-stone-900">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 text-stone-400 hover:text-stone-900 transition-colors"
            >
              +
            </button>
          </div>
          <Button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex-grow h-12 rounded-full bg-stone-900 text-white hover:bg-stone-800 transition-all shadow-lg active:scale-95"
          >
            {isAdding ? (
              <Check className="mr-2 h-5 w-5 animate-in zoom-in" />
            ) : (
              <ShoppingBag className="mr-2 h-5 w-5" />
            )}
            {isAdding ? 'Added' : 'Add to Cart'}
          </Button>
          <button 
            onClick={handleWishlistToggle}
            className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all ${
              inWishlist 
                ? 'border-rose-200 bg-rose-50 text-rose-500' 
                : 'border-stone-200 text-stone-600 hover:text-rose-500 hover:border-rose-200'
            }`}
          >
            <Heart className={`h-6 w-6 ${inWishlist ? 'fill-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Product Highlights */}
      <div className="grid grid-cols-2 gap-4 py-8 border-t border-stone-100">
        <div className="flex items-center text-sm text-stone-600">
          <div className="h-2 w-2 rounded-full bg-emerald-500 mr-3" />
          In Stock & Ready to Ship
        </div>
        <div className="flex items-center text-sm text-stone-600">
          <Check className="h-4 w-4 mr-3 text-stone-400" />
          Authentic Quality
        </div>
        <div className="flex items-center text-sm text-stone-600">
          <Check className="h-4 w-4 mr-3 text-stone-400" />
          Free US Returns
        </div>
        <div className="flex items-center text-sm text-stone-600">
          <Check className="h-4 w-4 mr-3 text-stone-400" />
          Secure Checkout
        </div>
      </div>
    </div>
  );
}
