'use client';

import { useState, useRef, useEffect } from 'react';
import { Product } from '@/types';
import { addStock } from '@/app/(dashboard)/inventory/actions';
import { formatCurrency } from '@/lib/utils';

interface AddStockModalProps {
  product: Product;
  onClose: () => void;
}

export function AddStockModal({ product, onClose }: AddStockModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const itemsPerPkg = product.items_per_package || 1;
  const packageUnitName = product.package_unit_name || 'box';
  const hasPackageSupport = itemsPerPkg > 1;

  const [addMode, setAddMode] = useState<'package' | 'pcs'>(hasPackageSupport ? 'package' : 'pcs');
  const [quantity, setQuantity] = useState<string>('1');
  
  const [updatePrice, setUpdatePrice] = useState<boolean>(false);
  const [newPackagePrice, setNewPackagePrice] = useState<string>(
    product.package_price !== undefined && product.package_price !== null ? String(product.package_price) : ''
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const numQty = parseInt(quantity, 10);
  const isValidQty = !isNaN(numQty) && numQty > 0;

  const addedPieces = isValidQty ? (addMode === 'package' ? numQty * itemsPerPkg : numQty) : 0;
  const newStock = product.current_stock + addedPieces;

  // New stock box breakdown calculation
  const newFullBoxes = itemsPerPkg > 1 ? Math.floor(newStock / itemsPerPkg) : 0;
  const newRemainder = itemsPerPkg > 1 ? newStock % itemsPerPkg : 0;

  let newBoxBreakdown = '';
  if (itemsPerPkg > 1) {
    if (newRemainder === 0) {
      newBoxBreakdown = `${newFullBoxes} ${packageUnitName}${newFullBoxes === 1 ? '' : 'es'}`;
    } else {
      newBoxBreakdown = `${newFullBoxes} ${packageUnitName}${newFullBoxes === 1 ? '' : 'es'}, ${newRemainder} pcs`;
    }
  }

  const numNewPrice = parseFloat(newPackagePrice);
  const isValidNewPrice = !isNaN(numNewPrice) && numNewPrice >= 0;
  const newUnitCost = (isValidNewPrice && itemsPerPkg > 0) ? (numNewPrice / itemsPerPkg) : product.unit_cost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidQty) {
      setError('Please enter a valid quantity');
      return;
    }

    if (updatePrice && !isValidNewPrice) {
      setError('Please enter a valid new package price');
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await addStock(
      product.id,
      numQty,
      addMode === 'package',
      updatePrice,
      updatePrice && isValidNewPrice ? numNewPrice : undefined
    );

    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Failed to update stock');
      setIsLoading(false);
    }
  };

  const InputStyle = "w-full h-[48px] px-4 bg-[#FAFAFA] border border-outline-variant/50 focus:border-[#D4A359] focus:bg-white rounded-[10px] outline-none transition-colors text-body-md";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div 
        ref={modalRef}
        className="bg-surface border border-outline-variant rounded-xl shadow-ambient w-full max-w-[460px] max-h-[90vh] overflow-y-auto flex flex-col"
      >
        <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between sticky top-0 bg-surface z-10">
          <div>
            <h2 className="text-headline-md font-headline-md">Add Stock</h2>
            <p className="text-body-sm text-on-surface-variant">{product.name}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-grow">
          {error && (
            <div className="bg-error-container/30 text-on-error-container px-4 py-3 rounded-lg text-label-md">
              {error}
            </div>
          )}

          {/* Current Stock Banner */}
          <div className="bg-surface-container p-3.5 rounded-lg flex justify-between items-center text-body-md">
            <span className="text-on-surface-variant">Current Stock:</span>
            <div className="text-right">
              <span className="font-semibold text-on-surface">{product.current_stock} pcs</span>
              {hasPackageSupport && (
                <span className="text-label-md text-on-surface-variant block">
                  ({Math.floor(product.current_stock / itemsPerPkg)} {packageUnitName}s
                  {product.current_stock % itemsPerPkg > 0 ? `, ${product.current_stock % itemsPerPkg} pcs` : ''})
                </span>
              )}
            </div>
          </div>

          {/* Add Mode Switch */}
          {hasPackageSupport && (
            <div className="space-y-2">
              <label className="block text-label-md text-on-surface-variant">Restock Unit</label>
              <div className="flex bg-[#F0EFEA] p-1 rounded-lg text-body-sm font-medium">
                <button
                  type="button"
                  onClick={() => setAddMode('package')}
                  className={`flex-1 py-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                    addMode === 'package' 
                      ? 'bg-primary-container text-on-primary shadow-sm font-semibold' 
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                  Add by {packageUnitName.charAt(0).toUpperCase() + packageUnitName.slice(1)} ({itemsPerPkg} pcs/{packageUnitName})
                </button>
                <button
                  type="button"
                  onClick={() => setAddMode('pcs')}
                  className={`flex-1 py-2 rounded-md transition-all ${
                    addMode === 'pcs' 
                      ? 'bg-white text-on-surface shadow-sm font-semibold' 
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Add by Pcs
                </button>
              </div>
            </div>
          )}

          {/* Quantity Input */}
          <div>
            <label htmlFor="quantity" className="block text-label-md text-on-surface-variant mb-1.5">
              Quantity to Add ({addMode === 'package' ? `${packageUnitName}s` : 'pcs'})
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={InputStyle}
              placeholder="e.g. 2"
            />
          </div>

          {/* Preview Banner */}
          {isValidQty && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3.5 rounded-lg text-body-sm space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-emerald-600">add_circle</span>
                Will add +{addedPieces} pcs to current stock
              </p>
              <p className="text-label-md text-emerald-800">
                New Total: <strong>{newStock} pcs</strong> {hasPackageSupport ? `(${newBoxBreakdown})` : ''}
              </p>
            </div>
          )}

          {/* Price Update Option */}
          {hasPackageSupport && (
            <div className="border-t border-outline-variant/60 pt-4 space-y-3">
              <label className="flex items-center gap-2.5 cursor-pointer text-body-md text-on-surface">
                <input
                  type="checkbox"
                  checked={updatePrice}
                  onChange={(e) => setUpdatePrice(e.target.checked)}
                  className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <span>Update purchase price for this item?</span>
              </label>

              {updatePrice && (
                <div className="space-y-3 animate-in fade-in duration-200 pt-1">
                  <div>
                    <label htmlFor="newPackagePrice" className="block text-label-md text-on-surface-variant mb-1.5">
                      New Package Price (₱)
                    </label>
                    <input
                      id="newPackagePrice"
                      type="number"
                      step="0.01"
                      min="0"
                      required={updatePrice}
                      value={newPackagePrice}
                      onChange={(e) => setNewPackagePrice(e.target.value)}
                      className={InputStyle}
                      placeholder="e.g. 1500.00"
                    />
                  </div>
                  {isValidNewPrice && (
                    <div className="text-label-md text-on-surface-variant bg-surface-container p-2.5 rounded-md">
                      Updated COGS: {formatCurrency(newUnitCost)} / pc
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="pt-3 flex justify-end gap-3 sticky bottom-0 bg-surface">
            <button 
              type="button" 
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container font-label-md transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isLoading || !isValidQty}
              className="px-5 py-2.5 bg-primary-container text-on-primary hover:bg-primary-container/90 rounded-lg font-label-md flex items-center gap-2 transition-colors disabled:opacity-70"
            >
              {isLoading && <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>}
              Confirm Restock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
