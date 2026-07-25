'use client';

import { useState } from 'react';

export default function CalculatorsPage() {
  // Margin Calculator State
  const [itemCost, setItemCost] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');

  // Breakeven Calculator State
  const [fixedCosts, setFixedCosts] = useState('');
  const [avgMargin, setAvgMargin] = useState('');

  // Margin Calculations
  const parsedCost = parseFloat(itemCost) || 0;
  const parsedPrice = parseFloat(sellingPrice) || 0;
  
  const hasValidMarginInputs = parsedCost > 0 && parsedPrice > 0;
  const profit = parsedPrice - parsedCost;
  const marginPercent = parsedPrice > 0 ? (profit / parsedPrice) * 100 : 0;

  // Breakeven Calculations
  const parsedFixed = parseFloat(fixedCosts) || 0;
  const parsedAvgMargin = parseFloat(avgMargin) || 0;
  
  const hasValidBreakevenInputs = parsedFixed > 0 && parsedAvgMargin > 0;
  const monthlyItemsNeeded = hasValidBreakevenInputs ? Math.ceil(parsedFixed / parsedAvgMargin) : 0;
  const dailyCupsTarget = hasValidBreakevenInputs ? (monthlyItemsNeeded / 30).toFixed(1) : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-headline-lg font-headline-lg">Business Calculators</h1>
        <p className="text-body-lg text-on-surface-variant mt-2 max-w-2xl">
          Precision tools for pricing and forecasting. Optimize your margins and understand your daily targets with our intentional financial models.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-card-gap">
        
        {/* Margin & Pricing Calculator */}
        <div className="bg-surface-container border border-outline-variant rounded-xl p-6 h-full">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-outline-variant">
            <span className="material-symbols-outlined text-primary">calculate</span>
            <h3 className="text-headline-md font-headline-md">Item Margin & Pricing</h3>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-label-lg font-label-lg text-on-surface mb-2">Item Cost (₱)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={itemCost}
                onChange={(e) => setItemCost(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-outline-variant rounded-[10px] px-4 py-3 text-body-lg focus:outline-none focus:border-[#D4A359] transition-colors"
                placeholder="e.g. 45.00"
              />
            </div>
            <div>
              <label className="block text-label-lg font-label-lg text-on-surface mb-2">Selling Price (₱)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-outline-variant rounded-[10px] px-4 py-3 text-body-lg focus:outline-none focus:border-[#D4A359] transition-colors"
                placeholder="e.g. 130.00"
              />
            </div>
          </div>

          {hasValidMarginInputs && (
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6">
              <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider block mb-4">RESULTS</span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-body-md text-on-surface-variant mb-1">Net Profit</p>
                  <p className={`text-display-sm font-display-sm ${profit >= 0 ? 'text-emerald-600' : 'text-error'}`}>
                    {formatCurrency(profit)}
                  </p>
                </div>
                <div>
                  <p className="text-body-md text-on-surface-variant mb-1">Margin</p>
                  <p className={`text-display-sm font-display-sm ${marginPercent >= 0 ? 'text-emerald-600' : 'text-error'}`}>
                    {marginPercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Breakeven Calculator */}
        <div className="bg-surface-container border border-outline-variant rounded-xl p-6 h-full">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-outline-variant">
            <span className="material-symbols-outlined text-primary">storefront</span>
            <h3 className="text-headline-md font-headline-md">Café Breakeven</h3>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-label-lg font-label-lg text-on-surface mb-2">Monthly Fixed Costs (₱)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={fixedCosts}
                onChange={(e) => setFixedCosts(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-outline-variant rounded-[10px] px-4 py-3 text-body-lg focus:outline-none focus:border-[#D4A359] transition-colors"
                placeholder="e.g. 18275.00"
              />
            </div>
            <div>
              <label className="block text-label-lg font-label-lg text-on-surface mb-2">Average Gross Margin per Item (₱)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={avgMargin}
                onChange={(e) => setAvgMargin(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-outline-variant rounded-[10px] px-4 py-3 text-body-lg focus:outline-none focus:border-[#D4A359] transition-colors"
                placeholder="e.g. 85.00"
              />
            </div>
          </div>

          {hasValidBreakevenInputs && (
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 space-y-4">
              <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider block mb-2">TARGETS</span>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-body-md text-on-surface-variant mb-1">Monthly Sales Needed</p>
                  <p className="text-display-sm font-display-sm text-on-surface">
                    {new Intl.NumberFormat('en-PH').format(monthlyItemsNeeded)} <span className="text-title-md text-on-surface-variant">items</span>
                  </p>
                </div>
                <div>
                  <p className="text-body-md text-on-surface-variant mb-1">Daily Target (30 days)</p>
                  <p className="text-display-sm font-display-sm text-on-surface">
                    {dailyCupsTarget} <span className="text-title-md text-on-surface-variant">cups</span>
                  </p>
                </div>
              </div>

              <div className="bg-[#FEF7E6] border border-[#F6E0A6] rounded-lg p-4 mt-4 flex gap-3">
                <span className="text-xl">💡</span>
                <p className="text-body-md" style={{ color: '#8A6A2C' }}>
                  <strong>Insight:</strong> Every sale after cup #{Math.ceil(Number(dailyCupsTarget))} daily is pure profit!
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
