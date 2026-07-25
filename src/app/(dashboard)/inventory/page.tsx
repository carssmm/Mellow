import { getProducts } from './actions';
import { InventoryTable } from '@/components/inventory/inventory-table';
import { RestockList } from '@/components/inventory/restock-list';
import { Suspense } from 'react';

export default async function InventoryPage() {
  const { data: products, error } = await getProducts();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-headline-lg font-headline-lg">Inventory & Automated Restock</h1>
          <p className="text-body-lg text-on-surface-variant mt-2 max-w-2xl">
            Manage your stock levels and view smart restock recommendations based on current inventory thresholds.
          </p>
        </div>
      </div>

      {error ? (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl">
          Error loading inventory: {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Inventory Table - Takes up 2/3 or full width on small screens */}
          <div className="lg:col-span-2">
            <InventoryTable products={products || []} />
          </div>
          
          {/* Smart Restock List - Takes up 1/3 width */}
          <div className="lg:col-span-1">
            <Suspense fallback={
              <div className="bg-surface-container border border-outline-variant rounded-xl p-6 h-full min-h-[400px] flex items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
              </div>
            }>
              <RestockList />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}
