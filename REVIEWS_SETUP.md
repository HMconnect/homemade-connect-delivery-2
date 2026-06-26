# Reviews and Ratings System Setup

## Database Setup

Run these SQL commands in your Supabase SQL Editor:

### 1. Create Reviews Table

```sql
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  vendor_id UUID NOT NULL,
  customer_id UUID NOT NULL REFERENCES auth.users(id),
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  vendor_response TEXT,
  vendor_response_date TIMESTAMPTZ,
  is_verified_purchase BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_vendor ON reviews(vendor_id);
CREATE INDEX idx_reviews_status ON reviews(status);
```

### 2. Enable Row Level Security

```sql
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved reviews"
  ON reviews FOR SELECT USING (status = 'approved');

CREATE POLICY "Customers can create reviews"
  ON reviews FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Vendors can respond to reviews"
  ON reviews FOR UPDATE USING (vendor_id IN (
    SELECT id FROM user_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admins can moderate reviews"
  ON reviews FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = true)
  );
```
