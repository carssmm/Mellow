import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { getTodaysSummary } from '@/app/(dashboard)/sales/actions';
import { getLowStockProducts } from '@/app/(dashboard)/inventory/actions';
import { getRecentSales, getBreakevenGoal } from '@/app/(dashboard)/actions';
import { formatCurrency, getGreeting } from '@/lib/utils';
import { Product } from '@/types';

export const revalidate = 0; // Dynamic server component

export default async function DashboardPage() {
  const greeting = getGreeting();

  const [summaryRes, lowStockRes, recentSalesRes, breakevenRes] = await Promise.all([
    getTodaysSummary(),
    getLowStockProducts(),
    getRecentSales(7),
    getBreakevenGoal(),
  ]);

  const summary = summaryRes.data || {
    totalRevenue: 0,
    totalCogs: 0,
    netProfit: 0,
    totalItemsSold: 0,
    totalCashSales: 0,
    transactionCount: 0,
  };

  const lowStockItems = lowStockRes.data || [];
  const lowStockCount = lowStockItems.length;
  const recentSales = recentSalesRes.data || [];
  const breakeven = breakevenRes.data || {
    dailyTarget: 3000,
    todayRevenue: 0,
    percentage: 0,
    isExceeded: false,
    difference: 3000,
  };

  const getCategoryIcon = (category?: string) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('coffee') || cat.includes('espresso') || cat.includes('beverage')) return 'local_cafe';
    if (cat.includes('bakery') || cat.includes('pastry') || cat.includes('food')) return 'bakery_dining';
    if (cat.includes('beans') || cat.includes('milk') || cat.includes('syrup')) return 'inventory_2';
    return 'storefront';
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-headline-lg font-headline-lg">{greeting}, Mellow Café ☕</h1>
          <p className="text-body-lg text-on-surface-variant mt-1">
            Here is your live daily financial summary and stock alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/sales"
            className="px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-label-lg font-label-lg text-on-surface hover:bg-surface-variant transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
            End-of-Day Closing
          </Link>

          <Link
            href="/sales"
            className="px-4 py-2.5 bg-[#2B2B2B] text-[#F5F2EC] rounded-xl text-label-lg font-label-lg hover:bg-black transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Record New Sale
          </Link>
        </div>
      </div>

      {/* 4-Column Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-card-gap">
        
        {/* Card 1: Today's Net Profit */}
        <div className="bg-surface-container border border-outline-variant rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-label-md font-label-md text-on-surface-variant">Today's Net Profit</span>
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">monitoring</span>
            </div>
          </div>
          <p className="text-[32px] font-bold text-emerald-600 tracking-tight">
            {formatCurrency(summary.netProfit)}
          </p>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Margin: {summary.totalRevenue > 0 ? ((summary.netProfit / summary.totalRevenue) * 100).toFixed(1) : 0}%
          </p>
        </div>

        {/* Card 2: Gross Sales */}
        <div className="bg-surface-container border border-outline-variant rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-label-md font-label-md text-on-surface-variant">Gross Sales</span>
            <div className="w-10 h-10 rounded-full bg-surface-container-high text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">point_of_sale</span>
            </div>
          </div>
          <p className="text-[32px] font-bold text-on-surface tracking-tight">
            {formatCurrency(summary.totalRevenue)}
          </p>
          <p className="text-body-sm text-on-surface-variant mt-1">
            {summary.transactionCount} transactions today
          </p>
        </div>

        {/* Card 3: Total COGS */}
        <div className="bg-surface-container border border-outline-variant rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-label-md font-label-md text-on-surface-variant">Total COGS</span>
            <div className="w-10 h-10 rounded-full bg-surface-container-high text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">receipt_long</span>
            </div>
          </div>
          <p className="text-[32px] font-bold text-on-surface tracking-tight">
            {formatCurrency(summary.totalCogs)}
          </p>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Cost of goods sold today
          </p>
        </div>

        {/* Card 4: Low Stock Alerts */}
        <div className="bg-surface-container border border-amber-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-amber-500/5 pointer-events-none" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-label-md font-label-md text-amber-900">Low Stock Alerts</span>
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">warning</span>
            </div>
          </div>
          <p className="text-[32px] font-bold text-amber-600 tracking-tight relative z-10">
            {lowStockCount} {lowStockCount === 1 ? 'Item' : 'Items'} Low
          </p>
          <p className="text-body-sm text-amber-800/80 mt-1 relative z-10">
            {lowStockCount > 0 ? 'Requires restock attention' : 'All raw stock healthy'}
          </p>
        </div>

      </div>

      {/* Lower 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-card-gap">
        
        {/* Left Column: Recent Activity Log */}
        <div className="lg:col-span-2 bg-surface-container border border-outline-variant rounded-xl p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant">
            <div>
              <h3 className="text-headline-md font-headline-md">Recent Activity Log</h3>
              <p className="text-body-sm text-on-surface-variant mt-0.5">Live feed of transactions recorded today</p>
            </div>
            <Link href="/sales" className="text-label-md font-label-md text-primary hover:underline flex items-center gap-1">
              View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          {recentSales.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-outline-variant rounded-xl">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-40 mb-2">history</span>
              <p className="text-body-md text-on-surface-variant">No sales recorded yet today.</p>
              <Link href="/sales" className="inline-block mt-4 text-label-md font-label-md text-primary hover:underline">
                + Record a Sale Now
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant">
              {recentSales.map((sale) => {
                let timeAgo = 'Just now';
                try {
                  timeAgo = formatDistanceToNow(new Date(sale.createdAt), { addSuffix: true });
                } catch {
                  timeAgo = 'Recently';
                }

                return (
                  <div key={sale.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface">
                        <span className="material-symbols-outlined text-[20px]">
                          {getCategoryIcon(sale.category)}
                        </span>
                      </div>
                      <div>
                        <p className="text-body-md font-semibold text-on-surface">
                          {sale.productName}
                        </p>
                        <p className="text-body-sm text-on-surface-variant">
                          x{sale.quantity} • {timeAgo} • <span className="capitalize">{sale.paymentMethod}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-body-lg font-bold text-on-surface">
                      {formatCurrency(sale.totalAmount)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Breakeven Goal & Low Stock Items */}
        <div className="space-y-6">
          
          {/* Daily Breakeven Goal Card */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-headline-md font-headline-md">Daily Breakeven Goal</h3>
              <span className="text-label-md font-label-md text-on-surface-variant">
                Target: {formatCurrency(breakeven.dailyTarget)}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-body-sm">
                <span className="text-on-surface-variant">Today's Revenue</span>
                <span className="font-bold text-on-surface">{formatCurrency(breakeven.todayRevenue)}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-surface-variant rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    breakeven.isExceeded ? 'bg-emerald-600' : 'bg-[#D4A359]'
                  }`}
                  style={{ width: `${breakeven.percentage}%` }}
                />
              </div>

              {/* Goal status text */}
              <div className="pt-2">
                {breakeven.isExceeded ? (
                  <p className="text-body-sm font-medium text-emerald-600 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Goal exceeded by {formatCurrency(breakeven.difference)}! 🎉
                  </p>
                ) : (
                  <p className="text-body-sm font-medium text-amber-700 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                    {formatCurrency(breakeven.difference)} remaining to break even
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Top Low Stock Items Sidebar */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-outline-variant">
              <h3 className="text-headline-md font-headline-md">Low Stock Items</h3>
              <Link href="/inventory" className="text-label-sm font-label-sm text-primary hover:underline">
                Manage
              </Link>
            </div>

            {lowStockItems.length === 0 ? (
              <div className="py-6 text-center text-emerald-600 font-medium text-body-sm">
                ✓ All inventory items well stocked!
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockItems.slice(0, 5).map((item: Product) => (
                  <div key={item.id} className="flex items-center justify-between p-2.5 bg-surface rounded-lg border border-outline-variant">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">
                          {getCategoryIcon(item.category)}
                        </span>
                      </div>
                      <span className="text-body-md font-medium text-on-surface">
                        {item.name}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full text-label-sm font-medium">
                      {item.current_stock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
