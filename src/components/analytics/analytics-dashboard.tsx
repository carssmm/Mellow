'use client';

import { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { DailyAnalyticsPoint, TopProduct, getSalesAnalytics, getTopSellingProducts, getExportData } from '@/app/(dashboard)/analytics/actions';
import { generateSalesCSV, generateProfitSummaryCSV, downloadCSV } from '@/lib/csv-export';
import { formatCurrency } from '@/lib/utils';

export type DateRangePreset = 'today' | '7days' | 'month' | 'custom';

interface AnalyticsDashboardProps {
  initialAnalytics: DailyAnalyticsPoint[];
  initialTopProducts: TopProduct[];
}

export function AnalyticsDashboard({ initialAnalytics, initialTopProducts }: AnalyticsDashboardProps) {
  const [preset, setPreset] = useState<DateRangePreset>('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [analytics, setAnalytics] = useState<DailyAnalyticsPoint[]>(initialAnalytics);
  const [topProducts, setTopProducts] = useState<TopProduct[]>(initialTopProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [isExportingSales, setIsExportingSales] = useState(false);
  const [isExportingSummary, setIsExportingSummary] = useState(false);

  const fetchFilteredData = async (newPreset: DateRangePreset, customStart?: string, customEnd?: string) => {
    setIsLoading(true);
    let startStr: string | undefined;
    let endStr: string | undefined;

    const now = new Date();

    if (newPreset === 'today') {
      const todayStr = now.toISOString().split('T')[0];
      startStr = todayStr;
      endStr = todayStr;
    } else if (newPreset === '7days') {
      const d7 = new Date(now);
      d7.setDate(d7.getDate() - 6);
      startStr = d7.toISOString().split('T')[0];
      endStr = now.toISOString().split('T')[0];
    } else if (newPreset === 'month') {
      const startM = new Date(now.getFullYear(), now.getMonth(), 1);
      const endM = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      startStr = startM.toISOString().split('T')[0];
      endStr = endM.toISOString().split('T')[0];
    } else if (newPreset === 'custom') {
      startStr = customStart || startDate;
      endStr = customEnd || endDate;
    }

    const [analyticsRes, topProdRes] = await Promise.all([
      getSalesAnalytics(startStr, endStr),
      getTopSellingProducts(startStr, endStr, 5),
    ]);

    if (analyticsRes.data) setAnalytics(analyticsRes.data);
    if (topProdRes.data) setTopProducts(topProdRes.data);

    setIsLoading(false);
  };

  const handlePresetChange = (newPreset: DateRangePreset) => {
    setPreset(newPreset);
    if (newPreset !== 'custom') {
      fetchFilteredData(newPreset);
    }
  };

  const handleCustomDateApply = () => {
    if (startDate && endDate) {
      fetchFilteredData('custom', startDate, endDate);
    }
  };

  const handleExportSalesDetail = async () => {
    setIsExportingSales(true);
    const { data } = await getExportData(startDate, endDate);
    if (data?.salesRows) {
      const csv = generateSalesCSV(data.salesRows);
      const filename = `mellow_sales_detail_${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csv, filename);
    }
    setIsExportingSales(false);
  };

  const handleExportProfitSummary = async () => {
    setIsExportingSummary(true);
    const { data } = await getExportData(startDate, endDate);
    if (data?.summaryRows) {
      const csv = generateProfitSummaryCSV(data.summaryRows);
      const filename = `mellow_profit_summary_${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csv, filename);
    }
    setIsExportingSummary(false);
  };

  const totalPeriodRevenue = analytics.reduce((sum, d) => sum + d.revenue, 0);
  const totalPeriodCogs = analytics.reduce((sum, d) => sum + d.cogs, 0);
  const totalPeriodProfit = analytics.reduce((sum, d) => sum + d.profit, 0);

  return (
    <div className="space-y-8">
      {/* Header & Date Filters */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <h1 className="text-headline-lg font-headline-lg">Sales & Profit Analytics</h1>
          <p className="text-body-lg text-on-surface-variant mt-1">
            Historical reporting, net profit performance, and downloadable business reports.
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-surface-container border border-outline-variant p-1.5 rounded-xl">
          <button
            onClick={() => handlePresetChange('today')}
            className={`px-3.5 py-1.5 rounded-lg text-label-md font-label-md transition-colors ${
              preset === 'today' ? 'bg-[#2B2B2B] text-[#F5F2EC]' : 'text-on-surface hover:bg-surface-variant'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => handlePresetChange('7days')}
            className={`px-3.5 py-1.5 rounded-lg text-label-md font-label-md transition-colors ${
              preset === '7days' ? 'bg-[#2B2B2B] text-[#F5F2EC]' : 'text-on-surface hover:bg-surface-variant'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => handlePresetChange('month')}
            className={`px-3.5 py-1.5 rounded-lg text-label-md font-label-md transition-colors ${
              preset === 'month' ? 'bg-[#2B2B2B] text-[#F5F2EC]' : 'text-on-surface hover:bg-surface-variant'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => handlePresetChange('custom')}
            className={`px-3.5 py-1.5 rounded-lg text-label-md font-label-md transition-colors ${
              preset === 'custom' ? 'bg-[#2B2B2B] text-[#F5F2EC]' : 'text-on-surface hover:bg-surface-variant'
            }`}
          >
            Custom Range
          </button>
        </div>
      </div>

      {/* Custom Date Inputs if Custom Selected */}
      {preset === 'custom' && (
        <div className="bg-surface-container border border-outline-variant rounded-xl p-4 flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-surface border border-outline-variant rounded-lg px-3 py-1.5 text-body-md focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-surface border border-outline-variant rounded-lg px-3 py-1.5 text-body-md focus:outline-none focus:border-primary"
            />
          </div>
          <button
            onClick={handleCustomDateApply}
            disabled={!startDate || !endDate}
            className="px-4 py-2 bg-primary text-on-primary rounded-lg text-label-md font-label-md disabled:opacity-50"
          >
            Apply Filter
          </button>
        </div>
      )}

      {/* Action bar for CSV exports */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-container border border-outline-variant rounded-xl p-4">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-body-sm text-on-surface-variant">Period Revenue</span>
            <p className="text-headline-sm font-headline-sm text-on-surface">{formatCurrency(totalPeriodRevenue)}</p>
          </div>
          <div className="border-l border-outline-variant pl-6">
            <span className="text-body-sm text-on-surface-variant">Period Net Profit</span>
            <p className="text-headline-sm font-headline-sm text-emerald-600">{formatCurrency(totalPeriodProfit)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportProfitSummary}
            disabled={isExportingSummary}
            className="px-3.5 py-2 bg-surface border border-outline-variant rounded-xl text-label-md font-label-md text-on-surface hover:bg-surface-variant transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            {isExportingSummary ? 'Generating...' : 'Export Profit Summary (CSV)'}
          </button>

          <button
            onClick={handleExportSalesDetail}
            disabled={isExportingSales}
            className="px-3.5 py-2 bg-[#2B2B2B] text-[#F5F2EC] rounded-xl text-label-md font-label-md hover:bg-black transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            {isExportingSales ? 'Generating...' : 'Export Sales Detail (CSV)'}
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-card-gap">
        
        {/* Net Profit Line Chart */}
        <div className="bg-surface-container border border-outline-variant rounded-xl p-6">
          <h3 className="text-headline-md font-headline-md mb-1">Daily Net Profit Trend</h3>
          <p className="text-body-sm text-on-surface-variant mb-6">Net profit trajectory across selected date range</p>

          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center text-on-surface-variant">
              Loading analytics...
            </div>
          ) : analytics.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-on-surface-variant">
              No sales data for selected period.
            </div>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6E1DA" />
                  <XAxis dataKey="displayDate" tick={{ fontSize: 12, fill: '#605D57' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#605D57' }} />
                  <Tooltip
                    formatter={(value: any) => [formatCurrency(Number(value || 0)), 'Net Profit']}
                    contentStyle={{ backgroundColor: '#F5F2EC', borderColor: '#E6E1DA', borderRadius: '8px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#2D6A4F"
                    strokeWidth={3}
                    dot={{ fill: '#2D6A4F', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Revenue vs COGS Bar Chart */}
        <div className="bg-surface-container border border-outline-variant rounded-xl p-6">
          <h3 className="text-headline-md font-headline-md mb-1">Revenue vs COGS Breakdown</h3>
          <p className="text-body-sm text-on-surface-variant mb-6">Gross sales revenue compared against item costs</p>

          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center text-on-surface-variant">
              Loading analytics...
            </div>
          ) : analytics.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-on-surface-variant">
              No sales data for selected period.
            </div>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6E1DA" />
                  <XAxis dataKey="displayDate" tick={{ fontSize: 12, fill: '#605D57' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#605D57' }} />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      formatCurrency(Number(value || 0)),
                      name === 'revenue' ? 'Gross Revenue' : 'COGS',
                    ]}
                    contentStyle={{ backgroundColor: '#F5F2EC', borderColor: '#E6E1DA', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill="#2B2B2B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cogs" name="COGS" fill="#D4A359" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>

      {/* Top Selling Products Section */}
      <div className="bg-surface-container border border-outline-variant rounded-xl p-6">
        <h3 className="text-headline-md font-headline-md mb-1">Top-Selling Menu Items</h3>
        <p className="text-body-sm text-on-surface-variant mb-6">Highest revenue generating products for this period</p>

        {topProducts.length === 0 ? (
          <p className="text-body-md text-on-surface-variant py-4">No item sales recorded in this period.</p>
        ) : (
          <div className="divide-y divide-outline-variant">
            {topProducts.map((prod, index) => (
              <div key={prod.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface font-bold text-label-md flex items-center justify-center">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="text-body-md font-semibold text-on-surface">{prod.name}</p>
                    <p className="text-body-sm text-on-surface-variant">{prod.category} • {prod.quantitySold} units sold</p>
                  </div>
                </div>
                <span className="text-body-lg font-bold text-on-surface">
                  {formatCurrency(prod.totalRevenue)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
