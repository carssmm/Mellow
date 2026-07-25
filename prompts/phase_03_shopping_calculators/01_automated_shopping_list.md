# 3.1 Automated Shopping List

## Context

<context>
This step builds the Smart Restock List that appears in the right column of the Inventory page. It auto-fetches products where `current_stock <= low_stock_threshold`, calculates the recommended purchase quantity (`target_stock - current_stock`), shows the estimated total cost, and provides action buttons for copying/sharing. This replaces the placeholder card created in Phase 1.
</context>

## Prerequisites

<prerequisites>
- Phase 1 completed (Inventory page with placeholder restock card)
- `getLowStockProducts()` Server Action from Step 1.4
- Inventory UI reference showing the "Smart Restock List" card
</prerequisites>

## AI Implementation Prompt

<instructions>
1. **Create the Restock List component: `src/components/inventory/restock-list.tsx`**
   - Server Component that fetches low-stock products
   - Card matching the UI reference:
     - Title: "Smart Restock List" in `text-headline-md font-headline-md`
     - Subtitle: "Auto-generated based on current stock levels falling below defined thresholds."
     - Divider line
     - List of restock items, each showing:
       - Shopping cart icon
       - "Buy [recommended_qty] [unit] [product_name]"
       - `recommended_qty = max(0, target_stock - current_stock)`
     - Divider line
     - "Estimated Cost" with total: sum of `recommended_qty × unit_cost` for each item, displayed in `₱X,XXX.XX`
     - Action buttons (filled in Step 3.2): "Copy to WhatsApp / SMS" (charcoal primary) and "Copy Plain Text List" (secondary outline)
   - If no items are low stock, show a success message: "All items are well stocked! ✓"
   - Option to add manual ad-hoc items (text input + add button) that don't come from the database

2. **Update the Inventory page to include the Restock List**
   - Replace the placeholder in the right column with the actual `<RestockList />` component
   - The restock list should update when product stock changes (via `revalidatePath`)

3. **Create a type for restock items: add to `src/types/database.ts`**
   ```
   RestockItem {
     productId: string
     productName: string
     currentStock: number
     targetStock: number
     recommendedQty: number
     unitCost: number
     estimatedCost: number
   }
   ```
</instructions>

<requirements>
### Functional Requirements
- Auto-populates from products where `current_stock <= low_stock_threshold`
- `recommended_qty = max(0, target_stock - current_stock)`
- Estimated cost = sum of all `recommended_qty × unit_cost`
- Empty state when all products are well-stocked
- Manual ad-hoc items can be added to the list

### Technical Requirements
- Server Component for initial data fetch
- Updates when stock changes via `revalidatePath('/inventory')`
</requirements>

<output_files>
1. `src/components/inventory/restock-list.tsx` — Smart Restock List component
2. `src/app/(dashboard)/inventory/page.tsx` — MODIFIED: Replace placeholder with RestockList
3. `src/types/database.ts` — MODIFIED: Add RestockItem type
</output_files>

## Verification

<verification>
- [ ] Restock list shows products below their low stock threshold
- [ ] Recommended quantities calculated correctly
- [ ] Estimated cost totals correctly
- [ ] "All items well stocked" shows when no items are low
- [ ] List updates after recording a sale that depletes stock
</verification>

---

**Next**: [3.2 - Clipboard & Share Actions](./02_clipboard_share_actions.md)
