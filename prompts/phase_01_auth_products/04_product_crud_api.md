# 1.4 Product CRUD API

## Context

<context>
This step creates the Server Actions for managing products (create, read, update, delete). These actions power the inventory management page and are also used by the Sales Logger to fetch product lists. All actions enforce authentication via the server Supabase client, and input validation is handled with Zod schemas. The product data includes pricing (in Philippine Pesos), stock levels, and restock thresholds.
</context>

## Prerequisites

<prerequisites>
- Step 1.1 completed (Supabase server client)
- Step 1.3 completed (middleware protects routes)
- Database schema with `products` table and RLS policies (Phase 0, Step 0.3)
- TypeScript types for `Product` defined in `src/types/database.ts`
</prerequisites>

## AI Implementation Prompt

<instructions>
Think step by step:

1. **Create Zod validation schemas: `src/lib/validations/product.ts`**
   - `createProductSchema`:
     - `name`: string, min 1, max 100, trimmed
     - `category`: string, min 1, max 50, default 'Uncategorized'
     - `selling_price`: number, min 0, max 999999.99 (₱)
     - `unit_cost`: number, min 0, max 999999.99 (₱)
     - `current_stock`: integer, min 0, default 0
     - `low_stock_threshold`: integer, min 0, default 5
     - `target_stock`: integer, min 0, default 20
   - `updateProductSchema`: Same as create but all fields optional (partial), plus `id` required (UUID string)
   - `deleteProductSchema`: Just `id` (UUID string)

2. **Create Product Server Actions: `src/app/(dashboard)/inventory/actions.ts`**
   - Mark the file with `'use server'` at the top

   **`getProducts()`:**
   - Create a server Supabase client
   - Get the authenticated user (redirect if not authenticated)
   - Query `products` table ordered by `name` ascending
   - Return `{ data: Product[], error: string | null }`

   **`getProductsByCategory(category: string)`:**
   - Same as `getProducts` but filtered by category
   - If category is 'All' or empty, return all products

   **`createProduct(formData: FormData)`:**
   - Parse and validate form data with `createProductSchema`
   - Get the authenticated user
   - Insert into `products` table with `user_id: user.id`
   - Revalidate the `/inventory` path using `revalidatePath`
   - Return `{ success: boolean, error: string | null }`

   **`updateProduct(formData: FormData)`:**
   - Parse and validate with `updateProductSchema`
   - Get the authenticated user
   - Update the product matching `id` AND `user_id` (double protection with RLS)
   - Revalidate `/inventory`
   - Return `{ success: boolean, error: string | null }`

   **`deleteProduct(id: string)`:**
   - Validate the UUID
   - Get the authenticated user
   - Delete the product matching `id` AND `user_id`
   - Revalidate `/inventory`
   - Return `{ success: boolean, error: string | null }`

   **`getProductCategories()`:**
   - Query distinct categories from the products table
   - Return `{ data: string[], error: string | null }`

   **`getLowStockProducts()`:**
   - Query products where `current_stock <= low_stock_threshold`
   - Ordered by `current_stock` ascending (most urgent first)
   - Return `{ data: Product[], error: string | null }`

3. **Create a validation barrel: `src/lib/validations/index.ts`**
   - Re-export all schemas from `product.ts`

4. **Error handling pattern**
   - All actions should use try/catch
   - On validation error: return `{ success: false, error: 'Validation failed: [specific field errors]' }`
   - On Supabase error: return `{ success: false, error: error.message }`
   - On auth error: redirect to `/login`
   - Never throw errors from Server Actions — always return structured results
</instructions>

<requirements>
### Functional Requirements
- Create: adds a new product with the authenticated user's ID
- Read: returns only the authenticated user's products (enforced by RLS AND query filter)
- Update: modifies an existing product (only if owned by the user)
- Delete: removes a product (only if owned by the user, and only if not referenced by active sales)
- Validation: all inputs validated with Zod before database operations
- Low stock query: returns products where stock is at or below the threshold

### Technical Requirements
- All functions marked with `'use server'` (or in a `'use server'` file)
- Use `revalidatePath('/inventory')` after mutations to refresh the page data
- Use `createSupabaseServerClient()` for all database operations
- Authentication checked via `getAuthenticatedUser()` — redirect if null
- Zod schemas defined separately for reuse in client-side form validation

### File Naming Conventions
- `src/app/(dashboard)/inventory/actions.ts`
- `src/lib/validations/product.ts`
- `src/lib/validations/index.ts`
</requirements>

<output_files>
Generate the following files:

1. `src/lib/validations/product.ts` — Zod schemas for product validation
2. `src/lib/validations/index.ts` — Barrel export
3. `src/app/(dashboard)/inventory/actions.ts` — Product CRUD Server Actions
</output_files>

## Verification

<verification>
After completing this step, confirm:

- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] Calling `getProducts()` from a Server Component returns the seed data products
- [ ] Calling `createProduct()` adds a new product to the database
- [ ] Calling `updateProduct()` modifies an existing product
- [ ] Calling `deleteProduct()` removes a product
- [ ] Calling `getLowStockProducts()` returns products below their threshold
- [ ] Invalid inputs (e.g., negative price) are rejected with clear error messages
- [ ] All operations only affect the authenticated user's data
</verification>

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Server Action returns empty data | RLS blocking queries | Verify the user is authenticated and RLS policies allow SELECT for `auth.uid() = user_id` |
| "Row not found" on update | Product doesn't belong to user | Check that the `user_id` filter is applied and matches the authenticated user |
| Zod validation errors | FormData keys don't match schema | Ensure form field names match the Zod schema keys exactly |
| `revalidatePath` not refreshing | Incorrect path string | Ensure path matches the actual route: `/inventory` not `/dashboard/inventory` |

---

**Previous**: [1.3 - Auth Middleware Protection](./03_auth_middleware_protection.md) | **Next**: [1.5 - Product Inventory Page](./05_product_inventory_page.md)
