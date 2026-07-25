# 4.1 Financial Dashboard

## Context

<context>
This step builds the main dashboard page — the first thing the café owner sees after login. It matches the dashboard UI reference with a greeting header, quick action buttons, and a 4-column metrics grid showing today's financial snapshot. The data comes from the `getTodaysSummary()` and `getLowStockProducts()` Server Actions built in previous phases.
</context>

## Prerequisites

<prerequisites>
- Phase 2 completed (sales data exists, `getTodaysSummary()` available)
- Phase 1 completed (`getLowStockProducts()` available)
- Dashboard UI reference at `Mellow UI/dashboard_mellow_caf/code.html` and `screen.png`
</prerequisites>

## AI Implementation Prompt

<instructions>
1. **Build the Dashboard page: `src/app/(dashboard)/page.tsx`**
   - Server Component that fetches today's summary and low-stock count
   - Structure matching the dashboard UI reference:

   **Header section:**
   - Greeting: "Good [morning/afternoon/evening], Mellow Café ☕" using `getGreeting()` utility
   - Subtitle: "Here is your live daily financial summary and stock alerts."
   - Right side buttons:
     - "End-of-Day Closing" — secondary outline button (links to `/sales` with reconciliation mode)
     - "Record New Sale" — primary charcoal button with + icon (links to `/sales`)

   **4-Column Metrics Grid:**
   - `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-card-gap`
   - Each metric card: `bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-ambient`

   Card 1: **Today's Net Profit**
   - Label: "Today's Net Profit" with chart icon
   - Value: `₱X,XXX.XX` in `text-[32px] font-bold text-emerald-600`

   Card 2: **Gross Sales**
   - Label: "Gross Sales" with POS icon
   - Value: `₱X,XXX.XX` in `text-[32px] font-bold text-primary`

   Card 3: **Total COGS**
   - Label: "Total COGS" with receipt icon
   - Value: `₱X,XXX.XX` in `text-[32px] font-bold text-primary`

   Card 4: **Low Stock Alerts**
   - Label: "Low Stock Alerts" with warning icon (amber, filled)
   - Value: "X Items Low" in `text-[32px] font-bold text-amber-600`
   - Subtle amber background overlay: `bg-secondary-fixed/20`

2. **Use Material Symbols icons for each metric:**
   - Net Profit: `monitoring`
   - Gross Sales: `point_of_sale`
   - Total COGS: `receipt_long`
   - Low Stock: `warning` (filled variant)
</instructions>

<requirements>
### Functional Requirements
- Dashboard displays today's financial data in Philippine Pesos
- Metrics refresh when the page is loaded (Server Component fetch)
- Net Profit displayed in emerald green
- Low Stock count in amber with warning icon
- Quick action buttons link to the Sales Logger page

### Technical Requirements
- Server Component — data fetched on the server, no client-side loading
- Uses `getTodaysSummary()` and `getLowStockProducts()` Server Actions
- Currency formatted with `formatCurrency()` utility
</requirements>

<output_files>
1. `src/app/(dashboard)/page.tsx` — Dashboard page with metrics grid
</output_files>

## Verification

<verification>
- [ ] Dashboard shows 4 metric cards with correct data
- [ ] Net Profit in emerald green, Low Stock in amber
- [ ] Greeting updates based on time of day
- [ ] Quick action buttons navigate to `/sales`
- [ ] Layout matches the dashboard UI reference
</verification>

---

**Next**: [4.2 - Activity Log & Goals](./02_activity_log_and_goals.md)
