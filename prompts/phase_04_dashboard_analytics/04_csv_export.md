# 4.4 CSV Export

## Context

<context>
This step adds CSV download functionality so the café owner can export sales and profit data for bookkeeping. The export respects the selected date range from the Analytics page and generates a downloadable file with all transaction details.
</context>

## Prerequisites

<prerequisites>
- Step 4.3 completed (Analytics page with date filters)
- Sales data available via Server Actions
</prerequisites>

## AI Implementation Prompt

<instructions>
1. **Create CSV export utility: `src/lib/csv-export.ts`**

   **`generateSalesCSV(sales, dateRange)`:**
   - Headers: Date, Product, Quantity, Unit Price (₱), Unit Cost (₱), Revenue (₱), COGS (₱), Profit (₱), Payment Method, Entry Mode
   - One row per sales_item (joins with sale date and product name)
   - Summary row at bottom: Total Revenue, Total COGS, Total Net Profit

   **`generateProfitSummaryCSV(dailyData, dateRange)`:**
   - Headers: Date, Gross Revenue (₱), Total COGS (₱), Net Profit (₱), Items Sold, Transactions
   - One row per day

   **`downloadCSV(csvString, filename)`:**
   - Create a Blob from the CSV string
   - Create a temporary download link
   - Trigger the download with the filename: `mellow_sales_[startDate]_to_[endDate].csv`

2. **Add export buttons to the Analytics page**
   - "Export Sales Detail" button — downloads the detailed sales CSV
   - "Export Profit Summary" button — downloads the daily summary CSV
   - Both use the current date range filter
   - Buttons styled as secondary outline with download icon
   - Show loading state during CSV generation

3. **Create a Server Action for export data: add to `src/app/(dashboard)/analytics/actions.ts`**
   - `getExportData(startDate, endDate)` — returns all sales with items for the date range
   - Returns full detail needed for CSV generation
</instructions>

<requirements>
### Functional Requirements
- CSV downloads contain accurate sales data for the selected date range
- File names include the date range for easy identification
- CSV format is compatible with Excel, Google Sheets, and other spreadsheet tools
- Summary row provides quick totals

### Technical Requirements
- CSV generation happens client-side (after fetching data from Server Action)
- Use proper CSV escaping for product names that may contain commas
- Blob download approach works across modern browsers
- Date formatting in CSV uses YYYY-MM-DD for consistency
</requirements>

<output_files>
1. `src/lib/csv-export.ts` — CSV generation and download utilities
2. `src/components/analytics/analytics-dashboard.tsx` — MODIFIED: Add export buttons
3. `src/app/(dashboard)/analytics/actions.ts` — MODIFIED: Add export data action
</output_files>

## Verification

<verification>
- [ ] "Export Sales Detail" downloads a CSV with all transaction line items
- [ ] "Export Profit Summary" downloads a CSV with daily totals
- [ ] CSV opens correctly in Excel/Google Sheets
- [ ] Date range filter affects which data is exported
- [ ] File names include date range
</verification>

---

**Previous**: [4.3 - Historical Charts](./03_historical_charts.md) | **Next**: [Phase 4 Checklist](./99_PHASE_CHECKLIST.md)
