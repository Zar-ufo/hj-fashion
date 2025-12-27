import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'FAQs | HJ Fashion USA',
};

export default function FaqPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-serif font-bold text-stone-900">Frequently Asked Questions</h1>
              <p className="text-stone-500 font-light">
                Quick answers to common questions about orders, shipping, and returns.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-stone-900">Where do you ship?</h2>
                <p className="text-stone-600 font-light">
                  We currently ship within the United States. For special requests, please contact support.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-stone-900">How long does shipping take?</h2>
                <p className="text-stone-600 font-light">
                  Shipping times vary by location and carrier. You will receive tracking details once your order ships.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-stone-900">Can I return an item?</h2>
                <p className="text-stone-600 font-light">
                  Please see our Shipping & Returns page for the latest return policy and eligibility.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-stone-900">Need more help?</h2>
                <p className="text-stone-600 font-light">
                  Reach out and we’ll get back to you as soon as possible.
                </p>
                <Link href="/contact">
                  <Button className="mt-2 rounded-full bg-stone-900 text-white hover:bg-stone-800">Contact Support</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
