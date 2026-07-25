# Phase 3: Shopping List & Calculators

> **Objective**: Build the automated shopping list generator (auto-populates from low-stock items with one-tap clipboard/WhatsApp copy) and the business calculators (Item Margin & Pricing, Café Breakeven).
> **Duration**: Days 9–11
> **Dependencies**: Phase 2 (Sales engine — stock levels are now dynamic)

---

## Phase Goals

1. ✅ Smart Restock List auto-generated from low-stock products with recommended purchase quantities
2. ✅ One-tap "Copy to WhatsApp/SMS" and "Copy Plain Text List" buttons
3. ✅ Item Margin & Pricing Calculator with real-time results
4. ✅ Café Breakeven Calculator with daily target insight

## Prompt Files in This Phase

| # | Prompt | Purpose |
|---|--------|---------|
| 3.1 | [01_automated_shopping_list.md](01_automated_shopping_list.md) | Restock list from low-stock items |
| 3.2 | [02_clipboard_share_actions.md](02_clipboard_share_actions.md) | Copy to clipboard and share actions |
| 3.3 | [03_business_calculators.md](03_business_calculators.md) | Margin and breakeven calculator page |

## Skills to Load

- `react-patterns` — Component composition, controlled inputs
- `frontend-dev-guidelines` — Form UX, real-time calculations
- `form-cro` — Form conversion optimization, input UX

## Exit Criteria

- [ ] Smart Restock List shows items where stock ≤ threshold
- [ ] Recommended qty = `max(0, target_stock - current_stock)`
- [ ] "Copy to WhatsApp/SMS" copies formatted list to clipboard
- [ ] Margin Calculator computes profit and margin % from cost and price
- [ ] Breakeven Calculator shows monthly items needed and daily cups target
- [ ] All calculations update in real-time as inputs change

---

**Next Phase**: [Phase 4: Dashboard & Analytics](../phase_04_dashboard_analytics/00_PHASE_OVERVIEW.md)
