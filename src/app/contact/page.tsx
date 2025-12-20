import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        <section className="bg-stone-50 py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl font-serif font-bold text-stone-900">Get in Touch</h1>
                  <p className="text-stone-500 font-light leading-relaxed">
                    Have a question about our collections, sizing, or an existing order? Our dedicated team is here to assist you.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-stone-900 shadow-sm">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900">Email Us</h3>
                      <p className="text-sm text-stone-500">info@hjfashionusa.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-stone-900 shadow-sm">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900">Call Us</h3>
                      <p className="text-sm text-stone-500">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-stone-900 shadow-sm">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900">Visit Us</h3>
                      <p className="text-sm text-stone-500">Dallas, Texas, United States</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-stone-900 shadow-sm">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-stone-900">Business Hours</h3>
                      <p className="text-sm text-stone-500">Mon - Fri: 9am - 6pm CST</p>
                      <p className="text-sm text-stone-500">Sat - Sun: 10am - 4pm CST</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-stone-100">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="first_name" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">First Name</Label>
                      <Input id="first_name" placeholder="Hina" className="rounded-xl border-stone-100" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Last Name</Label>
                      <Input id="last_name" placeholder="Javed" className="rounded-xl border-stone-100" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Email Address</Label>
                    <Input id="email" type="email" placeholder="hina@example.com" className="rounded-xl border-stone-100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Subject</Label>
                    <Input id="subject" placeholder="Order Inquiry" className="rounded-xl border-stone-100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Message</Label>
                    <Textarea id="message" placeholder="How can we help you?" className="rounded-xl border-stone-100 min-h-[150px]" />
                  </div>
                  <Button className="w-full h-14 rounded-full bg-stone-900 text-white hover:bg-stone-800 text-lg shadow-lg">
                    Send Message <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="py-24 container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-12">
            <h2 className="text-3xl font-serif font-bold text-stone-900 text-center">Frequently Asked Questions</h2>
            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-stone-900">What is your shipping policy within the US?</h3>
                <p className="text-sm text-stone-500 leading-relaxed font-light">We offer standard and express shipping to all 50 states. Orders over $150 qualify for complimentary standard shipping. Most orders are processed within 24-48 hours.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-stone-900">Do you offer custom tailoring?</h3>
                <p className="text-sm text-stone-500 leading-relaxed font-light">Yes, for our formal and bridal collections, we provide custom tailoring services. Please contact us at least 6-8 weeks in advance for bridal orders.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-stone-900">What is your return policy?</h3>
                <p className="text-sm text-stone-500 leading-relaxed font-light">We accept returns of unworn items with original tags within 14 days of delivery. Custom-tailored pieces and sale items are final sale.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
