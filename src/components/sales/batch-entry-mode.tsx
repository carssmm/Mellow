'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';
import { recordBatchSale } from '@/app/(dashboard)/sales/actions';
import { useToast } from '@/components/ui/toast';

export function BatchEntryMode({ products }: { products: Product[] }) {
  const { showToast } = useToast();
  // State maps productId to quantity sold
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'gcash_maya'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQtyChange = (productId: string, val: string) => {
    const qty = parseInt(val, 10);
    setQuantities(prev => ({
      ...prev,
      [productId]: isNaN(qty) || qty < 0 ? 0 : qty
    }));
  };

  // Calculations
  let totalItems = 0;
  let grossRevenue = 0;
  let totalCogs = 0;

  products.forEach(product => {
    const qty = quantities[product.id] || 0;
    if (qty > 0) {
      totalItems += qty;
      grossRevenue += qty * product.selling_price;
      totalCogs += qty * product.unit_cost;
    }
  });

  const netProfit = grossRevenue - totalCogs;

  const handleSubmit = async () => {
    if (totalItems === 0) return;
    setIsSubmitting(true);

    const items = products
      .filter(p => (quantities[p.id] || 0) > 0)
      .map(p => ({
        productId: p.id,
        quantity: quantities[p.id],
        unitPrice: p.selling_price,
        unitCost: p.unit_cost
      }));

    const result = await recordBatchSale({ items, paymentMethod });

    if (result.success) {
      showToast('Batch sales recorded successfully!', 'success');
      if (result.warnings && result.warnings.length > 0) {
        result.warnings.forEach(w => showToast(w, 'warning'));
      }
      setQuantities({}); // Reset form
    } else {
      showToast(result.error || 'Failed to record batch sale', 'error');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-surface rounded-xl border border-outline-variant shadow-soft overflow-hidden">
      <div className="p-6 border-b border-outline-variant">
        <h2 className="text-headline-md font-headline-md">Batch Daily Entry</h2>
        <p className="text-body-md text-on-surface-variant mt-1">
          Enter the total quantities sold today for each product.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-lowest">
              <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant font-medium">Product</th>
              <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant font-medium">Category</th>
              <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant font-medium text-right">Price</th>
              <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant font-medium w-48">Qty Sold Today</th>
              <th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant font-medium text-right">Line Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/50">
            {products.map(product => {
              const qty = quantities[product.id] || 0;
              const lineTotal = qty * product.selling_price;
              return (
                <tr key={product.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                  <td className="px-6 py-4 text-body-md font-medium text-on-surface">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-body-md text-on-surface-variant">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-number-data text-right text-on-surface">
                    {formatCurrency(product.selling_price)}
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      min="0"
                      value={qty || ''}
                      onChange={(e) => handleQtyChange(product.id, e.target.value)}
                      placeholder="0"
                      className="w-full max-w-[120px] px-3 py-2 bg-surface border border-outline-variant rounded-md text-number-data focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow"
                    />
                  </td>
                  <td className="px-6 py-4 text-number-data text-right font-medium text-on-surface">
                    {formatCurrency(lineTotal)}
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">
                  No active products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-6 bg-surface-container-lowest border-t border-outline-variant flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-end">
        
        {/* Payment Method Selector */}
        <div className="w-full lg:w-auto">
          <label className="block text-label-md text-on-surface-variant mb-2">Default Payment Method</label>
          <div className="flex bg-surface-container-high p-1 rounded-lg border border-outline-variant/50">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={cn(
                "px-4 py-2 text-label-md flex items-center gap-2 rounded-md transition-all",
                paymentMethod === 'cash' ? "bg-surface text-primary shadow-sm" : "text-on-surface-variant hover:text-primary"
              )}
            >
              <span>Cash</span>
              <span className="text-[16px]">💵</span>
            </button>
            <button
              onClick={() => setPaymentMethod('gcash_maya')}
              className={cn(
                "px-4 py-2 text-label-md flex items-center gap-2 rounded-md transition-all",
                paymentMethod === 'gcash_maya' ? "bg-surface text-primary shadow-sm" : "text-on-surface-variant hover:text-primary"
              )}
            >
              <span>GCash/Maya</span>
              <span className="text-[16px]">📱</span>
            </button>
          </div>
        </div>

        {/* Summary & Submit */}
        <div className="w-full lg:w-[400px]">
          <div className="space-y-2 mb-6 text-label-md">
            <div className="flex justify-between text-on-surface-variant">
              <span>Total Items Sold</span>
              <span className="font-number-data text-on-surface">{totalItems}</span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>Gross Revenue</span>
              <span className="font-number-data text-on-surface">{formatCurrency(grossRevenue)}</span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>Total COGS</span>
              <span className="font-number-data text-on-surface">{formatCurrency(totalCogs)}</span>
            </div>
            <div className="flex justify-between text-on-surface font-semibold pt-2 border-t border-outline-variant/50">
              <span>Net Profit</span>
              <span className="font-number-data text-secondary">{formatCurrency(netProfit)}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={totalItems === 0 || isSubmitting}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-on-primary rounded-lg font-label-md flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed shadow-sm"
          >
            {isSubmitting ? (
              <span className="material-symbols-outlined animate-spin">refresh</span>
            ) : (
              <>
                Record Batch Sales
                <span className="material-symbols-outlined text-[20px]">save</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
