# 4.3 Historical Charts

## Context

<context>
This step builds the Analytics page with historical sales and profit charts using Recharts. It includes date range filters (Today, Last 7 Days, This Month, Custom Range) and a top-selling items ranking. This implements Feature 6 (Historical Reports) from the project specification.
</context>

## Prerequisites

<prerequisites>
- Recharts installed (Phase 0)
- Sales data in database (Phase 2)
- Analytics UI reference at `Mellow UI/analytics_mellow_caf/`
</prerequisites>

## AI Implementation Prompt

<instructions>
1. **Create the Analytics page: `src/app/(dashboard)/analytics/page.tsx`**
   - Server Component that fetches initial data for the default date range (This Month)
   - Header: "Sales & Profit Analytics" with date filter controls
   - Passes data to a Client Component for interactive charting

2. **Create Analytics Client Component: `src/components/analytics/analytics-dashboard.tsx`**
   - `'use client'` — handles date filter state and chart rendering
   - **Date range filters**: pill buttons for Today, Last 7 Days, This Month, Custom Range
   - **Custom Range**: two date inputs (from/to) that appear when "Custom Range" is selected
   - When filter changes, fetch new data via Server Action

3. **Charts section (Recharts)**
   - **Monthly Net Profit Chart**: Line or Bar chart showing daily net profit for the selected period
     - X-axis: dates, Y-axis: ₱ amounts
     - Line color: emerald green (#2D6A4F)
     - Grid: subtle, matching the oatmeal aesthetic
     - Tooltip: shows date and ₱ amount on hover
   - **Revenue vs COGS Chart**: Stacked bar chart or dual-line chart
     - Revenue in charcoal, COGS in amber
   - Chart cards: white background, border, rounded-xl, shadow-ambient

4. **Top-Selling Items Ranking**
   - A card showing top 5 products by quantity sold in the selected period
   - Each item: rank number, product name, quantity sold, total revenue
   - Sorted by total revenue descending

5. **Create analytics Server Actions: `src/app/(dashboard)/analytics/actions.ts`**
   - `getSalesAnalytics(startDate, endDate)` — returns daily aggregated sales data for charts
   - `getTopSellingProducts(startDate, endDate, limit)` — returns top products by revenue
   - Both use Philippine Time (UTC+8) for date boundaries

6. **Style the charts to match the Mellow aesthetic**
   - Use Manrope font for chart labels
   - Colors: emerald for profit, charcoal for revenue, amber for costs
   - Background: transparent (card handles the background)
   - Grid lines: very subtle `#E6E1DA` color
</instructions>

<requirements>
### Functional Requirements
- Charts show real sales data from the database
- Date filters change the displayed data range
- Top-selling items ranked by revenue
- All amounts in Philippine Pesos

### Technical Requirements
- Recharts components: `LineChart`, `BarChart`, `ResponsiveContainer`, `Tooltip`, `Legend`
- Recharts is a client-side library — charts must be in Client Components
- Date range queries use `date-fns` for date arithmetic
- Server Actions handle data aggregation queries
</requirements>

<output_files>
1. `src/app/(dashboard)/analytics/page.tsx` — Analytics page
2. `src/components/analytics/analytics-dashboard.tsx` — Chart client component
3. `src/app/(dashboard)/analytics/actions.ts` — Analytics Server Actions
</output_files>

## Verification

<verification>
- [ ] Analytics page shows charts with real data
- [ ] Date filters (Today, 7 Days, Month, Custom) change the chart data
- [ ] Top-selling items list shows correct rankings
- [ ] Charts styled with Mellow colors (emerald, charcoal, amber)
- [ ] Charts are responsive (shrink on mobile)
</verification>

---

**Previous**: [4.2 - Activity Log & Goals](./02_activity_log_and_goals.md) | **Next**: [4.4 - CSV Export](./04_csv_export.md)
