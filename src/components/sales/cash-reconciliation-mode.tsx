'use client';

import { useState, useEffect } from 'react';
import { formatCurrency, cn } from '@/lib/utils';
import { recordReconciliation, getTodaysSummary } from '@/app/(dashboard)/sales/actions';
import { useToast } from '@/components/ui/toast';

export function CashReconciliationMode() {
  const { showToast } = useToast();
  
  const [startingFloat, setStartingFloat] = useState<string>('');
  const [endingCash, setEndingCash] = useState<string>('');
  
  const [todayCashSales, setTodayCashSales] = useState<number>(0);
  const [summary, setSummary] = useState<{ revenue: number; cogs: number; profit: number } | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecorded, setIsRecorded] = useState(false);

  useEffect(() => {
    async function loadSummary() {
      const { data, error } = await getTodaysSummary();
      if (data && !error) {
        setTodayCashSales(data.totalCashSales);
        setSummary({
          revenue: data.totalRevenue,
          cogs: data.totalCogs,
          profit: data.netProfit
        });
      }
      setIsLoadingSummary(false);
    }
    loadSummary();
  }, [isRecorded]); // Reload summary after a recording

  // Calculations
  const numStarting = parseFloat(startingFloat) || 0;
  const numEnding = parseFloat(endingCash) || 0;
  const expectedCash = numStarting + todayCashSales;
  const discrepancy = numEnding - expectedCash;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (startingFloat === '' || endingCash === '') return;
    
    setIsSubmitting(true);
    
    const result = await recordReconciliation({
      startingFloat: numStarting,
      endingCash: numEnding
    });

    if (result.success) {
      showToast('Cash drawer closed and recorded.', 'success');
      setIsRecorded(true); // Triggers re-fetch and shows summary panel
    } else {
      showToast(result.error || 'Failed to record reconciliation', 'error');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Input Form */}
      <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-outline-variant p-6 shadow-soft">
        <div className="mb-6">
          <h2 className="text-headline-md font-headline-md">Cash Drawer Closing</h2>
          <p className="text-body-md text-on-surface-variant mt-1">
            Reconcile your physical cash against recorded sales.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-label-md text-on-surface-variant mb-1">Starting Cash Float</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-number-data">₱</span>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={startingFloat}
                onChange={e => setStartingFloat(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 bg-surface border border-outline-variant rounded-lg text-number-data text-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow"
              />
            </div>
            <p className="text-body-sm text-on-surface-variant mt-1 ml-1">
              The cash amount in your drawer at the start of the day.
            </p>
          </div>

          <div>
            <label className="block text-label-md text-on-surface-variant mb-1">Ending Physical Cash</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-number-data">₱</span>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={endingCash}
                onChange={e => setEndingCash(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 bg-surface border border-outline-variant rounded-lg text-number-data text-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow"
              />
            </div>
            <p className="text-body-sm text-on-surface-variant mt-1 ml-1">
              Count and enter the total cash in your drawer now.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-outline-variant/50">
          <button
            type="submit"
            disabled={isSubmitting || startingFloat === '' || endingCash === ''}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-on-primary rounded-lg font-label-md flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed shadow-sm"
          >
            {isSubmitting ? (
              <span className="material-symbols-outlined animate-spin">refresh</span>
            ) : (
              <>
                Close Cash Drawer & Record
                <span className="material-symbols-outlined text-[20px]">inventory_2</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Right: Calculated Results */}
      <div className="flex flex-col gap-6">
        <div className="bg-surface rounded-xl border border-outline-variant p-6 shadow-soft h-auto">
          <h3 className="text-headline-sm font-headline-md mb-6 border-b border-outline-variant pb-4">
            Drawer Calculations
          </h3>

          {isLoadingSummary ? (
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-surface-container-high rounded w-3/4"></div>
              <div className="h-6 bg-surface-container-high rounded w-1/2"></div>
              <div className="h-10 bg-surface-container-high rounded w-full mt-4"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center text-label-md">
                <span className="text-on-surface-variant">Today&apos;s Recorded Cash Sales</span>
                <span className="font-number-data text-on-surface text-lg">
                  {formatCurrency(todayCashSales)}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-label-md">
                <span className="text-on-surface-variant">Expected Cash (Float + Sales)</span>
                <span className="font-number-data text-on-surface text-lg">
                  {formatCurrency(expectedCash)}
                </span>
              </div>

              <div className={cn(
                "p-4 rounded-lg border flex justify-between items-center",
                discrepancy === 0 && "bg-[#D1E6D3]/30 border-[#A3CBA6] text-[#1E3F20]",
                discrepancy > 0 && "bg-primary-container/30 border-primary-container text-primary",
                discrepancy < 0 && "bg-error-container/30 border-error-container text-error"
              )}>
                <div className="flex flex-col">
                  <span className="text-label-sm uppercase tracking-wider opacity-80">Cash Discrepancy</span>
                  <span className="text-headline-md font-headline-md font-number-data">
                    {discrepancy === 0 ? "Balanced ✓" : 
                     discrepancy > 0 ? `${formatCurrency(discrepancy)} Over` : 
                     `${formatCurrency(Math.abs(discrepancy))} Short`}
                  </span>
                </div>
                <span className="material-symbols-outlined text-[32px] opacity-80">
                  {discrepancy === 0 ? 'check_circle' : 
                   discrepancy > 0 ? 'trending_up' : 
                   'warning'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Day Summary (Shown after record or always visible but highlights day totals) */}
        {summary && (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-soft">
            <h3 className="text-label-lg text-on-surface-variant mb-4">Today&apos;s Trading Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface p-4 rounded-lg border border-outline-variant/50">
                <div className="text-label-sm text-on-surface-variant mb-1">Gross Revenue</div>
                <div className="font-number-data text-on-surface text-xl">{formatCurrency(summary.revenue)}</div>
              </div>
              <div className="bg-surface p-4 rounded-lg border border-outline-variant/50">
                <div className="text-label-sm text-on-surface-variant mb-1">Total COGS</div>
                <div className="font-number-data text-on-surface text-xl">{formatCurrency(summary.cogs)}</div>
              </div>
              <div className="col-span-2 bg-surface p-4 rounded-lg border border-outline-variant shadow-sm flex justify-between items-center">
                <div className="text-label-md text-on-surface-variant">Net Profit</div>
                <div className="font-number-data text-secondary text-2xl font-bold">{formatCurrency(summary.profit)}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
