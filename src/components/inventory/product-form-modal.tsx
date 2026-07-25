'use client';

import { useState, useRef, useEffect } from 'react';
import { Product } from '@/types';
import { createProduct, updateProduct } from '@/app/(dashboard)/inventory/actions';
import { formatCurrency } from '@/lib/utils';
import { RecipeBuilder } from './recipe-builder';
import { AddonManager } from './addon-manager';

interface ProductFormModalProps {
  mode: 'create' | 'edit';
  product?: Product;
  onClose: () => void;
}

export function ProductFormModal({ mode, product, onClose }: ProductFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [productType, setProductType] = useState<'menu_item' | 'raw_material'>(
    product?.type || 'menu_item'
  );

  // Costing mode state: 'per_piece' vs 'per_box'
  const [costingMode, setCostingMode] = useState<'per_piece' | 'per_box'>(
    product?.package_price && (product?.items_per_package || 0) > 1 ? 'per_box' : 'per_piece'
  );

  // Form field states
  const [sellingPrice, setSellingPrice] = useState<string>(
    product?.selling_price !== undefined && product?.selling_price !== null ? String(product.selling_price) : ''
  );
  const [packagePrice, setPackagePrice] = useState<string>(
    product?.package_price !== undefined && product?.package_price !== null ? String(product.package_price) : ''
  );
  const [itemsPerPkg, setItemsPerPkg] = useState<string>(
    product?.items_per_package ? String(product.items_per_package) : '50'
  );
  const [packageUnitName, setPackageUnitName] = useState<string>(
    product?.package_unit_name || 'box'
  );
  const [unitCost, setUnitCost] = useState<string>(
    product?.unit_cost !== undefined && product?.unit_cost !== null ? String(product.unit_cost) : ''
  );

  // Close on escape key or click outside
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

  // Calculations for Per Box mode
  const numPkgPrice = parseFloat(packagePrice);
  const numItemsPkg = parseInt(itemsPerPkg, 10);
  const isBoxValid = !isNaN(numPkgPrice) && numPkgPrice >= 0 && !isNaN(numItemsPkg) && numItemsPkg >= 1;
  const computedUnitCost = isBoxValid ? (numPkgPrice / numItemsPkg) : null;

  const numSellingPrice = parseFloat(sellingPrice);
  const hasSellingPrice = productType === 'menu_item' && !isNaN(numSellingPrice) && numSellingPrice >= 0;
  const profitPerPiece = (hasSellingPrice && computedUnitCost !== null) ? (numSellingPrice - computedUnitCost) : null;
  const marginPercent = (hasSellingPrice && numSellingPrice > 0 && profitPerPiece !== null) ? (profitPerPiece / numSellingPrice) * 100 : null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (costingMode === 'per_box' && (!isBoxValid || numItemsPkg < 1)) {
      setError('Items per package must be at least 1');
      setIsLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    if (mode === 'edit' && product) {
      formData.append('id', product.id);
    }
    formData.append('type', productType);

    if (productType === 'menu_item') {
      formData.set('selling_price', sellingPrice);
    }

    if (costingMode === 'per_box' && computedUnitCost !== null) {
      formData.set('unit_cost', computedUnitCost.toFixed(4));
      formData.set('package_price', numPkgPrice.toString());
      formData.set('items_per_package', numItemsPkg.toString());
      formData.set('package_unit_name', packageUnitName || 'box');
    } else {
      formData.delete('package_price');
      formData.set('items_per_package', '1');
      formData.set('package_unit_name', 'box');
      formData.set('unit_cost', unitCost || '0');
    }

    const action = mode === 'create' ? createProduct : updateProduct;
    const result = await action(formData);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Something went wrong');
      setIsLoading(false);
    }
  };

  const InputStyle = "w-full h-[48px] px-4 bg-[#FAFAFA] border border-outline-variant/50 focus:border-[#D4A359] focus:bg-white rounded-[10px] outline-none transition-colors text-body-md";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div 
        ref={modalRef}
        className="bg-surface border border-outline-variant rounded-xl shadow-ambient w-full max-w-[540px] max-h-[90vh] overflow-y-auto flex flex-col"
      >
        <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between sticky top-0 bg-surface z-10">
          <h2 className="text-headline-md font-headline-md">
            {mode === 'create' ? 'Add New Product' : 'Edit Product'}
          </h2>
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

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-label-md text-on-surface-variant mb-1.5">Product Type</label>
                <select 
                  id="type" 
                  name="type" 
                  required 
                  value={productType}
                  onChange={(e) => setProductType(e.target.value as 'menu_item' | 'raw_material')}
                  className={InputStyle}
                  disabled={mode === 'edit'}
                >
                  <option value="menu_item">Menu Item (Sold)</option>
                  <option value="raw_material">Raw Material (Stocked)</option>
                </select>
              </div>

              <div>
                <label htmlFor="category" className="block text-label-md text-on-surface-variant mb-1.5">Category</label>
                <select 
                  id="category" 
                  name="category" 
                  required 
                  defaultValue={product?.category || 'Coffee'}
                  className={InputStyle}
                >
                  <option value="Coffee">Coffee</option>
                  <option value="Non-Coffee">Non-Coffee</option>
                  <option value="Pastries">Pastries</option>
                  <option value="Beans">Beans</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-label-md text-on-surface-variant mb-1.5">Product Name</label>
              <input 
                id="name" 
                name="name" 
                type="text" 
                required 
                defaultValue={product?.name || ''}
                placeholder={productType === 'menu_item' ? "e.g., Spanish Latte" : "e.g., Oat Milk 1L"} 
                className={InputStyle} 
              />
            </div>

            {/* Costing & Pricing Mode Selector */}
            <div className="border border-outline-variant/60 rounded-xl p-4 bg-surface-container-lowest space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-label-md font-semibold text-on-surface">Unit Option</span>
                
                {/* Segmented Mode Switch */}
                <div className="flex bg-[#F0EFEA] p-1 rounded-lg text-body-sm font-medium">
                  <button
                    type="button"
                    onClick={() => setCostingMode('per_piece')}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      costingMode === 'per_piece' 
                        ? 'bg-white text-on-surface shadow-sm font-semibold' 
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Per Piece
                  </button>
                  <button
                    type="button"
                    onClick={() => setCostingMode('per_box')}
                    className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                      costingMode === 'per_box' 
                        ? 'bg-primary-container text-on-primary shadow-sm font-semibold' 
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                    Per Box / Bulk
                  </button>
                </div>
              </div>

              {costingMode === 'per_piece' ? (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-4">
                    {productType === 'menu_item' && (
                      <div>
                        <label htmlFor="selling_price_piece" className="block text-label-md text-on-surface-variant mb-1.5">
                          Selling Price per Piece (₱)
                        </label>
                        <input 
                          id="selling_price_piece" 
                          type="number" 
                          step="0.01" 
                          min="0"
                          required={productType === 'menu_item'}
                          value={sellingPrice}
                          onChange={(e) => setSellingPrice(e.target.value)}
                          placeholder="0.00" 
                          className={InputStyle} 
                        />
                      </div>
                    )}
                    
                    <div className={productType === 'raw_material' ? "col-span-2" : ""}>
                      <label htmlFor="unit_cost" className="block text-label-md text-on-surface-variant mb-1.5">
                        {productType === 'menu_item' ? 'Cost per Piece (₱)' : 'Cost per Unit / Liter (₱)'}
                      </label>
                      <input 
                        id="unit_cost" 
                        name="unit_cost" 
                        type="number" 
                        step="0.01" 
                        min="0"
                        required={costingMode === 'per_piece'}
                        value={unitCost}
                        onChange={(e) => setUnitCost(e.target.value)}
                        placeholder="0.00" 
                        className={InputStyle} 
                      />
                    </div>
                  </div>

                  {productType === 'raw_material' && (
                    <div className="bg-primary-container/10 border border-primary-container/40 p-3 rounded-lg text-xs text-on-surface space-y-1">
                      <div className="font-bold flex items-center gap-1 text-primary">
                        <span className="material-symbols-outlined text-[16px]">info</span>
                        <span>Liquid / Grams Portion Tip:</span>
                      </div>
                      <p className="text-on-surface-variant">
                        Set <strong>Cost per Unit</strong> to your bottle/carton price (e.g. ₱90 per 1L Milk). In your drink recipe, add <strong>0.02</strong> (for 20ml). Mellow will deduct <strong>0.02</strong> per sale without removing a whole bottle!
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Two Pricing Inputs: Box Purchase Price & Piece Selling Price */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="package_price" className="block text-label-md text-on-surface-variant mb-1.5">
                        Box Purchase Price (₱)
                      </label>
                      <input 
                        id="package_price" 
                        name="package_price" 
                        type="number" 
                        step="0.01" 
                        min="0"
                        required={costingMode === 'per_box'}
                        value={packagePrice}
                        onChange={(e) => setPackagePrice(e.target.value)}
                        placeholder="e.g. 1500.00" 
                        className={InputStyle} 
                      />
                    </div>

                    {productType === 'menu_item' ? (
                      <div>
                        <label htmlFor="selling_price_box" className="block text-label-md text-on-surface-variant mb-1.5">
                          Selling Price per Piece (₱)
                        </label>
                        <input 
                          id="selling_price_box" 
                          type="number" 
                          step="0.01" 
                          min="0"
                          required={productType === 'menu_item'}
                          value={sellingPrice}
                          onChange={(e) => setSellingPrice(e.target.value)}
                          placeholder="e.g. 45.00" 
                          className={InputStyle} 
                        />
                      </div>
                    ) : (
                      <div>
                        <label htmlFor="items_per_package" className="block text-label-md text-on-surface-variant mb-1.5">
                          Items per Box (pcs)
                        </label>
                        <input 
                          id="items_per_package" 
                          name="items_per_package" 
                          type="number" 
                          min="1"
                          required={costingMode === 'per_box'}
                          value={itemsPerPkg}
                          onChange={(e) => setItemsPerPkg(e.target.value)}
                          placeholder="e.g. 50" 
                          className={InputStyle} 
                        />
                      </div>
                    )}
                  </div>

                  {productType === 'menu_item' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="items_per_package" className="block text-label-md text-on-surface-variant mb-1.5">
                          Items per Box (pcs)
                        </label>
                        <input 
                          id="items_per_package" 
                          name="items_per_package" 
                          type="number" 
                          min="1"
                          required={costingMode === 'per_box'}
                          value={itemsPerPkg}
                          onChange={(e) => setItemsPerPkg(e.target.value)}
                          placeholder="e.g. 50" 
                          className={InputStyle} 
                        />
                      </div>
                      <div>
                        <label htmlFor="package_unit_name" className="block text-label-md text-on-surface-variant mb-1.5">
                          Package Label
                        </label>
                        <select
                          id="package_unit_name"
                          name="package_unit_name"
                          value={packageUnitName}
                          onChange={(e) => setPackageUnitName(e.target.value)}
                          className={InputStyle}
                        >
                          <option value="box">Box</option>
                          <option value="pack">Pack</option>
                          <option value="case">Case</option>
                          <option value="bag">Bag</option>
                          <option value="carton">Carton</option>
                          <option value="bottle">Bottle</option>
                          <option value="gallon">Gallon</option>
                          <option value="can">Can</option>
                          <option value="jar">Jar</option>
                          <option value="pail">Pail</option>
                          <option value="kg">Kilogram (kg)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {productType === 'raw_material' && (
                    <div>
                      <label htmlFor="package_unit_name" className="block text-label-md text-on-surface-variant mb-1.5">
                        Bulk Container Unit
                      </label>
                      <select
                        id="package_unit_name"
                        name="package_unit_name"
                        value={packageUnitName}
                        onChange={(e) => setPackageUnitName(e.target.value)}
                        className={InputStyle}
                      >
                        <option value="box">Box</option>
                        <option value="pack">Pack</option>
                        <option value="case">Case</option>
                        <option value="bag">Bag</option>
                        <option value="carton">Carton</option>
                        <option value="bottle">Bottle</option>
                        <option value="gallon">Gallon</option>
                        <option value="can">Can</option>
                        <option value="jar">Jar</option>
                        <option value="pail">Pail</option>
                        <option value="kg">Kilogram (kg)</option>
                      </select>
                    </div>
                  )}

                  {/* Live Breakdown Banner */}
                  {numItemsPkg < 1 && itemsPerPkg !== '' ? (
                    <div className="bg-error-container/20 border border-error/30 text-error p-3 rounded-lg text-body-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">warning</span>
                      Items per package must be at least 1
                    </div>
                  ) : isBoxValid && computedUnitCost !== null ? (
                    <div className="bg-primary-container/20 border border-primary-container/60 p-4 rounded-xl text-body-sm text-on-surface space-y-2">
                      <div className="flex items-center justify-between font-semibold border-b border-primary-container/40 pb-2">
                        <span>Calculated Cost per Piece:</span>
                        <span className="text-headline-sm font-headline-sm text-primary">
                          {formatCurrency(computedUnitCost)} / pc
                        </span>
                      </div>
                      <div className="text-label-md text-on-surface-variant flex justify-between">
                        <span>Box Purchase Price:</span>
                        <span className="font-semibold">{formatCurrency(numPkgPrice)} ({numItemsPkg} pcs)</span>
                      </div>
                      {hasSellingPrice && (
                        <div className="text-label-md text-on-surface-variant flex justify-between border-t border-primary-container/30 pt-2">
                          <span>Selling Price per Piece:</span>
                          <span className="font-semibold text-on-surface">{formatCurrency(numSellingPrice)}</span>
                        </div>
                      )}
                      {hasSellingPrice && profitPerPiece !== null && (
                        <div className="text-label-md flex justify-between text-emerald-700 font-semibold">
                          <span>Profit per Piece:</span>
                          <span>{formatCurrency(profitPerPiece)} ({marginPercent?.toFixed(1)}% margin)</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-surface-container p-3 rounded-lg text-body-sm text-on-surface-variant text-center">
                      Enter box purchase price and pieces to calculate per-piece cost and profit.
                    </div>
                  )}
                </div>
              )}
            </div>

            {productType === 'raw_material' && (
              <div className="grid grid-cols-3 gap-4 animate-in fade-in duration-200">
                <div>
                  <label htmlFor="current_stock" className="block text-label-md text-on-surface-variant mb-1.5">Current Stock (pcs)</label>
                  <input 
                    id="current_stock" 
                    name="current_stock" 
                    type="number" 
                    min="0"
                    required={productType === 'raw_material'}
                    defaultValue={product?.current_stock ?? 0}
                    className={InputStyle} 
                  />
                </div>
                <div>
                  <label htmlFor="low_stock_threshold" className="block text-label-md text-on-surface-variant mb-1.5">Threshold (pcs)</label>
                  <input 
                    id="low_stock_threshold" 
                    name="low_stock_threshold" 
                    type="number" 
                    min="0"
                    required={productType === 'raw_material'}
                    defaultValue={product?.low_stock_threshold ?? 5}
                    className={InputStyle} 
                  />
                </div>
                <div>
                  <label htmlFor="target_stock" className="block text-label-md text-on-surface-variant mb-1.5">Target (pcs)</label>
                  <input 
                    id="target_stock" 
                    name="target_stock" 
                    type="number" 
                    min="0"
                    required={productType === 'raw_material'}
                    defaultValue={product?.target_stock ?? 20}
                    className={InputStyle} 
                  />
                </div>
              </div>
            )}

            {productType === 'menu_item' && mode === 'edit' && product?.id && (
              <>
                <RecipeBuilder menuProductId={product.id} />
                <AddonManager productId={product.id} />
              </>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-surface">
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
              disabled={isLoading}
              className="px-5 py-2.5 bg-primary-container text-on-primary hover:bg-primary-container/90 rounded-lg font-label-md flex items-center gap-2 transition-colors disabled:opacity-70"
            >
              {isLoading && <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>}
              {mode === 'create' ? 'Save Product' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
