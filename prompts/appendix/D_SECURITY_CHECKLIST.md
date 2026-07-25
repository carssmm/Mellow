# Appendix D: Security Checklist

> MVP-level security measures for the Mellow Café System.
> Security Tier: Basic Production (single-user, low-risk data)

---

## ✅ Authentication & Authorization

- [ ] Supabase Auth enabled with email+password
- [ ] `getUser()` used for server-side auth checks (NOT `getSession()`)
- [ ] Middleware refreshes sessions on every request
- [ ] Unauthenticated users cannot access any dashboard route
- [ ] Login page accessible without authentication
- [ ] Sign-out clears all session cookies

## ✅ Row Level Security (RLS)

- [ ] RLS enabled on `products` table
- [ ] RLS enabled on `sales` table
- [ ] RLS enabled on `sales_items` table
- [ ] RLS enabled on `expenses` table
- [ ] All policies check `auth.uid() = user_id`
- [ ] `sales_items` policy checks through `sales` table join
- [ ] No table has `public` access without authentication

## ✅ Environment Variables

- [ ] `.env.local` in `.gitignore`
- [ ] No secrets committed to Git history
- [ ] Only `NEXT_PUBLIC_` prefixed variables accessible on client
- [ ] `.env.example` documents all required variables (without values)
- [ ] Vercel production env vars configured separately

## ✅ Input Validation

- [ ] All Server Actions validate inputs with Zod schemas
- [ ] Client-side validation for immediate feedback
- [ ] Server-side validation as the source of truth (never trust client)
- [ ] Number inputs prevent negative values where applicable
- [ ] String inputs trimmed and length-limited

## ✅ Data Protection

- [ ] Monetary values stored as DECIMAL(10,2), not FLOAT
- [ ] Price/cost snapshots stored in `sales_items` (not live references)
- [ ] ON DELETE RESTRICT prevents orphaned sales data
- [ ] Foreign key constraints enforce referential integrity
- [ ] UUID primary keys (not sequential integers)

## ✅ HTTP Security Headers (Vercel)

- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-Frame-Options: DENY`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] HTTPS enforced (Vercel default)
- [ ] No CORS issues (same-origin API calls)

## ✅ Client-Side Security

- [ ] No sensitive data in `localStorage` or `sessionStorage`
- [ ] Auth tokens managed via HTTP-only cookies (Supabase SSR default)
- [ ] No inline `<script>` tags
- [ ] No `eval()` or `innerHTML` with user input
- [ ] Form submissions use Server Actions (not exposed API endpoints)

## ⚠️ Known Limitations (Acceptable for MVP)

- No rate limiting on Server Actions (Supabase has built-in rate limiting)
- No CSRF token (Next.js Server Actions have built-in CSRF protection)
- No audit logging of data changes
- No IP-based access restriction
- No two-factor authentication
- No password complexity requirements (Supabase defaults apply)
- No data encryption at rest (Supabase handles this)

## 🔮 Future Security Improvements (Post-MVP)

- Add rate limiting to auth endpoints
- Implement audit trail for data changes
- Add two-factor authentication
- Implement password complexity rules
- Add session timeout (auto-logout after inactivity)
- Content Security Policy headers
- Subresource Integrity for CDN resources
