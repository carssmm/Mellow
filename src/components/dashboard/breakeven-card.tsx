'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { EditTargetModal } from './edit-target-modal';

interface BreakevenCardProps {
  breakeven: {
    dailyTarget: number;
    todayRevenue: number;
    percentage: number;
    isExceeded: boolean;
    difference: number;
  };
}

export function BreakevenCard({ breakeven }: BreakevenCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-headline-md font-headline-md">Daily Breakeven Goal</h3>
          <p className="text-xs text-on-surface-variant">Track sales progress against target</p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-label-md font-label-md text-on-surface-variant font-mono">
            Target: {formatCurrency(breakeven.dailyTarget)}
          </span>
          <button
            onClick={() => setIsEditOpen(true)}
            className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-md transition-colors"
            title="Edit Daily Target Goal"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
        </div>
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

      {isEditOpen && (
        <EditTargetModal
          currentTarget={breakeven.dailyTarget}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </div>
  );
}
