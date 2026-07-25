-- Migration 007: Change stock columns from INTEGER to DECIMAL to support precise decimal levels
ALTER TABLE public.products 
  ALTER COLUMN current_stock TYPE DECIMAL(12,4),
  ALTER COLUMN low_stock_threshold TYPE DECIMAL(12,4),
  ALTER COLUMN target_stock TYPE DECIMAL(12,4);
