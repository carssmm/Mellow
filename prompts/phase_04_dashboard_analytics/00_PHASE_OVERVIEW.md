# Phase 4: Dashboard & Analytics

> **Objective**: Build the financial dashboard with live daily metrics, activity log, breakeven goal tracker, historical sales charts with date filtering, and CSV data export.
> **Duration**: Days 12–14
> **Dependencies**: Phase 2 (Sales data exists in database)

---

## Phase Goals

1. ✅ Financial dashboard with 4-metric cards (Net Profit, Gross Sales, COGS, Low Stock Alerts)
2. ✅ Recent Activity Log and Daily Breakeven Goal tracker
3. ✅ Historical charts (monthly net profit) with date range filters
4. ✅ CSV export for sales and profit data

## Prompt Files in This Phase

| # | Prompt | Purpose |
|---|--------|---------|
| 4.1 | [01_financial_dashboard.md](01_financial_dashboard.md) | 4-metric dashboard matching UI reference |
| 4.2 | [02_activity_log_and_goals.md](02_activity_log_and_goals.md) | Activity log, breakeven goal, low stock sidebar |
| 4.3 | [03_historical_charts.md](03_historical_charts.md) | Recharts line/bar charts with date filters |
| 4.4 | [04_csv_export.md](04_csv_export.md) | Downloadable CSV reports |

## Skills to Load

- `frontend-design` — Dashboard layout, data visualization patterns
- `react-best-practices` — Server Components for data, Client Components for charts
- `web-performance-optimization` — Lazy loading charts, efficient queries

## Exit Criteria

- [ ] Dashboard shows today's Net Profit (emerald), Gross Sales, COGS, Low Stock count
- [ ] Recent Activity Log shows last sales with product names and amounts
- [ ] Breakeven Goal card shows progress bar and surplus/deficit
- [ ] Analytics page has historical charts with date range filters
- [ ] CSV download works for selected date ranges

---

**Next Phase**: [Phase 5: Polish, Mobile QA & Launch](../phase_05_polish_launch/00_PHASE_OVERVIEW.md)
