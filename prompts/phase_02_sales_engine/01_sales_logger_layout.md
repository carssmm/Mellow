# 2.1 Sales Logger Layout

## Context

<context>
This step creates the Sales Logger page shell with a segmented control that switches between three modes: Quick Tap Logger, Batch Daily Entry, and Cash Drawer Closing. The layout matches the sales logger UI reference — a header with the page title, segmented control tabs, and a content area that renders the active mode's interface. This is the container; the individual mode components are built in Steps 2.2 and 2.3.
</context>

## Prerequisites

<prerequisites>
- Phase 1 completed (Auth, Products, Inventory)
- Sales Logger UI reference at `Mellow UI/sales_logger_mellow_caf/code.html` and `screen.png`
- Products can be fetched via `getProducts()` Server Action
</prerequisites>

## AI Implementation Prompt

<instructions>
Think step by step:

1. **Create the Sales Logger page: `src/app/(dashboard)/sales/page.tsx`**
   - Server Component that fetches all active products
   - Passes products to a Client Component wrapper
   - Page structure:
     - Header: "Record Transactions" in `text-headline-lg font-headline-lg`
     - Subtitle: "Log real-time sales or batch entries for the day." in `text-body-md text-on-surface-variant`
     - Segmented control positioned to the right of the header on desktop, below on mobile

2. **Create the Sales Logger Client wrapper: `src/components/sales/sales-logger.tsx`**
   - `'use client'` component that manages mode state
   - Props: `products: Product[]`
   - State: `activeMode: 'quick_tap' | 'batch' | 'reconciliation'`
   - Renders the segmented control and conditionally renders the active mode component

3. **Create the Segmented Control: `src/components/ui/segmented-control.tsx`**
   - A reusable segmented control component matching the UI reference:
     - Container: `bg-surface-container-high p-1 rounded-lg border border-outline-variant/50`
     - Active segment: `bg-surface text-primary shadow-sm rounded-md`
     - Inactive segment: `text-on-surface-variant hover:text-primary`
     - Each segment: `px-4 py-2 text-label-md font-label-md flex items-center gap-2`
   - Three segments with emoji icons:
     - ⚡ Quick Tap Logger
     - 📝 Batch Daily Entry
     - 💵 Cash Drawer Closing
   - Props: `options: { value, label, icon }[]`, `value: string`, `onChange: (value) => void`
   - Smooth transition between active states

4. **Set up placeholder components for each mode**
   - `src/components/sales/quick-tap-mode.tsx` — Placeholder "Quick Tap Logger coming in Step 2.2"
   - `src/components/sales/batch-entry-mode.tsx` — Placeholder "Batch Entry coming in Step 2.3"
   - `src/components/sales/cash-reconciliation-mode.tsx` — Placeholder "Cash Reconciliation coming in Step 2.3"
   - Each receives `products: Product[]` as prop
</instructions>

<requirements>
### Functional Requirements
- Segmented control switches between three modes without page navigation
- Active mode is visually highlighted with white background and shadow
- Default mode on page load is "Quick Tap Logger"
- Products are fetched once on the server and passed to all mode components

### Technical Requirements
- Page is a Server Component; Sales Logger wrapper is a Client Component
- Segmented control is a reusable UI component (not hardcoded to sales modes)
- Use React `useState` for mode switching
- Layout must be responsive: segmented control goes below header on mobile

### File Naming Conventions
- `src/app/(dashboard)/sales/page.tsx`
- `src/components/sales/sales-logger.tsx`
- `src/components/ui/segmented-control.tsx`
</requirements>

<output_files>
1. `src/app/(dashboard)/sales/page.tsx` — Sales Logger page
2. `src/components/sales/sales-logger.tsx` — Client wrapper with mode state
3. `src/components/ui/segmented-control.tsx` — Reusable segmented control
4. `src/components/sales/quick-tap-mode.tsx` — Placeholder
5. `src/components/sales/batch-entry-mode.tsx` — Placeholder
6. `src/components/sales/cash-reconciliation-mode.tsx` — Placeholder
</output_files>

## Verification

<verification>
- [ ] `/sales` page renders with "Record Transactions" header
- [ ] Segmented control shows three options with emoji icons
- [ ] Clicking each segment switches the visible mode (shows placeholder text)
- [ ] Active segment has white background with shadow
- [ ] Layout is responsive: control stacks below header on mobile
- [ ] `npx tsc --noEmit` passes
</verification>

---

**Next**: [2.2 - Quick Tap Logger](./02_quick_tap_logger.md)
