-- Migration 004: Product Add-ons / Modifiers table
CREATE TABLE IF NOT EXISTS public.product_addons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE, -- NULL means global add-on
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (price >= 0),
    raw_product_id UUID REFERENCES public.products(id) ON DELETE SET NULL, -- optional raw ingredient deduction
    raw_quantity DECIMAL(10,4) DEFAULT 1.0000,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_addons_user ON public.product_addons(user_id);
CREATE INDEX IF NOT EXISTS idx_product_addons_product ON public.product_addons(product_id);

ALTER TABLE public.product_addons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own addons" ON public.product_addons FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own addons" ON public.product_addons FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own addons" ON public.product_addons FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own addons" ON public.product_addons FOR DELETE USING (auth.uid() = user_id);
