import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SizeGuidePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12 lg:py-24">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-serif font-bold text-stone-900">Size Guide</h1>
            <p className="text-stone-500 max-w-xl mx-auto">Ensuring the perfect fit for your traditional attire. Please use these charts as a general guide to finding your size.</p>
          </div>

          <div className="space-y-8">
            <h2 className="text-2xl font-serif font-bold text-stone-900 border-b border-stone-100 pb-4">Women's Standard Sizing</h2>
            <Table>
              <TableHeader className="bg-stone-50">
                <TableRow>
                  <TableHead className="font-bold uppercase tracking-widest text-[10px] text-stone-500">Size</TableHead>
                  <TableHead className="font-bold uppercase tracking-widest text-[10px] text-stone-500">US Size</TableHead>
                  <TableHead className="font-bold uppercase tracking-widest text-[10px] text-stone-500">Bust (in)</TableHead>
                  <TableHead className="font-bold uppercase tracking-widest text-[10px] text-stone-500">Waist (in)</TableHead>
                  <TableHead className="font-bold uppercase tracking-widest text-[10px] text-stone-500">Hips (in)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-bold">XS</TableCell>
                  <TableCell>0 - 2</TableCell>
                  <TableCell>32 - 33</TableCell>
                  <TableCell>24 - 25</TableCell>
                  <TableCell>34 - 35</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold">S</TableCell>
                  <TableCell>4 - 6</TableCell>
                  <TableCell>34 - 35</TableCell>
                  <TableCell>26 - 27</TableCell>
                  <TableCell>36 - 37</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold">M</TableCell>
                  <TableCell>8 - 10</TableCell>
                  <TableCell>36 - 37</TableCell>
                  <TableCell>28 - 29</TableCell>
                  <TableCell>38 - 39</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold">L</TableCell>
                  <TableCell>12 - 14</TableCell>
                  <TableCell>38 - 40</TableCell>
                  <TableCell>30 - 32</TableCell>
                  <TableCell>40 - 42</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold">XL</TableCell>
                  <TableCell>16 - 18</TableCell>
                  <TableCell>42 - 44</TableCell>
                  <TableCell>34 - 36</TableCell>
                  <TableCell>44 - 46</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
            <div className="space-y-6">
              <h3 className="text-xl font-serif font-bold text-stone-900">How to Measure</h3>
              <ul className="space-y-4 text-stone-600 font-light text-sm">
                <li>
                  <strong className="text-stone-900 block mb-1">Bust:</strong>
                  Measure around the fullest part of your bust, keeping the tape horizontal.
                </li>
                <li>
                  <strong className="text-stone-900 block mb-1">Waist:</strong>
                  Measure around your natural waistline, typically the narrowest part of your torso.
                </li>
                <li>
                  <strong className="text-stone-900 block mb-1">Hips:</strong>
                  Measure around the fullest part of your hips, about 8 inches below your waist.
                </li>
              </ul>
            </div>
            <div className="bg-stone-50 rounded-3xl p-8 flex flex-col justify-center">
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-4 text-center">Need Custom Sizing?</h3>
              <p className="text-sm text-stone-500 text-center mb-6 leading-relaxed">
                Many of our formal and bridal pieces can be custom-tailored to your exact measurements. Contact our styling team for a personalized consultation.
              </p>
              <Link href="/contact" className="w-full">
                <Button className="w-full h-12 rounded-full bg-stone-900 text-white font-bold hover:bg-stone-800 transition-colors">
                  Request Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
