'use client';

import { useState, useEffect } from 'react';
import { getTodaySales } from '@/app/(dashboard)/sales/actions';
import { Sale, SaleItem, Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { ReceiptModal } from './receipt-modal';
import { VoidSaleModal } from './void-sale-modal';

export function SalesHistoryList() {
  const [sales, setSales] = useState<(Sale & { items: (SaleItem & { product: Product })[] })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReceiptSale, setSelectedReceiptSale] = useState<(Sale & { items: (SaleItem & { product: Product })[] }) | null>(null);
  const [selectedVoidSale, setSelectedVoidSale] = useState<Sale | null>(null);

  const fetchSales = async () => {
    setIsLoading(true);
    const res = await getTodaySales();
    if (res.data) {
      setSales(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
        <div>
          <h3 className="text-headline-md font-headline-md">Today's Transactions History</h3>
          <p className="text-body-sm text-on-surface-variant">View receipts, print orders, or void mistakes</p>
        </div>
        <button
          onClick={fetchSales}
          disabled={isLoading}
          className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
        >
          <span className={`material-symbols-outlined text-[18px] ${isLoading ? 'animate-spin' : ''}`}>refresh</span>
          <span>Refresh</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-xs text-on-surface-variant">Loading today's sales history...</div>
      ) : sales.length === 0 ? (
        <div className="py-8 text-center text-xs text-on-surface-variant">No transaction records found for today yet.</div>
      ) : (
        <div className="divide-y divide-outline-variant/60 overflow-x-auto">
          {sales.map((sale) => {
            const dateStr = new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const isVoided = sale.is_voided;

            return (
              <div key={sale.id} className={`py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isVoided ? 'opacity-50 line-through bg-gray-50/50 p-2 rounded-lg' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${isVoided ? 'bg-gray-200 text-gray-500' : 'bg-primary-container text-on-primary'}`}>
                    <span className="material-symbols-outlined text-[18px]">{isVoided ? 'cancel' : 'receipt'}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-on-surface">#{sale.id.slice(0, 8)}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container-high uppercase font-semibold text-on-surface-variant">
                        {sale.payment_method === 'cash' ? 'Cash' : 'GCash/Maya'}
                      </span>
                      {isVoided && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-bold uppercase no-underline">
                          VOIDED ({sale.void_reason})
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {sale.items.length} items • {dateStr}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <span className="text-body-md font-bold text-on-surface block font-mono">
                      {formatCurrency(sale.total_revenue)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedReceiptSale(sale)}
                      className="px-2.5 py-1.5 bg-surface-container-high hover:bg-primary-container hover:text-on-primary text-on-surface rounded-md text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="View / Print Receipt"
                    >
                      <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                      <span>Receipt</span>
                    </button>

                    {!isVoided && (
                      <button
                        onClick={() => setSelectedVoidSale(sale)}
                        className="px-2 py-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-md transition-colors"
                        title="Void / Cancel Sale"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedReceiptSale && (
        <ReceiptModal
          sale={selectedReceiptSale}
          onClose={() => setSelectedReceiptSale(null)}
        />
      )}

      {selectedVoidSale && (
        <VoidSaleModal
          sale={selectedVoidSale}
          onClose={() => setSelectedVoidSale(null)}
          onSuccess={fetchSales}
        />
      )}
    </div>
  );
}
