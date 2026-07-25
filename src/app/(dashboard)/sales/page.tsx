import { getProducts } from '@/app/(dashboard)/inventory/actions';
import { SalesLogger } from '@/components/sales/sales-logger';

export default async function SalesPage() {
  const { data: products, error } = await getProducts();

  if (error) {
    return (
      <div className="bg-error-container text-on-error-container p-4 rounded-xl">
        Error loading products: {error}
      </div>
    );
  }

  // Filter out inactive products and only include menu items for the sales logger
  const activeProducts = (products || []).filter(p => p.is_active && p.type === 'menu_item');

  return <SalesLogger products={activeProducts} />;
}
