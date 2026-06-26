# Orders Table Setup for Supabase

## Create Orders Table

```sql
-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  items JSONB NOT NULL,
  delivery_address TEXT NOT NULL,
  customer_name TEXT,
  vendor_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_vendor ON orders(vendor_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policies for customers to view their own orders
CREATE POLICY "Customers can view own orders" ON orders
  FOR SELECT USING (auth.uid() = customer_id);

-- Policies for vendors to view their orders
CREATE POLICY "Vendors can view their orders" ON orders
  FOR SELECT USING (auth.uid() = vendor_id);

-- Policies for customers to create orders
CREATE POLICY "Customers can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Policies for vendors to update order status
CREATE POLICY "Vendors can update their orders" ON orders
  FOR UPDATE USING (auth.uid() = vendor_id);

-- Enable real-time for orders table
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
```

## Order Status Flow

- `pending` - Order placed, awaiting vendor confirmation
- `confirmed` - Vendor confirmed the order
- `preparing` - Vendor is preparing the order
- `ready` - Order ready for pickup
- `picked_up` - Order picked up by delivery
- `delivered` - Order delivered to customer
- `cancelled` - Order cancelled

## Real-time Subscriptions

The orders table is configured for real-time updates. Both customers and vendors will receive instant notifications when:
- New orders are created
- Order status changes
- Orders are updated
