# 2.3 Batch Entry & Cash Reconciliation

## Context

<context>
This step builds the remaining two sales modes: Batch Daily Entry (for end-of-day bulk quantity logging) and Cash Drawer Reconciliation (for closing the cash register). Batch Entry lets the owner enter how many of each product were sold that day in a single form. Cash Reconciliation calculates the expected cash based on the starting float plus cash sales, compares it to the physical ending cash, and highlights any discrepancy (over/short).
</context>

## Prerequisites

<prerequisites>
- Step 2.1 completed (Sales Logger layout with mode switching)
- Products available via props
- Cash reconciliation formulas from spec Section 3, Feature 1
</prerequisites>

## AI Implementation Prompt

<instructions>
Think step by step:

1. **Build the Batch Entry Mode: `src/components/sales/batch-entry-mode.tsx`**
   - `'use client'` component receiving `products: Product[]`
   - Layout: A full-width card containing a table/list of all active products
   - For each product, show:
     - Product name and category
     - Current selling price (₱)
     - A number input for "Qty Sold Today" (default 0, min 0)
     - Line total: `qty × selling_price` displayed next to each row
   - Bottom summary section:
     - Total Items Sold: sum of all quantities
     - Gross Revenue: sum of all `qty × selling_price`
     - Total COGS: sum of all `qty × unit_cost`
     - Net Profit: `Gross Revenue - Total COGS`
   - Submit button: "Record Batch Sales" (charcoal primary button)
   - All calculations update in real-time as the owner types quantities
   - Payment method selector (same as Quick Tap — Cash / GCash/Maya)
   - On submit: call `recordBatchSale` Server Action with all quantities > 0, payment method, entry_mode 'batch'

2. **Build the Cash Reconciliation Mode: `src/components/sales/cash-reconciliation-mode.tsx`**
   - `'use client'` component
   - Layout: Two main sections in a card
   
   **Section 1: Cash Drawer Inputs**
   - Starting Cash Float (₱): number input with currency icon
     - Label: "Starting Cash Float"
     - Helper text: "The cash amount in your drawer at the start of the day"
   - Ending Physical Cash (₱): number input with currency icon
     - Label: "Ending Physical Cash"
     - Helper text: "Count and enter the total cash in your drawer now"
   
   **Section 2: Calculated Results (auto-calculated, read-only)**
   - Today's Cash Sales: fetched from today's recorded cash sales
     - Display: `₱X,XXX.XX` (from today's sales where payment_method = 'cash')
   - Expected Cash: `Starting Float + Cash Sales`
   - Cash Discrepancy: `Ending Physical Cash - Expected Cash`
     - If positive: green text "₱X.XX Over" with upward icon
     - If negative: red text "₱X.XX Short" with warning icon
     - If zero: green text "Balanced ✓"
   
   **Section 3: Day Summary (after recording)**
   - Total Revenue today
   - Total COGS today
   - Net Profit today (in emerald green)
   
   - Submit button: "Close Cash Drawer & Record" (charcoal primary)
   - On submit: call `recordReconciliation` Server Action with starting_float, ending_cash, entry_mode 'reconciliation'
   - After successful recording, show the day summary section

3. **Build a success toast/notification component: `src/components/ui/toast.tsx`**
   - Simple toast notification that appears at the top-right or bottom of the screen
   - Variants: `success` (emerald background), `error` (red background), `warning` (amber background)
   - Auto-dismisses after 3 seconds
   - Shows an icon + message text
   - Used by both Quick Tap and Batch Entry on successful sale recording
</instructions>

<requirements>
### Functional Requirements
- Batch Entry: real-time calculation of totals as quantities are entered
- Batch Entry: only submits products with quantity > 0
- Cash Reconciliation: Expected Cash = Starting Float + Today's Cash Sales
- Cash Reconciliation: Discrepancy = Ending Physical Cash - Expected Cash
- Cash Reconciliation: color-coded discrepancy (green = over/balanced, red = short)
- Toast notification after successful sale recording

### Technical Requirements
- Number inputs must prevent negative values (min=0)
- Currency calculations use proper decimal arithmetic (avoid floating point issues)
- Cash Reconciliation needs to fetch today's total cash sales (may need a Server Action or prop)
- All monetary displays use `formatCurrency()` utility

### File Naming Conventions
- `src/components/sales/batch-entry-mode.tsx`
- `src/components/sales/cash-reconciliation-mode.tsx`
- `src/components/ui/toast.tsx`
</requirements>

<output_files>
1. `src/components/sales/batch-entry-mode.tsx` — Batch Daily Entry mode
2. `src/components/sales/cash-reconciliation-mode.tsx` — Cash Drawer Reconciliation mode
3. `src/components/ui/toast.tsx` — Toast notification component
</output_files>

## Verification

<verification>
- [ ] Batch Entry shows all products with quantity inputs
- [ ] Typing quantities updates totals (revenue, COGS, profit) in real-time
- [ ] Cash Reconciliation calculates Expected Cash correctly
- [ ] Cash discrepancy is color-coded (green/red)
- [ ] Toast appears after successful sale recording
- [ ] Both modes submit data correctly to Server Actions
</verification>

---

**Previous**: [2.2 - Quick Tap Logger](./02_quick_tap_logger.md) | **Next**: [2.4 - Sales Data Layer](./04_sales_data_layer.md)
