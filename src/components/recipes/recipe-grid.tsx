'use client';

import { useState, useMemo } from 'react';
import { Product } from '@/types';
import { RecipeModal } from './recipe-modal';

interface RecipeGridProps {
  products: Product[];
}

export function RecipeGrid({ products }: RecipeGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['All', ...Array.from(cats).sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <div className="space-y-6">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-label-md transition-colors ${
              activeCategory === cat 
                ? 'bg-primary text-on-primary' 
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {filteredProducts.map((product) => (
          <button
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            className="flex flex-col h-full bg-surface-container-lowest border border-outline-variant hover:border-primary/50 hover:shadow-md rounded-xl p-3 sm:p-4 text-left transition-all group active:scale-95"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-container/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary-container transition-colors">
              <span className="material-symbols-outlined text-[20px] sm:text-[24px] text-primary group-hover:text-on-primary transition-colors">
                blender
              </span>
            </div>
            
            <div className="flex-grow">
              <h3 className="font-semibold text-body-md text-on-surface line-clamp-2 leading-snug">
                {product.name}
              </h3>
            </div>
          </button>
        ))}
        
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-12 text-center text-on-surface-variant bg-surface-container/30 rounded-xl border border-dashed border-outline-variant">
            No menu items found in this category.
          </div>
        )}
      </div>

      {selectedProduct && (
        <RecipeModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
