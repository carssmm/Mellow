import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(100).trim(),
  category: z.string().min(1, "Category is required").max(50).default('Uncategorized'),
  selling_price: z.coerce.number().min(0, "Selling price cannot be negative").max(999999.99).default(0),
  unit_cost: z.coerce.number().min(0, "Unit cost cannot be negative").max(999999.99),
  current_stock: z.coerce.number().int().min(0, "Stock cannot be negative").default(0),
  low_stock_threshold: z.coerce.number().int().min(0, "Threshold cannot be negative").default(5),
  target_stock: z.coerce.number().int().min(0, "Target cannot be negative").default(20),
  is_active: z.boolean().default(true),
  type: z.enum(['menu_item', 'raw_material']).default('menu_item'),
  package_price: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : val),
    z.coerce.number().min(0, "Package price cannot be negative").nullable().optional()
  ),
  items_per_package: z.coerce.number().int().min(1, "Items per package must be at least 1").default(1),
  package_unit_name: z.string().min(1, "Package label is required").default('box'),
  unit_name: z.string().default('pcs'),
  piece_capacity: z.coerce.number().min(0.0001, "Capacity must be greater than 0").default(1),
  piece_capacity_unit: z.string().default('ml'),
});

export const updateProductSchema = createProductSchema.partial().extend({
  id: z.string().uuid("Invalid product ID"),
});

export const deleteProductSchema = z.object({
  id: z.string().uuid("Invalid product ID"),
});

export const addStockSchema = z.object({
  product_id: z.string().uuid("Invalid product ID"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  is_package: z.boolean().default(false),
  update_package_price: z.boolean().default(false),
  new_package_price: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : val),
    z.coerce.number().min(0, "Package price cannot be negative").nullable().optional()
  ),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type AddStockInput = z.infer<typeof addStockSchema>;
