# Phase 0: Setup & Infrastructure

> **Objective**: Scaffold the Next.js project, configure the Mellow Artisanal design system in Tailwind, set up the Supabase database schema with RLS policies, and establish the feature-based directory structure.
> **Duration**: Day 1 (4–6 hours for AI agent execution)
> **Dependencies**: None — this is the foundation phase.

---

## Phase Goals

1. ✅ Next.js 14+ App Router project initialized with TypeScript strict mode
2. ✅ Tailwind CSS configured with complete Mellow Artisanal design tokens (colors, typography, spacing, shadows)
3. ✅ Supabase database schema created (users, products, sales, sales_items, expenses) with Row Level Security
4. ✅ Feature-based directory structure established with typed environment config and shared types

## Prompt Files in This Phase

| # | Prompt | Purpose |
|---|--------|---------|
| 0.1 | [01_nextjs_project_init.md](01_nextjs_project_init.md) | Initialize Next.js App Router with TypeScript and core dependencies |
| 0.2 | [02_tailwind_design_tokens.md](02_tailwind_design_tokens.md) | Configure Tailwind with Mellow design system tokens |
| 0.3 | [03_supabase_setup.md](03_supabase_setup.md) | Database schema, RLS policies, and environment variables |
| 0.4 | [04_directory_structure.md](04_directory_structure.md) | Feature-based folders, typed config, layout skeleton |

## Key Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 14+ App Router | Spec requirement; SSR, PWA capability, Vercel deployment |
| Styling | Tailwind CSS (CDN config → proper install) | Matches all UI reference HTML code; utility-first, rapid iteration |
| Typography | Bricolage Grotesque + Manrope (Google Fonts) | Per DESIGN.md — artisanal headings + data-readable body |
| Database | Supabase PostgreSQL | Spec requirement; free tier, built-in auth, RLS |
| Icons | Material Symbols Outlined + Lucide React | Material Symbols match UI references; Lucide for additional icons |
| Package Manager | npm | Default, widely supported |

## Skills to Load

Before starting this phase, load these skill files from `Essentials/skills/[skill-id]/SKILL.md`:
- `clean-code` — Coding standards: SRP, DRY, naming conventions, function rules
- `cc-skill-coding-standards` — TypeScript/JS/React specific conventions
- `nextjs-best-practices` — App Router patterns, Server vs Client Components, data fetching
- `tailwind-patterns` — Tailwind v4 architecture, design tokens, CSS-first config
- `environment-setup-guide` — Dev environment, linting, formatting setup

## Exit Criteria

Before moving to Phase 1, verify:

- [ ] `npm run dev` starts the dev server without errors on `http://localhost:3000`
- [ ] `npx tsc --noEmit` compiles with zero TypeScript errors
- [ ] Tailwind classes render correctly (test with a sample page showing Mellow colors/fonts)
- [ ] Supabase database tables (products, sales, sales_items, expenses) exist with correct columns
- [ ] RLS policies are enabled on all tables
- [ ] `.env.local` contains `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Directory structure matches the specified feature-based layout

---

**Next Phase**: [Phase 1: Auth & Product CRUD](../phase_01_auth_products/00_PHASE_OVERVIEW.md)
