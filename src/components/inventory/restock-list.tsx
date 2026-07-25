import { getLowStockProducts } from '@/app/(dashboard)/inventory/actions';
import { RestockClient } from './restock-client';
import { RestockItem } from '@/types';

export async function RestockList() {
  const { data: products, error } = await getLowStockProducts();

  if (error) {
    return (
      <div className="bg-surface-container border border-outline-variant rounded-xl p-6 h-full min-h-[400px] flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-secondary">shopping_cart</span>
          <h3 className="text-headline-md font-headline-md">Smart Restock</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-error">
          Failed to load restock data.
        </div>
      </div>
    );
  }

  // Calculate restock items
  const items: RestockItem[] = (products || []).map((product) => {
    const recommendedQty = Math.max(0, product.target_stock - product.current_stock);
    const estimatedCost = recommendedQty * product.unit_cost;
    
    return {
      productId: product.id,
      productName: product.name,
      currentStock: product.current_stock,
      targetStock: product.target_stock,
      recommendedQty,
      unitCost: product.unit_cost,
      estimatedCost,
      itemsPerPackage: product.items_per_package,
      packageUnitName: product.package_unit_name,
    };
  }).filter(item => item.recommendedQty > 0); // Only include items that actually need restocking

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-6 h-full min-h-[400px] flex flex-col">
      <div className="mb-4 pb-4 border-b border-outline-variant">
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-secondary">shopping_cart</span>
          <h3 className="text-headline-md font-headline-md">Smart Restock List</h3>
        </div>
        <p className="text-body-sm text-on-surface-variant">
          Auto-generated based on current stock levels falling below defined thresholds.
        </p>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <RestockClient items={items} />
      </div>
    </div>
  );
}
