'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient, getAuthenticatedUser } from '@/lib/supabase/server';
import { quickTapSaleSchema, batchSaleSchema, reconciliationSchema } from '@/lib/validations';
import { Sale, SaleItem, DailySummary, Product } from '@/types';

// Utility for decrementing stock in Supabase atomically or gracefully
async function decrementStock(
  supabase: ReturnType<typeof import('@supabase/ssr').createServerClient>,
  userId: string,
  items: { productId: string; quantity: number }[]
): Promise<string[]> {
  const warnings: string[] = [];
  
  // Fetch current stock to warn if it drops below zero
  const productIds = items.map(i => i.productId);
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, current_stock, type')
    .in('id', productIds)
    .eq('user_id', userId);
    
  if (error || !products) return warnings;

  // Process decrements
  for (const item of items) {
    const product = products.find((p: Product) => p.id === item.productId);
    if (!product || product.type === 'menu_item') continue;
    
    const newStock = product.current_stock - item.quantity;
    
    // Allow negative stock but generate a warning
    if (newStock < 0) {
      warnings.push(`Stock for "${product.name}" is now negative (${newStock}).`);
    }

    // Direct update query
    await supabase
      .from('products')
      .update({ current_stock: newStock })
      .eq('id', item.productId)
      .eq('user_id', userId);
  }
  
  return warnings;
}

export async function recordQuickTapSale(data: unknown): Promise<{ success: boolean; saleId?: string; warnings?: string[]; error?: string }> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const parsed = quickTapSaleSchema.parse(data);
    
    const totalRevenue = parsed.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalCogs = parsed.items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);
    const netProfit = totalRevenue - totalCogs;

    const supabase = await createSupabaseServerClient();
    
    // Insert Sale
    const { data: saleRecord, error: saleError } = await supabase.from('sales').insert({
      user_id: user.id,
      total_revenue: totalRevenue,
      total_cogs: totalCogs,
      net_profit: netProfit,
      entry_mode: 'quick_tap',
      payment_method: parsed.paymentMethod,
    }).select().single();

    if (saleError || !saleRecord) throw new Error(saleError?.message || 'Failed to create sale record');

    // Insert Sale Items
    const salesItemsData = parsed.items.map(item => ({
      sale_id: saleRecord.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      unit_cost: item.unitCost,
    }));
    
    const { error: itemsError } = await supabase.from('sales_items').insert(salesItemsData);
    if (itemsError) throw new Error(itemsError.message);

    // Decrement Stock
    const warnings = await decrementStock(supabase, user.id, parsed.items);

    revalidatePath('/sales');
    revalidatePath('/inventory');
    revalidatePath('/dashboard');

    return { success: true, saleId: saleRecord.id, warnings };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'ZodError') {
      return { success: false, error: 'Validation failed for sale data.' };
    }
    return { success: false, error: err instanceof Error ? err.message : 'Failed to record sale' };
  }
}

export async function recordBatchSale(data: unknown): Promise<{ success: boolean; saleId?: string; warnings?: string[]; error?: string }> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const parsed = batchSaleSchema.parse(data);
    
    // Filter out items with 0 quantity just in case it passed validation
    const validItems = parsed.items.filter(item => item.quantity > 0);
    if (validItems.length === 0) {
      return { success: false, error: 'No items to process' };
    }

    const totalRevenue = validItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalCogs = validItems.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);
    const netProfit = totalRevenue - totalCogs;

    const supabase = await createSupabaseServerClient();
    
    // Insert Sale
    const { data: saleRecord, error: saleError } = await supabase.from('sales').insert({
      user_id: user.id,
      total_revenue: totalRevenue,
      total_cogs: totalCogs,
      net_profit: netProfit,
      entry_mode: 'batch',
      payment_method: parsed.paymentMethod,
    }).select().single();

    if (saleError || !saleRecord) throw new Error(saleError?.message || 'Failed to create batch sale record');

    // Insert Sale Items
    const salesItemsData = validItems.map(item => ({
      sale_id: saleRecord.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      unit_cost: item.unitCost,
    }));
    
    const { error: itemsError } = await supabase.from('sales_items').insert(salesItemsData);
    if (itemsError) throw new Error(itemsError.message);

    // Decrement Stock
    const warnings = await decrementStock(supabase, user.id, validItems);

    revalidatePath('/sales');
    revalidatePath('/inventory');
    revalidatePath('/dashboard');

    return { success: true, saleId: saleRecord.id, warnings };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'ZodError') {
      return { success: false, error: 'Validation failed for batch sale data.' };
    }
    return { success: false, error: err instanceof Error ? err.message : 'Failed to record batch sale' };
  }
}

export async function recordReconciliation(data: unknown): Promise<{ success: boolean; expectedCash?: number; cashDiscrepancy?: number; todayCashSales?: number; error?: string }> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const parsed = reconciliationSchema.parse(data);
    const supabase = await createSupabaseServerClient();
    
    // Get today's cash sales
    // We filter by date in JS to ensure timezone consistency if needed, or query directly
    // Using current date on DB ensures UTC date matching if user is same timezone
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const { data: todaySales, error: fetchError } = await supabase
      .from('sales')
      .select('total_revenue')
      .eq('user_id', user.id)
      .eq('payment_method', 'cash')
      .gte('created_at', startOfDay.toISOString());

    if (fetchError) throw new Error(fetchError.message);

    const todayCashSales = todaySales.reduce((sum, s) => sum + Number(s.total_revenue), 0);
    const expectedCash = parsed.startingFloat + todayCashSales;
    const cashDiscrepancy = parsed.endingCash - expectedCash;

    // Record the reconciliation
    const { error: saleError } = await supabase.from('sales').insert({
      user_id: user.id,
      total_revenue: 0,
      total_cogs: 0,
      net_profit: 0,
      starting_float: parsed.startingFloat,
      ending_cash: parsed.endingCash,
      cash_discrepancy: cashDiscrepancy,
      entry_mode: 'reconciliation',
      payment_method: 'cash', // N/A really, but required
    });

    if (saleError) throw new Error(saleError.message);

    revalidatePath('/sales');
    revalidatePath('/dashboard');

    return { 
      success: true, 
      expectedCash, 
      cashDiscrepancy, 
      todayCashSales 
    };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'ZodError') {
      return { success: false, error: 'Validation failed for reconciliation data.' };
    }
    return { success: false, error: err instanceof Error ? err.message : 'Failed to record reconciliation' };
  }
}

// Fetch sales for "Today" (UTC+8 or DB equivalent)
export async function getTodaySales(): Promise<{ data: (Sale & { items: (SaleItem & { product: Product })[] })[] | null; error: string | null }> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { data: null, error: 'Unauthorized' };

    const supabase = await createSupabaseServerClient();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        items:sales_items (
          *,
          product:products (*)
        )
      `)
      .eq('user_id', user.id)
      .gte('created_at', startOfDay.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return { data: data as (Sale & { items: (SaleItem & { product: Product })[] })[], error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch sales' };
  }
}

export async function getTodaysSummary(): Promise<{ data: DailySummary | null; error: string | null }> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { data: null, error: 'Unauthorized' };

    const supabase = await createSupabaseServerClient();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const { data: sales, error } = await supabase
      .from('sales')
      .select(`
        *,
        items:sales_items ( quantity )
      `)
      .eq('user_id', user.id)
      .gte('created_at', startOfDay.toISOString());

    if (error) throw new Error(error.message);

    const summary: DailySummary = {
      totalRevenue: 0,
      totalCogs: 0,
      netProfit: 0,
      totalItemsSold: 0,
      totalCashSales: 0,
      transactionCount: 0,
    };
    sales.forEach((sale: Sale & { items: { quantity: number }[] }) => {
      // Exclude reconciliation records from revenue/profit totals
      if (sale.entry_mode !== 'reconciliation') {
        summary.totalRevenue += Number(sale.total_revenue || 0);
        summary.totalCogs += Number(sale.total_cogs || 0);
        summary.netProfit += Number(sale.net_profit || 0);
        summary.transactionCount += 1;
        
        if (sale.payment_method === 'cash') {
          summary.totalCashSales += Number(sale.total_revenue || 0);
        }
        sale.items.forEach((item: { quantity: number }) => {
          summary.totalItemsSold += Number(item.quantity || 0);
        });
      }
    });

    return { data: summary, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch summary' };
  }
}
