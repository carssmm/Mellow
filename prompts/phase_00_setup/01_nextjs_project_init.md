# 0.1 Next.js Project Initialization

## Context

<context>
This is the very first step of the Mellow Café System build. We initialize a Next.js 14+ project with App Router, TypeScript in strict mode, and install all core dependencies. This establishes the foundation that every subsequent phase builds upon. The project is a single-user café management web app (sales, stock, analytics) deployed to Vercel's free tier.
</context>

## Prerequisites

<prerequisites>
- Node.js 18+ installed
- npm available
- Empty project directory at the workspace root (or clean workspace)
- No existing Next.js project — this is a fresh scaffold
</prerequisites>

## AI Implementation Prompt

<instructions>
Think step by step:

1. **Initialize the Next.js project**
   - Run `npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm` in the project root
   - This creates a Next.js 14+ project with:
     - TypeScript enabled
     - Tailwind CSS pre-configured
     - ESLint configured
     - App Router (not Pages Router)
     - `src/` directory structure
     - `@/*` import alias for clean imports
     - npm as the package manager

2. **Enable TypeScript strict mode**
   - Open `tsconfig.json`
   - Ensure `"strict": true` is set in `compilerOptions`
   - Add `"forceConsistentCasingInFileNames": true`
   - Add `"noUncheckedIndexedAccess": true` for safer object access

3. **Install core dependencies**
   - Supabase: `npm install @supabase/supabase-js @supabase/ssr`
   - Icons: `npm install lucide-react`
   - Charts (for Phase 4): `npm install recharts`
   - Form validation: `npm install zod`
   - Date utilities: `npm install date-fns`

4. **Install dev dependencies**
   - `npm install -D @types/node`

5. **Clean the scaffolded files**
   - Replace the contents of `src/app/page.tsx` with a minimal placeholder page that displays "Mellow Café System" with Bricolage Grotesque font
   - Clean `src/app/globals.css` — keep only the Tailwind directives (`@tailwind base;`, `@tailwind components;`, `@tailwind utilities;`) and remove all default Next.js styles
   - Remove the default Next.js SVG files from `public/` (next.svg, vercel.svg)

6. **Verify the setup**
   - Run `npm run dev` to confirm the dev server starts
   - Run `npx tsc --noEmit` to confirm TypeScript compiles cleanly
</instructions>

<requirements>
### Functional Requirements
- The project must use Next.js 14+ with App Router (NOT Pages Router)
- TypeScript must be in strict mode
- The dev server must start successfully on `http://localhost:3000`
- All specified npm packages must install without errors

### Technical Requirements
- Use `src/` directory structure (not root-level `app/`)
- Import alias: `@/*` maps to `src/*`
- Package manager: npm (not yarn, not pnpm)
- Node.js 18+ compatibility

### File Naming Conventions
- All files in kebab-case (e.g., `page.tsx`, `layout.tsx`)
- React components in PascalCase inside the files
- No `I` prefix on interfaces
</requirements>

<output_files>
Generate/modify the following files:

1. `tsconfig.json` — TypeScript configuration with strict mode enabled
2. `src/app/page.tsx` — Minimal placeholder page
3. `src/app/globals.css` — Clean Tailwind-only CSS
4. `src/app/layout.tsx` — Root layout (will be expanded in step 0.4)
5. `package.json` — With all dependencies installed
</output_files>

## Directory Structure

After completing this step, the project should have:

```
mellow-cafe/
├── public/
├── src/
│   └── app/
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
├── .eslintrc.json
├── .gitignore
├── next.config.mjs (or next.config.ts)
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Verification

<verification>
After completing this step, confirm:

- [ ] Running `npm run dev` starts without errors and shows the placeholder page at `http://localhost:3000`
- [ ] Running `npx tsc --noEmit` produces zero errors
- [ ] `package.json` contains `@supabase/supabase-js`, `@supabase/ssr`, `lucide-react`, `recharts`, `zod`, `date-fns`
- [ ] `tsconfig.json` has `"strict": true`
- [ ] The `src/app/` directory exists with `page.tsx`, `layout.tsx`, `globals.css`
</verification>

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| `create-next-app` fails with permissions error | npm global install issue on Windows | Run terminal as Administrator, or use `npx -y` |
| TypeScript errors in default template | Strict mode catching nullable types | Add explicit null checks or update the types |
| Tailwind classes not rendering | PostCSS not configured correctly | Verify `postcss.config.mjs` exists and includes `tailwindcss` |
| `Module not found: @supabase/ssr` | Installation failed silently | Re-run `npm install @supabase/supabase-js @supabase/ssr` |

---

**Next**: [0.2 - Tailwind Design Tokens](./02_tailwind_design_tokens.md)
