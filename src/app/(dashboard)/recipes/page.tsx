import { getProducts } from '@/app/(dashboard)/inventory/actions';
import { RecipeManager } from '@/components/recipes/recipe-manager';

export const revalidate = 0; // Dynamic server component

export default async function RecipesPage() {
  const { data: products, error } = await getProducts();

  if (error) {
    return (
      <div className="bg-error-container text-on-error-container p-4 rounded-xl">
        Error loading products: {error}
      </div>
    );
  }

  // Filter out inactive products and only include menu items
  const activeMenuItems = (products || []).filter(p => p.is_active && p.type === 'menu_item');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-display-sm font-display-sm">Recipe Manager</h1>
          <p className="text-body-lg text-on-surface-variant mt-1">
            Select a menu item to configure its raw ingredients
          </p>
        </div>
      </div>

      <RecipeManager products={activeMenuItems} />
    </div>
  );
}
