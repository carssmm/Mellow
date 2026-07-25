# 1.2 Auth Login Page

## Context

<context>
This step creates the login page that matches the Mellow UI reference exactly. It's the single entry point for the café owner — a clean, centered card with the Mellow storefront logo, "HOME BASED CAFE" badge, email/password form with Material Symbols icons, and a charcoal "Sign In to Dashboard" button. The page uses Supabase Auth for email+password sign-in. Since this is a single-user MVP, there's no sign-up form exposed — the owner's account is pre-created in Supabase Dashboard.
</context>

## Prerequisites

<prerequisites>
- Step 1.1 completed (Supabase client utilities)
- Tailwind design tokens configured (Phase 0)
- Material Symbols Outlined font loaded in root layout
- Login UI reference available at `Mellow UI/login_mellow_caf/code.html` and `screen.png`
</prerequisites>

## AI Implementation Prompt

<instructions>
Think step by step:

1. **Create the auth layout: `src/app/(auth)/layout.tsx`**
   - This layout wraps the login page only — NO TopNav, NO Footer
   - Body styles: `min-h-screen flex items-center justify-center p-4`
   - Background: `#F5F2EC` (oatmeal) — the body background from globals.css handles this

2. **Create the login page: `src/app/(auth)/login/page.tsx`**
   - This should be a Client Component (`'use client'`) since it handles form state and auth actions
   - Match the login UI reference EXACTLY:

   **Visual structure:**
   - Centered card: `max-w-[440px]`, white background (`bg-surface-container-lowest`), 1px border (`border-[#E6E1DA]`), 16px border radius, `p-8 md:p-10`
   - Subtle decorative element: An absolute-positioned `div` in the top-right corner (rounded blob shape) with `bg-surface-container-low opacity-50`
   - Card shadow: `0 4px 20px rgba(28,27,26,0.04)`

   **Brand header (centered):**
   - Mellow Café logo image (use a placeholder image or the external URL from the reference code for now)
   - "HOME BASED CAFE" badge: pill-shaped, `bg-surface-container-high`, uppercase, extra-small text, tracking wider

   **Form section:**
   - "Owner Sign In" heading: `text-headline-md font-headline-md text-primary-container`, centered
   - Email input:
     - Label: "Email Address" in `text-label-md text-on-surface-variant`
     - Input: 52px height, `pl-12` (space for icon), `bg-[#FAFAFA]`, 10px radius
     - Left icon: Material Symbols `mail` icon (absolute positioned)
     - Focus state: `border-[#D4A359]` (golden-amber)
     - Placeholder: "Enter your email"
   - Password input:
     - Label: "Password"
     - Same styling as email input
     - Left icon: Material Symbols `lock` icon
     - Right icon: Visibility toggle button (`visibility_off` / `visibility`)
     - Type toggles between `password` and `text`
   - Submit button:
     - "Sign In to Dashboard" with right arrow icon
     - Full width, 52px height, `bg-primary-container text-surface-container-lowest`
     - `rounded-[10px]`, hover effect: slight upward translate

   **Footer:**
   - "Protected single-user access • Mellow Café ☕"
   - Separated by a top border, centered, muted text

3. **Implement the auth logic**
   - On form submit:
     - Show a loading state on the button (disable + spinner or loading text)
     - Call `supabase.auth.signInWithPassword({ email, password })`
     - On success: redirect to `/` (dashboard) using `router.push('/')`
     - On error: display the error message below the form (styled with `text-error` color)
   - Use the browser Supabase client from `createSupabaseClient()`
   - Use `useRouter()` from `next/navigation` for redirect

4. **Create a sign-out Server Action: `src/app/(auth)/actions.ts`**
   - Export an async function `signOut()` that:
     - Creates a server Supabase client
     - Calls `supabase.auth.signOut()`
     - Redirects to `/login` using `redirect('/login')`
   - This will be used by the Owner badge/button in the TopNav later

5. **Handle password visibility toggle**
   - Use `useState` to track `showPassword` boolean
   - Toggle the input type between `'password'` and `'text'`
   - Toggle the icon between `visibility_off` and `visibility`
</instructions>

<requirements>
### Functional Requirements
- Login form must authenticate with Supabase Auth using email + password
- Invalid credentials must show a clear error message (e.g., "Invalid login credentials")
- Successful login redirects to the dashboard
- Password field must have a visibility toggle
- Loading state must be shown during authentication (button disabled, visual feedback)
- Sign-out action must clear the session and redirect to login

### Technical Requirements
- Login page is a Client Component (`'use client'`) for form interactivity
- Sign-out is a Server Action for security
- The auth layout `(auth)/layout.tsx` must NOT include TopNav or Footer
- Use `createSupabaseClient()` (browser client) for sign-in
- Form must have `type="email"` validation on the email field and `required` on both fields

### File Naming Conventions
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/layout.tsx`
- `src/app/(auth)/actions.ts`
</requirements>

<output_files>
Generate the following files:

1. `src/app/(auth)/layout.tsx` — Auth layout (no nav, centered card)
2. `src/app/(auth)/login/page.tsx` — Login page with form and auth logic
3. `src/app/(auth)/actions.ts` — Sign-out Server Action
</output_files>

## Verification

<verification>
After completing this step, confirm:

- [ ] Navigating to `/login` shows the login card centered on an oatmeal background
- [ ] The Mellow logo, "HOME BASED CAFE" badge, and "Owner Sign In" heading render correctly
- [ ] Email and password fields have Material Symbols icons (mail, lock)
- [ ] Password visibility toggle works (switches between dots and plain text)
- [ ] Submitting with invalid credentials shows an error message
- [ ] Submitting with valid credentials redirects to the dashboard
- [ ] The "Sign In to Dashboard" button shows a loading state during auth
- [ ] The login page does NOT show the TopNav or Footer
- [ ] `npx tsc --noEmit` passes
</verification>

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| "Invalid login credentials" even with correct password | No user created in Supabase | Create a user in Supabase Dashboard → Authentication → Users → Add User |
| Redirect after login doesn't work | Missing `router.push` or cookie not set | Ensure using `createSupabaseClient()` (browser client) which handles cookies |
| Login page shows TopNav | Login is inside `(dashboard)` route group | Ensure login is at `src/app/(auth)/login/page.tsx`, NOT `src/app/(dashboard)/login/` |
| Form submits but nothing happens | Missing `e.preventDefault()` | Ensure the form's onSubmit handler prevents default form submission |

---

**Previous**: [1.1 - Supabase Client Setup](./01_supabase_client_setup.md) | **Next**: [1.3 - Auth Middleware Protection](./03_auth_middleware_protection.md)
