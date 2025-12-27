import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy | HJ Fashion USA',
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-serif font-bold text-stone-900">Privacy Policy</h1>
              <p className="text-stone-500 font-light">
                This page explains how we handle information when you use our site.
              </p>
            </div>

            <div className="space-y-4 text-stone-600 font-light leading-relaxed">
              <p>
                We may collect information you provide (such as your email address) to create accounts, process orders,
                and provide customer support.
              </p>
              <p>
                We may also collect basic usage and device information to improve performance and security.
              </p>
              <p>
                If you have questions about privacy or data requests, please contact us via the Contact page.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
