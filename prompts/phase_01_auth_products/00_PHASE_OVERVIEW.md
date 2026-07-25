# Phase 1: Auth & Product CRUD

> **Objective**: Set up Supabase authentication (login/logout), create the product management CRUD interface with inventory table, and implement the low stock status badges — establishing the core data foundation all other features depend on.
> **Duration**: Days 2–4 (estimated 8–12 hours for AI agent execution)
> **Dependencies**: Phase 0 must be fully complete (Next.js project, Tailwind tokens, Supabase schema, directory structure)

---

## Phase Goals

1. ✅ Supabase client utilities created for server, client, and middleware contexts
2. ✅ Login page matching the Mellow UI reference with email/password authentication
3. ✅ Route protection via Next.js middleware — unauthenticated users redirected to login
4. ✅ Product CRUD Server Actions (create, read, update, delete) with Zod validation
5. ✅ Inventory table page matching the UI reference with search, status badges, and Add/Edit product modal

## Prompt Files in This Phase

| # | Prompt | Purpose |
|---|--------|---------|
| 1.1 | [01_supabase_client_setup.md](01_supabase_client_setup.md) | Server/Client/Middleware Supabase client utilities |
| 1.2 | [02_auth_login_page.md](02_auth_login_page.md) | Login page UI with Supabase email+password auth |
| 1.3 | [03_auth_middleware_protection.md](03_auth_middleware_protection.md) | Next.js middleware for session refresh and route protection |
| 1.4 | [04_product_crud_api.md](04_product_crud_api.md) | Server Actions for Product CRUD with validation |
| 1.5 | [05_product_inventory_page.md](05_product_inventory_page.md) | Inventory table UI with search, badges, and Add/Edit modal |

## Key Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Auth method | Supabase Email + Password | Single-user, spec requirement, no OAuth complexity needed |
| Client utility | `@supabase/ssr` with cookie-based sessions | App Router compatible, handles Server Components and middleware |
| Data mutations | Server Actions (not API Routes) | Next.js native, simpler for CRUD, type-safe |
| Validation | Zod schemas | Shared validation for client and server, TypeScript integration |
| Product modal | Client-side modal (not separate page) | Better UX for quick add/edit without navigation |

## Skills to Load

Before starting this phase, load these skill files from `Essentials/skills/[skill-id]/SKILL.md`:
- `nextjs-supabase-auth` — Supabase Auth + App Router integration patterns, cookie-based sessions, middleware auth
- `api-security-best-practices` — Input validation, auth patterns, rate limiting
- `database-design` — Schema patterns, ORM queries, indexing
- `react-patterns` — Hooks, composition, Client vs Server components
- `ui-ux-pro-max` — Design system implementation, component patterns

## Exit Criteria

Before moving to Phase 2, verify:

- [ ] Login page renders matching the Mellow UI reference (logo, email/password fields, charcoal button)
- [ ] Users can sign up and sign in with email + password via Supabase Auth
- [ ] Unauthenticated users are redirected to `/login`
- [ ] Authenticated users are redirected from `/login` to the dashboard
- [ ] Product CRUD works: create, read, update, delete products
- [ ] Inventory table displays products with search filtering
- [ ] Stock status badges show correctly: Green (In Stock), Yellow/Amber (Low Stock), Red (Out of Stock)
- [ ] Add Product and Edit Product modals work correctly
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] All data operations enforce RLS (only the logged-in user's data is accessible)

---

**Previous Phase**: [Phase 0: Setup & Infrastructure](../phase_00_setup/00_PHASE_OVERVIEW.md)
**Next Phase**: [Phase 2: Multi-Mode Sales Engine](../phase_02_sales_engine/00_PHASE_OVERVIEW.md)
