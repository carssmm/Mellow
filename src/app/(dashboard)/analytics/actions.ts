'use server';

import { createSupabaseServerClient, getAuthenticatedUser } from '@/lib/supabase/server';
import { SalesCSVRow, ProfitSummaryCSVRow } from '@/lib/csv-export';

export interface DailyAnalyticsPoint {
  date: string; // YYYY-MM-DD or formatted
  displayDate: string;
  revenue: number;
  cogs: number;
  profit: number;
  transactionCount: number;
}

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  quantitySold: number;
  totalRevenue: number;
}

import { getPHDateRangeISO } from '@/lib/date-utils';

function getRangeDates(startDateStr?: string, endDateStr?: string) {
  return getPHDateRangeISO(startDateStr, endDateStr);
}

export async function getSalesAnalytics(
  startDateStr?: string,
  endDateStr?: string
): Promise<{ data: DailyAnalyticsPoint[] | null; error: string | null }> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { data: null, error: 'Unauthorized' };

    const { startISO, endISO } = getRangeDates(startDateStr, endDateStr);
    const supabase = await createSupabaseServerClient();

    const { data: sales, error } = await supabase
      .from('sales')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_voided', false)
      .gte('created_at', startISO)
      .lte('created_at', endISO)
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);

    // Group by YYYY-MM-DD
    const grouped: Record<string, DailyAnalyticsPoint> = {};

    (sales || []).forEach((sale) => {
      if (sale.entry_mode === 'reconciliation') return; // Skip reconciliation rows

      const dateObj = new Date(sale.created_at);
      const dateKey = dateObj.toISOString().split('T')[0] || ''; // YYYY-MM-DD
      const displayDate = new Intl.DateTimeFormat('en-PH', { month: 'short', day: 'numeric' }).format(dateObj);

      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: dateKey,
          displayDate,
          revenue: 0,
          cogs: 0,
          profit: 0,
          transactionCount: 0,
        };
      }

      grouped[dateKey].revenue += Number(sale.total_revenue || 0);
      grouped[dateKey].cogs += Number(sale.total_cogs || 0);
      grouped[dateKey].profit += Number(sale.net_profit || 0);
      grouped[dateKey].transactionCount += 1;
    });

    const result = Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
    return { data: result, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch analytics' };
  }
}

export async function getTopSellingProducts(
  startDateStr?: string,
  endDateStr?: string,
  limit: number = 5
): Promise<{ data: TopProduct[] | null; error: string | null }> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { data: null, error: 'Unauthorized' };

    const { startISO, endISO } = getRangeDates(startDateStr, endDateStr);
    const supabase = await createSupabaseServerClient();

    const { data: items, error } = await supabase
      .from('sales_items')
      .select(`
        quantity,
        unit_price,
        created_at,
        sale:sales!inner(user_id, is_voided),
        product:products!inner(id, name, category)
      `)
      .eq('sale.user_id', user.id)
      .eq('sale.is_voided', false)
      .gte('created_at', startISO)
      .lte('created_at', endISO);

    if (error) throw new Error(error.message);

    const productMap: Record<string, TopProduct> = {};

    (items || []).forEach((item: any) => {
      const prodId = item.product?.id || 'unknown';
      const name = item.product?.name || 'Unknown Item';
      const category = item.product?.category || 'General';
      const qty = Number(item.quantity || 0);
      const rev = qty * Number(item.unit_price || 0);

      if (!productMap[prodId]) {
        productMap[prodId] = {
          id: prodId,
          name,
          category,
          quantitySold: 0,
          totalRevenue: 0,
        };
      }

      productMap[prodId].quantitySold += qty;
      productMap[prodId].totalRevenue += rev;
    });

    const sorted = Object.values(productMap)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit);

    return { data: sorted, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch top products' };
  }
}

export async function getExportData(
  startDateStr?: string,
  endDateStr?: string
): Promise<{
  data: { salesRows: SalesCSVRow[]; summaryRows: ProfitSummaryCSVRow[] } | null;
  error: string | null;
}> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { data: null, error: 'Unauthorized' };

    const { startISO, endISO } = getRangeDates(startDateStr, endDateStr);
    const supabase = await createSupabaseServerClient();

    // Fetch items with sales and product details
    const { data: items, error: itemsError } = await supabase
      .from('sales_items')
      .select(`
        quantity,
        unit_price,
        unit_cost,
        created_at,
        sale:sales!inner(user_id, payment_method, entry_mode, is_voided),
        product:products!inner(name, category)
      `)
      .eq('sale.user_id', user.id)
      .eq('sale.is_voided', false)
      .gte('created_at', startISO)
      .lte('created_at', endISO)
      .order('created_at', { ascending: false });

    if (itemsError) throw new Error(itemsError.message);

    const salesRows: SalesCSVRow[] = (items || []).map((item: any) => {
      const qty = Number(item.quantity || 1);
      const price = Number(item.unit_price || 0);
      const cost = Number(item.unit_cost || 0);
      const revenue = qty * price;
      const cogs = qty * cost;
      const profit = revenue - cogs;
      const dateFormatted = new Date(item.created_at).toISOString().split('T')[0] || '';

      return {
        date: dateFormatted,
        productName: item.product?.name || 'Item',
        category: item.product?.category || 'General',
        quantity: qty,
        unitPrice: price,
        unitCost: cost,
        revenue,
        cogs,
        profit,
        paymentMethod: item.sale?.payment_method || 'cash',
        entryMode: item.sale?.entry_mode || 'quick_tap',
      };
    });

    // Daily summaries for profit summary CSV
    const analyticsRes = await getSalesAnalytics(startDateStr, endDateStr);
    const analyticsData = analyticsRes.data || [];

    const summaryRows: ProfitSummaryCSVRow[] = analyticsData.map((pt) => ({
      date: pt.date,
      grossRevenue: pt.revenue,
      totalCogs: pt.cogs,
      netProfit: pt.profit,
      itemsSold: 0, // filled if needed
      transactionCount: pt.transactionCount,
    }));

    return { data: { salesRows, summaryRows }, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch export data' };
  }
}
