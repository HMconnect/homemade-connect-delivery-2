-- ============================================
-- FIX: order line items were never being saved
-- Run this in the Supabase SQL Editor
-- ============================================
--
-- CartContext.tsx's placeOrder() saves the order itself into `orders`,
-- then tries to save the list of dishes/quantities/special instructions
-- into a table called `order_items` — but that table has never existed
-- in this database (confirmed: querying it returns
-- "relation order_items does not exist"). That second save has been
-- silently failing on every order ever placed; the customer still sees
-- "Order placed!" because the code never checked for an error on that
-- insert.
--
-- The knock-on effects:
--   - OrderHistory.tsx (customer-facing order history) tries to read
--     orders joined with order_items. With the table missing, that
--     whole query throws, so customers see "No orders yet" even when
--     they have orders.
--   - VendorOrdersTab.tsx / CustomerOrdersView.tsx / DriverDashboard.tsx
--     all show "0 items" for every order since there's nowhere to read
--     the items from.
--
-- This migration creates the table with the same columns the checkout
-- code already writes, and access rules matching the same pattern as
-- the existing `orders` policies (customers see their own, vendors see
-- theirs, drivers see assigned orders, admins see everything).
--
-- NOTE: this does not recover items for orders placed before this fix —
-- that data was never saved anywhere, so it can't be reconstructed.
-- Every order placed after this fix (and the matching code change to
-- CartContext.tsx) will save and display correctly.

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  food_item_id TEXT,
  food_name TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Customers can insert and view items for their own orders
DROP POLICY IF EXISTS "Customers manage own order items" ON order_items;
CREATE POLICY "Customers manage own order items"
ON order_items FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.customer_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.customer_id = auth.uid()
  )
);

-- Vendors can view items for orders placed with them
DROP POLICY IF EXISTS "Vendors view their order items" ON order_items;
CREATE POLICY "Vendors view their order items"
ON order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.vendor_id = auth.uid()
  )
);

-- Drivers can view items for orders assigned to them
DROP POLICY IF EXISTS "Drivers view assigned order items" ON order_items;
CREATE POLICY "Drivers view assigned order items"
ON order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.driver_id = auth.uid()
  )
);

-- Admins can manage all order items
DROP POLICY IF EXISTS "Admins manage all order items" ON order_items;
CREATE POLICY "Admins manage all order items"
ON order_items FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- ============================================
-- Verify it worked
-- ============================================
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'order_items' ORDER BY ordinal_position;
--
-- Then place a real test order from the app and confirm rows show up:
--
--   SELECT oi.*, o.created_at AS order_created_at
--   FROM order_items oi
--   JOIN orders o ON o.id = oi.order_id
--   ORDER BY o.created_at DESC LIMIT 10;
