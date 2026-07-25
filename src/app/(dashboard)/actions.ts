'use server';

import { createSupabaseServerClient, getAuthenticatedUser } from '@/lib/supabase/server';
import { getTodaysSummary } from '@/app/(dashboard)/sales/actions';

export interface RecentSaleItem {
  id: string;
  productName: string;
  category: string;
  quantity: number;
  totalAmount: number;
  createdAt: string;
  paymentMethod: string;
}

export async function getRecentSales(limit: number = 7): Promise<{ data: RecentSaleItem[] | null; error: string | null }> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { data: null, error: 'Unauthorized' };

    const supabase = await createSupabaseServerClient();
    
    // Select sales_items joined with sale and product
    const { data: items, error } = await supabase
      .from('sales_items')
      .select(`
        id,
        quantity,
        unit_price,
        created_at,
        sale:sales!inner(user_id, payment_method, entry_mode),
        product:products!inner(name, category)
      `)
      .eq('sale.user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);

    const recentSales: RecentSaleItem[] = (items || []).map((item: any) => ({
      id: item.id,
      productName: item.product?.name || 'Item',
      category: item.product?.category || 'General',
      quantity: Number(item.quantity || 1),
      totalAmount: Number(item.quantity || 1) * Number(item.unit_price || 0),
      createdAt: item.created_at,
      paymentMethod: item.sale?.payment_method || 'cash',
    }));

    return { data: recentSales, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch recent sales' };
  }
}

export interface BreakevenGoal {
  dailyTarget: number;
  todayRevenue: number;
  percentage: number;
  isExceeded: boolean;
  difference: number;
}

export async function getBreakevenGoal(): Promise<{ data: BreakevenGoal | null; error: string | null }> {
  try {
    const summaryRes = await getTodaysSummary();
    if (summaryRes.error || !summaryRes.data) {
      return { data: null, error: summaryRes.error || 'Failed to fetch summary' };
    }

    // Default daily target for MVP (₱3,000)
    const dailyTarget = 3000;
    const todayRevenue = summaryRes.data.totalRevenue;
    const percentage = Math.min(100, Math.round((todayRevenue / dailyTarget) * 100));
    const isExceeded = todayRevenue >= dailyTarget;
    const difference = Math.abs(todayRevenue - dailyTarget);

    return {
      data: {
        dailyTarget,
        todayRevenue,
        percentage,
        isExceeded,
        difference,
      },
      error: null,
    };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch breakeven goal' };
  }
}
