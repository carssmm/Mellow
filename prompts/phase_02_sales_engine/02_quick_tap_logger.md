# 2.2 Quick Tap Logger

## Context

<context>
This step builds the Quick Tap Logger — the primary mid-day sales recording interface. The café owner taps product tiles on their phone to instantly add items to a running cart. The interface matches the sales logger UI reference: a category filter bar, a product grid with tap-to-add tiles, and a sticky sidebar cart showing current sale items, total, payment method selector, and "Complete & Log Sale" button. This is the most-used feature during peak hours.
</context>

## Prerequisites

<prerequisites>
- Step 2.1 completed (Sales Logger layout with segmented control)
- Products available via props from the parent component
- Sales Logger UI reference for layout structure
</prerequisites>

## AI Implementation Prompt

<instructions>
Think step by step:

1. **Build the Quick Tap Mode: `src/components/sales/quick-tap-mode.tsx`**
   - `'use client'` component receiving `products: Product[]`
   - Two-column layout (desktop: 8 cols product grid / 4 cols cart):
     - `grid grid-cols-1 lg:grid-cols-12 gap-card-gap`
     - Left: `lg:col-span-8` — Category chips + Product grid
     - Right: `lg:col-span-4` — Sticky cart sidebar

2. **Category filter chips**
   - Row of pill-shaped filter buttons: All, Coffee, Non-Coffee, Pastries, Beans
   - Active chip: `bg-primary-container text-on-primary rounded-full`
   - Inactive chip: `bg-surface-container-high text-on-surface-variant border border-outline-variant rounded-full hover:bg-surface-variant`
   - Clicking a chip filters the product grid to show only that category
   - "All" shows all products
   - Categories are derived from the products data (use `getProductCategories` or extract from the products array)

3. **Product tile grid**
   - `grid grid-cols-2 md:grid-cols-3 gap-4`
   - Each tile matching the UI reference:
     - Card: `bg-surface rounded-xl border border-outline-variant p-4 shadow-soft h-48 hover:-translate-y-0.5 transition-transform cursor-pointer`
     - Top: Stock badge — `bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded text-xs` showing "[N] in stock"
     - Middle: Product name in `text-headline-md font-headline-md` with `group-hover:text-secondary`
     - Bottom: Price in `text-number-data font-number-data` on the left, circular "+" button on the right
     - "+" button: `bg-surface-container-high hover:bg-primary-container hover:text-on-primary w-8 h-8 rounded-full`
   - Tapping the tile OR the "+" button adds the item to the cart
   - If stock is 0, show a disabled/dimmed state with "Out of Stock" overlay

4. **Cart sidebar**
   - Sticky positioned: `lg:sticky lg:top-[96px]` (below nav)
   - Container: `bg-surface rounded-xl border border-outline-variant shadow-soft flex flex-col h-[calc(100vh-200px)]`
   - **Header**: "Current Sale" in `text-headline-md font-headline-md` with `border-b border-outline-variant`
   - **Cart items list** (scrollable):
     - Each item: `[Qty]x [Product Name]` on the left, `₱[Price]` on the right
     - Separated by `border-b border-outline-variant`
     - Include quantity increment/decrement buttons (+/-) for each item
     - Include a remove button (X) to remove item entirely
   - **Empty state**: Show a friendly message "Tap a product to start a sale" with a café icon
   - **Checkout section** (bottom, fixed):
     - Total: "Total" label + `₱X,XXX.XX` in `text-headline-lg font-headline-lg`
     - Payment method selector: 2-column grid with "Cash 💵" and "GCash / Maya 📱" buttons
       - Selected: `bg-primary-container text-on-primary border-primary-container`
       - Unselected: `bg-surface text-on-surface border border-outline-variant`
     - "Complete & Log Sale" button: `bg-[#D4A359] hover:bg-[#C58B38] text-white py-4 rounded-lg w-full` with right arrow icon
     - Disabled when cart is empty

5. **Cart state management**
   - Use `useReducer` or `useState` with an array of cart items:
     ```
     CartItem { productId, productName, quantity, unitPrice, unitCost }
     ```
   - Actions: addItem, removeItem, incrementQuantity, decrementQuantity, clearCart
   - When adding an item already in cart, increment its quantity
   - Total calculated as: `sum(item.quantity * item.unitPrice)`

6. **Handle the "Complete & Log Sale" action**
   - When clicked:
     - Show loading state on the button
     - Call a `recordQuickTapSale` Server Action (defined in Step 2.4) with:
       - cart items array
       - payment method
       - entry_mode: 'quick_tap'
     - On success: clear the cart, show a success toast/notification
     - On error: show error message, don't clear cart
</instructions>

<requirements>
### Functional Requirements
- Tapping a product tile adds it to the cart (or increments if already there)
- Category chips filter the product grid
- Cart shows quantity, item name, and price for each item
- Quantity can be adjusted with +/- buttons
- Items can be removed from the cart
- Payment method defaults to Cash, can switch to GCash/Maya
- "Complete & Log Sale" submits the cart to the server and clears it on success
- Out-of-stock products are visually dimmed and not tappable

### Technical Requirements
- Cart state is purely client-side (React state)
- Large touch targets: product tiles are at least 48px touchable area
- Cart sidebar is sticky on desktop, collapses to bottom sheet on mobile (or flows below product grid)
- Number formatting uses `formatCurrency()` utility

### File Naming Conventions
- `src/components/sales/quick-tap-mode.tsx`
</requirements>

<output_files>
1. `src/components/sales/quick-tap-mode.tsx` — Complete Quick Tap Logger mode
</output_files>

## Verification

<verification>
- [ ] Product grid shows all active products with stock badges, names, and prices
- [ ] Category chips filter products correctly
- [ ] Tapping a product adds it to the cart sidebar
- [ ] Cart shows correct quantities and calculated total
- [ ] +/- buttons adjust item quantities
- [ ] Payment method toggle works (Cash ↔ GCash/Maya)
- [ ] "Complete & Log Sale" button is disabled when cart is empty
- [ ] UI matches the sales logger reference screenshot
</verification>

---

**Previous**: [2.1 - Sales Logger Layout](./01_sales_logger_layout.md) | **Next**: [2.3 - Batch Entry & Reconciliation](./03_batch_entry_and_reconciliation.md)
