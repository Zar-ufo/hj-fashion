import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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

            <Accordion type="single" collapsible className="w-full rounded-2xl border border-stone-100 px-5">
              <AccordionItem value="shipping-us" className="border-stone-100">
                <AccordionTrigger className="text-base font-semibold text-stone-900 hover:no-underline">
                  What is your shipping policy within the US?
                </AccordionTrigger>
                <AccordionContent className="text-stone-600 font-light leading-relaxed">
                  We offer standard and express shipping to all 50 states. Orders over $150 qualify for complimentary standard shipping. Most orders are processed within 24-48 hours.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="custom-tailoring" className="border-stone-100">
                <AccordionTrigger className="text-base font-semibold text-stone-900 hover:no-underline">
                  Do you offer custom tailoring?
                </AccordionTrigger>
                <AccordionContent className="text-stone-600 font-light leading-relaxed">
                  Yes, for our formal and bridal collections, we provide custom tailoring services. Please contact us at least 6-8 weeks in advance for bridal orders.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="returns-policy" className="border-stone-100">
                <AccordionTrigger className="text-base font-semibold text-stone-900 hover:no-underline">
                  What is your return policy?
                </AccordionTrigger>
                <AccordionContent className="text-stone-600 font-light leading-relaxed">
                  We accept returns of unworn items with original tags within 14 days of delivery. Custom-tailored pieces and sale items are final sale.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

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
        </section>
      </main>
      <Footer />
    </div>
  );
}
