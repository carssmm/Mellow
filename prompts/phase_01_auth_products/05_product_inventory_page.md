# 1.5 Product Inventory Page

## Context

<context>
This step builds the Inventory & Automated Restock page matching the UI reference. The page displays a searchable product table with columns (Item, Price, Cost, Stock, Threshold, Status) and color-coded stock status badges. It includes an Add Product button that opens a modal form, and each row has Edit/Delete actions. This is the primary product management interface and feeds data into the Sales Logger and Shopping List features in later phases.
</context>

## Prerequisites

<prerequisites>
- Step 1.4 completed (Product CRUD Server Actions)
- Tailwind design tokens configured (Phase 0)
- UI reference available at `Mellow UI/inventory_restock_mellow_caf/code.html` and `screen.png`
- Product types defined in `src/types/database.ts`
</prerequisites>

## AI Implementation Prompt

<instructions>
Think step by step:

1. **Create the Inventory page: `src/app/(dashboard)/inventory/page.tsx`**
   - This is a Server Component that fetches products on the server
   - Call `getProducts()` to fetch all products
   - Pass the products to a Client Component for interactive features (search, modals)
   - Page structure matching the UI reference:
     - **Header section:**
       - Title: "Inventory & Automated Restock" in `text-headline-lg font-headline-lg`
       - Subtitle: "Manage your stock levels and view smart restock recommendations based on current inventory thresholds." in `text-body-lg text-on-surface-variant`
     - **Content section (2-column on desktop):**
       - Left column (wider): "Current Inventory" card with search and product table
       - Right column: "Smart Restock List" card (placeholder for Phase 3 — just show the card shell)
     - **Add Product button**: In the header area, charcoal button with + icon

2. **Create the Inventory Client Component: `src/components/inventory/inventory-table.tsx`**
   - `'use client'` component that receives `products: Product[]` as prop
   - Features:
     - **Search input**: Filter products by name (client-side filtering)
       - Styled like the UI reference: search icon, `bg-[#FAFAFA]`, rounded, placeholder "Search items..."
     - **Product table**: Responsive table with columns:
       - Item (icon + name)
       - Price (selling price in ₱)
       - Cost (unit cost in ₱)
       - Stock (current stock — colored: red if 0, amber if <= threshold, normal otherwise)
       - Threshold (low stock threshold number)
       - Status (badge: "In Stock" green, "Low Stock" amber, "Out of Stock" red)
     - **Row actions**: Edit and Delete buttons (icon buttons or dropdown menu)
     - Each row should have a subtle icon placeholder on the left (like the material icons in the reference)

3. **Create Stock Status Badge component: `src/components/ui/badge.tsx`**
   - A reusable badge component with variants:
     - `in_stock`: Green background/text — `bg-tertiary-fixed/30 text-on-tertiary-fixed-variant` with "In Stock" label
     - `low_stock`: Amber background/text — `bg-secondary-fixed/50 text-on-secondary-fixed` with "Low Stock" label
     - `out_of_stock`: Red background/text — `bg-error-container text-on-error-container` with "Out of Stock" label
   - 4-6px border radius per DESIGN.md spec
   - Use the `getStockStatus()` utility from `src/lib/utils.ts`

4. **Create the Product Form Modal: `src/components/inventory/product-form-modal.tsx`**
   - `'use client'` component for adding and editing products
   - Modal overlay: semi-transparent dark background, centered white card
   - Form fields matching the product schema:
     - Product Name (text input)
     - Category (select dropdown: Coffee, Non-Coffee, Pastries, Beans, Other)
     - Selling Price ₱ (number input)
     - Unit Cost ₱ (number input)
     - Current Stock (number input)
     - Low Stock Threshold (number input)
     - Target Stock (number input)
   - Buttons: "Cancel" (secondary) and "Save Product" (primary charcoal)
   - Input styling per DESIGN.md: `bg-[#FAFAFA]`, 10px radius, golden-amber focus border
   - On submit:
     - Call `createProduct()` or `updateProduct()` Server Action
     - Show loading state on save button
     - On success: close modal (parent re-renders with new data via revalidation)
     - On error: show error message in the modal
   - Props: `mode: 'create' | 'edit'`, `product?: Product` (for edit pre-fill), `onClose: () => void`

5. **Create Delete Confirmation: `src/components/inventory/delete-confirmation.tsx`**
   - Simple confirmation dialog before deleting a product
   - Shows the product name: "Are you sure you want to delete [Product Name]?"
   - Warning: "This cannot be undone. Products with existing sales records cannot be deleted."
   - Buttons: "Cancel" and "Delete" (red/error color)
   - Calls `deleteProduct(id)` on confirm

6. **Wire everything together in the inventory page**
   - The page server component fetches data and passes to the table client component
   - Add Product button opens the modal in "create" mode
   - Table Edit button opens the modal in "edit" mode with pre-filled data
   - Table Delete button opens the delete confirmation
   - Use React `useState` for modal open/close state
</instructions>

<requirements>
### Functional Requirements
- Products display in a clean table matching the UI reference
- Search filters products by name in real-time (client-side)
- Stock status badges are color-coded: Green (In Stock), Amber (Low Stock), Red (Out of Stock)
- Add Product modal creates a new product via Server Action
- Edit Product modal updates an existing product via Server Action
- Delete confirmation removes a product via Server Action
- After any mutation, the table refreshes with updated data (via `revalidatePath`)
- Currency values display as `₱X,XXX.XX`

### Technical Requirements
- Page is a Server Component; table and modals are Client Components
- Use Server Actions for all mutations (not API routes)
- Zod validation on client-side (inline errors) AND server-side (Server Action)
- Modal must be accessible: focus trap, ESC to close, click outside to close
- Responsive: table collapses to a card list on mobile (optional: can use horizontal scroll)

### File Naming Conventions
- `src/app/(dashboard)/inventory/page.tsx`
- `src/components/inventory/inventory-table.tsx`
- `src/components/inventory/product-form-modal.tsx`
- `src/components/inventory/delete-confirmation.tsx`
- `src/components/ui/badge.tsx`
</requirements>

<output_files>
Generate the following files:

1. `src/app/(dashboard)/inventory/page.tsx` — Inventory page (Server Component)
2. `src/components/inventory/inventory-table.tsx` — Interactive product table
3. `src/components/inventory/product-form-modal.tsx` — Add/Edit product modal
4. `src/components/inventory/delete-confirmation.tsx` — Delete confirmation dialog
5. `src/components/ui/badge.tsx` — Reusable stock status badge
</output_files>

## Verification

<verification>
After completing this step, confirm:

- [ ] Navigating to `/inventory` shows the inventory table with seed data products
- [ ] The search input filters products by name in real-time
- [ ] Stock status badges show correctly: green for high stock, amber for low, red for zero
- [ ] Clicking "Add Product" opens the modal form
- [ ] Filling and submitting the form creates a new product (appears in table)
- [ ] Clicking Edit on a row opens the modal pre-filled with product data
- [ ] Updating a product via the modal reflects in the table
- [ ] Deleting a product removes it from the table after confirmation
- [ ] Currency values show as `₱X,XXX.XX`
- [ ] The page layout matches the UI reference (header, 2-column layout)
- [ ] `npx tsc --noEmit` passes
</verification>

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Table shows no products | Server Action not fetching, or user has no products | Check `getProducts()` returns data; run seed SQL with the correct `user_id` |
| Modal doesn't close after save | `revalidatePath` not triggering re-render | Ensure `onClose()` is called after successful Server Action; check that the parent state updates |
| Search doesn't work | Filtering on wrong field | Ensure filtering uses `product.name.toLowerCase().includes(query)` |
| Badge colors wrong | Using wrong Tailwind color class | Cross-reference with DESIGN.md: emerald for good, amber for warning, error for out |

---

**Previous**: [1.4 - Product CRUD API](./04_product_crud_api.md) | **Next**: [Phase 1 Checklist](./99_PHASE_CHECKLIST.md)
