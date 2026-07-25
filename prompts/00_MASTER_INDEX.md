# Mellow Café System — Implementation Guide

> Generated from `project_specification.md`
> Total Phases: 6 (Phase 0–5)
> Total Step Prompts: 23
> Estimated Duration: 16 days

## Quick Start

1. Start with Phase 0 and complete all steps in order
2. Each step has its own prompt file — feed it to your AI coding agent
3. Complete the phase checklist (`99_PHASE_CHECKLIST.md`) before moving to the next phase
4. Skills are loaded from `Essentials/skills/[skill-id]/SKILL.md`

## Phase Overview

| Phase | Name | Steps | Focus |
|-------|------|-------|-------|
| 0 | [Setup & Infrastructure](./phase_00_setup/00_PHASE_OVERVIEW.md) | 4 | Next.js scaffolding, Tailwind design tokens, Supabase schema, directory structure |
| 1 | [Auth & Product CRUD](./phase_01_auth_products/00_PHASE_OVERVIEW.md) | 5 | Supabase client, login page, auth middleware, product CRUD, inventory UI |
| 2 | [Multi-Mode Sales Engine](./phase_02_sales_engine/00_PHASE_OVERVIEW.md) | 4 | Quick Tap, Batch Entry, Cash Reconciliation, sales data layer |
| 3 | [Shopping List & Calculators](./phase_03_shopping_calculators/00_PHASE_OVERVIEW.md) | 3 | Auto restock list, clipboard/share, margin & breakeven calculators |
| 4 | [Dashboard & Analytics](./phase_04_dashboard_analytics/00_PHASE_OVERVIEW.md) | 4 | Financial dashboard, activity log, charts, CSV export |
| 5 | [Polish, Mobile QA & Launch](./phase_05_polish_launch/00_PHASE_OVERVIEW.md) | 3 | PWA setup, mobile polish, Vercel deployment |

## Dependency Graph

```
Phase 0 (Setup & Infrastructure)
    ↓
Phase 1 (Auth & Product CRUD)
    ↓
Phase 2 (Multi-Mode Sales Engine)
    ↓
Phase 3 (Shopping List & Calculators)
    ↓
Phase 4 (Dashboard & Analytics)
    ↓
Phase 5 (Polish, Mobile QA & Launch)
```

## All Prompt Files

### Phase 0: Setup & Infrastructure
- [0.1 - Next.js Project Init](./phase_00_setup/01_nextjs_project_init.md)
- [0.2 - Tailwind Design Tokens](./phase_00_setup/02_tailwind_design_tokens.md)
- [0.3 - Supabase Setup](./phase_00_setup/03_supabase_setup.md)
- [0.4 - Directory Structure](./phase_00_setup/04_directory_structure.md)

### Phase 1: Auth & Product CRUD
- [1.1 - Supabase Client Setup](./phase_01_auth_products/01_supabase_client_setup.md)
- [1.2 - Auth Login Page](./phase_01_auth_products/02_auth_login_page.md)
- [1.3 - Auth Middleware Protection](./phase_01_auth_products/03_auth_middleware_protection.md)
- [1.4 - Product CRUD API](./phase_01_auth_products/04_product_crud_api.md)
- [1.5 - Product Inventory Page](./phase_01_auth_products/05_product_inventory_page.md)

### Phase 2: Multi-Mode Sales Engine
- [2.1 - Sales Logger Layout](./phase_02_sales_engine/01_sales_logger_layout.md)
- [2.2 - Quick Tap Logger](./phase_02_sales_engine/02_quick_tap_logger.md)
- [2.3 - Batch Entry & Reconciliation](./phase_02_sales_engine/03_batch_entry_and_reconciliation.md)
- [2.4 - Sales Data Layer](./phase_02_sales_engine/04_sales_data_layer.md)

### Phase 3: Shopping List & Calculators
- [3.1 - Automated Shopping List](./phase_03_shopping_calculators/01_automated_shopping_list.md)
- [3.2 - Clipboard & Share Actions](./phase_03_shopping_calculators/02_clipboard_share_actions.md)
- [3.3 - Business Calculators](./phase_03_shopping_calculators/03_business_calculators.md)

### Phase 4: Dashboard & Analytics
- [4.1 - Financial Dashboard](./phase_04_dashboard_analytics/01_financial_dashboard.md)
- [4.2 - Activity Log & Goals](./phase_04_dashboard_analytics/02_activity_log_and_goals.md)
- [4.3 - Historical Charts](./phase_04_dashboard_analytics/03_historical_charts.md)
- [4.4 - CSV Export](./phase_04_dashboard_analytics/04_csv_export.md)

### Phase 5: Polish, Mobile QA & Launch
- [5.1 - PWA Manifest Setup](./phase_05_polish_launch/01_pwa_manifest_setup.md)
- [5.2 - Mobile Responsive Polish](./phase_05_polish_launch/02_mobile_responsive_polish.md)
- [5.3 - Vercel Deployment](./phase_05_polish_launch/03_vercel_deployment.md)

### Appendix
- [A - Design System](./appendix/A_DESIGN_SYSTEM.md)
- [B - API Reference](./appendix/B_API_REFERENCE.md)
- [C - Troubleshooting](./appendix/C_TROUBLESHOOTING.md)
- [D - Security Checklist](./appendix/D_SECURITY_CHECKLIST.md)

## Post-Implementation

After all phases:
- [ ] Run full build: `npm run build` with zero errors
- [ ] Security audit (see [appendix/D_SECURITY_CHECKLIST.md](./appendix/D_SECURITY_CHECKLIST.md))
- [ ] Mobile responsive testing on iPhone Safari and Android Chrome
- [ ] Verify all Supabase RLS policies are active
- [ ] Confirm Vercel deployment is live and functional

## Design Reference

All UI mockups and reference code are in `Mellow UI/`:
- `login_mellow_caf/` — Login page (code.html + screen.png)
- `dashboard_mellow_caf/` — Dashboard (code.html + screen.png)
- `sales_logger_mellow_caf/` — Sales Logger (code.html + screen.png)
- `inventory_restock_mellow_caf/` — Inventory & Restock (code.html + screen.png)
- `analytics_mellow_caf/` — Analytics (code.html + screen.png)
- `calculators_mellow_caf/` — Business Calculators (code.html + screen.png)
- `mellow_artisanal_interface/` — Design system specification (DESIGN.md)

## Currency

All monetary values are in Philippine Pesos (₱). Format: `₱0,000.00`.
