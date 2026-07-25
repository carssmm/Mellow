-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Uncategorized',
    selling_price DECIMAL(10,2) NOT NULL CHECK (selling_price >= 0),
    unit_cost DECIMAL(10,2) NOT NULL CHECK (unit_cost >= 0),
    current_stock INTEGER NOT NULL DEFAULT 0,
    low_stock_threshold INTEGER NOT NULL DEFAULT 5,
    target_stock INTEGER NOT NULL DEFAULT 20,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sales table
CREATE TABLE IF NOT EXISTS public.sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_cogs DECIMAL(10,2) NOT NULL DEFAULT 0,
    net_profit DECIMAL(10,2) NOT NULL DEFAULT 0,
    starting_float DECIMAL(10,2),
    ending_cash DECIMAL(10,2),
    cash_discrepancy DECIMAL(10,2),
    entry_mode TEXT NOT NULL CHECK (entry_mode IN ('quick_tap', 'batch', 'reconciliation')),
    payment_method TEXT DEFAULT 'cash' CHECK (payment_method IN ('cash', 'gcash_maya')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sales_items table
CREATE TABLE IF NOT EXISTS public.sales_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    frequency TEXT NOT NULL DEFAULT 'monthly' CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_products_user_id ON public.products(user_id);
CREATE INDEX idx_sales_user_id ON public.sales(user_id);
CREATE INDEX idx_sales_created_at ON public.sales(created_at);
CREATE INDEX idx_sales_items_sale_id ON public.sales_items(sale_id);
CREATE INDEX idx_sales_items_product_id ON public.sales_items(product_id);
CREATE INDEX idx_expenses_user_id ON public.expenses(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
BEFORE UPDATE ON public.expenses
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for products
CREATE POLICY "Users can view their own products" ON public.products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own products" ON public.products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own products" ON public.products FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own products" ON public.products FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for sales
CREATE POLICY "Users can view their own sales" ON public.sales FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sales" ON public.sales FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sales" ON public.sales FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sales" ON public.sales FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for expenses
CREATE POLICY "Users can view their own expenses" ON public.expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own expenses" ON public.expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own expenses" ON public.expenses FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own expenses" ON public.expenses FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for sales_items
-- Since sales_items doesn't have a user_id, we join with sales table for auth checks
CREATE POLICY "Users can view their own sales items" ON public.sales_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.sales WHERE sales.id = sales_items.sale_id AND sales.user_id = auth.uid())
);
CREATE POLICY "Users can insert their own sales items" ON public.sales_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.sales WHERE sales.id = sales_items.sale_id AND sales.user_id = auth.uid())
);
CREATE POLICY "Users can update their own sales items" ON public.sales_items FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.sales WHERE sales.id = sales_items.sale_id AND sales.user_id = auth.uid())
);
CREATE POLICY "Users can delete their own sales items" ON public.sales_items FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.sales WHERE sales.id = sales_items.sale_id AND sales.user_id = auth.uid())
);
