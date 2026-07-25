# Phase 2: Multi-Mode Sales Engine

> **Objective**: Build the complete sales recording interface with three modes: Quick Tap Logger (tap product tiles to add to cart), Batch Daily Entry (enter quantities for all products at end of day), and Cash Drawer Reconciliation (starting float vs ending cash calculation). All sales decrement inventory stock and record transaction data.
> **Duration**: Days 5–8 (estimated 10–14 hours for AI agent execution)
> **Dependencies**: Phase 1 must be fully complete (Auth, Product CRUD, Inventory page)

---

## Phase Goals

1. ✅ Sales Logger page with segmented control switching between three modes
2. ✅ Quick Tap Logger: product grid with category filters, tap-to-add, sticky cart sidebar, payment method selection
3. ✅ Batch Daily Entry: quantity inputs for all products, submit all at once
4. ✅ Cash Drawer Reconciliation: starting float, ending cash, expected vs actual, discrepancy alert
5. ✅ Sales data layer: Server Actions for recording sales, stock decrement, negative stock warnings

## Prompt Files in This Phase

| # | Prompt | Purpose |
|---|--------|---------|
| 2.1 | [01_sales_logger_layout.md](01_sales_logger_layout.md) | Page layout with segmented control for 3 modes |
| 2.2 | [02_quick_tap_logger.md](02_quick_tap_logger.md) | Product grid, category chips, cart sidebar, checkout |
| 2.3 | [03_batch_entry_and_reconciliation.md](03_batch_entry_and_reconciliation.md) | Batch entry form + Cash drawer closing |
| 2.4 | [04_sales_data_layer.md](04_sales_data_layer.md) | Server Actions for sales recording and stock updates |

## Key Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| State management | React useState + useReducer | Cart state is local to the session, no global store needed |
| Payment methods | Cash and GCash/Maya toggle | Matches Philippines payment landscape per UI reference |
| Stock decrement | Immediate on sale completion | Spec requires: "Sales immediately decrement unit inventory stock levels" |
| Price snapshot | Captured at time of sale | `sales_items` stores `unit_price` and `unit_cost` to preserve historical accuracy |

## Skills to Load

Before starting this phase, load these skill files from `Essentials/skills/[skill-id]/SKILL.md`:
- `react-patterns` — React hooks, useReducer for cart state, composition patterns
- `cc-skill-frontend-patterns` — State management, form handling, optimistic updates
- `react-ui-patterns` — Loading states, error states, empty states, toast notifications
- `cc-skill-backend-patterns` — Database transactions, data consistency, error handling

## Exit Criteria

Before moving to Phase 3, verify:

- [ ] Sales Logger page shows three modes via segmented control
- [ ] Quick Tap: tapping a product adds it to the cart sidebar
- [ ] Quick Tap: category chips filter the product grid
- [ ] Quick Tap: "Complete & Log Sale" records the sale and decrements stock
- [ ] Batch Entry: quantity inputs for all products, single submit
- [ ] Cash Reconciliation: calculates Expected Cash and shows Over/Short discrepancy
- [ ] All sales create records in the `sales` and `sales_items` tables
- [ ] Product stock levels update after each sale
- [ ] Negative stock shows a warning but doesn't block the sale
- [ ] Payment method (Cash / GCash/Maya) is recorded with each sale

---

**Previous Phase**: [Phase 1: Auth & Product CRUD](../phase_01_auth_products/00_PHASE_OVERVIEW.md)
**Next Phase**: [Phase 3: Shopping List & Calculators](../phase_03_shopping_calculators/00_PHASE_OVERVIEW.md)
