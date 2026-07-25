# 1.3 Auth Middleware Protection

## Context

<context>
This step creates the Next.js middleware that protects all dashboard routes, refreshes Supabase sessions on every request, and handles redirects. Unauthenticated users trying to access any dashboard page are redirected to `/login`. Authenticated users trying to access `/login` are redirected to the dashboard. This uses the `updateSession` utility created in Step 1.1.
</context>

## Prerequisites

<prerequisites>
- Step 1.1 completed (Supabase middleware client utility)
- Step 1.2 completed (Login page exists at `/login`)
- Auth layout `(auth)` and dashboard layout `(dashboard)` route groups exist
</prerequisites>

## AI Implementation Prompt

<instructions>
Think step by step:

1. **Create the Next.js middleware: `src/middleware.ts`**
   - Import `updateSession` from `@/lib/supabase/middleware`
   - Import `NextResponse` and `type NextRequest` from `next/server`
   - The middleware function should:
     - Call `updateSession(request)` to refresh the session and get the response
     - After updating the session, create a Supabase server client from the request/response
     - Call `supabase.auth.getUser()` to check authentication status
     - **If NOT authenticated AND the path is NOT `/login`**: redirect to `/login`
     - **If authenticated AND the path IS `/login`**: redirect to `/` (dashboard)
     - Otherwise: return the response from `updateSession` (pass through)

2. **Configure the middleware matcher**
   - Export a `config` object with a `matcher` array that includes:
     - `/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)`
   - This matches all routes EXCEPT static files, images, and Next.js internals
   - This ensures the middleware runs on page navigations and API calls, but not on static assets

3. **Update the TopNav to include sign-out functionality**
   - In `src/components/layout/top-nav.tsx`:
     - Import the `signOut` Server Action from `@/app/(auth)/actions`
     - Convert the "Owner" badge/button into a dropdown or a button that triggers sign-out
     - On click: call the `signOut` action
     - Simple approach: make the Owner button a form with the signOut action
</instructions>

<requirements>
### Functional Requirements
- ALL routes under `(dashboard)` must require authentication
- Unauthenticated users are redirected to `/login` with no flash of protected content
- Authenticated users accessing `/login` are redirected to the dashboard
- Sessions are refreshed on every request to prevent expiration during active use
- Sign-out button in TopNav clears the session and redirects to login

### Technical Requirements
- Middleware must be at `src/middleware.ts` (project root of src/)
- Use the `updateSession` function from Step 1.1 for session management
- The middleware matcher must exclude static files and Next.js internals
- Redirects use `NextResponse.redirect()` with absolute URLs constructed from `request.nextUrl`

### File Naming Conventions
- `src/middleware.ts`
</requirements>

<output_files>
Generate/modify the following files:

1. `src/middleware.ts` — NEW: Next.js middleware for auth protection and session refresh
2. `src/components/layout/top-nav.tsx` — MODIFIED: Add sign-out functionality to Owner button
</output_files>

## Verification

<verification>
After completing this step, confirm:

- [ ] Visiting `/` when not logged in redirects to `/login`
- [ ] Visiting `/sales`, `/inventory`, `/analytics`, `/calculators` when not logged in redirects to `/login`
- [ ] Visiting `/login` when logged in redirects to `/` (dashboard)
- [ ] After logging in, navigating between dashboard pages works without re-authentication
- [ ] Clicking sign-out clears the session and redirects to `/login`
- [ ] After sign-out, the `/` route redirects to `/login` (session is fully cleared)
- [ ] Static assets (images, fonts) still load correctly (not blocked by middleware)
</verification>

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Infinite redirect loop | Middleware redirecting `/login` to `/login` | Check that the `/login` path is excluded from auth-required redirects |
| Session lost on page refresh | Cookie not being set in response | Verify `updateSession` returns the response with updated cookies |
| Static assets blocked (fonts, images) | Middleware matcher too broad | Ensure the matcher regex excludes `_next/static`, `_next/image`, and common file extensions |
| Sign-out doesn't redirect | Server Action not calling `redirect()` | Ensure `signOut()` in `actions.ts` calls `redirect('/login')` after `supabase.auth.signOut()` |

---

**Previous**: [1.2 - Auth Login Page](./02_auth_login_page.md) | **Next**: [1.4 - Product CRUD API](./04_product_crud_api.md)
