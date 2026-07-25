import { z } from 'zod';

export const saleItemSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  quantity: z.number().int().positive("Quantity must be greater than 0"),
  unitPrice: z.number().min(0, "Unit price cannot be negative"),
  unitCost: z.number().min(0, "Unit cost cannot be negative"),
});

export const quickTapSaleSchema = z.object({
  items: z.array(saleItemSchema).min(1, "Cart cannot be empty"),
  paymentMethod: z.enum(['cash', 'gcash_maya']),
});

export const batchSaleSchema = z.object({
  items: z.array(saleItemSchema).min(1, "Must submit at least one item"),
  paymentMethod: z.enum(['cash', 'gcash_maya']),
});

export const reconciliationSchema = z.object({
  startingFloat: z.number().min(0, "Starting float cannot be negative"),
  endingCash: z.number().min(0, "Ending cash cannot be negative"),
  items: z.array(saleItemSchema).optional(),
});

export type SaleItemInput = z.infer<typeof saleItemSchema>;
export type QuickTapSaleInput = z.infer<typeof quickTapSaleSchema>;
export type BatchSaleInput = z.infer<typeof batchSaleSchema>;
export type ReconciliationInput = z.infer<typeof reconciliationSchema>;
