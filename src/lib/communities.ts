// Homemade Connect Delivery — Cultural Communities

export interface Community {
  id: string;
  name: string;
  emoji: string;
  script?: string;        // native script/lettering
  scriptFont?: string;    // font style hint
  color: string;          // tailwind gradient
  textColor: string;
  description: string;
  sampleDishes: string[];
  category: string;
}

export const COMMUNITIES: Community[] = [
  {
    id: 'soul-food',
    name: 'Soul Food',
    emoji: '🍗',
    script: 'Soul Food',
    color: 'from-amber-500 to-orange-600',
    textColor: 'text-amber-700',
    description: 'Southern comfort from Black home kitchens',
    sampleDishes: ['Fried Chicken', 'Mac & Cheese', 'Collard Greens', 'Cornbread'],
    category: 'soul-food',
  },
  {
    id: 'latin',
    name: 'Latino / Hispanic',
    emoji: '🌮',
    script: 'Sabor Latino',
    color: 'from-red-500 to-pink-600',
    textColor: 'text-red-700',
    description: 'Authentic flavors from Mexican, Puerto Rican, Colombian & more',
    sampleDishes: ['Tamales', 'Empanadas', 'Pernil', 'Pupusas', 'Mole'],
    category: 'latin',
  },
  {
    id: 'caribbean',
    name: 'Caribbean',
    emoji: '🌴',
    script: 'Irie Kitchen',
    color: 'from-green-500 to-teal-600',
    textColor: 'text-green-700',
    description: 'Jamaican, Haitian, Trinidadian & island cooking',
    sampleDishes: ['Jerk Chicken', 'Oxtail', 'Rice & Peas', 'Roti'],
    category: 'caribbean',
  },
  {
    id: 'east-asian',
    name: 'East Asian',
    emoji: '🥟',
    script: '家常菜',          // Chinese: Home-cooked food
    color: 'from-red-600 to-yellow-500',
    textColor: 'text-red-700',
    description: 'Chinese, Korean, Japanese & Vietnamese home cooking',
    sampleDishes: ['Dumplings', 'Bibimbap', 'Pho', 'Bento', 'Mapo Tofu'],
    category: 'east-asian',
  },
  {
    id: 'south-asian',
    name: 'Desi / South Asian',
    emoji: '🍛',
    script: 'घर का खाना',      // Hindi: Home food
    color: 'from-yellow-500 to-orange-500',
    textColor: 'text-yellow-700',
    description: 'Indian, Pakistani, Bangladeshi & Sri Lankan cuisine',
    sampleDishes: ['Biryani', 'Curry', 'Samosas', 'Dosa', 'Haleem'],
    category: 'south-asian',
  },
  {
    id: 'jewish-kosher',
    name: 'Jewish & Kosher',
    emoji: '✡️',
    script: 'בית מטבח',        // Hebrew: Home kitchen
    color: 'from-blue-600 to-indigo-700',
    textColor: 'text-blue-700',
    description: 'Kosher-certified & traditional Jewish home cooking',
    sampleDishes: ['Brisket', 'Challah', 'Matzo Ball Soup', 'Kugel', 'Latkes'],
    category: 'jewish-kosher',
  },
  {
    id: 'middle-eastern',
    name: 'Middle Eastern',
    emoji: '🧆',
    script: 'مطبخ البيت',      // Arabic: Home kitchen
    color: 'from-amber-600 to-yellow-600',
    textColor: 'text-amber-700',
    description: 'Lebanese, Egyptian, Turkish & Persian home cooking',
    sampleDishes: ['Hummus', 'Falafel', 'Shawarma', 'Baklava', 'Mansaf'],
    category: 'middle-eastern',
  },
  {
    id: 'west-african',
    name: 'West African',
    emoji: '🫙',
    script: 'Ìdáná Ilé',       // Yoruba: Home cooking
    color: 'from-green-600 to-emerald-700',
    textColor: 'text-green-700',
    description: 'Nigerian, Ghanaian, Senegalese & West African flavors',
    sampleDishes: ['Jollof Rice', 'Egusi Soup', 'Suya', 'Puff Puff', 'Fufu'],
    category: 'west-african',
  },
  {
    id: 'southeast-asian',
    name: 'Southeast Asian',
    emoji: '🍜',
    script: 'อาหารบ้าน',        // Thai: Home food
    color: 'from-pink-500 to-rose-600',
    textColor: 'text-pink-700',
    description: 'Thai, Filipino, Vietnamese & Indonesian home cooking',
    sampleDishes: ['Pad Thai', 'Lumpia', 'Adobo', 'Laksa', 'Rendang'],
    category: 'southeast-asian',
  },
  {
    id: 'eastern-european',
    name: 'Eastern European',
    emoji: '🥣',
    script: 'Домашняя Еда',    // Russian: Home food
    color: 'from-slate-500 to-blue-700',
    textColor: 'text-slate-700',
    description: 'Polish, Ukrainian, Russian & Eastern European classics',
    sampleDishes: ['Pierogi', 'Borscht', 'Kielbasa', 'Stuffed Cabbage', 'Blini'],
    category: 'eastern-european',
  },
  {
    id: 'halal',
    name: 'Halal',
    emoji: '🌙',
    script: 'حلال',             // Arabic: Halal
    color: 'from-emerald-600 to-teal-700',
    textColor: 'text-emerald-700',
    description: 'Certified Halal home cooking from diverse traditions',
    sampleDishes: ['Halal Chicken', 'Lamb Biryani', 'Shawarma', 'Kebabs'],
    category: 'halal',
  },
  {
    id: 'vegan',
    name: 'Vegan & Plant-Based',
    emoji: '🌱',
    script: 'Plant Love',
    color: 'from-lime-500 to-green-600',
    textColor: 'text-lime-700',
    description: 'Whole food, plant-based & vegan home cooking',
    sampleDishes: ['Grain Bowls', 'Vegan Curry', 'Raw Desserts', 'Smoothies'],
    category: 'vegan',
  },
];

export const ALL_CATEGORIES = [
  { id: 'all', label: '🍽️ All', script: null },
  ...COMMUNITIES.map(c => ({ id: c.category, label: `${c.emoji} ${c.name}`, script: c.script })),
  { id: 'bakery', label: '🍞 Bakery', script: null },
  { id: 'desserts', label: '🍪 Desserts', script: null },
];

// ─── Non-Food Marketplace Categories ───────────────────────────────────────

export interface MarketCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  sampleItems: string[];
  deliveryNote: string;
}

export const MARKET_CATEGORIES: MarketCategory[] = [
  {
    id: 'beauty-body',
    name: 'Beauty & Body',
    emoji: '🧴',
    color: 'from-pink-400 to-rose-500',
    description: 'Handmade soaps, body butters, natural hair care & skincare',
    sampleItems: ['Shea Butter Soap', 'Natural Hair Grease', 'Body Scrub', 'Lip Balm', 'Perfume Oil'],
    deliveryNote: 'Same-day local delivery',
  },
  {
    id: 'candles',
    name: 'Candles & Aromatherapy',
    emoji: '🕯️',
    color: 'from-yellow-400 to-amber-500',
    description: 'Handpoured candles, incense, essential oils & aromatherapy',
    sampleItems: ['Soy Candles', 'Beeswax Candles', 'Incense Bundles', 'Essential Oils', 'Wax Melts'],
    deliveryNote: 'Same-day local delivery',
  },
  {
    id: 'jewelry',
    name: 'Jewelry & Accessories',
    emoji: '💎',
    color: 'from-purple-500 to-violet-600',
    description: 'Handmade jewelry, waist beads, cultural accessories & more',
    sampleItems: ['Beaded Jewelry', 'African Waist Beads', 'Wire-Wrapped Rings', 'Resin Earrings', 'Hair Accessories'],
    deliveryNote: 'Same-day local delivery',
  },
  {
    id: 'art-prints',
    name: 'Art & Prints',
    emoji: '🎨',
    color: 'from-blue-500 to-indigo-600',
    description: 'Hand-painted art, cultural prints, photography & greeting cards',
    sampleItems: ['Art Prints', 'Cultural Décor', 'Greeting Cards', 'Photography', 'Hand-Painted Canvas'],
    deliveryNote: 'Same-day local delivery',
  },
  {
    id: 'textiles',
    name: 'Textiles & Crafts',
    emoji: '🧶',
    color: 'from-teal-500 to-cyan-600',
    description: 'Handmade quilts, crochet, knitting, cultural fabric & clothing',
    sampleItems: ['Crocheted Blankets', 'Knitted Hats', 'Quilts', 'Cultural Fabric', 'Hand-Sewn Clothing'],
    deliveryNote: 'Same-day local delivery',
  },
  {
    id: 'plants',
    name: 'Plants & Garden',
    emoji: '🌿',
    color: 'from-green-500 to-emerald-600',
    description: 'Potted plants, herbs, succulents, seeds & natural products',
    sampleItems: ['Succulents', 'Fresh Herbs', 'Potted Plants', 'Heirloom Seeds', 'Natural Cleaning Products'],
    deliveryNote: 'Same-day local delivery',
  },
  {
    id: 'cultural-goods',
    name: 'Cultural Goods',
    emoji: '🏺',
    color: 'from-orange-500 to-red-600',
    description: 'Imported spices, cultural items, handmade toys & specialty goods',
    sampleItems: ['Specialty Spices', 'Cultural Décor', 'Handmade Toys', 'Books & Zines', 'Spiritual Items'],
    deliveryNote: 'Same-day local delivery',
  },
];

// Sample marketplace products
export const SAMPLE_MARKET_PRODUCTS = [
  {
    id: 'shea-soap',
    name: 'African Black Soap Bar',
    vendor_name: "Mama Zuri's Naturals",
    price: 8.00, rating: 4.9,
    prep_time_min: 0, prep_time_max: 30,
    image_url: 'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=400',
    category: 'beauty-body',
    description: 'Handmade African black soap with shea butter and coconut oil',
    community: 'west-african',
  },
  {
    id: 'soy-candle',
    name: 'Lavender Soy Candle',
    vendor_name: "Crystal's Candle Co.",
    price: 18.00, rating: 4.8,
    prep_time_min: 0, prep_time_max: 30,
    image_url: 'https://images.unsplash.com/photo-1603905756898-5e29c3914beb?w=400',
    category: 'candles',
    description: 'Hand-poured lavender soy candle with 40+ hour burn time',
    community: 'soul-food',
  },
  {
    id: 'waist-beads',
    name: 'African Waist Beads',
    vendor_name: "Adisa's Adornments",
    price: 22.00, rating: 5.0,
    prep_time_min: 0, prep_time_max: 45,
    image_url: 'https://images.unsplash.com/photo-1573408301185-9519bf943e41?w=400',
    category: 'jewelry',
    description: 'Handstrung traditional African waist beads in custom colors',
    community: 'west-african',
  },
  {
    id: 'art-print',
    name: 'Black Joy Art Print 11x14',
    vendor_name: "Amara Creates",
    price: 25.00, rating: 4.9,
    prep_time_min: 0, prep_time_max: 60,
    image_url: 'https://images.unsplash.com/photo-1578926288207-a90a5366a1bf?w=400',
    category: 'art-prints',
    description: 'Original digital art print celebrating Black joy and community',
    community: 'soul-food',
  },
  {
    id: 'body-butter',
    name: 'Mango Shea Body Butter',
    vendor_name: "Priya's Natural Beauty",
    price: 16.00, rating: 4.8,
    prep_time_min: 0, prep_time_max: 30,
    image_url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400',
    category: 'beauty-body',
    description: 'Whipped mango and shea body butter — deeply moisturizing',
    community: 'south-asian',
  },
  {
    id: 'crochet-blanket',
    name: 'Hand-Crocheted Baby Blanket',
    vendor_name: "Abuela's Stitches",
    price: 45.00, rating: 5.0,
    prep_time_min: 0, prep_time_max: 60,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    category: 'textiles',
    description: 'Handmade crochet baby blanket in soft cotton yarn',
    community: 'latin',
  },
  {
    id: 'herb-bundle',
    name: 'Fresh Herb Bundle',
    vendor_name: "Garden of Eden Urban Farm",
    price: 10.00, rating: 4.7,
    prep_time_min: 0, prep_time_max: 30,
    image_url: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400',
    category: 'plants',
    description: 'Fresh basil, mint, rosemary and thyme from local urban garden',
    community: 'vegan',
  },
  {
    id: 'spice-blend',
    name: 'Jerk Seasoning Spice Blend',
    vendor_name: "Mama T's Caribbean",
    price: 12.00, rating: 5.0,
    prep_time_min: 0, prep_time_max: 30,
    image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
    category: 'cultural-goods',
    description: 'Authentic Jamaican jerk seasoning blend, family recipe',
    community: 'caribbean',
  },
];
