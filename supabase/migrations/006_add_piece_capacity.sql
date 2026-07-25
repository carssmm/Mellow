-- Migration 006: Add piece_content_capacity and piece_content_unit fields to products table
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS piece_capacity DECIMAL(10,4) DEFAULT 1.0000,
  ADD COLUMN IF NOT EXISTS piece_capacity_unit TEXT DEFAULT 'ml';
