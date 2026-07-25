'use client';

import { useState } from 'react';
import { updateUserTargetSales } from '@/app/(dashboard)/sales/actions';
import { formatCurrency } from '@/lib/utils';

interface EditTargetModalProps {
  currentTarget: number;
  onClose: () => void;
}

export function EditTargetModal({ currentTarget, onClose }: EditTargetModalProps) {
  const [target, setTarget] = useState(String(currentTarget));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(target);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a valid target amount.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const res = await updateUserTargetSales(num);
    setIsLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      onClose();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface border border-outline-variant rounded-xl shadow-ambient w-full max-w-[400px] p-6 text-on-surface flex flex-col space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
          <div className="flex items-center gap-2 font-bold text-headline-sm">
            <span className="material-symbols-outlined text-primary text-[22px]">target</span>
            <span>Edit Daily Target Sales</span>
          </div>
          <button onClick={onClose} className="p-1 text-on-surface-variant hover:bg-surface-container rounded-full">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {error && (
          <div className="p-3 bg-error-container/20 border border-error/30 text-error text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-label-md text-on-surface-variant font-semibold mb-1">
              Daily Target Revenue Goal (₱)
            </label>
            <input
              type="number"
              step="100"
              min="100"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full h-11 px-4 bg-surface-container border border-outline-variant/60 focus:border-primary rounded-lg text-headline-sm font-mono outline-none"
              required
            />
            <p className="text-xs text-on-surface-variant mt-1.5">
              Current Goal: <span className="font-semibold">{formatCurrency(currentTarget)}</span>
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-outline-variant/50">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded-lg text-label-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary-container hover:bg-primary-container/90 text-on-primary rounded-lg text-label-md font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {isLoading && <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>}
              <span>Save Target</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
