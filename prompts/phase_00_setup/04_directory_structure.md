# 0.4 Directory Structure & Layout Skeleton

## Context

<context>
This step establishes the feature-based directory structure, creates a typed environment configuration module (no raw `process.env` access), defines shared TypeScript types for the database schema, and builds the root layout skeleton with the top navigation bar and footer. This matches the layout visible in all UI reference screenshots — a sticky top nav with the Mellow logo, navigation links (Dashboard, Sales Logger, Inventory & Restock, Analytics, Calculators), calendar icon, and Owner badge. The footer shows the MELLOW wordmark, copyright, and legal links.
</context>

## Prerequisites

<prerequisites>
- Steps 0.1–0.3 completed
- Tailwind design tokens configured in `tailwind.config.ts`
- Google Fonts (Bricolage Grotesque + Manrope) configured in `layout.tsx`
- `.env.local` with Supabase credentials
</prerequisites>

## AI Implementation Prompt

<instructions>
Think step by step:

1. **Create the feature-based directory structure**
   - Create the following directories under `src/`:
   ```
   src/
   ├── app/
   │   ├── (auth)/
   │   │   └── login/
   │   ├── (dashboard)/
   │   │   ├── page.tsx          (Dashboard — default route after login)
   │   │   ├── sales/
   │   │   ├── inventory/
   │   │   ├── analytics/
   │   │   └── calculators/
   │   ├── globals.css
   │   ├── layout.tsx
   │   └── page.tsx              (Root — redirects to dashboard or login)
   ├── components/
   │   ├── layout/
   │   │   ├── top-nav.tsx
   │   │   ├── footer.tsx
   │   │   └── mobile-nav.tsx
   │   ├── ui/
   │   │   ├── button.tsx
   │   │   ├── card.tsx
   │   │   ├── badge.tsx
   │   │   └── input.tsx
   │   └── icons/
   │       └── mellow-logo.tsx
   ├── lib/
   │   ├── supabase/
   │   │   ├── client.ts
   │   │   ├── server.ts
   │   │   └── middleware.ts
   │   ├── config.ts
   │   ├── constants.ts
   │   └── utils.ts
   └── types/
       ├── database.ts
       └── index.ts
   ```

2. **Create the typed environment config module: `src/lib/config.ts`**
   - Create a typed config object that reads from `process.env`
   - Export a `config` object with:
     - `supabase.url`: string (from `NEXT_PUBLIC_SUPABASE_URL`)
     - `supabase.anonKey`: string (from `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - Throw a clear error at build time if any required variable is missing
   - This is the ONLY file that accesses `process.env` directly — all other files import from `config`

3. **Create shared TypeScript types: `src/types/database.ts`**
   - Define TypeScript interfaces matching the Supabase database schema:
     - `Product` — id, user_id, name, category, selling_price, unit_cost, current_stock, low_stock_threshold, target_stock, is_active, created_at, updated_at
     - `Sale` — id, user_id, total_revenue, total_cogs, net_profit, starting_float (nullable), ending_cash (nullable), cash_discrepancy (nullable), entry_mode, payment_method, created_at
     - `SaleItem` — id, sale_id, product_id, quantity, unit_price, unit_cost, created_at
     - `Expense` — id, user_id, name, amount, frequency, is_active, created_at, updated_at
   - Define enum-like union types:
     - `EntryMode = 'quick_tap' | 'batch' | 'reconciliation'`
     - `PaymentMethod = 'cash' | 'gcash_maya'`
     - `ExpenseFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly'`
     - `StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'`
   - Export a `Database` type for Supabase type-safety (optional but recommended)

4. **Create `src/types/index.ts`**
   - Barrel export all types from `database.ts`

5. **Create constants file: `src/lib/constants.ts`**
   - `APP_NAME = 'Mellow Café System'`
   - `CURRENCY_SYMBOL = '₱'`
   - `CURRENCY_LOCALE = 'en-PH'`
   - `MAX_CONTENT_WIDTH = '1280px'`
   - `NAV_HEIGHT = '72px'`
   - Navigation items array: `[{ label, href, icon }]` for Dashboard, Sales Logger, Inventory & Restock, Analytics, Calculators

6. **Create utility functions: `src/lib/utils.ts`**
   - `formatCurrency(amount: number): string` — Formats a number as Philippine Peso with `₱0,000.00` format
   - `cn(...classes: (string | undefined | null | false)[]): string` — Tailwind className merge utility (simple version: filter falsy and join)
   - `getStockStatus(currentStock: number, threshold: number): StockStatus` — Returns 'out_of_stock' if 0, 'low_stock' if <= threshold, 'in_stock' otherwise
   - `getGreeting(): string` — Returns "Good morning/afternoon/evening" based on current time (Philippine Time / UTC+8)

7. **Create the TopNav component: `src/components/layout/top-nav.tsx`**
   - Sticky top navigation bar matching the dashboard UI reference exactly:
     - Height: 72px
     - Background: `bg-surface` with bottom border `border-outline-variant`
     - Max content width: 1280px, centered with `mx-auto`
     - Left side: Mellow logo image + navigation links (Desktop only, hidden on mobile)
     - Active nav link: `text-primary border-b-2 border-secondary pb-1`
     - Inactive nav link: `text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg px-2 py-1`
     - Right side: Calendar icon button + "Owner" badge (`bg-primary-container text-on-primary px-4 py-2 rounded-lg`)
   - This should be a Client Component (`'use client'`) since it uses `usePathname()` for active link detection
   - Accept `pathname` or use Next.js `usePathname()` to highlight the active nav item

8. **Create the Footer component: `src/components/layout/footer.tsx`**
   - Footer matching the dashboard UI reference:
     - Top border: `border-outline-variant`
     - Padding: `py-section-margin`
     - 3-column flex layout (desktop), stacked on mobile:
       - Left: "MELLOW" wordmark in `text-headline-md font-headline-md`
       - Center: "© 2024 Mellow Café System. Crafted with intention."
       - Right: Links (Support, Privacy Policy, Terms of Service) with hover color → `text-secondary`

9. **Create the Dashboard layout: `src/app/(dashboard)/layout.tsx`**
   - This is the authenticated layout that wraps all main app pages
   - Include the TopNav and Footer
   - The main content area should be: `flex-grow w-full max-w-[1280px] mx-auto px-container-padding py-section-margin`
   - Body: `bg-surface text-on-surface min-h-screen flex flex-col font-body-md`

10. **Create placeholder pages**
    - `src/app/(dashboard)/page.tsx` — Placeholder with "Dashboard" heading
    - `src/app/(dashboard)/sales/page.tsx` — Placeholder with "Sales Logger" heading
    - `src/app/(dashboard)/inventory/page.tsx` — Placeholder with "Inventory & Restock" heading
    - `src/app/(dashboard)/analytics/page.tsx` — Placeholder with "Analytics" heading
    - `src/app/(dashboard)/calculators/page.tsx` — Placeholder with "Calculators" heading
    - Each placeholder should use the design system: `text-headline-lg font-headline-lg` for heading, `text-body-lg text-on-surface-variant` for description

11. **Update root page and layout**
    - `src/app/page.tsx` — For now, show a simple redirect or link to the dashboard. This will be updated with proper auth redirect in Phase 1.
    - `src/app/layout.tsx` — Should only contain the HTML shell, font variables, metadata, and Material Symbols link. The TopNav/Footer are in the dashboard layout group.
</instructions>

<requirements>
### Functional Requirements
- Navigation must highlight the current active page
- The layout must match the visual structure in the dashboard, sales logger, inventory, analytics, and calculators UI references
- All placeholder pages must render within the dashboard layout (TopNav + content + Footer)
- Currency formatting must output `₱X,XXX.XX` format consistently

### Technical Requirements
- Route groups: `(auth)` for unauthenticated pages, `(dashboard)` for authenticated pages
- The TopNav is a Client Component (uses `usePathname`); the Footer can be a Server Component
- No raw `process.env` access outside of `src/lib/config.ts`
- All types exported through barrel file `src/types/index.ts`
- Use `next/link` for navigation (not `<a>` tags)
- Use `next/image` for the logo if using a local image file, or a regular `<img>` for external URLs

### File Naming Conventions
- Components: kebab-case files (`top-nav.tsx`), PascalCase exports (`TopNav`)
- Lib files: kebab-case (`config.ts`, `utils.ts`)
- Type files: kebab-case (`database.ts`)
</requirements>

<output_files>
Generate the following files:

1. `src/lib/config.ts` — Typed environment configuration
2. `src/lib/constants.ts` — App constants (currency, nav items, etc.)
3. `src/lib/utils.ts` — Utility functions (formatCurrency, cn, getStockStatus, getGreeting)
4. `src/types/database.ts` — TypeScript interfaces for all database tables
5. `src/types/index.ts` — Barrel export
6. `src/components/layout/top-nav.tsx` — Top navigation bar component
7. `src/components/layout/footer.tsx` — Footer component
8. `src/app/(dashboard)/layout.tsx` — Authenticated dashboard layout
9. `src/app/(dashboard)/page.tsx` — Dashboard placeholder
10. `src/app/(dashboard)/sales/page.tsx` — Sales Logger placeholder
11. `src/app/(dashboard)/inventory/page.tsx` — Inventory placeholder
12. `src/app/(dashboard)/analytics/page.tsx` — Analytics placeholder
13. `src/app/(dashboard)/calculators/page.tsx` — Calculators placeholder
14. `src/app/layout.tsx` — Updated root layout
15. `src/app/page.tsx` — Updated root page
</output_files>

## Directory Structure

After completing this step, the project should have:

```
mellow-cafe/
├── public/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/           ← Directory created (empty for now)
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx       ← NEW (dashboard layout with TopNav + Footer)
│   │   │   ├── page.tsx         ← NEW (Dashboard placeholder)
│   │   │   ├── sales/
│   │   │   │   └── page.tsx     ← NEW (placeholder)
│   │   │   ├── inventory/
│   │   │   │   └── page.tsx     ← NEW (placeholder)
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx     ← NEW (placeholder)
│   │   │   └── calculators/
│   │   │       └── page.tsx     ← NEW (placeholder)
│   │   ├── globals.css
│   │   ├── layout.tsx           ← MODIFIED (root layout)
│   │   └── page.tsx             ← MODIFIED (root redirect)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── top-nav.tsx      ← NEW
│   │   │   ├── footer.tsx       ← NEW
│   │   │   └── mobile-nav.tsx   ← NEW (empty placeholder)
│   │   ├── ui/                  ← Directory created (empty for now)
│   │   └── icons/               ← Directory created (empty for now)
│   ├── lib/
│   │   ├── supabase/            ← Directory created (filled in Phase 1)
│   │   ├── config.ts            ← NEW
│   │   ├── constants.ts         ← NEW
│   │   └── utils.ts             ← NEW
│   └── types/
│       ├── database.ts          ← NEW
│       └── index.ts             ← NEW
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql
├── .env.local
├── .env.example
└── ... (config files)
```

## Verification

<verification>
After completing this step, confirm:

- [ ] Navigating to `http://localhost:3000` shows the dashboard layout with TopNav and Footer
- [ ] Clicking nav links (Dashboard, Sales Logger, etc.) navigates to the correct placeholder pages
- [ ] The active nav link is visually highlighted with the secondary color underline
- [ ] The TopNav matches the visual layout from the dashboard UI reference (logo left, links center, Owner badge right)
- [ ] The Footer renders the 3-column layout on desktop
- [ ] `formatCurrency(2450)` returns `₱2,450.00`
- [ ] `getStockStatus(2, 5)` returns `'low_stock'`
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] No `process.env` access exists outside of `src/lib/config.ts`
</verification>

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| 404 on `/sales`, `/inventory` etc. | Route group or file structure incorrect | Ensure pages are at `src/app/(dashboard)/sales/page.tsx`, not `src/app/sales/page.tsx` |
| TopNav renders on login page | Login page inside `(dashboard)` group | Login should be in `(auth)` group which has its own layout WITHOUT TopNav |
| `usePathname` error | TopNav missing `'use client'` directive | Add `'use client'` at the top of `top-nav.tsx` |
| Config throws "missing env var" | `.env.local` not loaded | Restart the dev server (`npm run dev`) after creating `.env.local` |
| Nav links not highlighted | Pathname comparison logic wrong | Check that `usePathname()` returns `/sales` and compare correctly |

---

**Previous**: [0.3 - Supabase Setup](./03_supabase_setup.md) | **Next**: [Phase 1 Overview](../phase_01_auth_products/00_PHASE_OVERVIEW.md)
