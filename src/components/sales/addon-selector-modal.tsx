'use client';

import { useState, useEffect } from 'react';
import { Product, ProductAddon } from '@/types';
import { getProductAddons } from '@/app/(dashboard)/inventory/actions';
import { formatCurrency } from '@/lib/utils';

interface AddonSelectorModalProps {
  product: Product;
  onClose: () => void;
  onConfirm: (product: Product, selectedAddons: ProductAddon[]) => void;
}

export function AddonSelectorModal({ product, onClose, onConfirm }: AddonSelectorModalProps) {
  const [addons, setAddons] = useState<ProductAddon[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<ProductAddon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAddons() {
      setIsLoading(true);
      const res = await getProductAddons(product.id);
      if (res.data) {
        setAddons(res.data as unknown as ProductAddon[]);
      }
      setIsLoading(false);
    }
    fetchAddons();
  }, [product.id]);

  const toggleAddon = (addon: ProductAddon) => {
    setSelectedAddons(prev => {
      const exists = prev.some(a => a.id === addon.id);
      if (exists) return prev.filter(a => a.id !== addon.id);
      return [...prev, addon];
    });
  };

  const extraCost = selectedAddons.reduce((sum, a) => sum + Number(a.price), 0);
  const totalPrice = product.selling_price + extraCost;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface border border-outline-variant rounded-xl shadow-ambient w-full max-w-[420px] p-6 text-on-surface flex flex-col space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
          <div>
            <h3 className="font-bold text-headline-sm text-on-surface">{product.name}</h3>
            <p className="text-xs text-on-surface-variant">Base Price: {formatCurrency(product.selling_price)}</p>
          </div>
          <button onClick={onClose} className="p-1 text-on-surface-variant hover:bg-surface-container rounded-full">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
          <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            Select Customize Add-ons:
          </label>

          {isLoading ? (
            <div className="py-6 text-center text-xs text-on-surface-variant">Loading available add-ons...</div>
          ) : addons.length === 0 ? (
            <div className="py-6 text-center text-xs text-on-surface-variant bg-surface-container/30 rounded-lg">
              No add-ons configured yet. You can add default choices like "Extra Shot" in Inventory!
            </div>
          ) : (
            <div className="space-y-2">
              {addons.map((addon) => {
                const isSelected = selectedAddons.some(a => a.id === addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon)}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-primary-container/10 border-primary text-primary font-semibold'
                        : 'bg-surface-container/50 border-outline-variant/50 hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-[18px]">
                        {isSelected ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                      <span>{addon.name}</span>
                    </div>
                    <span className="font-mono text-xs">+{formatCurrency(addon.price)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-outline-variant/60 flex items-center justify-between">
          <div>
            <span className="text-xs text-on-surface-variant block">Total Item Price:</span>
            <span className="text-headline-sm font-bold text-on-surface font-mono">{formatCurrency(totalPrice)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onConfirm(product, [])}
              className="px-3 py-2 border border-outline-variant text-on-surface-variant hover:bg-surface-container rounded-lg text-xs font-semibold"
            >
              No Add-ons
            </button>
            <button
              onClick={() => onConfirm(product, selectedAddons)}
              className="px-4 py-2 bg-primary-container hover:bg-primary-container/90 text-on-primary rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <span>Add to Cart</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
