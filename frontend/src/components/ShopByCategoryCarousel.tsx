'use client';

import * as React from 'react';
import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface ShopByCategoryCarouselProps {
  categories: {
    id: string;
    name: string;
    slug: string;
    image: string;
  }[];
}

export function ShopByCategoryCarousel({ categories }: ShopByCategoryCarouselProps) {
  const plugin = React.useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  return (
    <Carousel
      className="w-full"
      opts={{ loop: true }}
      plugins={[plugin.current]}
    >
      <CarouselContent className="-ml-4">
        {categories.map((category) => (
          <CarouselItem
            key={category.id}
            className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4"
          >
            <Link
              href={`/shop?category=${category.slug}`}
              className="group relative block overflow-hidden border-2 border-black bg-black aspect-[4/5]"
            >
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-3 md:inset-4 border border-white/20 pointer-events-none group-hover:border-white/50 transition-all duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-4 md:p-8 text-center text-white">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="font-serif font-light tracking-wide mb-2 text-lg md:text-xl">
                    {category.name}
                  </h3>
                  <div className="h-[1px] w-0 bg-white mx-auto group-hover:w-16 transition-all duration-500" />
                  <p className="text-xs uppercase tracking-[0.25em] mt-3 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    Explore
                  </p>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-6 hidden md:flex" />
      <CarouselNext className="-right-6 hidden md:flex" />
    </Carousel>
  );
}
