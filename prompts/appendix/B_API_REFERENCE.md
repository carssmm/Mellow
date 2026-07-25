# Appendix B: API Reference

> All Server Actions, data queries, and Supabase operations for the Mellow Café System.

---

## Product Actions (`src/app/(dashboard)/inventory/actions.ts`)

| Action | Input | Returns | Side Effects |
|--------|-------|---------|-------------|
| `getProducts()` | none | `{ data: Product[], error }` | None |
| `getProductsByCategory(category)` | string | `{ data: Product[], error }` | None |
| `createProduct(formData)` | FormData | `{ success, error }` | Insert product, revalidate `/inventory` |
| `updateProduct(formData)` | FormData | `{ success, error }` | Update product, revalidate `/inventory` |
| `deleteProduct(id)` | string (UUID) | `{ success, error }` | Delete product, revalidate `/inventory` |
| `getProductCategories()` | none | `{ data: string[], error }` | None |
| `getLowStockProducts()` | none | `{ data: Product[], error }` | None |

## Sales Actions (`src/app/(dashboard)/sales/actions.ts`)

| Action | Input | Returns | Side Effects |
|--------|-------|---------|-------------|
| `recordQuickTapSale(data)` | `{ items, paymentMethod }` | `{ success, saleId, warnings, error }` | Insert sale + items, decrement stock, revalidate |
| `recordBatchSale(data)` | `{ items, paymentMethod }` | `{ success, saleId, warnings, error }` | Insert sale + items, decrement stock, revalidate |
| `recordReconciliation(data)` | `{ startingFloat, endingCash }` | `{ success, expectedCash, cashDiscrepancy, error }` | Insert reconciliation record, revalidate |
| `getTodaySales()` | none | `{ data: SaleWithItems[], error }` | None |
| `getTodaysSummary()` | none | `{ data: DailySummary, error }` | None |

## Dashboard Actions (`src/app/(dashboard)/actions.ts`)

| Action | Input | Returns | Side Effects |
|--------|-------|---------|-------------|
| `getRecentSales(limit)` | number | `{ data: SaleWithItems[], error }` | None |

## Analytics Actions (`src/app/(dashboard)/analytics/actions.ts`)

| Action | Input | Returns | Side Effects |
|--------|-------|---------|-------------|
| `getSalesAnalytics(startDate, endDate)` | Date, Date | `{ data: DailyAnalytics[], error }` | None |
| `getTopSellingProducts(startDate, endDate, limit)` | Date, Date, number | `{ data: TopProduct[], error }` | None |
| `getExportData(startDate, endDate)` | Date, Date | `{ data: ExportRow[], error }` | None |

## Auth Actions (`src/app/(auth)/actions.ts`)

| Action | Input | Returns | Side Effects |
|--------|-------|---------|-------------|
| `signOut()` | none | void (redirects) | Clear session, redirect to `/login` |

---

## TypeScript Types

```typescript
interface Product {
  id: string
  user_id: string
  name: string
  category: string
  selling_price: number
  unit_cost: number
  current_stock: number
  low_stock_threshold: number
  target_stock: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface Sale {
  id: string
  user_id: string
  total_revenue: number
  total_cogs: number
  net_profit: number
  starting_float: number | null
  ending_cash: number | null
  cash_discrepancy: number | null
  entry_mode: 'quick_tap' | 'batch' | 'reconciliation'
  payment_method: 'cash' | 'gcash_maya'
  created_at: string
}

interface SaleItem {
  id: string
  sale_id: string
  product_id: string
  quantity: number
  unit_price: number
  unit_cost: number
  created_at: string
}

interface Expense {
  id: string
  user_id: string
  name: string
  amount: number
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  is_active: boolean
  created_at: string
  updated_at: string
}

interface DailySummary {
  totalRevenue: number
  totalCogs: number
  netProfit: number
  totalItemsSold: number
  totalCashSales: number
  transactionCount: number
}
```

---

## Supabase Client Usage

| Context | Import | Source |
|---------|--------|--------|
| Server Component / Server Action | `createSupabaseServerClient()` | `@/lib/supabase/server` |
| Client Component | `createSupabaseClient()` | `@/lib/supabase/client` |
| Middleware | `updateSession(request)` | `@/lib/supabase/middleware` |
| Auth check | `getAuthenticatedUser()` | `@/lib/supabase/server` |

---

## Currency Formatting

All monetary values formatted as: `₱X,XXX.XX`
- Use `formatCurrency(amount)` from `@/lib/utils`
- Philippine Peso (₱), no i18n
- DECIMAL(10,2) in database
