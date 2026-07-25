# 3.3 Business Calculators

## Context

<context>
This step builds the Business Calculators page matching the calculators UI reference. It contains two side-by-side calculator cards: the Item Margin & Pricing Calculator (input COGS + selling price, get profit and margin %) and the Café Breakeven Calculator (input monthly fixed costs + average margin, get monthly items needed and daily cups target). All calculations update in real-time as the owner types.
</context>

## Prerequisites

<prerequisites>
- Phase 0 completed (design system)
- Calculators UI reference at `Mellow UI/calculators_mellow_caf/code.html` and `screen.png`
- Business rules from spec Section 3, Feature 5
</prerequisites>

## AI Implementation Prompt

<instructions>
1. **Create the Calculators page: `src/app/(dashboard)/calculators/page.tsx`**
   - Can be a Client Component since it's purely interactive (no server data needed)
   - Header:
     - Title: "Business Calculators" in `text-headline-lg font-headline-lg`
     - Subtitle: "Precision tools for pricing and forecasting. Optimize your margins and understand your daily targets with our intentional financial models."
   - Two-column grid on desktop: `grid grid-cols-1 lg:grid-cols-2 gap-card-gap`

2. **Item Margin & Pricing Calculator card**
   - Card header: calculator icon + "Item Margin & Pricing Calculator" in `text-headline-md font-headline-md`
   - Divider line
   - Inputs:
     - "Item Cost (₱)" — number input, default empty
     - "Selling Price (₱)" — number input, default empty
   - Results section (auto-calculated, appears below inputs):
     - Container: `bg-surface-container-low rounded-xl p-6`
     - "RESULTS" label in uppercase, small, muted
     - Net Profit: `₱[selling_price - unit_cost]` in emerald green, large text
     - Margin: `[((selling_price - unit_cost) / selling_price) * 100]%` in large text
   - Calculations:
     - `profit = sellingPrice - itemCost`
     - `margin = ((sellingPrice - itemCost) / sellingPrice) * 100`
   - Edge cases: if selling price is 0 or less than cost, show appropriate values (negative profit, negative/zero margin)
   - Input styling: `bg-[#FAFAFA]` background, `rounded-[10px]`, focus border `border-[#D4A359]`

3. **Café Breakeven Calculator card**
   - Card header: café icon + "Café Breakeven Calculator" in `text-headline-md font-headline-md`
   - Divider line
   - Inputs:
     - "Monthly Fixed Costs (₱)" — number input (rent, utilities, etc.)
     - "Average Gross Margin per Item (₱)" — number input
   - Results section:
     - Container: `bg-surface-container-low rounded-xl p-6`
     - "TARGETS" label in uppercase
     - Monthly Sales Needed: `[monthlyFixedCosts / averageMargin]` items — large number with "items" unit label
     - Daily Target (30 days): `[monthlyTarget / 30]` cups — large number with "cups" unit label
   - Insight callout (amber/golden background):
     - 💡 "Insight: Every sale after cup #[dailyTarget] daily is pure profit!"
   - Calculations:
     - `monthlyItemsNeeded = Math.ceil(monthlyFixedCosts / averageMargin)`
     - `dailyCupsTarget = (monthlyItemsNeeded / 30).toFixed(1)`
   - Edge case: if averageMargin is 0 or negative, show "N/A" or infinity warning

4. **Real-time calculation behavior**
   - Use `useState` for all input values
   - Results update on every keystroke (controlled inputs)
   - Show results section only when inputs are valid (both > 0)
   - Use `formatCurrency()` for ₱ formatting in results
</instructions>

<requirements>
### Functional Requirements
- Margin Calculator: `Margin % = ((Selling Price - COGS) / Selling Price) * 100`
- Breakeven Calculator: `Breakeven Items/Day = Monthly Fixed Costs / (Average Margin per Item × 30 days)`
- All calculations update in real-time
- Results formatted with ₱ currency symbol
- Insight callout provides actionable business intelligence

### Technical Requirements
- Client Component (`'use client'`) — no server data needed
- Controlled inputs with `useState`
- Guard against division by zero
- Number inputs with step="0.01" for peso precision
</requirements>

<output_files>
1. `src/app/(dashboard)/calculators/page.tsx` — Business Calculators page
</output_files>

## Verification

<verification>
- [ ] Navigating to `/calculators` shows two calculator cards side-by-side
- [ ] Entering Cost=45, Price=130 shows Profit=₱85.00 and Margin=65.38%
- [ ] Entering Fixed Costs=18275, Margin=85 shows ~215 monthly items, ~7.2 daily cups
- [ ] Insight callout appears with correct cup number
- [ ] Layout matches the calculators UI reference
- [ ] Results update in real-time as inputs change
</verification>

---

**Previous**: [3.2 - Clipboard & Share](./02_clipboard_share_actions.md) | **Next**: [Phase 3 Checklist](./99_PHASE_CHECKLIST.md)
