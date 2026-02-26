'use client';

import { useState } from 'react';
import { ShoppingBag, Check, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';
import { toast } from 'sonner';

interface QuickAddToCartProps {
  product: {
    id: string;
    name: string;
    slug?: string;
    price: number;
    image?: string;
    size?: string;
  };
  className?: string;
  showWishlist?: boolean;
}

export function QuickAddToCart({ product, className, showWishlist = false }: QuickAddToCartProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      size: product.size || 'M', // Default size for quick add
    });

    setTimeout(() => {
      setIsAdding(false);
      toast.success(`${product.name} added to cart!`);
    }, 500);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug,
      });
      toast.success('Added to wishlist!');
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button 
        onClick={handleAddToCart}
        disabled={isAdding}
        className="flex-1 rounded-none bg-white text-black hover:bg-black hover:text-white border-2 border-black text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300"
      >
        {isAdding ? (
          <Check className="mr-2 h-4 w-4 animate-in zoom-in" />
        ) : (
          <ShoppingBag className="mr-2 h-4 w-4" />
        )}
        {isAdding ? 'Added' : 'Add to Cart'}
      </Button>
      {showWishlist && (
        <button
          onClick={handleWishlistToggle}
          className={`flex h-10 w-10 items-center justify-center border-2 transition-all ${
            inWishlist 
              ? 'border-black bg-black text-white' 
              : 'border-black bg-white text-black hover:bg-black hover:text-white'
          }`}
        >
          <Heart className={`h-5 w-5 ${inWishlist ? 'fill-white' : ''}`} />
        </button>
      )}
    </div>
  );
}
