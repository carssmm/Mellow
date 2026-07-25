-- Migration 005: Add custom unit_name field to products table
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS unit_name TEXT DEFAULT 'pcs';
