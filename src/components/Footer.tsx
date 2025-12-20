import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex flex-col">
              <span className="text-2xl font-serif font-bold tracking-tighter text-white">
                HJ FASHION USA
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400">
                Pakistani Premium Wear
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed">
              Bringing the elegance and craftsmanship of authentic Pakistani fashion to the United States. Your trusted destination for premium traditional wear.
            </p>
            <div className="flex space-x-5">
              <Link href="#" className="hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6">Collections</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/shop?category=shalwar-kameez" className="hover:text-white transition-colors">Shalwar Kameez</Link></li>
              <li><Link href="/shop?category=anarkali-suits" className="hover:text-white transition-colors">Anarkali Suits</Link></li>
              <li><Link href="/shop?category=lehenga" className="hover:text-white transition-colors">Lehenga & Bridal</Link></li>
              <li><Link href="/shop?category=kurti-collection" className="hover:text-white transition-colors">Kurti Collection</Link></li>
              <li><Link href="/shop?category=accessories" className="hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6">Customer Service</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6">Store Information</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-stone-500 flex-shrink-0" />
                <span>Dallas, Texas, United States</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-stone-500 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-stone-500 flex-shrink-0" />
                <span>info@hjfashionusa.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} HJ Fashion USA. All rights reserved.</p>
          <div className="flex space-x-6">
            <span className="flex items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer mr-2" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer mr-2" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
