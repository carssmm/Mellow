# Feature Spec: Bulk Purchasing & Package-Based Costing Calculator

## Overview
- **Feature:** Package-Based Costing & Dual-Unit Stock Tracking (Box/Pack to Unit COGS)
- **Requested by:** Café Owner
- **Complexity:** Small-to-Medium (4 UI/action files to modify, 1 migration to add)
- **Estimated scope:** 5 files, ~2-3 hours implementation
- **Related features:** Inventory Management (`src/app/(dashboard)/inventory`), Restock List (`src/components/inventory/restock-client.tsx`), Product Form Modal (`src/components/inventory/product-form-modal.tsx`), Multi-mode Sales Logger (COGS calculations)

---

## Problem & Motivation
Café operators frequently purchase inventory supplies in bulk packages from online retailers (e.g., Shopee, Lazada) or wholesale markets—such as a box of 50 coffee pods for ₱1,500 or a pack of 100 cups for ₱350. 

Currently, Mellow requires the user to manually calculate unit cost (`₱1,500 ÷ 50 = ₱30/pc`) offline before entering it into the system. Furthermore, inventory stock is tracked strictly in raw pieces, making it difficult for owners to visualize how many unopened boxes/packs remain during restock checks.

This feature introduces an integrated **Package Costing Calculator** in product forms, **Dual-Unit Stock Visualization** (Pcs & Boxes), and a **Package-Based Restocking Helper** to eliminate mental math and prevent costing errors.

---

## User Stories
- **As a café owner**, I want to enter the package price (e.g., ₱1,500/box) and pieces per box (50 pcs) when adding or editing a product so that Mellow automatically calculates and updates the per-piece unit cost (₱30.00/pc).
- **As a café owner**, I want to view my inventory stock in both total pieces and full boxes (e.g., `150 pcs (3 boxes)`) so I immediately know how many unopened packages I have on hand.
- **As a café owner**, when receiving new supplies, I want to add stock by entering package counts (e.g., `+2 boxes`) so Mellow automatically converts it to pieces (`+100 pcs`) and updates the stock level.
- **As a café owner**, I want the option to manually override the unit cost if needed, so I retain total control over item margin calculations.

---

## Detailed Requirements

### Requirement Group 1 — Package Costing Calculator (Product Modal)

**Description:** Enhances the Product Create/Edit Modal (`product-form-modal.tsx`) with a costing mode toggle: "Direct Unit Cost" vs "Package Purchase (Shopee/Bulk)".

**UI/UX:**
- **Mode Toggle:** A segmented control or tab switch inside the Product Modal:
  - `Per Piece`: Direct input of `unit_cost` (existing behavior).
  - `Bulk / Box`: Package costing inputs.
- **Inputs in Bulk Mode:**
  - `Package Purchase Price (₱)` (e.g. `1500.00`)
  - `Items per Package (pcs)` (e.g. `50`)
  - `Package Label` (Select/Input: `Box`, `Pack`, `Case`, `Bag`, `Can` — Default: `Box`)
- **Live Output Banner:** Displays calculated unit cost in real time:  
  `Formula: ₱1,500.00 ÷ 50 pcs = ₱30.00 / pc (Auto-calculated COGS)`
- **States:**
  | State | What the user sees | Trigger |
  |---|---|---|
  | Default (Per Piece) | Existing unit cost input field | Default or toggled to "Per Piece" |
  | Bulk Mode (Empty) | Box Price & Pcs/Box inputs (empty) | Toggled to "Bulk / Box" |
  | Bulk Mode (Valid) | Calculated unit cost banner highlight | Box Price > 0 and Pcs/Box > 0 |
  | Bulk Mode (Error) | Warning: "Items per package must be at least 1" | Pcs/Box = 0 or negative |

---

### Requirement Group 2 — Dual Stock Display (Inventory List)

**Description:** Upgrades the Inventory Table (`inventory-table.tsx`) and Restock List (`restock-client.tsx`) to show stock counts in both individual units and equivalent packages.

**UI/UX:**
- **Stock Column Display:**
  - Standard format: **`150 pcs`**
  - Subtext / Badge (when `items_per_package > 1`): **`(3 boxes)`** or **`(3 boxes + 2 pcs)`** if there is a remainder.
- **Example Calculations:**
  - `current_stock = 150`, `items_per_package = 50` ➔ `150 pcs (3 boxes)`
  - `current_stock = 110`, `items_per_package = 50` ➔ `110 pcs (2 boxes, 10 pcs)`
  - `current_stock = 3`, `items_per_package = 50` ➔ `3 pcs (0 boxes, 3 pcs)`

---

### Requirement Group 3 — Quick Restock by Package

**Description:** Allows receiving inventory by adding package counts during stock updates.

**UI/UX:**
- **Add Stock Action Modal / Dialog:**
  - Quick action button on inventory table row: `+ Add Stock`.
  - Radio toggle: `Add by Pcs` vs `Add by Box`.
  - If `Add by Box` selected: User enters number of boxes (e.g., `2`).
  - Helper preview: `Will add 100 pcs to current stock (New total: 250 pcs / 5 boxes)`.
  - Optional checkbox: `"Update purchase price for this item?"` (updates package price & auto-recalculates unit COGS if online market prices changed).

---

## Data Contracts & Schemas

### Database Schema Migration (`supabase/migrations/002_add_package_costing.sql`)

```sql
-- Add package costing columns to products table
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS package_price DECIMAL(10,2) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS items_per_package INTEGER DEFAULT 1 CHECK (items_per_package >= 1),
  ADD COLUMN IF NOT EXISTS package_unit_name TEXT DEFAULT 'box';
```

### TypeScript Interface (`src/types/database.ts`)

```typescript
export interface Product {
  id: string;
  user_id: string;
  name: string;
  category: string;
  selling_price: number;
  unit_cost: number;
  current_stock: number;
  low_stock_threshold: number;
  target_stock: number;
  is_active: boolean;
  type: ProductType;
  // New Package Costing Fields
  package_price?: number | null;
  items_per_package?: number;
  package_unit_name?: string;
  created_at: string;
  updated_at: string;
}
```

### Business Rules
1. `unit_cost` remains the single canonical COGS source used by sales transactions and profit analytics (`net_profit = selling_price - unit_cost`).
2. If `package_price` and `items_per_package` are provided (`items_per_package > 0`), `unit_cost` is automatically set to `package_price / items_per_package`.
3. If `items_per_package = 1` or `null`, the dual stock display shows pieces only (no redundant `(X boxes)` tag).
4. Stock decrements during sales always subtract from `current_stock` in pieces. Dual box calculations update dynamically on fetch/render.

---

## Codebase Integration

### Files to CREATE
| File Path | Purpose |
|---|---|
| `supabase/migrations/002_add_package_costing.sql` | Migration adding `package_price`, `items_per_package`, and `package_unit_name` columns to `products`. |

### Files to MODIFY
| File Path | What Changes |
|---|---|
| `src/types/database.ts` | Update `Product` interface and `Database['public']['Tables']['products']` definition. |
| `src/lib/validations/index.ts` | Update `createProductSchema` and `updateProductSchema` Zod schemas to include optional `package_price`, `items_per_package`, and `package_unit_name`. |
| `src/app/(dashboard)/inventory/actions.ts` | Update `createProduct`, `updateProduct`, and quick stock adjustment actions to process package costing fields. |
| `src/components/inventory/product-form-modal.tsx` | Add "Per Piece" vs "Bulk / Box" toggle mode and live package COGS calculator UI. |
| `src/components/inventory/inventory-table.tsx` | Add dual stock display helper (`150 pcs (3 boxes)`) and "+ Add Stock by Box" modal/action button. |

### Files NOT to Change
| File Path | Why |
|---|---|
| `src/app/(dashboard)/sales/actions.ts` | Sales logging already operates on `unit_cost` and `current_stock` (in pieces). No changes required. |
| `src/app/(dashboard)/analytics/actions.ts` | Profit charts consume `total_cogs` from recorded sales. No changes required. |

### Existing Code to Reuse
| What | Where | How |
|---|---|---|
| Form input styling | `src/components/inventory/product-form-modal.tsx` | Reuse consistent input styles (`bg-[#FAFAFA] border border-outline-variant rounded-[10px]`) |
| Zod validation pattern | `src/lib/validations/index.ts` | Extend existing product validation schema |

---

## Acceptance Criteria

- [ ] **GIVEN** a user opens the Product Form Modal, **WHEN** they switch to "Bulk / Box" mode and enter `₱1,500` box price for `50` pcs, **THEN** the live banner shows `₱30.00 / pc` and `unit_cost` is saved as `30.00`.
- [ ] **GIVEN** a product has `current_stock = 150` and `items_per_package = 50`, **WHEN** viewed in the Inventory Table, **THEN** the stock cell displays `150 pcs` with subtext `(3 boxes)`.
- [ ] **GIVEN** a product has `current_stock = 112` and `items_per_package = 50`, **WHEN** viewed in the Inventory Table, **THEN** it displays `112 pcs` with subtext `(2 boxes, 12 pcs)`.
- [ ] **GIVEN** a user uses the "+ Add Stock" action on a product with `50 pcs/box`, **WHEN** they enter `+2 boxes`, **THEN** `current_stock` increases by `100 pcs`.
- [ ] **GIVEN** a product has no package information (`items_per_package = 1`), **WHEN** rendered in the table, **THEN** only piece counts are displayed without empty box badges.
- [ ] All new code compiles cleanly with `npm run build` and TypeScript checks with zero errors.

---

## Edge Cases & Error Handling

| Scenario | Expected Behavior |
|---|---|
| User enters `items_per_package = 0` | Form validation error: "Items per package must be at least 1". Prevents division by zero. |
| Package price is modified during restock | System updates `package_price` and recalculates `unit_cost` for future sales. Existing historical sales records remain unaffected. |
| Stock falls below 1 box (e.g. 15 pcs remaining out of 50/box) | Display shows `15 pcs (0 boxes, 15 pcs)` and highlights Low Stock alert if `15 <= low_stock_threshold`. |
| Negative stock level (e.g., -5 pcs) | Display shows `-5 pcs` cleanly without attempting negative box math. |

---

## Security Considerations
- All new product attributes are protected under existing Supabase Row Level Security (RLS) policies (`auth.uid() = user_id`).
- Package calculations occur on client UI and are re-validated in Server Actions before database mutation.

---

## Out of Scope (Explicit Exclusions)
- ❌ **Supplier Directory / Order Tracking:** No formal B2B vendor tables or PO management needed (designed for direct online/Shopee purchases).
- ❌ **Recipe Multi-Level Gram Deductions:** Deductions remain per unit/piece in MVP.
- ❌ **Historical Purchase Price Logs:** Only the latest package price is saved on the product record.

---

## Recommended Skills
- `Next.js App Router` (Server Actions, revalidation)
- `TypeScript` & `Zod` (Schema extension & typing)
- `Tailwind CSS 4` (UI layout & responsive badges)
