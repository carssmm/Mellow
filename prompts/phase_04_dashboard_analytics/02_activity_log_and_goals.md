# 4.2 Activity Log & Goals

## Context

<context>
This step adds the two-column section below the metrics grid on the dashboard: the Recent Activity Log (left, wider) showing the last sales transactions, and the right sidebar with the Daily Breakeven Goal progress card and Top Low Stock Items list. These match the dashboard UI reference's lower section.
</context>

## Prerequisites

<prerequisites>
- Step 4.1 completed (dashboard metrics grid)
- `getTodaySales()` Server Action available
- `getLowStockProducts()` Server Action available
- Expenses data for breakeven calculation (or use a hardcoded daily target for MVP)
</prerequisites>

## AI Implementation Prompt

<instructions>
1. **Add the 2-column section to the Dashboard page**
   - Below the metrics grid: `grid grid-cols-1 lg:grid-cols-3 gap-card-gap`
   - Left column: `lg:col-span-2` — Recent Activity Log
   - Right column: Breakeven Goal + Top Low Stock Items

2. **Recent Activity Log card**
   - Title: "Recent Activity Log" in `text-headline-md font-headline-md`
   - List of recent sales, each row:
     - Left: circular icon (40px, `bg-surface-container-high`) with product-category icon (local_cafe, bakery_dining, coffee)
     - Product name in semibold, detail line: "x[qty] • [time ago]"
     - Right: `₱X,XXX.XX` in `text-number-data font-number-data`
   - Separated by `border-b border-outline-variant`
   - Show the last 5-10 sales items
   - Use `date-fns` `formatDistanceToNow()` for "2 mins ago", "45 mins ago"

3. **Daily Breakeven Goal card**
   - Title: "Daily Breakeven Goal"
   - Target amount (from expenses or hardcoded for MVP): "Target: ₱3,000"
   - Progress percentage: `(todayRevenue / target * 100)%`
   - Progress bar: `bg-surface-variant rounded-full h-2` with filled portion `bg-primary-container`
   - If exceeded: green text "Goal exceeded by ₱X,XXX" with check_circle icon
   - If not met: amber text "₱X,XXX remaining to break even"

4. **Top Low Stock Items card**
   - Title: "Top Low Stock Items"
   - List of 3-5 low stock products:
     - Left: circular icon (32px, `bg-secondary-fixed/30`) with category icon in amber
     - Product name
     - Right: stock badge "X [unit] left" in `bg-secondary-fixed/50`
   - Sorted by lowest stock first

5. **Create a Server Action for recent activity: `src/app/(dashboard)/actions.ts`**
   - `getRecentSales(limit: number)` — returns the last N sales with their items and product names
   - Joins sales → sales_items → products to get product names and icons
</instructions>

<requirements>
### Functional Requirements
- Activity log shows real sales data with relative timestamps
- Breakeven goal tracks progress toward a daily revenue target
- Low stock items highlight the most urgent restocking needs

### Technical Requirements
- Server Component fetches data
- Use `date-fns` for relative time formatting
- Limit activity log to prevent performance issues
</requirements>

<output_files>
1. `src/app/(dashboard)/page.tsx` — MODIFIED: Add activity log and goals sections
2. `src/app/(dashboard)/actions.ts` — NEW: Dashboard-specific Server Actions
</output_files>

## Verification

<verification>
- [ ] Activity log shows recent sales with product names, quantities, times, and amounts
- [ ] Breakeven goal shows progress bar and surplus/deficit message
- [ ] Low stock items list matches products below threshold
- [ ] Layout matches the dashboard UI reference (2-column: wide left, narrow right)
</verification>

---

**Previous**: [4.1 - Financial Dashboard](./01_financial_dashboard.md) | **Next**: [4.3 - Historical Charts](./03_historical_charts.md)
