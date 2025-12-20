'use client';

import { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';
import { toast } from 'sonner';

interface QuickAddToCartProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    size?: string;
  };
  className?: string;
}

export function QuickAddToCart({ product, className }: QuickAddToCartProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    
    addToCart({
      productId: product.id,
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

  return (
    <Button 
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`w-full rounded-full bg-stone-900 text-white hover:bg-stone-800 shadow-lg ${className}`}
    >
      {isAdding ? (
        <Check className="mr-2 h-4 w-4 animate-in zoom-in" />
      ) : (
        <ShoppingBag className="mr-2 h-4 w-4" />
      )}
      {isAdding ? 'Added' : 'Add to Cart'}
    </Button>
  );
}
