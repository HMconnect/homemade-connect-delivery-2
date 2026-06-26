# Vendor Products Database Setup

## Create the vendor_products table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create vendor_products table
CREATE TABLE IF NOT EXISTS vendor_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  inventory_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE vendor_products ENABLE ROW LEVEL SECURITY;

-- Vendors can view their own products
CREATE POLICY "Vendors can view own products" ON vendor_products
  FOR SELECT USING (vendor_id = auth.uid());

-- Vendors can insert their own products
CREATE POLICY "Vendors can insert own products" ON vendor_products
  FOR INSERT WITH CHECK (vendor_id = auth.uid());

-- Vendors can update their own products
CREATE POLICY "Vendors can update own products" ON vendor_products
  FOR UPDATE USING (vendor_id = auth.uid());

-- Vendors can delete their own products
CREATE POLICY "Vendors can delete own products" ON vendor_products
  FOR DELETE USING (vendor_id = auth.uid());

-- Everyone can view active products
CREATE POLICY "Anyone can view active products" ON vendor_products
  FOR SELECT USING (is_active = true);
```

## Notes

- The table stores all vendor food products/listings
- Each product is linked to a vendor via vendor_id
- RLS policies ensure vendors can only manage their own products
- Active products are visible to all users for browsing
- Prices are stored as DECIMAL(10,2) for accurate currency handling
