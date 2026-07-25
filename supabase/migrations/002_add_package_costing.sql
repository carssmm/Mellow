-- Add package costing columns to products table
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS package_price DECIMAL(10,2) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS items_per_package INTEGER DEFAULT 1 CHECK (items_per_package >= 1),
  ADD COLUMN IF NOT EXISTS package_unit_name TEXT DEFAULT 'box';
