'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { formatCurrency, getStockStatus, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ProductFormModal } from './product-form-modal';
import { DeleteConfirmation } from './delete-confirmation';
import { AddStockModal } from './add-stock-modal';

export function InventoryTable({ products }: { products: Product[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'raw_material' | 'menu_item'>('all');
  
  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || 
      (typeFilter === 'raw_material' ? (product.type === 'raw_material' || !product.type) : product.type === 'menu_item');

    return matchesSearch && matchesType;
  });

  // Handlers
  const handleAddClick = () => {
    setFormMode('create');
    setSelectedProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setFormMode('edit');
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const handleAddStockClick = (product: Product) => {
    setSelectedProduct(product);
    setIsAddStockOpen(true);
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-ambient overflow-hidden flex flex-col">
      {/* Header & Search */}
      <div className="p-6 border-b border-outline-variant flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-headline-md font-headline-md">Current Inventory</h2>
            <p className="text-label-md text-on-surface-variant mt-1">
              {filteredProducts.length} of {products.length} items shown
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-[240px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-[#FAFAFA] border border-outline-variant/50 focus:border-[#D4A359] focus:bg-white rounded-lg outline-none transition-colors text-body-md"
              />
            </div>
            <button
              onClick={handleAddClick}
              className="h-10 px-4 bg-primary-container hover:bg-primary-container/90 text-on-primary rounded-lg font-label-md flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-t border-outline-variant/40 pt-3 overflow-x-auto">
          <button
            onClick={() => setTypeFilter('all')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-label-md font-medium transition-colors whitespace-nowrap",
              typeFilter === 'all'
                ? "bg-primary-container text-on-primary"
                : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
            )}
          >
            All Items ({products.length})
          </button>
          <button
            onClick={() => setTypeFilter('raw_material')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-label-md font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap",
              typeFilter === 'raw_material'
                ? "bg-secondary-container text-on-secondary-container font-bold"
                : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
            )}
          >
            <span className="material-symbols-outlined text-[16px]">inventory_2</span>
            Raw Products ({products.filter(p => p.type === 'raw_material' || !p.type).length})
          </button>
          <button
            onClick={() => setTypeFilter('menu_item')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-label-md font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap",
              typeFilter === 'menu_item'
                ? "bg-primary-container text-on-primary font-bold"
                : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
            )}
          >
            <span className="material-symbols-outlined text-[16px]">local_cafe</span>
            Menu Items ({products.filter(p => p.type === 'menu_item').length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-lowest border-b border-outline-variant text-label-md text-on-surface-variant uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Item</th>
              <th className="px-6 py-4 font-semibold text-right">Price</th>
              <th className="px-6 py-4 font-semibold text-right">Unit Cost</th>
              <th className="px-6 py-4 font-semibold text-right">Stock Level</th>
              <th className="px-6 py-4 font-semibold text-right">Threshold</th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/50">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant">
                  {products.length === 0 ? "No products found. Add your first product!" : "No products match your search."}
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const isMenuItem = product.type === 'menu_item';
                const status = isMenuItem 
                  ? 'default' 
                  : getStockStatus(product.current_stock, product.low_stock_threshold);

                const itemsPerPkg = product.items_per_package || 1;
                const pkgName = product.package_unit_name || 'box';
                const hasPackages = itemsPerPkg > 1;

                let packageSubtext = '';
                if (hasPackages && product.current_stock >= 0) {
                  const boxes = Math.floor(product.current_stock / itemsPerPkg);
                  const remainder = product.current_stock % itemsPerPkg;
                  if (remainder === 0) {
                    packageSubtext = `(${boxes} ${pkgName}${boxes === 1 ? '' : 'es'})`;
                  } else {
                    packageSubtext = `(${boxes} ${pkgName}${boxes === 1 ? '' : 'es'}, ${remainder} pcs)`;
                  }
                }
                
                return (
                  <tr key={product.id} className="hover:bg-surface-container-lowest/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
                          <span className="material-symbols-outlined text-[20px]">
                            {isMenuItem ? 'local_cafe' : 'inventory_2'}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-on-surface flex items-center gap-2">
                            {product.name}
                            <span className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase",
                              isMenuItem ? "bg-primary-container/20 text-primary" : "bg-secondary-container/20 text-on-secondary-container"
                            )}>
                              {isMenuItem ? 'Menu' : 'Raw'}
                            </span>
                          </div>
                          <div className="text-label-md text-on-surface-variant">{product.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-number-data text-on-surface">
                      {isMenuItem ? formatCurrency(product.selling_price) : '-'}
                    </td>
                    <td className="px-6 py-4 text-right font-number-data text-on-surface-variant">
                      <div>{formatCurrency(product.unit_cost)}</div>
                      {product.package_price && (product.items_per_package || 1) > 1 && (
                        <div className="text-[11px] text-on-surface-variant/70">
                          ({formatCurrency(product.package_price)}/{product.package_unit_name || 'box'})
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-number-data">
                      {isMenuItem ? (
                        <span className="text-on-surface-variant/50">-</span>
                      ) : (
                        <div>
                          <span className={cn(
                            status === 'out_of_stock' ? "text-error font-bold" :
                            status === 'low_stock' ? "text-amber-600 font-bold" :
                            "text-on-surface font-semibold"
                          )}>
                            {product.current_stock} pcs
                          </span>
                          {packageSubtext && (
                            <div className="text-label-md text-on-surface-variant font-normal">
                              {packageSubtext}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-number-data text-on-surface-variant">
                      {isMenuItem ? '-' : `${product.low_stock_threshold} pcs`}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={status}>
                        {isMenuItem ? 'No Stock Track' :
                         status === 'in_stock' ? 'In Stock' :
                         status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        {!isMenuItem && (
                          <button
                            onClick={() => handleAddStockClick(product)}
                            className="px-2.5 py-1.5 bg-surface-container hover:bg-primary-container hover:text-on-primary text-on-surface rounded-md text-label-md flex items-center gap-1 transition-colors shadow-sm md:shadow-none"
                            title="Add Stock"
                          >
                            <span className="material-symbols-outlined text-[16px]">add_box</span>
                            <span className="text-xs font-semibold">+ Stock</span>
                          </button>
                        )}
                        <button 
                          onClick={() => handleEditClick(product)}
                          className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container bg-surface-container/50 md:bg-transparent rounded-md transition-colors"
                          title="Edit Product"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(product)}
                          className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/30 bg-surface-container/50 md:bg-transparent rounded-md transition-colors"
                          title="Delete Product"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {isFormOpen && (
        <ProductFormModal 
          mode={formMode}
          product={selectedProduct}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {isDeleteOpen && selectedProduct && (
        <DeleteConfirmation
          product={selectedProduct}
          onClose={() => setIsDeleteOpen(false)}
        />
      )}

      {isAddStockOpen && selectedProduct && (
        <AddStockModal
          product={selectedProduct}
          onClose={() => setIsAddStockOpen(false)}
        />
      )}
    </div>
  );
}
