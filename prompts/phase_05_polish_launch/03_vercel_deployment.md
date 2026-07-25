# 5.3 Vercel Deployment

## Context

<context>
This final step deploys the Mellow Café System to Vercel's free tier, configures production environment variables, runs a final build check, and provides a deployment verification checklist. After this, the café owner has a live production URL for their business management app.
</context>

## AI Implementation Prompt

<instructions>
1. **Pre-deployment build check**
   - Run `npm run build` and fix any build errors
   - Run `npx tsc --noEmit` for TypeScript validation
   - Run `npm run lint` for code quality
   - Ensure all environment variables are documented in `.env.example`

2. **Vercel project setup**
   - Install Vercel CLI: `npm install -g vercel` (or use `npx vercel`)
   - Initialize: `npx vercel` in the project root
   - Configure:
     - Framework Preset: Next.js (auto-detected)
     - Build Command: `npm run build`
     - Output Directory: `.next` (default)
     - Install Command: `npm install`

3. **Configure production environment variables in Vercel**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL` — Production Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Production Supabase anon key
   - Ensure variables are set for the Production environment

4. **Deploy**
   - Run `npx vercel --prod` for production deployment
   - Or push to the connected Git repository for automatic deployment

5. **Post-deployment verification**
   - Visit the production URL
   - Test the full flow: Login → Dashboard → Record Sale → Check Inventory → View Analytics
   - Test on mobile browser (iPhone Safari and Android Chrome)
   - Verify PWA install works from the production URL
   - Check that Supabase RLS blocks unauthorized access

6. **Create a deployment configuration: `vercel.json` (optional)**
   - Configure headers for security:
     - `X-Content-Type-Options: nosniff`
     - `X-Frame-Options: DENY`
     - `Referrer-Policy: strict-origin-when-cross-origin`
   - Configure redirects if needed
</instructions>

<output_files>
1. `vercel.json` — Optional Vercel configuration with security headers
2. `.env.example` — MODIFIED: Ensure all required variables documented
</output_files>

## Final Deployment Checklist

<verification>
### Build
- [ ] `npm run build` completes with zero errors
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes

### Security
- [ ] `.env.local` is in `.gitignore` (no secrets in Git)
- [ ] Supabase RLS is enabled on ALL tables in production
- [ ] No API keys exposed in client-side code (only `NEXT_PUBLIC_` prefixed vars)
- [ ] HTTPS enforced (Vercel does this by default)

### Functionality
- [ ] Login works with production Supabase credentials
- [ ] Dashboard shows live data
- [ ] Sales recording works (all 3 modes)
- [ ] Inventory CRUD works
- [ ] Shopping list generates correctly
- [ ] Calculators compute correctly
- [ ] Analytics charts render
- [ ] CSV export downloads

### Mobile
- [ ] Works on iPhone Safari
- [ ] Works on Android Chrome
- [ ] PWA installable from production URL
- [ ] Bottom navigation works on mobile
- [ ] Touch targets are adequate
- [ ] No horizontal scroll issues

### Performance
- [ ] Page load under 3 seconds on 4G
- [ ] No console errors in production
- [ ] Images and fonts load correctly
</verification>

---

**Previous**: [5.2 - Mobile Responsive Polish](./02_mobile_responsive_polish.md) | **Next**: [Phase 5 Checklist](./99_PHASE_CHECKLIST.md)
