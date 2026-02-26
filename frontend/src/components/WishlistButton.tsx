'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { toast } from 'sonner';

interface WishlistButtonProps {
  product: {
    id: string;
    name: string;
    slug?: string;
    price: number;
    image?: string;
  };
  className?: string;
}

export function WishlistButton({ product, className = '' }: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const inWishlist = mounted ? isInWishlist(product.id) : false;

  const handleToggle = (e: React.MouseEvent) => {
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
    <button
      onClick={handleToggle}
      className={`flex h-10 w-10 items-center justify-center bg-white/95 backdrop-blur-sm transition-all active:scale-95 ${
        inWishlist 
          ? 'text-black' 
          : 'text-black/70 hover:text-black'
      } ${className}`}
    >
      <Heart className={`h-4 w-4 ${inWishlist ? 'fill-black' : ''}`} />
    </button>
  );
}
