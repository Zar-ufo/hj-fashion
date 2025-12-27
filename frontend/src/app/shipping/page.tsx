import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Shipping & Returns | HJ Fashion USA',
};

export default function ShippingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-serif font-bold text-stone-900">Shipping & Returns</h1>
              <p className="text-stone-500 font-light">
                Shipping timelines, tracking, and return guidance.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-stone-900">Shipping</h2>
                <p className="text-stone-600 font-light">
                  After your order is placed, we process it as quickly as possible and share tracking once it ships.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-stone-900">Returns</h2>
                <p className="text-stone-600 font-light">
                  If you need help with a return, contact support with your order ID and we’ll guide you through the next steps.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-stone-900">Questions?</h2>
                <p className="text-stone-600 font-light">
                  Visit our FAQ page or contact us directly.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/faq">
                    <Button variant="outline" className="rounded-full">Read FAQs</Button>
                  </Link>
                  <Link href="/contact">
                    <Button className="rounded-full bg-stone-900 text-white hover:bg-stone-800">Contact Support</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
