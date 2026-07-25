'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { deleteProduct } from '@/app/(dashboard)/inventory/actions';

interface DeleteConfirmationProps {
  product: Product;
  onClose: () => void;
}

export function DeleteConfirmation({ product, onClose }: DeleteConfirmationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    const result = await deleteProduct(product.id);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Failed to delete product');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-surface border border-outline-variant rounded-xl shadow-ambient w-full max-w-[400px] overflow-hidden">
        <div className="p-6">
          <div className="w-12 h-12 bg-error-container/30 text-error rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined">warning</span>
          </div>
          
          <h3 className="text-headline-md font-headline-md mb-2">Delete Product</h3>
          <p className="text-body-md text-on-surface-variant mb-1">
            Are you sure you want to delete <span className="font-semibold text-on-surface">{product.name}</span>?
          </p>
          <p className="text-label-md text-error/80 bg-error-container/10 p-3 rounded-lg mt-3 border border-error-container/30">
            This cannot be undone. Products with existing sales records cannot be deleted to preserve history.
          </p>

          {error && (
            <div className="mt-4 text-error text-label-md bg-error-container/20 p-2 rounded">
              {error}
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-surface-container-lowest border-t border-outline-variant flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container font-label-md transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleDelete}
            disabled={isLoading}
            className="px-4 py-2 bg-error text-on-error hover:bg-error/90 rounded-lg font-label-md flex items-center gap-2 transition-colors disabled:opacity-70"
          >
            {isLoading && <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
