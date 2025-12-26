// Mock data for the fashion store - replaces backend/database

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  images: string[];
  category_id: string;
  is_featured: boolean;
  ratings: number;
  sizes: string[];
  fabric?: string;
  color?: string;
  care_instructions?: string;
  created_at: string;
  categories: {
    name: string;
    slug: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Lawn Suits',
    slug: 'lawn-suits',
    description: 'Premium quality lawn suits for summer comfort and style.',
    image_url: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000'
  },
  {
    id: '2',
    name: 'Anarkali',
    slug: 'anarkali',
    description: 'Elegant Anarkali suits for festive occasions.',
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000'
  },
  {
    id: '3',
    name: 'Bridal Wear',
    slug: 'bridal-wear',
    description: 'Exquisite bridal collections for your special day.',
    image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000'
  },
  {
    id: '4',
    name: 'Party Wear',
    slug: 'party-wear',
    description: 'Stunning party wear for every celebration.',
    image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000'
  },
  {
    id: '5',
    name: 'Kurtis',
    slug: 'kurtis',
    description: 'Contemporary kurtis for everyday elegance.',
    image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000'
  },
  {
    id: '6',
    name: 'Sarees',
    slug: 'sarees',
    description: 'Traditional and modern sarees for all occasions.',
    image_url: 'https://images.unsplash.com/photo-1507679799987-c7377457a18b?q=80&w=1000'
  },
  {
    id: '7',
    name: 'Sharara Sets',
    slug: 'sharara-sets',
    description: 'Trendy sharara sets for festive celebrations.',
    image_url: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=1000'
  },
  {
    id: '8',
    name: 'Lehengas',
    slug: 'lehengas',
    description: 'Magnificent lehengas for weddings and special events.',
    image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000'
  },
  {
    id: '9',
    name: 'Palazzo Suits',
    slug: 'palazzo-suits',
    description: 'Comfortable and stylish palazzo suits.',
    image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000'
  }
];

export const products: Product[] = [
  // ============ LAWN SUITS (Category 1) ============
  {
    id: '1',
    name: 'Embroidered Lawn Suit - Rose Garden',
    slug: 'embroidered-lawn-suit-rose-garden',
    description: 'Beautiful embroidered lawn suit featuring delicate floral patterns inspired by blooming rose gardens. The intricate threadwork on the neckline and sleeves adds a touch of elegance, while the lightweight lawn fabric ensures all-day comfort. Perfect for summer occasions, brunches, and casual gatherings.',
    price: 129,
    original_price: 159,
    images: [
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000'
    ],
    category_id: '1',
    is_featured: true,
    ratings: 4.9,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fabric: 'Premium Lawn Cotton',
    color: 'Rose Pink',
    care_instructions: 'Dry clean only for best results. Iron on medium heat.',
    created_at: '2024-12-20T10:00:00Z',
    categories: { name: 'Lawn Suits', slug: 'lawn-suits' }
  },
  {
    id: '9',
    name: 'Digital Print Lawn - Ocean Waves',
    slug: 'digital-print-lawn-ocean-waves',
    description: 'Contemporary digital print lawn suit featuring abstract ocean wave patterns in stunning shades of blue and turquoise. The modern design is complemented by subtle embroidery on the borders.',
    price: 99,
    original_price: 129,
    images: [
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000'
    ],
    category_id: '1',
    is_featured: false,
    ratings: 4.7,
    sizes: ['S', 'M', 'L', 'XL'],
    fabric: 'Swiss Lawn',
    color: 'Ocean Blue',
    care_instructions: 'Machine wash cold with similar colors.',
    created_at: '2024-12-22T10:00:00Z',
    categories: { name: 'Lawn Suits', slug: 'lawn-suits' }
  },
  {
    id: '10',
    name: 'Chikankari Lawn Suit - Pure White',
    slug: 'chikankari-lawn-suit-pure-white',
    description: 'Exquisite Lucknowi Chikankari work on premium white lawn fabric. This timeless piece features traditional hand-embroidered patterns that showcase the rich heritage of South Asian craftsmanship.',
    price: 179,
    images: [
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000'
    ],
    category_id: '1',
    is_featured: true,
    ratings: 5.0,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    fabric: 'Premium Lawn with Chikankari',
    color: 'Pure White',
    care_instructions: 'Hand wash recommended. Dry in shade.',
    created_at: '2024-12-21T10:00:00Z',
    categories: { name: 'Lawn Suits', slug: 'lawn-suits' }
  },
  {
    id: '11',
    name: 'Embroidered Lawn - Coral Sunset',
    slug: 'embroidered-lawn-coral-sunset',
    description: 'Vibrant coral lawn suit with geometric embroidery patterns. Features a modern cut with traditional embellishments for the perfect fusion look.',
    price: 139,
    original_price: 169,
    images: [
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000'
    ],
    category_id: '1',
    is_featured: false,
    ratings: 4.6,
    sizes: ['S', 'M', 'L'],
    fabric: 'Lawn Cotton Blend',
    color: 'Coral',
    care_instructions: 'Dry clean only.',
    created_at: '2024-12-19T10:00:00Z',
    categories: { name: 'Lawn Suits', slug: 'lawn-suits' }
  },

  // ============ ANARKALI (Category 2) ============
  {
    id: '2',
    name: 'Royal Anarkali - Midnight Blue',
    slug: 'royal-anarkali-midnight-blue',
    description: 'Elegant Anarkali suit in deep midnight blue with intricate gold embroidery. The floor-length silhouette creates a regal appearance, while the detailed zari work on the bodice and hemline adds luxurious charm. Perfect for weddings, formal dinners, and festive celebrations.',
    price: 249,
    original_price: 299,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000',
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000'
    ],
    category_id: '2',
    is_featured: true,
    ratings: 5.0,
    sizes: ['S', 'M', 'L', 'XL'],
    fabric: 'Silk Blend',
    color: 'Midnight Blue',
    care_instructions: 'Dry clean only.',
    created_at: '2024-12-19T10:00:00Z',
    categories: { name: 'Anarkali', slug: 'anarkali' }
  },
  {
    id: '12',
    name: 'Floral Anarkali - Blush Pink',
    slug: 'floral-anarkali-blush-pink',
    description: 'Romantic blush pink Anarkali with delicate floral thread embroidery. Features a sweetheart neckline and flowing skirt with subtle shimmer.',
    price: 219,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000'
    ],
    category_id: '2',
    is_featured: true,
    ratings: 4.8,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fabric: 'Net with Silk Lining',
    color: 'Blush Pink',
    care_instructions: 'Dry clean only.',
    created_at: '2024-12-18T10:00:00Z',
    categories: { name: 'Anarkali', slug: 'anarkali' }
  },
  {
    id: '13',
    name: 'Mirror Work Anarkali - Festive Maroon',
    slug: 'mirror-work-anarkali-festive-maroon',
    description: 'Statement Anarkali in rich maroon with traditional mirror work (shisha) embroidery. A showstopper piece perfect for Eid, Diwali, and wedding functions.',
    price: 329,
    original_price: 399,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000'
    ],
    category_id: '2',
    is_featured: false,
    ratings: 4.9,
    sizes: ['S', 'M', 'L'],
    fabric: 'Velvet with Net Dupatta',
    color: 'Maroon',
    care_instructions: 'Professional dry clean only.',
    created_at: '2024-12-17T10:00:00Z',
    categories: { name: 'Anarkali', slug: 'anarkali' }
  },
  {
    id: '14',
    name: 'Lucknowi Anarkali - Mint Green',
    slug: 'lucknowi-anarkali-mint-green',
    description: 'Refreshing mint green Anarkali featuring authentic Lucknowi chikankari embroidery. Light and airy, perfect for daytime events and summer celebrations.',
    price: 189,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000'
    ],
    category_id: '2',
    is_featured: false,
    ratings: 4.7,
    sizes: ['S', 'M', 'L', 'XL'],
    fabric: 'Georgette',
    color: 'Mint Green',
    care_instructions: 'Dry clean recommended.',
    created_at: '2024-12-16T10:00:00Z',
    categories: { name: 'Anarkali', slug: 'anarkali' }
  },

  // ============ BRIDAL WEAR (Category 3) ============
  {
    id: '3',
    name: 'Bridal Lehenga - Royal Red',
    slug: 'bridal-lehenga-royal-red',
    description: 'Stunning bridal lehenga in traditional royal red with heavy hand embroidery featuring zardozi, dabka, and sequin work. The magnificent piece includes a heavily embellished blouse and a dual-shade dupatta with intricate border work. Crafted for the bride who wants to make a grand statement on her special day.',
    price: 899,
    images: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000',
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000'
    ],
    category_id: '3',
    is_featured: true,
    ratings: 5.0,
    sizes: ['S', 'M', 'L'],
    fabric: 'Pure Silk with Zardozi Work',
    color: 'Royal Red',
    care_instructions: 'Professional dry clean only. Store in muslin cloth.',
    created_at: '2024-12-18T10:00:00Z',
    categories: { name: 'Bridal Wear', slug: 'bridal-wear' }
  },
  {
    id: '15',
    name: 'Bridal Lehenga - Champagne Gold',
    slug: 'bridal-lehenga-champagne-gold',
    description: 'Modern bridal lehenga in sophisticated champagne gold with delicate crystal and pearl embellishments. Perfect for the contemporary bride who appreciates understated elegance.',
    price: 1299,
    original_price: 1499,
    images: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000'
    ],
    category_id: '3',
    is_featured: true,
    ratings: 5.0,
    sizes: ['XS', 'S', 'M', 'L'],
    fabric: 'Tissue Silk with Crystal Work',
    color: 'Champagne Gold',
    care_instructions: 'Professional dry clean only.',
    created_at: '2024-12-17T10:00:00Z',
    categories: { name: 'Bridal Wear', slug: 'bridal-wear' }
  },
  {
    id: '16',
    name: 'Bridal Gharara - Ivory & Gold',
    slug: 'bridal-gharara-ivory-gold',
    description: 'Elegant bridal gharara set in ivory with intricate gold threadwork. Features a short kurti with heavy embroidery and flared gharara pants with gota patti work.',
    price: 799,
    images: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000'
    ],
    category_id: '3',
    is_featured: false,
    ratings: 4.9,
    sizes: ['S', 'M', 'L'],
    fabric: 'Raw Silk',
    color: 'Ivory & Gold',
    care_instructions: 'Dry clean only.',
    created_at: '2024-12-15T10:00:00Z',
    categories: { name: 'Bridal Wear', slug: 'bridal-wear' }
  },
  {
    id: '17',
    name: 'Reception Gown - Rose Gold',
    slug: 'reception-gown-rose-gold',
    description: 'Glamorous reception gown in rose gold with a mermaid silhouette. Features intricate beadwork and a dramatic train.',
    price: 699,
    original_price: 849,
    images: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000'
    ],
    category_id: '3',
    is_featured: true,
    ratings: 4.8,
    sizes: ['XS', 'S', 'M', 'L'],
    fabric: 'Satin with Beadwork',
    color: 'Rose Gold',
    care_instructions: 'Professional dry clean only.',
    created_at: '2024-12-14T10:00:00Z',
    categories: { name: 'Bridal Wear', slug: 'bridal-wear' }
  },

  // ============ PARTY WEAR (Category 4) ============
  {
    id: '4',
    name: 'Party Wear Gown - Champagne Gold',
    slug: 'party-wear-gown-champagne-gold',
    description: 'Glamorous party wear gown with sequin work and flowing silhouette. The elegant draping and shimmer make it perfect for evening parties, cocktail events, and special celebrations. Features a flattering A-line cut with detailed embellishments on the bodice.',
    price: 349,
    original_price: 399,
    images: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000'
    ],
    category_id: '4',
    is_featured: true,
    ratings: 4.8,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fabric: 'Georgette with Sequins',
    color: 'Champagne Gold',
    care_instructions: 'Dry clean recommended.',
    created_at: '2024-12-17T10:00:00Z',
    categories: { name: 'Party Wear', slug: 'party-wear' }
  },
  {
    id: '18',
    name: 'Cocktail Dress - Emerald Velvet',
    slug: 'cocktail-dress-emerald-velvet',
    description: 'Luxurious emerald velvet cocktail dress with delicate gold embroidery. Features a modern silhouette with traditional accents.',
    price: 279,
    images: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000'
    ],
    category_id: '4',
    is_featured: true,
    ratings: 4.9,
    sizes: ['XS', 'S', 'M', 'L'],
    fabric: 'Velvet',
    color: 'Emerald Green',
    care_instructions: 'Dry clean only.',
    created_at: '2024-12-16T10:00:00Z',
    categories: { name: 'Party Wear', slug: 'party-wear' }
  },
  {
    id: '19',
    name: 'Sequin Sharara Set - Silver Frost',
    slug: 'sequin-sharara-set-silver-frost',
    description: 'Dazzling silver sequin sharara set that catches light beautifully. Perfect for New Year parties, engagements, and glamorous evenings.',
    price: 399,
    original_price: 479,
    images: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000'
    ],
    category_id: '4',
    is_featured: false,
    ratings: 4.7,
    sizes: ['S', 'M', 'L'],
    fabric: 'Net with Sequin Work',
    color: 'Silver',
    care_instructions: 'Dry clean only.',
    created_at: '2024-12-15T10:00:00Z',
    categories: { name: 'Party Wear', slug: 'party-wear' }
  },
  {
    id: '20',
    name: 'Cape Gown - Midnight Black',
    slug: 'cape-gown-midnight-black',
    description: 'Sophisticated black cape gown with subtle shimmer and elegant draping. Features an attached cape for dramatic effect.',
    price: 449,
    images: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000'
    ],
    category_id: '4',
    is_featured: true,
    ratings: 4.9,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fabric: 'Crepe with Cape',
    color: 'Black',
    care_instructions: 'Dry clean only.',
    created_at: '2024-12-14T10:00:00Z',
    categories: { name: 'Party Wear', slug: 'party-wear' }
  },

  // ============ KURTIS (Category 5) ============
  {
    id: '5',
    name: 'Cotton Kurti - Summer Breeze',
    slug: 'cotton-kurti-summer-breeze',
    description: 'Comfortable cotton kurti with subtle prints, perfect for everyday wear. The breathable fabric and relaxed fit make it ideal for work, casual outings, and daily comfort. Features a mandarin collar and three-quarter sleeves.',
    price: 59,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000',
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000'
    ],
    category_id: '5',
    is_featured: false,
    ratings: 4.7,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fabric: 'Pure Cotton',
    color: 'White/Blue',
    care_instructions: 'Machine wash cold.',
    created_at: '2024-12-16T10:00:00Z',
    categories: { name: 'Kurtis', slug: 'kurtis' }
  },
  {
    id: '21',
    name: 'Embroidered Kurti - Mustard Yellow',
    slug: 'embroidered-kurti-mustard-yellow',
    description: 'Vibrant mustard yellow kurti with intricate thread embroidery on the yoke. Perfect for festive occasions and celebrations.',
    price: 79,
    original_price: 99,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000'
    ],
    category_id: '5',
    is_featured: true,
    ratings: 4.8,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fabric: 'Rayon',
    color: 'Mustard Yellow',
    care_instructions: 'Hand wash or gentle machine wash.',
    created_at: '2024-12-15T10:00:00Z',
    categories: { name: 'Kurtis', slug: 'kurtis' }
  },
  {
    id: '22',
    name: 'A-Line Kurti - Teal Blue',
    slug: 'a-line-kurti-teal-blue',
    description: 'Flattering A-line kurti in beautiful teal blue with golden button details. Versatile piece that works for office and casual wear.',
    price: 69,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000'
    ],
    category_id: '5',
    is_featured: false,
    ratings: 4.6,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fabric: 'Cotton Blend',
    color: 'Teal Blue',
    care_instructions: 'Machine wash cold.',
    created_at: '2024-12-14T10:00:00Z',
    categories: { name: 'Kurtis', slug: 'kurtis' }
  },
  {
    id: '23',
    name: 'Printed Kurti Set - Floral Garden',
    slug: 'printed-kurti-set-floral-garden',
    description: 'Beautiful printed kurti with matching palazzo pants. Features vibrant floral prints in a comfortable silhouette.',
    price: 89,
    original_price: 109,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000'
    ],
    category_id: '5',
    is_featured: true,
    ratings: 4.9,
    sizes: ['S', 'M', 'L', 'XL'],
    fabric: 'Muslin',
    color: 'Multicolor Floral',
    care_instructions: 'Hand wash recommended.',
    created_at: '2024-12-13T10:00:00Z',
    categories: { name: 'Kurtis', slug: 'kurtis' }
  },

  // ============ SAREES (Category 6) ============
  {
    id: '6',
    name: 'Banarasi Saree - Emerald Green',
    slug: 'banarasi-saree-emerald-green',
    description: 'Traditional Banarasi silk saree in rich emerald green with intricate golden zari work throughout. The timeless beauty of Banarasi weaving showcases traditional motifs including florals, paisleys, and border work. A masterpiece for weddings, pujas, and special celebrations.',
    price: 499,
    original_price: 599,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c7377457a18b?q=80&w=1000',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000'
    ],
    category_id: '6',
    is_featured: true,
    ratings: 4.9,
    sizes: ['Free Size'],
    fabric: 'Banarasi Silk',
    color: 'Emerald Green',
    care_instructions: 'Dry clean only. Store folded in muslin.',
    created_at: '2024-12-15T10:00:00Z',
    categories: { name: 'Sarees', slug: 'sarees' }
  },
  {
    id: '24',
    name: 'Kanjivaram Saree - Temple Red',
    slug: 'kanjivaram-saree-temple-red',
    description: 'Authentic Kanjivaram silk saree in auspicious red with traditional temple border and rich pallu. Handwoven by master artisans.',
    price: 699,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c7377457a18b?q=80&w=1000'
    ],
    category_id: '6',
    is_featured: true,
    ratings: 5.0,
    sizes: ['Free Size'],
    fabric: 'Pure Kanjivaram Silk',
    color: 'Temple Red',
    care_instructions: 'Dry clean only.',
    created_at: '2024-12-14T10:00:00Z',
    categories: { name: 'Sarees', slug: 'sarees' }
  },
  {
    id: '25',
    name: 'Georgette Saree - Dusty Rose',
    slug: 'georgette-saree-dusty-rose',
    description: 'Elegant georgette saree in dusty rose with delicate sequin work and embroidered border. Lightweight and easy to drape.',
    price: 199,
    original_price: 249,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c7377457a18b?q=80&w=1000'
    ],
    category_id: '6',
    is_featured: false,
    ratings: 4.7,
    sizes: ['Free Size'],
    fabric: 'Georgette',
    color: 'Dusty Rose',
    care_instructions: 'Dry clean recommended.',
    created_at: '2024-12-13T10:00:00Z',
    categories: { name: 'Sarees', slug: 'sarees' }
  },
  {
    id: '26',
    name: 'Chanderi Saree - Sky Blue',
    slug: 'chanderi-saree-sky-blue',
    description: 'Lightweight Chanderi silk saree in beautiful sky blue with subtle gold butis. Perfect for office wear and casual functions.',
    price: 279,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c7377457a18b?q=80&w=1000'
    ],
    category_id: '6',
    is_featured: false,
    ratings: 4.8,
    sizes: ['Free Size'],
    fabric: 'Chanderi Silk',
    color: 'Sky Blue',
    care_instructions: 'Dry clean only.',
    created_at: '2024-12-12T10:00:00Z',
    categories: { name: 'Sarees', slug: 'sarees' }
  },

  // ============ SHARARA SETS (Category 7) ============
  {
    id: '7',
    name: 'Sharara Set - Festive Pink',
    slug: 'sharara-set-festive-pink',
    description: 'Trendy sharara set with traditional mirror work, perfect for Eid and festivities. The short kurti features intricate hand embroidery while the flared sharara pants add drama and elegance. Comes with a matching dupatta with scattered mirror work.',
    price: 279,
    images: [
      'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=1000',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000'
    ],
    category_id: '7',
    is_featured: true,
    ratings: 4.8,
    sizes: ['XS', 'S', 'M', 'L'],
    fabric: 'Georgette with Mirror Work',
    color: 'Festive Pink',
    care_instructions: 'Dry clean only.',
    created_at: '2024-12-14T10:00:00Z',
    categories: { name: 'Sharara Sets', slug: 'sharara-sets' }
  },
  {
    id: '27',
    name: 'Sharara Set - Lavender Dreams',
    slug: 'sharara-set-lavender-dreams',
    description: 'Dreamy lavender sharara set with delicate thread embroidery and pearl embellishments. Perfect for mehendi and sangeet functions.',
    price: 319,
    original_price: 379,
    images: [
      'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=1000'
    ],
    category_id: '7',
    is_featured: true,
    ratings: 4.9,
    sizes: ['S', 'M', 'L', 'XL'],
    fabric: 'Net with Silk Lining',
    color: 'Lavender',
    care_instructions: 'Dry clean only.',
    created_at: '2024-12-13T10:00:00Z',
    categories: { name: 'Sharara Sets', slug: 'sharara-sets' }
  },
  {
    id: '28',
    name: 'Gharara Set - Royal Purple',
    slug: 'gharara-set-royal-purple',
    description: 'Traditional gharara set in royal purple with golden gota patti work. Features a peplum-style kurti with flared gharara.',
    price: 349,
    images: [
      'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=1000'
    ],
    category_id: '7',
    is_featured: false,
    ratings: 4.7,
    sizes: ['S', 'M', 'L'],
    fabric: 'Silk Blend',
    color: 'Royal Purple',
    care_instructions: 'Dry clean only.',
    created_at: '2024-12-12T10:00:00Z',
    categories: { name: 'Sharara Sets', slug: 'sharara-sets' }
  },
  {
    id: '29',
    name: 'Printed Sharara Set - Tropical',
    slug: 'printed-sharara-set-tropical',
    description: 'Contemporary printed sharara set with tropical patterns. Lightweight and comfortable, perfect for summer celebrations.',
    price: 199,
    original_price: 249,
    images: [
      'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=1000'
    ],
    category_id: '7',
    is_featured: false,
    ratings: 4.5,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fabric: 'Georgette',
    color: 'Multicolor',
    care_instructions: 'Hand wash or dry clean.',
    created_at: '2024-12-11T10:00:00Z',
    categories: { name: 'Sharara Sets', slug: 'sharara-sets' }
  },

  // ============ LEHENGAS (Category 8) ============
  {
    id: '8',
    name: 'Designer Lehenga - Peacock Blue',
    slug: 'designer-lehenga-peacock-blue',
    description: 'Contemporary designer lehenga in stunning peacock blue with elaborate peacock motif embroidery. The rich hue is complemented by silver and gold thread work, making it perfect for sangeet, receptions, and festive occasions.',
    price: 649,
    original_price: 749,
    images: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000'
    ],
    category_id: '8',
    is_featured: true,
    ratings: 5.0,
    sizes: ['S', 'M', 'L', 'XL'],
    fabric: 'Art Silk with Embroidery',
    color: 'Peacock Blue',
    care_instructions: 'Dry clean only.',
    created_at: '2024-12-13T10:00:00Z',
    categories: { name: 'Lehengas', slug: 'lehengas' }
  },
  {
    id: '30',
    name: 'Floral Lehenga - Garden Party',
    slug: 'floral-lehenga-garden-party',
    description: 'Fresh and feminine floral lehenga with 3D flower appliqué work. Perfect for day weddings, mehendi, and outdoor celebrations.',
    price: 549,
    images: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000'
    ],
    category_id: '8',
    is_featured: true,
    ratings: 4.9,
    sizes: ['XS', 'S', 'M', 'L'],
    fabric: 'Organza with 3D Flowers',
    color: 'Pastel Multicolor',
    care_instructions: 'Dry clean only.',
    created_at: '2024-12-12T10:00:00Z',
    categories: { name: 'Lehengas', slug: 'lehengas' }
  },
  {
    id: '31',
    name: 'Velvet Lehenga - Wine Red',
    slug: 'velvet-lehenga-wine-red',
    description: 'Luxurious wine red velvet lehenga with intricate zari embroidery. A regal choice for winter weddings and formal events.',
    price: 799,
    original_price: 899,
    images: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000'
    ],
    category_id: '8',
    is_featured: false,
    ratings: 4.8,
    sizes: ['S', 'M', 'L'],
    fabric: 'Velvet',
    color: 'Wine Red',
    care_instructions: 'Dry clean only.',
    created_at: '2024-12-11T10:00:00Z',
    categories: { name: 'Lehengas', slug: 'lehengas' }
  },
  {
    id: '32',
    name: 'Sequin Lehenga - Mirror Silver',
    slug: 'sequin-lehenga-mirror-silver',
    description: 'Show-stopping silver sequin lehenga that sparkles from every angle. Modern design with traditional silhouette.',
    price: 699,
    images: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000'
    ],
    category_id: '8',
    is_featured: true,
    ratings: 4.9,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fabric: 'Net with Full Sequin',
    color: 'Silver',
    care_instructions: 'Dry clean only.',
    created_at: '2024-12-10T10:00:00Z',
    categories: { name: 'Lehengas', slug: 'lehengas' }
  },

  // ============ PALAZZO SUITS (Category 9) ============
  {
    id: '33',
    name: 'Palazzo Suit - Classic Black',
    slug: 'palazzo-suit-classic-black',
    description: 'Timeless black palazzo suit with elegant white embroidery. Features a comfortable fit and versatile style suitable for multiple occasions.',
    price: 149,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000',
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000'
    ],
    category_id: '9',
    is_featured: true,
    ratings: 4.8,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fabric: 'Rayon',
    color: 'Black',
    care_instructions: 'Machine wash cold.',
    created_at: '2024-12-20T10:00:00Z',
    categories: { name: 'Palazzo Suits', slug: 'palazzo-suits' }
  },
  {
    id: '34',
    name: 'Printed Palazzo Set - Bohemian',
    slug: 'printed-palazzo-set-bohemian',
    description: 'Free-spirited bohemian printed palazzo set with flowing silhouette. Features vibrant prints and comfortable fit.',
    price: 119,
    original_price: 149,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000'
    ],
    category_id: '9',
    is_featured: false,
    ratings: 4.6,
    sizes: ['S', 'M', 'L', 'XL'],
    fabric: 'Muslin',
    color: 'Multicolor Print',
    care_instructions: 'Hand wash recommended.',
    created_at: '2024-12-19T10:00:00Z',
    categories: { name: 'Palazzo Suits', slug: 'palazzo-suits' }
  },
  {
    id: '35',
    name: 'Embroidered Palazzo Set - Sage Green',
    slug: 'embroidered-palazzo-set-sage-green',
    description: 'Elegant sage green palazzo set with beautiful threadwork embroidery. Perfect for semi-formal occasions.',
    price: 179,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000'
    ],
    category_id: '9',
    is_featured: true,
    ratings: 4.9,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fabric: 'Chanderi',
    color: 'Sage Green',
    care_instructions: 'Dry clean only.',
    created_at: '2024-12-18T10:00:00Z',
    categories: { name: 'Palazzo Suits', slug: 'palazzo-suits' }
  },
  {
    id: '36',
    name: 'Cotton Palazzo Set - Summer Fresh',
    slug: 'cotton-palazzo-set-summer-fresh',
    description: 'Light and breezy cotton palazzo set in refreshing pastels. Ideal for everyday wear and casual outings.',
    price: 89,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000'
    ],
    category_id: '9',
    is_featured: false,
    ratings: 4.5,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fabric: 'Pure Cotton',
    color: 'Pastel Pink',
    care_instructions: 'Machine wash cold.',
    created_at: '2024-12-17T10:00:00Z',
    categories: { name: 'Palazzo Suits', slug: 'palazzo-suits' }
  }
];

// Helper functions to query mock data
export function getProducts() {
  return products;
}

export function getFeaturedProducts() {
  return products.filter(p => p.is_featured);
}

export function getNewArrivals(limit = 8) {
  return [...products]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}

export function getProductBySlug(slug: string) {
  return products.find(p => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string) {
  return products.filter(p => p.categories.slug === categorySlug);
}

export function getCategories() {
  return categories;
}

export function getCategoryBySlug(slug: string) {
  return categories.find(c => c.slug === slug);
}

export function searchProducts(query: string) {
  const lowerQuery = query.toLowerCase();
  return products.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery)
  );
}

export function filterProducts(options: {
  categorySlug?: string;
  occasion?: string;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  sort?: string;
}) {
  let filtered = [...products];

  if (options.categorySlug) {
    filtered = filtered.filter(p => p.categories.slug === options.categorySlug);
  }

  if (options.minPrice) {
    filtered = filtered.filter(p => p.price >= options.minPrice!);
  }

  if (options.maxPrice) {
    filtered = filtered.filter(p => p.price <= options.maxPrice!);
  }

  if (options.searchQuery) {
    const query = options.searchQuery.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
  }

  // Sorting
  if (options.sort === 'newest') {
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else if (options.sort === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (options.sort === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else {
    // Default: featured first
    filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
  }

  return filtered;
}
