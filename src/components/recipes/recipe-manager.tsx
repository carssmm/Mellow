'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { RecipeBuilder } from '@/components/inventory/recipe-builder';

export function RecipeManager({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))].sort();

  // Filter products
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="flex flex-col gap-6">
      {/* Category Chips */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-1.5 rounded-full text-label-md font-label-md transition-colors",
              activeCategory === cat 
                ? "bg-primary-container text-on-primary"
                : "bg-surface-container-high text-on-surface-variant border border-outline-variant hover:bg-surface-variant"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map(product => {
          return (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="bg-surface rounded-xl border border-outline-variant p-4 shadow-soft h-48 flex flex-col justify-between group transition-transform select-none cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              {/* Category Badge */}
              <div className="self-start bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded text-xs font-semibold">
                {product.category}
              </div>

              {/* Name */}
              <div className="text-headline-md font-headline-md mt-auto mb-2 line-clamp-2 transition-colors group-hover:text-secondary">
                {product.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recipe Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface border border-outline-variant rounded-xl shadow-ambient w-full max-w-[540px] max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between sticky top-0 bg-surface z-10">
              <div>
                <h2 className="text-headline-md font-headline-md">{selectedProduct.name} Recipe</h2>
                <p className="text-body-sm text-on-surface-variant">Configure raw ingredients for this menu item.</p>
              </div>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors self-start"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-6">
              <RecipeBuilder menuProductId={selectedProduct.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
