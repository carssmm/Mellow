'use client';

import { useState } from 'react';
import { voidSale } from '@/app/(dashboard)/sales/actions';
import { formatCurrency } from '@/lib/utils';
import { Sale } from '@/types';

interface VoidSaleModalProps {
  sale: Sale;
  onClose: () => void;
  onSuccess: () => void;
}

export function VoidSaleModal({ sale, onClose, onSuccess }: VoidSaleModalProps) {
  const [reasonOption, setReasonOption] = useState('Input Mistake');
  const [customReason, setCustomReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmVoid = async () => {
    setIsLoading(true);
    setError(null);

    const finalReason = reasonOption === 'Other' ? customReason : reasonOption;
    if (!finalReason) {
      setError('Please provide a reason for cancelling this sale.');
      setIsLoading(false);
      return;
    }

    const res = await voidSale(sale.id, finalReason);
    setIsLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface border border-outline-variant rounded-xl shadow-ambient w-full max-w-[440px] p-6 text-on-surface flex flex-col space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
          <div className="flex items-center gap-2 text-error font-bold text-headline-sm">
            <span className="material-symbols-outlined text-[22px]">warning</span>
            <span>Void / Cancel Sale</span>
          </div>
          <button onClick={onClose} className="p-1 text-on-surface-variant hover:bg-surface-container rounded-full">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="text-body-md text-on-surface-variant">
          Are you sure you want to void sale <span className="font-mono font-bold text-on-surface">#{sale.id.slice(0, 8)}</span> for <span className="font-bold text-on-surface">{formatCurrency(sale.total_revenue)}</span>?
        </p>

        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-800 space-y-1">
          <div className="font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">inventory</span>
            <span>Stock Auto-Restoration:</span>
          </div>
          <p>Cancelling this transaction will automatically add back the sold products/recipe ingredients to your inventory stock.</p>
        </div>

        {error && (
          <div className="p-3 bg-error-container/20 border border-error/30 text-error text-xs rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-label-md text-on-surface-variant font-semibold">Select Cancellation Reason:</label>
          <select
            value={reasonOption}
            onChange={(e) => setReasonOption(e.target.value)}
            className="w-full h-10 px-3 bg-surface-container border border-outline-variant/60 rounded-lg text-body-md outline-none focus:border-primary"
          >
            <option value="Input Mistake">Input Mistake / Wrong Items</option>
            <option value="Customer Cancelled">Customer Cancelled Order</option>
            <option value="Payment Error">Payment Failed / Wrong Mode</option>
            <option value="Other">Other Reason...</option>
          </select>

          {reasonOption === 'Other' && (
            <input
              type="text"
              placeholder="Type specific reason..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="w-full h-10 px-3 bg-surface-container border border-outline-variant/60 rounded-lg text-body-md outline-none focus:border-primary mt-2"
              required
            />
          )}
        </div>

        <div className="pt-3 flex items-center justify-end gap-3 border-t border-outline-variant/50">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded-lg text-label-md transition-colors"
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={handleConfirmVoid}
            disabled={isLoading}
            className="px-4 py-2 bg-error hover:bg-error/90 text-on-error rounded-lg text-label-md font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {isLoading && <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>}
            <span>Confirm Void</span>
          </button>
        </div>

      </div>
    </div>
  );
}
