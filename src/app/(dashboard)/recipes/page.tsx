import { getProducts } from '@/app/(dashboard)/inventory/actions';
import { RecipeGrid } from '@/components/recipes/recipe-grid';

export default async function RecipesPage() {
  const { data: products, error } = await getProducts();

  if (error) {
    return (
      <div className="bg-error-container text-on-error-container p-4 rounded-xl">
        Error loading products: {error}
      </div>
    );
  }

  // Only include active menu items for the recipe grid
  const menuItems = (products || []).filter(p => p.is_active && p.type === 'menu_item');

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-headline-lg font-headline-lg">Recipe Management</h1>
        <p className="text-body-lg text-on-surface-variant mt-2 max-w-2xl">
          Tap a menu item below to manage its ingredients and auto-deduction recipe.
        </p>
      </div>

      <RecipeGrid products={menuItems} />
    </div>
  );
}
