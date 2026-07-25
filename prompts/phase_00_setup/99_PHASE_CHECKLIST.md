# Phase 0 Completion Checklist

## All Steps Completed

- [ ] 0.1 - Next.js Project Initialization
- [ ] 0.2 - Tailwind Design Tokens (Mellow Artisanal Design System)
- [ ] 0.3 - Supabase Setup (Database Schema & RLS)
- [ ] 0.4 - Directory Structure & Layout Skeleton

## Verification Tests

Run these commands and confirm they pass:

```bash
npm run dev          # Expected: Dev server starts on http://localhost:3000 without errors
npx tsc --noEmit     # Expected: Zero TypeScript errors
npm run lint         # Expected: No critical linting errors
npm run build        # Expected: Build completes successfully (may have warnings, zero errors)
```

## Code Quality Checks

- [ ] All TypeScript files compile: `npx tsc --noEmit`
- [ ] Linting passes: `npm run lint`
- [ ] No `console.log` statements in production code
- [ ] All new files have proper imports/exports
- [ ] No raw `process.env` access outside of `src/lib/config.ts`
- [ ] All types exported through `src/types/index.ts` barrel file

## Visual Verification

- [ ] Visit `http://localhost:3000` — Dashboard layout renders with TopNav and Footer
- [ ] TopNav shows: Mellow logo (left), nav links (center), Calendar icon + Owner badge (right)
- [ ] Nav links (Dashboard, Sales Logger, Inventory & Restock, Analytics, Calculators) are clickable and navigate correctly
- [ ] Active nav link has the secondary color underline
- [ ] Footer shows: MELLOW wordmark, copyright text, legal links
- [ ] Fonts render correctly: Bricolage Grotesque for headings, Manrope for body text
- [ ] Colors match: oatmeal background (#F5F2EC), white cards, charcoal text, amber accents
- [ ] Material Symbols Outlined icons render correctly

## Database Verification

- [ ] Supabase dashboard shows 4 tables: products, sales, sales_items, expenses
- [ ] All tables have UUID primary keys
- [ ] RLS is enabled on ALL tables (check in Supabase Dashboard → Authentication → Policies)
- [ ] Foreign key relationships are correct (products → auth.users, sales_items → sales + products)
- [ ] Indexes exist on `user_id` columns and `created_at`

## Environment Verification

- [ ] `.env.local` exists with valid Supabase URL and anon key
- [ ] `.env.example` exists as a template (no real keys)
- [ ] `.env.local` is in `.gitignore`

## Rollback Plan

If this phase breaks something:
1. Delete the `node_modules/` and `package-lock.json`, then run `npm install` to restore clean dependencies
2. Drop all tables in Supabase SQL Editor: `DROP TABLE IF EXISTS sales_items, sales, products, expenses CASCADE;`
3. If directory structure is wrong, the simplest fix is `npx create-next-app@latest` again and re-apply the Tailwind config

---

**Proceed to**: [Phase 1: Auth & Product CRUD](../phase_01_auth_products/00_PHASE_OVERVIEW.md)
