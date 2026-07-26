'use client';

import { useState, useEffect } from 'react';
import { Product, Recipe } from '@/types';
import { getRecipeForMenuProduct, saveRecipeItem, deleteRecipeItem, getProducts } from '@/app/(dashboard)/inventory/actions';

interface RecipeBuilderProps {
  menuProductId: string;
}

export function RecipeBuilder({ menuProductId }: RecipeBuilderProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New ingredient form
  const [selectedRawId, setSelectedRawId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unitName, setUnitName] = useState('g');

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    const [recipeRes, productsRes] = await Promise.all([
      getRecipeForMenuProduct(menuProductId),
      getProducts(),
    ]);

    if (recipeRes.error) setError(recipeRes.error);
    else setRecipes((recipeRes.data as unknown as Recipe[]) || []);

    if (productsRes.data) {
      setRawProducts(productsRes.data.filter(p => p.type === 'raw_material'));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (menuProductId) {
      loadData();
    }
  }, [menuProductId]);

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRawId || !quantity || Number(quantity) <= 0) return;

    setIsAdding(true);
    const res = await saveRecipeItem(menuProductId, selectedRawId, Number(quantity), unitName);
    setIsAdding(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSelectedRawId('');
      setQuantity('1');
      loadData();
    }
  };

  const handleDelete = async (recipeId: string) => {
    const res = await deleteRecipeItem(recipeId);
    if (res.error) {
      setError(res.error);
    } else {
      loadData();
    }
  };

  if (isLoading) {
    return <div className="text-body-sm text-on-surface-variant py-4">Loading recipe ingredients...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">blender</span>
          <h4 className="font-semibold text-body-lg text-on-surface">Recipe Ingredients</h4>
        </div>
        <span className="text-xs text-on-surface-variant font-medium">Auto-deducts on sale</span>
      </div>

      {error && (
        <div className="p-2.5 mb-3 bg-error-container/20 border border-error/30 text-error rounded-lg text-xs">
          {error}
        </div>
      )}

      {/* Ingredient List */}
      {recipes.length === 0 ? (
        <div className="p-4 text-center text-xs text-on-surface-variant bg-surface-container/30 rounded-lg mb-4">
          No raw ingredients linked to this menu item yet. Add one below!
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          {recipes.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2.5 bg-surface-container border border-outline-variant/40 rounded-lg text-body-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">inventory_2</span>
                <span className="font-semibold text-on-surface">{item.raw_product?.name || 'Raw Ingredient'}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono bg-surface-container-high px-2 py-0.5 rounded text-xs font-bold text-primary">
                  {item.quantity_required} {item.unit_name || 'pcs'}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="text-on-surface-variant hover:text-error transition-colors p-1"
                  title="Remove ingredient"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Form */}
      <form onSubmit={handleAddIngredient} className="bg-surface-container-lowest border border-outline-variant/50 p-3 rounded-lg flex flex-col gap-2">
        <div className="text-xs font-semibold text-on-surface-variant">Add Raw Ingredient to Recipe</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <select
            value={selectedRawId}
            onChange={(e) => setSelectedRawId(e.target.value)}
            className="h-9 px-2 bg-white border border-outline-variant rounded-md text-xs outline-none focus:border-primary"
            required
          >
            <option value="">-- Select Raw Ingredient --</option>
            {rawProducts.map(p => (
              <option key={p.id} value={p.id}>{p.name} (Stock: {p.current_stock} pcs)</option>
            ))}
          </select>

          <input
            type="number"
            step="any"
            min="0.0001"
            placeholder="Qty req."
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="h-9 px-2 bg-white border border-outline-variant rounded-md text-xs outline-none focus:border-primary font-mono"
            required
          />

          <select
            value={unitName}
            onChange={(e) => setUnitName(e.target.value)}
            className="h-9 px-2 bg-white border border-outline-variant rounded-md text-xs outline-none focus:border-primary font-semibold"
          >
            <option value="ml">ml (Milliliters)</option>
            <option value="g">g (Grams)</option>
            <option value="pcs">pcs (Pieces)</option>
            <option value="oz">oz (Ounces)</option>
            <option value="tbsp">tbsp (Tablespoon)</option>
            <option value="tsp">tsp (Teaspoon)</option>
            <option value="pumps">pumps (Syrup Pump)</option>
            <option value="scoops">scoops (Powder Scoop)</option>
            <option value="slices">slices</option>
            <option value="shots">shots</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isAdding || !selectedRawId}
          className="h-8 mt-1 px-3 bg-secondary-container hover:bg-secondary-container/80 text-on-secondary-container rounded-md text-xs font-semibold flex items-center justify-center gap-1 transition-colors self-end disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>{isAdding ? 'Saving...' : 'Add Ingredient'}</span>
        </button>
      </form>
    </div>
  );
}
