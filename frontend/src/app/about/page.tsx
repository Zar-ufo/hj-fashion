import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Heart, Globe, Users, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=2000" 
              alt="Artisans at work" 
              className="h-full w-full object-cover grayscale opacity-60"
            />
            <div className="absolute inset-0 bg-stone-900/40" />
          </div>
          <div className="relative text-center space-y-4 px-4">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white tracking-tight">Our Legacy</h1>
            <p className="text-xl text-stone-200 font-light uppercase tracking-[0.3em]">Authenticity in every stitch</p>
          </div>
        </section>

        {/* Brand Story */}
        <section className="py-24 container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-serif font-bold text-stone-900">The HJ Fashion Story</h2>
              <p className="text-stone-600 leading-relaxed font-light">
                Founded with a passion for preserving the rich heritage of Pakistani craftsmanship, HJ Fashion USA brings the soul of Lahore, Karachi, and Islamabad to the heart of the United States.
              </p>
              <p className="text-stone-600 leading-relaxed font-light">
                We believe that clothing is more than just fabric—it's a celebration of culture, a testament to artistry, and a bridge between worlds. Our mission is to empower women by providing access to premium, authentic traditional wear that feels as good as it looks.
              </p>
              <div className="flex items-center space-x-4 pt-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100" 
                  alt="Founder" 
                  className="h-16 w-16 rounded-full object-cover border-2 border-stone-100"
                />
                <div>
                  <h4 className="font-bold text-stone-900">Hina Javed</h4>
                  <p className="text-xs uppercase tracking-widest text-stone-400">Founder & Creative Director</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="/pakistani_suits.png" 
                  alt="Craftsmanship" 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-stone-900 text-white p-8 rounded-2xl shadow-xl hidden md:block max-w-[200px]">
                <p className="text-3xl font-serif font-bold">100%</p>
                <p className="text-xs uppercase tracking-widest text-stone-400 mt-2">Authentic Fabrics Sourced Directly</p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-24 bg-stone-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-serif font-bold text-stone-900">Our Commitments</h2>
              <p className="text-stone-500 max-w-xl mx-auto">The principles that guide every decision we make at HJ Fashion USA.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="text-center space-y-4">
                <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm text-stone-900">
                  <Award className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-serif font-bold uppercase tracking-widest">Quality</h3>
                <p className="text-sm text-stone-500 font-light">We never compromise on fabric or finish, ensuring every piece lasts for generations.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm text-stone-900">
                  <Heart className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-serif font-bold uppercase tracking-widest">Authenticity</h3>
                <p className="text-sm text-stone-500 font-light">We work directly with traditional artisans to preserve centuries-old embroidery techniques.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm text-stone-900">
                  <Globe className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-serif font-bold uppercase tracking-widest">Global Link</h3>
                <p className="text-sm text-stone-500 font-light">Connecting the vibrant fashion of Pakistan to the diverse diaspora in the United States.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm text-stone-900">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-serif font-bold uppercase tracking-widest">Community</h3>
                <p className="text-sm text-stone-500 font-light">We take pride in being a part of your celebrations, from weddings to festive Eids.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
