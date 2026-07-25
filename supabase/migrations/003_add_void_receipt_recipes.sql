-- Migration 003: Void Sales, Customer Notes, User Target Settings, and Recipes

-- 1. Add void status, void reason, customer notes, and change fields to sales table
ALTER TABLE public.sales
  ADD COLUMN IF NOT EXISTS is_voided BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS void_reason TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS customer_notes TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10,2) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS change_given DECIMAL(10,2) DEFAULT NULL;

-- 2. Add customer_notes / item options to sales_items table
ALTER TABLE public.sales_items
  ADD COLUMN IF NOT EXISTS item_notes TEXT DEFAULT NULL;

-- 3. Create recipes table (linking menu items to raw materials)
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    menu_product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    raw_product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity_required DECIMAL(10,4) NOT NULL CHECK (quantity_required > 0),
    unit_name TEXT DEFAULT 'pcs',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(menu_product_id, raw_product_id)
);

CREATE INDEX IF NOT EXISTS idx_recipes_menu_product ON public.recipes(menu_product_id);
CREATE INDEX IF NOT EXISTS idx_recipes_raw_product ON public.recipes(raw_product_id);

-- RLS policies for recipes
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own recipes" ON public.recipes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own recipes" ON public.recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own recipes" ON public.recipes FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own recipes" ON public.recipes FOR DELETE USING (auth.uid() = user_id);

-- 4. Create user_settings table for customizable target sales
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    daily_target_sales DECIMAL(10,2) NOT NULL DEFAULT 5000.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
