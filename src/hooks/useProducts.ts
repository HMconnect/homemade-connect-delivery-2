import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  vendor_id: string;
  vendor_name: string;
  is_available: boolean;
  prep_time_min: number;
  prep_time_max: number;
  state: string;
  city: string;
  rating?: number;
  review_count?: number;
}

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'artisan-sourdough',
    name: 'Artisan Sourdough Bread',
    vendor_id: '1',
    vendor_name: "Sarah's Kitchen",
    price: 8.50,
    rating: 4.9,
    prep_time_min: 25,
    prep_time_max: 35,
    image_url: 'https://d64gsuwffb70l.cloudfront.net/68da9d653efb6b8fad30f591_1759157952729_583c4d9c.webp',
    category: 'bakery',
    description: 'Handcrafted sourdough with a perfect crust and tangy flavor',
    is_available: true,
    state: 'IL',
    city: 'Chicago',
    review_count: 48,
  },
  {
    id: 'chocolate-cookies',
    name: 'Double Chocolate Cookies',
    vendor_id: '2',
    vendor_name: "Emma's Treats",
    price: 12.00,
    rating: 4.8,
    prep_time_min: 20,
    prep_time_max: 30,
    image_url: 'https://d64gsuwffb70l.cloudfront.net/68da9d653efb6b8fad30f591_1759157954865_b8c5a2f1.webp',
    category: 'desserts',
    description: 'Rich chocolate cookies with premium cocoa',
    is_available: true,
    state: 'IL',
    city: 'Chicago',
    review_count: 62,
  },
  {
    id: 'honey-granola',
    name: 'Homemade Honey Granola',
    vendor_id: '3',
    vendor_name: "Nature's Pantry",
    price: 15.00,
    rating: 4.7,
    prep_time_min: 30,
    prep_time_max: 40,
    image_url: 'https://d64gsuwffb70l.cloudfront.net/68da9d653efb6b8fad30f591_1759157956997_d4e6f3a8.webp',
    category: 'healthy',
    description: 'Organic oats with local honey and nuts',
    is_available: true,
    state: 'IL',
    city: 'Chicago',
    review_count: 35,
  },
  {
    id: 'jerk-chicken',
    name: 'Jerk Chicken Plate',
    vendor_id: '4',
    vendor_name: "Mama T's Caribbean",
    price: 18.00,
    rating: 5.0,
    prep_time_min: 30,
    prep_time_max: 45,
    image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    category: 'caribbean',
    description: 'Authentic jerk chicken with rice & peas and plantains',
    is_available: true,
    state: 'IL',
    city: 'Chicago',
    review_count: 91,
  },
  {
    id: 'tamales',
    name: 'Homemade Tamales (6 pack)',
    vendor_id: '5',
    vendor_name: "Abuela Rosa's Kitchen",
    price: 16.00,
    rating: 4.9,
    prep_time_min: 20,
    prep_time_max: 35,
    image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
    category: 'latin',
    description: 'Traditional pork tamales wrapped in corn husks, made fresh daily',
    is_available: true,
    state: 'IL',
    city: 'Chicago',
    review_count: 77,
  },
  {
    id: 'soul-food-plate',
    name: 'Sunday Soul Food Plate',
    vendor_id: '6',
    vendor_name: "Big Mama's Kitchen",
    price: 20.00,
    rating: 4.9,
    prep_time_min: 35,
    prep_time_max: 50,
    image_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
    category: 'soul-food',
    description: 'Fried chicken, mac & cheese, collard greens & cornbread',
    is_available: true,
    state: 'IL',
    city: 'Chicago',
    review_count: 124,
  },
];

export const useProducts = (state: string, city: string, searchQuery: string = '', category: string = 'all') => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('products')
          .select(`
            *,
            user_profiles!vendor_id (
              full_name,
              business_name
            )
          `)
          .eq('is_available', true)
          .eq('state', state);

        if (city) query = query.eq('city', city);
        if (category !== 'all') query = query.eq('category', category);
        if (searchQuery) query = query.ilike('name', `%${searchQuery}%`);

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error || !data || data.length === 0) {
          // Use fallback data filtered by state/search
          let filtered = FALLBACK_PRODUCTS;
          if (searchQuery) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
          if (category !== 'all') filtered = filtered.filter(p => p.category === category);
          setProducts(filtered);
        } else {
          const mapped = data.map((p: any) => ({
            ...p,
            vendor_name: p.user_profiles?.business_name || p.user_profiles?.full_name || 'Local Vendor',
            prep_time_min: p.prep_time_min || 20,
            prep_time_max: p.prep_time_max || 35,
          }));
          setProducts(mapped);
        }
      } catch {
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [state, city, searchQuery, category]);

  return { products, loading, error };
};
