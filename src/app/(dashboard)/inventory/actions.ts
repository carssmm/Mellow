'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient, getAuthenticatedUser } from '@/lib/supabase/server';
import { createProductSchema, updateProductSchema, deleteProductSchema, addStockSchema } from '@/lib/validations';
import { Product } from '@/types';

export async function getProducts(): Promise<{ data: Product[] | null; error: string | null }> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { data: null, error: 'Unauthorized' };

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id)
      .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch products' };
  }
}

export async function getProductsByCategory(category: string): Promise<{ data: Product[] | null; error: string | null }> {
  if (!category || category === 'All') return getProducts();

  try {
    const user = await getAuthenticatedUser();
    if (!user) return { data: null, error: 'Unauthorized' };

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id)
      .eq('category', category)
      .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch products by category' };
  }
}

export async function createProduct(formData: FormData): Promise<{ success: boolean; error: string | null }> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const inputData = {
      name: formData.get('name'),
      category: formData.get('category'),
      selling_price: formData.get('selling_price') || undefined,
      unit_cost: formData.get('unit_cost'),
      current_stock: formData.get('current_stock') || undefined,
      low_stock_threshold: formData.get('low_stock_threshold') || undefined,
      target_stock: formData.get('target_stock') || undefined,
      type: formData.get('type') || undefined,
      package_price: formData.get('package_price') || undefined,
      items_per_package: formData.get('items_per_package') || undefined,
      package_unit_name: formData.get('package_unit_name') || undefined,
      unit_name: formData.get('unit_name') || undefined,
    };

    const validatedData = createProductSchema.parse(inputData);

    // Business rule: If package_price and items_per_package are provided, compute unit_cost automatically
    if (validatedData.package_price !== null && validatedData.package_price !== undefined && validatedData.items_per_package && validatedData.items_per_package > 0) {
      validatedData.unit_cost = Number((validatedData.package_price / validatedData.items_per_package).toFixed(4));
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('products').insert({
      ...validatedData,
      user_id: user.id,
    });

    if (error) throw new Error(error.message);

    revalidatePath('/inventory');
    return { success: true, error: null };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'ZodError') {
      // @ts-expect-error ZodError shape is known but we are not importing it to check instanceof fully
      return { success: false, error: err.errors?.map((e: { message: string }) => e.message).join(', ') };
    }
    return { success: false, error: err instanceof Error ? err.message : 'Failed to create product' };
  }
}

export async function updateProduct(formData: FormData): Promise<{ success: boolean; error: string | null }> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const inputData = {
      id: formData.get('id'),
      name: formData.get('name') || undefined,
      category: formData.get('category') || undefined,
      selling_price: formData.get('selling_price') || undefined,
      unit_cost: formData.get('unit_cost') || undefined,
      current_stock: formData.get('current_stock') || undefined,
      low_stock_threshold: formData.get('low_stock_threshold') || undefined,
      target_stock: formData.get('target_stock') || undefined,
      type: formData.get('type') || undefined,
      package_price: formData.get('package_price') !== null ? formData.get('package_price') : undefined,
      items_per_package: formData.get('items_per_package') || undefined,
      package_unit_name: formData.get('package_unit_name') || undefined,
      unit_name: formData.get('unit_name') || undefined,
    };

    const validatedData = updateProductSchema.parse(inputData);
    const { id, ...updateData } = validatedData;

    // Business rule: If package_price and items_per_package are provided, compute unit_cost automatically
    if (updateData.package_price !== null && updateData.package_price !== undefined && updateData.items_per_package && updateData.items_per_package > 0) {
      updateData.unit_cost = Number((updateData.package_price / updateData.items_per_package).toFixed(4));
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw new Error(error.message);

    revalidatePath('/inventory');
    return { success: true, error: null };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'ZodError') {
      // @ts-expect-error ZodError shape
      return { success: false, error: err.errors?.map((e: { message: string }) => e.message).join(', ') };
    }
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update product' };
  }
}

export async function deleteProduct(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const { id: validId } = deleteProductSchema.parse({ id });

    const supabase = await createSupabaseServerClient();
    
    // RLS handles user isolation, but explicitly checking user_id adds safety
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', validId)
      .eq('user_id', user.id);

    if (error) throw new Error(error.message);

    revalidatePath('/inventory');
    return { success: true, error: null };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'ZodError') {
      return { success: false, error: 'Invalid product ID' };
    }
    // E.g. foreign key constraint violation (linked to sales items)
    if (err instanceof Error && err.message?.includes('violates foreign key constraint')) {
      return { success: false, error: 'Cannot delete product that has existing sales records.' };
    }
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete product' };
  }
}

export async function getProductCategories(): Promise<{ data: string[] | null; error: string | null }> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { data: null, error: 'Unauthorized' };

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .eq('user_id', user.id);

    if (error) throw new Error(error.message);
    
    const uniqueCategories = Array.from(new Set((data || []).map(row => row.category))).sort();
    return { data: uniqueCategories, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch categories' };
  }
}

export async function getLowStockProducts(): Promise<{ data: Product[] | null; error: string | null }> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { data: null, error: 'Unauthorized' };

    const supabase = await createSupabaseServerClient();
    // In Supabase, you can't easily do a generic column-to-column comparison (current_stock <= low_stock_threshold) directly 
    // with the basic filter builder (.lte('current_stock', 'low_stock_threshold') compares with the string).
    // We would need to use RPC or we can fetch and filter on the server.
    // For MVP scale, fetching and filtering is fine, or we can use the raw RPC if created.
    // Actually, Supabase supports raw queries via rpc, but let's fetch and filter for simplicity for now.
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw new Error(error.message);

    const lowStockData = (data as Product[])
      .filter(p => (p.type === 'raw_material' || !p.type) && p.current_stock <= p.low_stock_threshold)
      .sort((a, b) => a.current_stock - b.current_stock);
      
    return { data: lowStockData, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch low stock products' };
  }
}

export async function addStock(
  productId: string,
  quantity: number,
  isPackage: boolean = false,
  updatePackagePrice: boolean = false,
  newPackagePrice?: number | null
): Promise<{ success: boolean; error: string | null }> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const validated = addStockSchema.parse({
      product_id: productId,
      quantity,
      is_package: isPackage,
      update_package_price: updatePackagePrice,
      new_package_price: newPackagePrice,
    });

    const supabase = await createSupabaseServerClient();
    
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', validated.product_id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !product) {
      return { success: false, error: 'Product not found' };
    }

    const itemsPerPkg = product.items_per_package || 1;
    const addedPieces = validated.is_package ? validated.quantity * itemsPerPkg : validated.quantity;
    const updatedStock = (product.current_stock || 0) + addedPieces;

    const updates: Record<string, unknown> = {
      current_stock: updatedStock,
    };

    if (validated.update_package_price && validated.new_package_price !== undefined && validated.new_package_price !== null) {
      updates.package_price = validated.new_package_price;
      if (itemsPerPkg > 0) {
        updates.unit_cost = Number((validated.new_package_price / itemsPerPkg).toFixed(4));
      }
    }

    const { error: updateError } = await supabase
      .from('products')
      .update(updates)
      .eq('id', validated.product_id)
      .eq('user_id', user.id);

    if (updateError) throw new Error(updateError.message);

    revalidatePath('/inventory');
    return { success: true, error: null };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'ZodError') {
      return { success: false, error: 'Invalid stock addition input' };
    }
    return { success: false, error: err instanceof Error ? err.message : 'Failed to add stock' };
  }
}

export async function getRecipeForMenuProduct(menuProductId: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { data: null, error: 'Unauthorized' };

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('recipes')
      .select('*, raw_product:products!recipes_raw_product_id_fkey(*)')
      .eq('menu_product_id', menuProductId)
      .eq('user_id', user.id);

    if (error) throw new Error(error.message);
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch recipe' };
  }
}

export async function saveRecipeItem(
  menuProductId: string,
  rawProductId: string,
  quantityRequired: number,
  unitName?: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from('recipes')
      .upsert({
        user_id: user.id,
        menu_product_id: menuProductId,
        raw_product_id: rawProductId,
        quantity_required: quantityRequired,
        unit_name: unitName || 'pcs',
      }, { onConflict: 'menu_product_id,raw_product_id' });

    if (error) throw new Error(error.message);
    revalidatePath('/inventory');
    return { success: true, error: null };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to save recipe item' };
  }
}

export async function deleteRecipeItem(recipeId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', recipeId)
      .eq('user_id', user.id);

    if (error) throw new Error(error.message);
    revalidatePath('/inventory');
    return { success: true, error: null };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete recipe item' };
  }
}

export async function getProductAddons(productId?: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { data: null, error: 'Unauthorized' };

    const supabase = await createSupabaseServerClient();
    let query = supabase.from('product_addons').select('*').eq('user_id', user.id);
    
    if (productId) {
      // Get global addons or product-specific addons
      query = query.or(`product_id.eq.${productId},product_id.is.null`);
    }

    const { data, error } = await query.order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch add-ons' };
  }
}

export async function createProductAddon(
  name: string,
  price: number,
  productId?: string | null,
  rawProductId?: string | null,
  rawQuantity?: number
): Promise<{ success: boolean; error: string | null }> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('product_addons').insert({
      user_id: user.id,
      product_id: productId || null,
      name,
      price,
      raw_product_id: rawProductId || null,
      raw_quantity: rawQuantity || 1,
    });

    if (error) throw new Error(error.message);
    revalidatePath('/inventory');
    revalidatePath('/sales');
    return { success: true, error: null };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to create add-on' };
  }
}

export async function deleteProductAddon(addonId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from('product_addons')
      .delete()
      .eq('id', addonId)
      .eq('user_id', user.id);

    if (error) throw new Error(error.message);
    revalidatePath('/inventory');
    revalidatePath('/sales');
    return { success: true, error: null };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete add-on' };
  }
}



