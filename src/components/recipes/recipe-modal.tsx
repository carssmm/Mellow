'use client';

import { useEffect, useRef } from 'react';
import { Product } from '@/types';
import { RecipeBuilder } from '@/components/inventory/recipe-builder';

interface RecipeModalProps {
  product: Product;
  onClose: () => void;
}

export function RecipeModal({ product, onClose }: RecipeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div 
        ref={modalRef}
        className="bg-surface border border-outline-variant rounded-xl shadow-ambient w-full max-w-[540px] max-h-[90vh] overflow-y-auto flex flex-col"
      >
        <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between sticky top-0 bg-surface z-10">
          <h2 className="text-headline-md font-headline-md">
            Recipe: {product.name}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="px-6 pb-6 pt-2">
          <RecipeBuilder menuProductId={product.id} />
        </div>
      </div>
    </div>
  );
}
