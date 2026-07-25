# 1.1 Supabase Client Setup

## Context

<context>
This step creates the Supabase client utilities needed for the three execution contexts in a Next.js App Router application: Server Components/Actions, Client Components, and Middleware. Using `@supabase/ssr` ensures cookie-based session management that works seamlessly across all contexts. These utilities are the foundation for all database operations and authentication in subsequent steps.
</context>

## Prerequisites

<prerequisites>
- Phase 0 completed (all steps)
- `@supabase/supabase-js` and `@supabase/ssr` installed
- `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `src/lib/config.ts` with typed environment config
</prerequisites>

## AI Implementation Prompt

<instructions>
Think step by step:

1. **Create the Server Supabase client: `src/lib/supabase/server.ts`**
   - Import `createServerClient` from `@supabase/ssr`
   - Import `cookies` from `next/headers`
   - Import `config` from `@/lib/config`
   - Create and export an async function `createSupabaseServerClient()` that:
     - Gets the cookie store via `await cookies()`
     - Creates a server client with cookie-based session using `createServerClient`
     - Passes the Supabase URL and anon key from the typed config
     - Implements the `cookies` option with `getAll` and `setAll` methods
   - Also export a convenience function `getAuthenticatedUser()` that:
     - Creates a server client
     - Calls `supabase.auth.getUser()`
     - Returns the user object or null
     - IMPORTANT: Use `getUser()` not `getSession()` for security (getUser validates the JWT with Supabase servers)

2. **Create the Client Supabase client: `src/lib/supabase/client.ts`**
   - Import `createBrowserClient` from `@supabase/ssr`
   - Import `config` from `@/lib/config`
   - Create and export a function `createSupabaseClient()` that:
     - Returns a browser client using `createBrowserClient`
     - Passes the Supabase URL and anon key from the typed config

3. **Create the Middleware Supabase client: `src/lib/supabase/middleware.ts`**
   - Import `createServerClient` from `@supabase/ssr`
   - Import `NextResponse` from `next/server`
   - Import `config` from `@/lib/config`
   - Create and export an async function `updateSession(request: NextRequest)` that:
     - Creates a `NextResponse.next()` response
     - Creates a server client with cookie handling that reads from request and writes to both request and response
     - Calls `supabase.auth.getUser()` to refresh the session
     - Returns the response (with updated cookies)

4. **Create barrel export: `src/lib/supabase/index.ts`**
   - Re-export `createSupabaseServerClient` and `getAuthenticatedUser` from `./server`
   - Re-export `createSupabaseClient` from `./client`
   - Re-export `updateSession` from `./middleware`
</instructions>

<requirements>
### Functional Requirements
- Server client must work in Server Components, Server Actions, and Route Handlers
- Client client must work in Client Components with `'use client'`
- Middleware client must refresh sessions and handle cookie rotation
- `getAuthenticatedUser()` must use `getUser()` (server-validated) not `getSession()` (client-side only)

### Technical Requirements
- All clients use `@supabase/ssr` (NOT the deprecated `@supabase/auth-helpers-nextjs`)
- Cookie handling follows the Supabase SSR patterns for Next.js App Router
- No hardcoded URLs or keys — use the typed `config` module
- The server client function must be async (cookies() is async in Next.js 15+)

### File Naming Conventions
- `src/lib/supabase/server.ts`, `client.ts`, `middleware.ts`, `index.ts`
</requirements>

<output_files>
Generate the following files:

1. `src/lib/supabase/server.ts` — Server-side Supabase client with cookie management
2. `src/lib/supabase/client.ts` — Browser-side Supabase client
3. `src/lib/supabase/middleware.ts` — Middleware Supabase client for session refresh
4. `src/lib/supabase/index.ts` — Barrel exports
</output_files>

## Verification

<verification>
After completing this step, confirm:

- [ ] `npx tsc --noEmit` passes — all Supabase client files compile without errors
- [ ] Importing `{ createSupabaseServerClient }` from `@/lib/supabase` works in a Server Component
- [ ] Importing `{ createSupabaseClient }` from `@/lib/supabase` works in a Client Component
- [ ] No TypeScript errors related to Supabase types
</verification>

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| `cookies()` type error | Next.js version mismatch | In Next.js 15+, `cookies()` is async. Ensure `await cookies()` |
| `createServerClient` not found | Wrong import package | Import from `@supabase/ssr`, not `@supabase/auth-helpers-nextjs` |
| Session not persisting | Cookie handler not setting cookies | Verify `setAll` implementation in the server client |

---

**Next**: [1.2 - Auth Login Page](./02_auth_login_page.md)
