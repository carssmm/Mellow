'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { QuickTapMode } from './quick-tap-mode';
import { BatchEntryMode } from './batch-entry-mode';
import { CashReconciliationMode } from './cash-reconciliation-mode';

export type SalesMode = 'quick_tap' | 'batch' | 'reconciliation';

export function SalesLogger({ products }: { products: Product[] }) {
  const [activeMode, setActiveMode] = useState<SalesMode>('quick_tap');

  const modes = [
    { value: 'quick_tap', label: 'Quick Tap Logger', icon: '⚡' },
    { value: 'batch', label: 'Batch Daily Entry', icon: '📝' },
    { value: 'reconciliation', label: 'Cash Drawer Closing', icon: '💵' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <h1 className="text-headline-lg font-headline-lg">Record Transactions</h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            Log real-time sales or batch entries for the day.
          </p>
        </div>
        <SegmentedControl 
          options={modes}
          value={activeMode}
          onChange={(val) => setActiveMode(val as SalesMode)}
        />
      </div>

      <div className="mt-4">
        {activeMode === 'quick_tap' && <QuickTapMode products={products} />}
        {activeMode === 'batch' && <BatchEntryMode products={products} />}
        {activeMode === 'reconciliation' && <CashReconciliationMode />}
      </div>
    </div>
  );
}
