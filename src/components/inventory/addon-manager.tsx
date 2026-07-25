'use client';

import { useState, useEffect } from 'react';
import { ProductAddon, Product } from '@/types';
import { getProductAddons, createProductAddon, deleteProductAddon, getProducts } from '@/app/(dashboard)/inventory/actions';
import { formatCurrency } from '@/lib/utils';

interface AddonManagerProps {
  productId?: string;
}

export function AddonManager({ productId }: AddonManagerProps) {
  const [addons, setAddons] = useState<ProductAddon[]>([]);
  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('20');
  const [selectedRawId, setSelectedRawId] = useState('');
  const [rawQuantity, setRawQuantity] = useState('1');

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    const [addonsRes, productsRes] = await Promise.all([
      getProductAddons(productId),
      getProducts(),
    ]);

    if (addonsRes.error) setError(addonsRes.error);
    else setAddons((addonsRes.data as unknown as ProductAddon[]) || []);

    if (productsRes.data) {
      setRawProducts(productsRes.data.filter(p => p.type === 'raw_material'));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [productId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isNaN(Number(price))) return;

    setIsAdding(true);
    const res = await createProductAddon(
      name.trim(),
      Number(price),
      productId,
      selectedRawId || null,
      selectedRawId ? Number(rawQuantity) : 1
    );
    setIsAdding(false);

    if (res.error) {
      setError(res.error);
    } else {
      setName('');
      setPrice('20');
      setSelectedRawId('');
      setRawQuantity('1');
      loadData();
    }
  };

  const handleDelete = async (addonId: string) => {
    const res = await deleteProductAddon(addonId);
    if (res.error) setError(res.error);
    else loadData();
  };

  if (isLoading) {
    return <div className="text-xs text-on-surface-variant py-3">Loading add-ons...</div>;
  }

  return (
    <div className="mt-6 pt-4 border-t border-outline-variant/60">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">add_circle</span>
          <h4 className="font-semibold text-body-lg text-on-surface">Product Add-ons & Modifiers</h4>
        </div>
        <span className="text-xs text-on-surface-variant font-medium">Extra Shot, Syrups, Toppings</span>
      </div>

      {error && (
        <div className="p-2.5 mb-3 bg-error-container/20 border border-error/30 text-error rounded-lg text-xs">
          {error}
        </div>
      )}

      {/* Existing Add-ons List */}
      {addons.length === 0 ? (
        <div className="p-3 text-center text-xs text-on-surface-variant bg-surface-container/30 rounded-lg mb-3">
          No custom add-ons configured. Add one below (e.g. "Extra Shot - ₱25")!
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          {addons.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2.5 bg-surface-container border border-outline-variant/40 rounded-lg text-body-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">add</span>
                <span className="font-semibold text-on-surface">{item.name}</span>
                {!item.product_id && (
                  <span className="text-[10px] bg-secondary-container/30 text-on-secondary-container px-1.5 py-0.5 rounded font-bold uppercase">Global</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono bg-surface-container-high px-2 py-0.5 rounded text-xs font-bold text-on-surface">
                  +{formatCurrency(item.price)}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="text-on-surface-variant hover:text-error transition-colors p-1"
                  title="Remove add-on"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Add-on Form */}
      <form onSubmit={handleAdd} className="bg-surface-container-lowest border border-outline-variant/50 p-3 rounded-lg flex flex-col gap-2">
        <div className="text-xs font-semibold text-on-surface-variant">Create New Custom Add-on</div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Add-on Name (e.g. Extra Shot, Caramel Drizzle)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-9 px-3 bg-white border border-outline-variant rounded-md text-xs outline-none focus:border-primary"
            required
          />

          <input
            type="number"
            step="0.5"
            min="0"
            placeholder="Price (₱)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="h-9 px-3 bg-white border border-outline-variant rounded-md text-xs outline-none focus:border-primary font-mono"
            required
          />
        </div>

        {/* Optional Linked Raw Material Stock Deduction */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-outline-variant/30 pt-2 mt-1">
          <select
            value={selectedRawId}
            onChange={(e) => setSelectedRawId(e.target.value)}
            className="h-8 px-2 bg-white border border-outline-variant rounded-md text-[11px] outline-none"
          >
            <option value="">-- Optional: Link Stock Deduction --</option>
            {rawProducts.map(p => (
              <option key={p.id} value={p.id}>{p.name} (Stock: {p.current_stock})</option>
            ))}
          </select>

          {selectedRawId && (
            <input
              type="number"
              step="any"
              min="0.001"
              placeholder="Deduct Qty per add-on"
              value={rawQuantity}
              onChange={(e) => setRawQuantity(e.target.value)}
              className="h-8 px-2 bg-white border border-outline-variant rounded-md text-[11px] outline-none font-mono"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={isAdding || !name.trim()}
          className="h-8 mt-1 px-3 bg-primary-container hover:bg-primary-container/90 text-on-primary rounded-md text-xs font-semibold flex items-center justify-center gap-1 transition-colors self-end disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>{isAdding ? 'Saving...' : 'Save Add-on'}</span>
        </button>
      </form>
    </div>
  );
}
