'use client';

import * as React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

const BANNERS = [
  {
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=2400",
    subtitle: "New Arrival: Festive Collection 2025",
    title: "Timeless Elegance, Rooted in Tradition",
    description: "Discover the finest authentic Pakistani couture, meticulously crafted for the modern woman in the USA.",
    cta: "Shop Festive",
    link: "/shop?category=pakistani-shalwar-kameez"
  },
  {
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=2400",
    subtitle: "Luxury Sarees",
    title: "Exquisite Drape & Sophistication",
    description: "Experience the grace of our hand-picked sarees, perfect for weddings and formal celebrations.",
    cta: "Explore Sarees",
    link: "/shop?category=sarees"
  },
  {
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=2400",
    subtitle: "Lawn Collection 2025",
    title: "Breezy Fabrics, Beautiful Designs",
    description: "Stay cool and stylish this summer with our premium Pakistani lawn suits collection.",
    cta: "Shop Lawn",
    link: "/shop?category=lawn-suits"
  }
]

export function HeroSlider() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
          {BANNERS.map((banner, index) => (
              <CarouselItem key={index}>
                <section className="relative min-h-[600px] h-[85vh] lg:h-[90vh] w-full">
                  <div className="absolute inset-0 overflow-hidden">

                <img
                  src={banner.image}
                  alt={banner.title}
                  className="h-full w-full object-cover object-center lg:object-[center_25%]"
                />
                <div className="absolute inset-0 bg-stone-900/40" />
              </div>
            
              <div className="relative flex h-full items-center justify-center text-center px-4">
                <div className="max-w-4xl space-y-6 md:space-y-8">
                      <div className="space-y-4">
                        <h2 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-stone-200">
                          {banner.subtitle}
                        </h2>
                        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-white leading-[1.1] md:leading-[1.2]">
                          {banner.title.split(',').map((part, i) => (
                            <React.Fragment key={i}>
                              {part}{i === 0 && banner.title.includes(',') && <br className="hidden md:block" />}
                            </React.Fragment>
                          ))}
                        </h1>
                      </div>
                      <p className="text-sm md:text-lg text-stone-100 font-light max-w-xl mx-auto leading-relaxed px-4 opacity-90">
                        {banner.description}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 items-center">
                        <Button asChild size="lg" className="rounded-full px-10 h-11 md:h-14 bg-white text-stone-900 hover:bg-stone-100 border-none transition-all shadow-xl hover:scale-105 active:scale-95 text-sm md:text-base font-bold w-full sm:w-auto">
                          <Link href={banner.link}>{banner.cta} <ArrowRight className="ml-2 h-5 w-5" /></Link>
                        </Button>
                        <Button asChild size="lg" variant="ghost" className="rounded-full px-10 h-11 md:h-14 border border-white/50 hover:border-white bg-transparent text-white hover:bg-white/10 transition-all text-sm md:text-base font-bold backdrop-blur-md w-full sm:w-auto">
                          <Link href="/shop">View Full Collection</Link>
                        </Button>
                      </div>

                </div>
              </div>
            </section>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-8 bg-black/20 text-white border-none hover:bg-black/40 hidden md:flex" />
      <CarouselNext className="right-8 bg-black/20 text-white border-none hover:bg-black/40 hidden md:flex" />
    </Carousel>
  )
}
