import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create the Prisma adapter
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

// Main categories matching the navbar
const mainCategories = [
  {
    name: 'Sarees',
    slug: 'sarees',
    description: 'Traditional and modern sarees for all occasions.',
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000',
    display_order: 1,
  },
  {
    name: 'Pakistani Suits',
    slug: 'pakistani-shalwar-kameez',
    description: 'Authentic Pakistani suits collection.',
    image_url: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000',
    display_order: 2,
  },
  {
    name: 'Lawn Suits',
    slug: 'lawn-suits',
    description: 'Premium quality lawn suits for summer comfort and style.',
    image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000',
    display_order: 3,
  },
  {
    name: 'Bags',
    slug: 'bags',
    description: 'Stylish bags and clutches for every occasion.',
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000',
    display_order: 4,
  },
  {
    name: 'Shoes',
    slug: 'shoes',
    description: 'Traditional and modern footwear collection.',
    image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000',
    display_order: 5,
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Complete your look with our accessories.',
    image_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000',
    display_order: 6,
  },
  {
    name: 'Dupattas',
    slug: 'dupattas-scarves',
    description: 'Beautiful dupattas and scarves.',
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000',
    display_order: 7,
  },
  {
    name: 'Undergarments',
    slug: 'undergarments',
    description: 'Comfortable undergarments collection.',
    image_url: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000',
    display_order: 8,
  },
  {
    name: 'Sports Wear',
    slug: 'sports-wear',
    description: 'Active wear for your fitness needs.',
    image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000',
    display_order: 9,
  },
  {
    name: 'Customized T-shirt',
    slug: 'customized-tshirt',
    description: 'Personalized T-shirts with your own design or text.',
    image_url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000',
    display_order: 10,
  },
];

// Subcategories for Pakistani Suits
const pakistaniSuitsSubcategories = [
  {
    name: 'Shalwar Kameez',
    slug: 'shalwar-kameez',
    description: 'Classic shalwar kameez collection.',
    image_url: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000',
    display_order: 1,
  },
  {
    name: 'Anarkali Suits',
    slug: 'anarkali-suits',
    description: 'Elegant Anarkali suits for festive occasions.',
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000',
    display_order: 2,
  },
  {
    name: 'Sharara & Gharara',
    slug: 'sharara-gharara',
    description: 'Trendy sharara and gharara sets.',
    image_url: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=1000',
    display_order: 3,
  },
  {
    name: 'Kurti Collection',
    slug: 'kurti-collection',
    description: 'Contemporary kurtis for everyday elegance.',
    image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000',
    display_order: 4,
  },
  {
    name: 'Lehenga',
    slug: 'lehenga',
    description: 'Magnificent lehengas for weddings and special events.',
    image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000',
    display_order: 5,
  },
];

// Occasion categories
const occasionCategories = [
  {
    name: 'Weddings',
    slug: 'weddings',
    description: 'Perfect outfits for wedding celebrations.',
    image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000',
    is_occasion: true,
    display_order: 1,
  },
  {
    name: 'Parties',
    slug: 'parties',
    description: 'Stunning party wear for every celebration.',
    image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000',
    is_occasion: true,
    display_order: 2,
  },
  {
    name: 'Casual',
    slug: 'casual',
    description: 'Comfortable casual wear for everyday style.',
    image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000',
    is_occasion: true,
    display_order: 3,
  },
  {
    name: 'Formal',
    slug: 'formal',
    description: 'Elegant formal wear for professional settings.',
    image_url: 'https://images.unsplash.com/photo-1507679799987-c7377457a18b?q=80&w=1000',
    is_occasion: true,
    display_order: 4,
  },
];

// Sample events
const events = [
  {
    name: 'Eid Collection',
    description: 'Celebrate Eid in style with our exclusive collection.',
    image_url: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=1000',
    discount_percent: 20,
    start_date: new Date('2025-12-20'),
    end_date: new Date('2026-01-15'),
    is_active: true,
    is_featured: true,
    applies_to: 'ALL' as const,
  },
  {
    name: 'Winter Sale',
    description: 'Warm up your wardrobe with amazing discounts.',
    image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000',
    discount_percent: 30,
    start_date: new Date('2025-12-01'),
    end_date: new Date('2026-02-28'),
    is_active: true,
    is_featured: false,
    applies_to: 'ALL' as const,
  },
  {
    name: 'New Year Special',
    description: 'Start the new year with new styles.',
    image_url: 'https://images.unsplash.com/photo-1467043237213-65f2da53396f?q=80&w=1000',
    discount_percent: 25,
    start_date: new Date('2025-12-25'),
    end_date: new Date('2026-01-05'),
    is_active: true,
    is_featured: false,
    applies_to: 'ALL' as const,
  },
  {
    name: 'Bridal Week',
    description: 'Exclusive discounts on bridal wear.',
    image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000',
    discount_percent: 15,
    start_date: new Date('2025-12-15'),
    end_date: new Date('2026-01-31'),
    is_active: true,
    is_featured: false,
    applies_to: 'CATEGORY' as const,
  },
];

// Products will be mapped to new categories
const categories = [
  {
    name: 'Lawn Suits',
    slug: 'lawn-suits',
    description: 'Premium quality lawn suits for summer comfort and style.',
    image_url: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000'
  },
  {
    name: 'Anarkali',
    slug: 'anarkali-suits',
    description: 'Elegant Anarkali suits for festive occasions.',
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000'
  },
  {
    name: 'Bridal Wear',
    slug: 'weddings',
    description: 'Exquisite bridal collections for your special day.',
    image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000'
  },
  {
    name: 'Party Wear',
    slug: 'parties',
    description: 'Stunning party wear for every celebration.',
    image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000'
  },
  {
    name: 'Kurtis',
    slug: 'kurti-collection',
    description: 'Contemporary kurtis for everyday elegance.',
    image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000'
  },
  {
    name: 'Sarees',
    slug: 'sarees',
    description: 'Traditional and modern sarees for all occasions.',
    image_url: 'https://images.unsplash.com/photo-1507679799987-c7377457a18b?q=80&w=1000'
  },
  {
    name: 'Sharara Sets',
    slug: 'sharara-gharara',
    description: 'Trendy sharara sets for festive celebrations.',
    image_url: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=1000'
  },
  {
    name: 'Lehengas',
    slug: 'lehenga',
    description: 'Magnificent lehengas for weddings and special events.',
    image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000'
  },
  {
    name: 'Palazzo Suits',
    slug: 'shalwar-kameez',
    description: 'Comfortable and stylish palazzo suits.',
    image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000'
  }
];

const products = [
  // ============ LAWN SUITS ============
  {
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
    category_slug: 'lawn-suits',
    is_featured: true,
    ratings: 4.9,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fabric: 'Premium Lawn Cotton',
    color: 'Rose Pink',
    care_instructions: 'Dry clean only for best results. Iron on medium heat.'
  },
  {
    name: 'Digital Print Lawn - Ocean Waves',
    slug: 'digital-print-lawn-ocean-waves',
    description: 'Contemporary digital print lawn suit featuring abstract ocean wave patterns in stunning shades of blue and turquoise. The modern design is complemented by subtle embroidery on the borders.',
    price: 99,
    original_price: 129,
    images: [
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000'
    ],
    category_slug: 'lawn-suits',
    is_featured: false,
    ratings: 4.7,
    sizes: ['S', 'M', 'L', 'XL'],
    fabric: 'Swiss Lawn',
    color: 'Ocean Blue',
    care_instructions: 'Machine wash cold with similar colors.'
  },
  {
    name: 'Chikankari Lawn Suit - Pure White',
    slug: 'chikankari-lawn-suit-pure-white',
    description: 'Exquisite Lucknowi Chikankari work on premium white lawn fabric. This timeless piece features traditional hand-embroidered patterns that showcase the rich heritage of South Asian craftsmanship.',
    price: 179,
    images: [
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000'
    ],
    category_slug: 'lawn-suits',
    is_featured: true,
    ratings: 5.0,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    fabric: 'Premium Lawn with Chikankari',
    color: 'Pure White',
    care_instructions: 'Hand wash recommended. Dry in shade.'
  },
  {
    name: 'Embroidered Lawn - Coral Sunset',
    slug: 'embroidered-lawn-coral-sunset',
    description: 'Vibrant coral lawn suit with geometric embroidery patterns. Features a modern cut with traditional embellishments for the perfect fusion look.',
    price: 139,
    original_price: 169,
    images: [
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000'
    ],
    category_slug: 'lawn-suits',
    is_featured: false,
    ratings: 4.6,
    sizes: ['S', 'M', 'L'],
    fabric: 'Lawn Cotton Blend',
    color: 'Coral',
    care_instructions: 'Dry clean only.'
  },

  // ============ ANARKALI ============
  {
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
    category_slug: 'anarkali',
    is_featured: true,
    ratings: 5.0,
    sizes: ['S', 'M', 'L', 'XL'],
    fabric: 'Silk Blend',
    color: 'Midnight Blue',
    care_instructions: 'Dry clean only.'
  },
  {
    name: 'Floral Anarkali - Blush Pink',
    slug: 'floral-anarkali-blush-pink',
    description: 'Romantic blush pink Anarkali with delicate floral thread embroidery. Features a sweetheart neckline and flowing skirt with subtle shimmer.',
    price: 219,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000'
    ],
    category_slug: 'anarkali',
    is_featured: true,
    ratings: 4.8,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fabric: 'Net with Silk Lining',
    color: 'Blush Pink',
    care_instructions: 'Dry clean only.'
  },
  {
    name: 'Mirror Work Anarkali - Festive Maroon',
    slug: 'mirror-work-anarkali-festive-maroon',
    description: 'Statement Anarkali in rich maroon with traditional mirror work (shisha) embroidery. A showstopper piece perfect for Eid, Diwali, and wedding functions.',
    price: 329,
    original_price: 399,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000'
    ],
    category_slug: 'anarkali',
    is_featured: false,
    ratings: 4.9,
    sizes: ['S', 'M', 'L'],
    fabric: 'Velvet with Net Dupatta',
    color: 'Maroon',
    care_instructions: 'Professional dry clean only.'
  },
  {
    name: 'Lucknowi Anarkali - Mint Green',
    slug: 'lucknowi-anarkali-mint-green',
    description: 'Refreshing mint green Anarkali featuring authentic Lucknowi chikankari embroidery. Light and airy, perfect for daytime events and summer celebrations.',
    price: 189,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000'
    ],
    category_slug: 'anarkali',
    is_featured: false,
    ratings: 4.7,
    sizes: ['S', 'M', 'L', 'XL'],
    fabric: 'Georgette',
    color: 'Mint Green',
    care_instructions: 'Dry clean recommended.'
  },

  // ============ BRIDAL WEAR ============
  {
    name: 'Bridal Lehenga - Royal Red',
    slug: 'bridal-lehenga-royal-red',
    description: 'Stunning bridal lehenga in traditional royal red with heavy hand embroidery featuring zardozi, dabka, and sequin work. The magnificent piece includes a heavily embellished blouse and a dual-shade dupatta with intricate border work. Crafted for the bride who wants to make a grand statement on her special day.',
    price: 899,
    images: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000',
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000'
    ],
    category_slug: 'bridal-wear',
    is_featured: true,
    ratings: 5.0,
    sizes: ['S', 'M', 'L'],
    fabric: 'Pure Silk with Zardozi Work',
    color: 'Royal Red',
    care_instructions: 'Professional dry clean only. Store in muslin cloth.'
  },
  {
    name: 'Bridal Lehenga - Champagne Gold',
    slug: 'bridal-lehenga-champagne-gold',
    description: 'Modern bridal lehenga in sophisticated champagne gold with delicate crystal and pearl embellishments. Perfect for the contemporary bride who appreciates understated elegance.',
    price: 1299,
    original_price: 1499,
    images: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000'
    ],
    category_slug: 'bridal-wear',
    is_featured: true,
    ratings: 5.0,
    sizes: ['XS', 'S', 'M', 'L'],
    fabric: 'Tissue Silk with Crystal Work',
    color: 'Champagne Gold',
    care_instructions: 'Professional dry clean only.'
  },
  {
    name: 'Bridal Gharara - Ivory & Gold',
    slug: 'bridal-gharara-ivory-gold',
    description: 'Elegant bridal gharara set in ivory with intricate gold threadwork. Features a short kurti with heavy embroidery and flared gharara pants with gota patti work.',
    price: 799,
    images: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000'
    ],
    category_slug: 'bridal-wear',
    is_featured: false,
    ratings: 4.9,
    sizes: ['S', 'M', 'L'],
    fabric: 'Raw Silk',
    color: 'Ivory & Gold',
    care_instructions: 'Dry clean only.'
  },
  {
    name: 'Reception Gown - Rose Gold',
    slug: 'reception-gown-rose-gold',
    description: 'Glamorous reception gown in rose gold with a mermaid silhouette. Features intricate beadwork and a dramatic train.',
    price: 699,
    original_price: 849,
    images: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000'
    ],
    category_slug: 'bridal-wear',
    is_featured: true,
    ratings: 4.8,
    sizes: ['XS', 'S', 'M', 'L'],
    fabric: 'Satin with Beadwork',
    color: 'Rose Gold',
    care_instructions: 'Professional dry clean only.'
  },

  // ============ PARTY WEAR ============
  {
    name: 'Party Wear Gown - Champagne Gold',
    slug: 'party-wear-gown-champagne-gold',
    description: 'Glamorous party wear gown with sequin work and flowing silhouette. The elegant draping and shimmer make it perfect for evening parties, cocktail events, and special celebrations. Features a flattering A-line cut with detailed embellishments on the bodice.',
    price: 349,
    original_price: 399,
    images: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000'
    ],
    category_slug: 'party-wear',
    is_featured: true,
    ratings: 4.8,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fabric: 'Georgette with Sequins',
    color: 'Champagne Gold',
    care_instructions: 'Dry clean recommended.'
  },
  {
    name: 'Cocktail Dress - Emerald Velvet',
    slug: 'cocktail-dress-emerald-velvet',
    description: 'Luxurious emerald velvet cocktail dress with delicate gold embroidery. Features a modern silhouette with traditional accents.',
    price: 279,
    images: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000'
    ],
    category_slug: 'party-wear',
    is_featured: true,
    ratings: 4.9,
    sizes: ['XS', 'S', 'M', 'L'],
    fabric: 'Velvet',
    color: 'Emerald Green',
    care_instructions: 'Dry clean only.'
  },
  {
    name: 'Sequin Sharara Set - Silver Frost',
    slug: 'sequin-sharara-set-silver-frost',
    description: 'Dazzling silver sequin sharara set that catches light beautifully. Perfect for New Year parties, engagements, and glamorous evenings.',
    price: 399,
    original_price: 479,
    images: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000'
    ],
    category_slug: 'party-wear',
    is_featured: false,
    ratings: 4.7,
    sizes: ['S', 'M', 'L'],
    fabric: 'Net with Sequin Work',
    color: 'Silver',
    care_instructions: 'Dry clean only.'
  },
  {
    name: 'Cape Gown - Midnight Black',
    slug: 'cape-gown-midnight-black',
    description: 'Sophisticated black cape gown with subtle shimmer and elegant draping. Features an attached cape for dramatic effect.',
    price: 449,
    images: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000'
    ],
    category_slug: 'party-wear',
    is_featured: true,
    ratings: 4.9,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fabric: 'Crepe with Cape',
    color: 'Black',
    care_instructions: 'Dry clean only.'
  },

  // ============ KURTIS ============
  {
    name: 'Cotton Kurti - Summer Breeze',
    slug: 'cotton-kurti-summer-breeze',
    description: 'Comfortable cotton kurti with subtle prints, perfect for everyday wear. The breathable fabric and relaxed fit make it ideal for work, casual outings, and daily comfort. Features a mandarin collar and three-quarter sleeves.',
    price: 59,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000',
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000'
    ],
    category_slug: 'kurtis',
    is_featured: false,
    ratings: 4.7,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fabric: 'Pure Cotton',
    color: 'White/Blue',
    care_instructions: 'Machine wash cold.'
  },
  {
    name: 'Embroidered Kurti - Mustard Yellow',
    slug: 'embroidered-kurti-mustard-yellow',
    description: 'Vibrant mustard yellow kurti with intricate thread embroidery on the yoke. Perfect for festive occasions and celebrations.',
    price: 79,
    original_price: 99,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000'
    ],
    category_slug: 'kurtis',
    is_featured: true,
    ratings: 4.8,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fabric: 'Rayon',
    color: 'Mustard Yellow',
    care_instructions: 'Hand wash or gentle machine wash.'
  },
  {
    name: 'A-Line Kurti - Teal Blue',
    slug: 'a-line-kurti-teal-blue',
    description: 'Flattering A-line kurti in beautiful teal blue with golden button details. Versatile piece that works for office and casual wear.',
    price: 69,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000'
    ],
    category_slug: 'kurtis',
    is_featured: false,
    ratings: 4.6,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fabric: 'Cotton Blend',
    color: 'Teal Blue',
    care_instructions: 'Machine wash cold.'
  },
  {
    name: 'Printed Kurti Set - Floral Garden',
    slug: 'printed-kurti-set-floral-garden',
    description: 'Beautiful printed kurti with matching palazzo pants. Features vibrant floral prints in a comfortable silhouette.',
    price: 89,
    original_price: 109,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000'
    ],
    category_slug: 'kurtis',
    is_featured: true,
    ratings: 4.9,
    sizes: ['S', 'M', 'L', 'XL'],
    fabric: 'Muslin',
    color: 'Multicolor Floral',
    care_instructions: 'Hand wash recommended.'
  },

  // ============ SAREES ============
  {
    name: 'Banarasi Saree - Emerald Green',
    slug: 'banarasi-saree-emerald-green',
    description: 'Traditional Banarasi silk saree in rich emerald green with intricate golden zari work throughout. The timeless beauty of Banarasi weaving showcases traditional motifs including florals, paisleys, and border work. A masterpiece for weddings, pujas, and special celebrations.',
    price: 499,
    original_price: 599,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c7377457a18b?q=80&w=1000',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000'
    ],
    category_slug: 'sarees',
    is_featured: true,
    ratings: 4.9,
    sizes: ['Free Size'],
    fabric: 'Banarasi Silk',
    color: 'Emerald Green',
    care_instructions: 'Dry clean only. Store folded in muslin.'
  },
  {
    name: 'Kanjivaram Saree - Temple Red',
    slug: 'kanjivaram-saree-temple-red',
    description: 'Authentic Kanjivaram silk saree in auspicious red with traditional temple border and rich pallu. Handwoven by master artisans.',
    price: 699,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c7377457a18b?q=80&w=1000'
    ],
    category_slug: 'sarees',
    is_featured: true,
    ratings: 5.0,
    sizes: ['Free Size'],
    fabric: 'Pure Kanjivaram Silk',
    color: 'Temple Red',
    care_instructions: 'Dry clean only.'
  },
  {
    name: 'Georgette Saree - Dusty Rose',
    slug: 'georgette-saree-dusty-rose',
    description: 'Elegant georgette saree in dusty rose with delicate sequin work and embroidered border. Lightweight and easy to drape.',
    price: 199,
    original_price: 249,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c7377457a18b?q=80&w=1000'
    ],
    category_slug: 'sarees',
    is_featured: false,
    ratings: 4.7,
    sizes: ['Free Size'],
    fabric: 'Georgette',
    color: 'Dusty Rose',
    care_instructions: 'Dry clean recommended.'
  },
  {
    name: 'Chanderi Saree - Sky Blue',
    slug: 'chanderi-saree-sky-blue',
    description: 'Lightweight Chanderi silk saree in beautiful sky blue with subtle gold butis. Perfect for office wear and casual functions.',
    price: 279,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c7377457a18b?q=80&w=1000'
    ],
    category_slug: 'sarees',
    is_featured: false,
    ratings: 4.8,
    sizes: ['Free Size'],
    fabric: 'Chanderi Silk',
    color: 'Sky Blue',
    care_instructions: 'Dry clean only.'
  },

  // ============ SHARARA SETS ============
  {
    name: 'Sharara Set - Festive Pink',
    slug: 'sharara-set-festive-pink',
    description: 'Trendy sharara set with traditional mirror work, perfect for Eid and festivities. The short kurti features intricate hand embroidery while the flared sharara pants add drama and elegance. Comes with a matching dupatta with scattered mirror work.',
    price: 279,
    images: [
      'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=1000',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000'
    ],
    category_slug: 'sharara-sets',
    is_featured: true,
    ratings: 4.8,
    sizes: ['XS', 'S', 'M', 'L'],
    fabric: 'Georgette with Mirror Work',
    color: 'Festive Pink',
    care_instructions: 'Dry clean only.'
  },
  {
    name: 'Sharara Set - Lavender Dreams',
    slug: 'sharara-set-lavender-dreams',
    description: 'Dreamy lavender sharara set with delicate thread embroidery and pearl embellishments. Perfect for mehendi and sangeet functions.',
    price: 319,
    original_price: 379,
    images: [
      'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=1000'
    ],
    category_slug: 'sharara-sets',
    is_featured: true,
    ratings: 4.9,
    sizes: ['S', 'M', 'L', 'XL'],
    fabric: 'Net with Silk Lining',
    color: 'Lavender',
    care_instructions: 'Dry clean only.'
  },
  {
    name: 'Gharara Set - Royal Purple',
    slug: 'gharara-set-royal-purple',
    description: 'Traditional gharara set in royal purple with golden gota patti work. Features a peplum-style kurti with flared gharara.',
    price: 349,
    images: [
      'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=1000'
    ],
    category_slug: 'sharara-sets',
    is_featured: false,
    ratings: 4.7,
    sizes: ['S', 'M', 'L'],
    fabric: 'Silk Blend',
    color: 'Royal Purple',
    care_instructions: 'Dry clean only.'
  },
  {
    name: 'Printed Sharara Set - Tropical',
    slug: 'printed-sharara-set-tropical',
    description: 'Contemporary printed sharara set with tropical patterns. Lightweight and comfortable, perfect for summer celebrations.',
    price: 199,
    original_price: 249,
    images: [
      'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=1000'
    ],
    category_slug: 'sharara-sets',
    is_featured: false,
    ratings: 4.5,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fabric: 'Georgette',
    color: 'Multicolor',
    care_instructions: 'Hand wash or dry clean.'
  },

  // ============ LEHENGAS ============
  {
    name: 'Designer Lehenga - Peacock Blue',
    slug: 'designer-lehenga-peacock-blue',
    description: 'Contemporary designer lehenga in stunning peacock blue with elaborate peacock motif embroidery. The rich hue is complemented by silver and gold thread work, making it perfect for sangeet, receptions, and festive occasions.',
    price: 649,
    original_price: 749,
    images: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000'
    ],
    category_slug: 'lehengas',
    is_featured: true,
    ratings: 5.0,
    sizes: ['S', 'M', 'L', 'XL'],
    fabric: 'Art Silk with Embroidery',
    color: 'Peacock Blue',
    care_instructions: 'Dry clean only.'
  },
  {
    name: 'Floral Lehenga - Garden Party',
    slug: 'floral-lehenga-garden-party',
    description: 'Fresh and feminine floral lehenga with 3D flower appliqué work. Perfect for day weddings, mehendi, and outdoor celebrations.',
    price: 549,
    images: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000'
    ],
    category_slug: 'lehengas',
    is_featured: true,
    ratings: 4.9,
    sizes: ['XS', 'S', 'M', 'L'],
    fabric: 'Organza with 3D Flowers',
    color: 'Pastel Multicolor',
    care_instructions: 'Dry clean only.'
  },
  {
    name: 'Velvet Lehenga - Wine Red',
    slug: 'velvet-lehenga-wine-red',
    description: 'Luxurious wine red velvet lehenga with intricate zari embroidery. A regal choice for winter weddings and formal events.',
    price: 799,
    original_price: 899,
    images: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000'
    ],
    category_slug: 'lehengas',
    is_featured: false,
    ratings: 4.8,
    sizes: ['S', 'M', 'L'],
    fabric: 'Velvet',
    color: 'Wine Red',
    care_instructions: 'Dry clean only.'
  },
  {
    name: 'Sequin Lehenga - Mirror Silver',
    slug: 'sequin-lehenga-mirror-silver',
    description: 'Show-stopping silver sequin lehenga that sparkles from every angle. Modern design with traditional silhouette.',
    price: 699,
    images: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000'
    ],
    category_slug: 'lehengas',
    is_featured: true,
    ratings: 4.9,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fabric: 'Net with Full Sequin',
    color: 'Silver',
    care_instructions: 'Dry clean only.'
  },

  // ============ PALAZZO SUITS ============
  {
    name: 'Palazzo Suit - Classic Black',
    slug: 'palazzo-suit-classic-black',
    description: 'Timeless black palazzo suit with elegant white embroidery. Features a comfortable fit and versatile style suitable for multiple occasions.',
    price: 149,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000',
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000'
    ],
    category_slug: 'palazzo-suits',
    is_featured: true,
    ratings: 4.8,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fabric: 'Rayon',
    color: 'Black',
    care_instructions: 'Machine wash cold.'
  },
  {
    name: 'Printed Palazzo Set - Bohemian',
    slug: 'printed-palazzo-set-bohemian',
    description: 'Free-spirited bohemian printed palazzo set with flowing silhouette. Features vibrant prints and comfortable fit.',
    price: 119,
    original_price: 149,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000'
    ],
    category_slug: 'palazzo-suits',
    is_featured: false,
    ratings: 4.6,
    sizes: ['S', 'M', 'L', 'XL'],
    fabric: 'Muslin',
    color: 'Multicolor Print',
    care_instructions: 'Hand wash recommended.'
  },
  {
    name: 'Embroidered Palazzo Set - Sage Green',
    slug: 'embroidered-palazzo-set-sage-green',
    description: 'Elegant sage green palazzo set with beautiful threadwork embroidery. Perfect for semi-formal occasions.',
    price: 179,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000'
    ],
    category_slug: 'palazzo-suits',
    is_featured: true,
    ratings: 4.9,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fabric: 'Chanderi',
    color: 'Sage Green',
    care_instructions: 'Dry clean only.'
  },
  {
    name: 'Cotton Palazzo Set - Summer Fresh',
    slug: 'cotton-palazzo-set-summer-fresh',
    description: 'Light and breezy cotton palazzo set in refreshing pastels. Ideal for everyday wear and casual outings.',
    price: 89,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000'
    ],
    category_slug: 'palazzo-suits',
    is_featured: false,
    ratings: 4.5,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fabric: 'Pure Cotton',
    color: 'Pastel Pink',
    care_instructions: 'Machine wash cold.'
  }
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  // Create main categories
  console.log('📁 Creating main categories...');
  const createdMainCategories: { id: string; slug: string; name: string }[] = [];
  for (const category of mainCategories) {
    const created = await prisma.category.create({
      data: category,
    });
    createdMainCategories.push(created);
  }

  // Find Pakistani Suits category to add subcategories
  const pakistaniSuitsCategory = createdMainCategories.find(c => c.slug === 'pakistani-shalwar-kameez');
  
  // Create Pakistani Suits subcategories
  console.log('📁 Creating Pakistani Suits subcategories...');
  const createdSubcategories: { id: string; slug: string; name: string }[] = [];
  if (pakistaniSuitsCategory) {
    for (const subcat of pakistaniSuitsSubcategories) {
      const created = await prisma.category.create({
        data: {
          ...subcat,
          parent_id: pakistaniSuitsCategory.id,
        },
      });
      createdSubcategories.push(created);
    }
  }

  // Create occasion categories
  console.log('📁 Creating occasion categories...');
  const createdOccasions: { id: string; slug: string; name: string }[] = [];
  for (const occasion of occasionCategories) {
    const created = await prisma.category.create({
      data: occasion,
    });
    createdOccasions.push(created);
  }

  // Combine all categories for product mapping
  const allCreatedCategories = [...createdMainCategories, ...createdSubcategories, ...createdOccasions];

  // Create a map of category slugs to IDs
  const categoryMap = new Map<string, string>(
    allCreatedCategories.map((cat) => [cat.slug, cat.id])
  );

  // Create events
  console.log('🎉 Creating events...');
  for (const event of events) {
    await prisma.event.create({
      data: event,
    });
  }

  // Create products
  console.log('🛍️  Creating products...');
  for (const product of products) {
    const { category_slug, ...productData } = product;
    const category_id = categoryMap.get(category_slug);
    
    if (category_id) {
      await prisma.product.create({
        data: {
          ...productData,
          category_id,
        },
      });
    } else {
      // Default to first available category if slug not found
      const firstCategory = allCreatedCategories[0];
      if (firstCategory) {
        await prisma.product.create({
          data: {
            ...productData,
            category_id: firstCategory.id,
          },
        });
      }
    }
  }

  // Create a demo admin user (password: admin123)
  console.log('👤 Creating demo admin user...');
  await prisma.user.create({
    data: {
      email: 'admin@hjfashion.com',
      password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
      first_name: 'Admin',
      last_name: 'User',
      role: 'ADMIN',
      email_verified: true,
    },
  });

  // Create HJ admin user
  console.log('👤 Creating HJ admin user...');
  await prisma.user.create({
    data: {
      email: 'hj_admin@gmail.com',
      password_hash: '$2b$10$QfWIyWbEog3FK5R32ipB9exGyie68l9eDoxTU4tOESKts95Ne4S/m', // password: hj_mast_3444
      first_name: 'HJ',
      last_name: 'Admin',
      role: 'ADMIN',
      email_verified: true,
    },
  });

  // Create a demo customer user
  console.log('👤 Creating demo customer user...');
  await prisma.user.create({
    data: {
      email: 'customer@example.com',
      password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
      first_name: 'Jane',
      last_name: 'Doe',
      role: 'CUSTOMER',
      email_verified: false,
    },
  });

  // Create more sample customers
  console.log('👤 Creating sample customers...');
  const sampleCustomers = [
    { email: 'ayesha.khan@example.com', first_name: 'Ayesha', last_name: 'Khan', phone: '+1234567890', city: 'New York' },
    { email: 'fatima.ali@example.com', first_name: 'Fatima', last_name: 'Ali', phone: '+1234567891', city: 'Los Angeles' },
    { email: 'zara.malik@example.com', first_name: 'Zara', last_name: 'Malik', phone: '+1234567892', city: 'Chicago' },
    { email: 'sarah.ahmed@example.com', first_name: 'Sarah', last_name: 'Ahmed', phone: '+1234567893', city: 'Houston' },
  ];

  for (const customer of sampleCustomers) {
    await prisma.user.create({
      data: {
        ...customer,
        password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
        role: 'CUSTOMER',
        email_verified: true,
      },
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
