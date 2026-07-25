# 2.4 Sales Data Layer

## Context

<context>
This step creates all the Server Actions needed to record sales across the three modes (Quick Tap, Batch, Reconciliation), decrement product stock levels, and query today's sales data. These actions handle the core business logic: calculating gross revenue, total COGS, net profit, and updating inventory stock atomically with the sale record. This is the data backbone that the Dashboard and Analytics features in later phases will query.
</context>

## Prerequisites

<prerequisites>
- Steps 2.1–2.3 completed (all three sales mode UIs)
- Database schema with `sales` and `sales_items` tables (Phase 0)
- Product CRUD Server Actions (Phase 1, Step 1.4)
- TypeScript types for `Sale`, `SaleItem`, `EntryMode`, `PaymentMethod`
</prerequisites>

## AI Implementation Prompt

<instructions>
Think step by step:

1. **Create Sales Server Actions: `src/app/(dashboard)/sales/actions.ts`**
   - Mark with `'use server'`

   **`recordQuickTapSale(data)`:**
   - Input: `{ items: { productId, quantity, unitPrice, unitCost }[], paymentMethod: PaymentMethod }`
   - Validate inputs with Zod
   - Get authenticated user
   - Calculate: `totalRevenue = sum(qty × unitPrice)`, `totalCogs = sum(qty × unitCost)`, `netProfit = totalRevenue - totalCogs`
   - Insert into `sales` table: user_id, total_revenue, total_cogs, net_profit, entry_mode: 'quick_tap', payment_method
   - Insert into `sales_items` table: one row per cart item with sale_id, product_id, quantity, unit_price, unit_cost
   - Decrement stock: for each item, update `products.current_stock = current_stock - quantity`
   - If `current_stock` would go negative, allow it but return a warning: `{ success: true, warnings: ['Product X stock is now negative (-2)'] }`
   - Revalidate paths: `/sales`, `/inventory`, `/` (dashboard)
   - Return: `{ success, saleId, warnings, error }`

   **`recordBatchSale(data)`:**
   - Input: `{ items: { productId, quantity, unitPrice, unitCost }[], paymentMethod: PaymentMethod }`
   - Same logic as Quick Tap but with `entry_mode: 'batch'`
   - Filter out items with `quantity === 0` before processing

   **`recordReconciliation(data)`:**
   - Input: `{ startingFloat: number, endingCash: number, items?: {...}[] }`
   - Get today's total cash sales (query `sales` where `created_at` is today and `payment_method = 'cash'`)
   - Calculate: `expectedCash = startingFloat + todayCashSales`
   - Calculate: `cashDiscrepancy = endingCash - expectedCash`
   - Insert into `sales` table with `entry_mode: 'reconciliation'`, starting_float, ending_cash, cash_discrepancy
   - If items are provided (optional batch entry with reconciliation), process those too
   - Revalidate paths
   - Return: `{ success, expectedCash, cashDiscrepancy, todayCashSales, error }`

   **`getTodaySales()`:**
   - Get authenticated user
   - Query `sales` where `created_at::date = CURRENT_DATE` (or use date-fns for timezone)
   - Join with `sales_items` and `products` for product names
   - Return: `{ data: SaleWithItems[], error }`

   **`getTodaysSummary()`:**
   - Get today's aggregated totals:
     - Total gross revenue
     - Total COGS
     - Total net profit
     - Total items sold (sum of all quantities)
     - Total cash sales amount
     - Number of transactions
   - Return: `{ data: DailySummary, error }`

2. **Create Zod validation schemas: `src/lib/validations/sale.ts`**
   - `saleItemSchema`: productId (UUID), quantity (positive integer), unitPrice (positive number), unitCost (non-negative number)
   - `quickTapSaleSchema`: items (array of saleItemSchema, min 1), paymentMethod
   - `batchSaleSchema`: same as quickTapSale
   - `reconciliationSchema`: startingFloat (non-negative number), endingCash (non-negative number)

3. **Create a DailySummary type: add to `src/types/database.ts`**
   ```
   DailySummary {
     totalRevenue: number
     totalCogs: number
     netProfit: number
     totalItemsSold: number
     totalCashSales: number
     transactionCount: number
   }
   ```

4. **Handle stock decrement safely**
   - Use a Supabase RPC function or direct update: `current_stock = current_stock - :quantity`
   - This avoids race conditions (atomic decrement)
   - After decrement, check if stock went below 0 and include in warnings
   - The spec explicitly allows negative stock with a warning

5. **Date handling for "today"**
   - All "today" queries should use Philippine Time (UTC+8)
   - Use `date-fns` with the correct timezone or PostgreSQL `AT TIME ZONE 'Asia/Manila'`
   - Alternative: filter by date range in the query: `created_at >= startOfDay AND created_at < startOfNextDay`

6. **Update the barrel export: `src/lib/validations/index.ts`**
   - Re-export sale validation schemas
</instructions>

<requirements>
### Functional Requirements
- All three sale modes create records in `sales` and `sales_items` tables
- Stock levels decrement atomically on sale completion
- Negative stock is allowed but generates a warning
- Cash reconciliation calculates Expected Cash and discrepancy
- Today's summary returns aggregated financial data
- All monetary calculations use the snapshot prices from `sales_items` (not current product prices)

### Technical Requirements
- Use Supabase RPC or atomic UPDATE for stock decrement (avoid read-then-write race conditions)
- Date queries account for Philippine Time (UTC+8)
- All inputs validated with Zod before database operations
- `revalidatePath` called for affected routes after mutations
- Server Actions return structured results (no thrown errors)

### File Naming Conventions
- `src/app/(dashboard)/sales/actions.ts`
- `src/lib/validations/sale.ts`
</requirements>

<output_files>
1. `src/app/(dashboard)/sales/actions.ts` — All sales Server Actions
2. `src/lib/validations/sale.ts` — Zod schemas for sales validation
3. `src/types/database.ts` — MODIFIED: Add DailySummary type
4. `src/lib/validations/index.ts` — MODIFIED: Add sale exports
</output_files>

## Verification

<verification>
- [ ] Quick Tap sale creates a record in `sales` (entry_mode: 'quick_tap') and `sales_items`
- [ ] Batch sale creates a record in `sales` (entry_mode: 'batch') and `sales_items`
- [ ] Cash reconciliation creates a record with starting_float, ending_cash, cash_discrepancy
- [ ] Product stock decreases correctly after a sale
- [ ] Selling 10 of a product with 5 in stock results in -5 stock with a warning
- [ ] `getTodaySales()` returns only today's sales (Philippine Time)
- [ ] `getTodaysSummary()` returns correct aggregate totals
- [ ] Invalid inputs are rejected with meaningful error messages
- [ ] `npx tsc --noEmit` passes
</verification>

---

**Previous**: [2.3 - Batch Entry & Reconciliation](./03_batch_entry_and_reconciliation.md) | **Next**: [Phase 2 Checklist](./99_PHASE_CHECKLIST.md)
