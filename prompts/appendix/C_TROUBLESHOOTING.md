# Appendix C: Troubleshooting

> Common issues and solutions for the Mellow Café System.

---

## Authentication Issues

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| Login fails with valid credentials | User not created in Supabase | Go to Supabase Dashboard → Authentication → Users → Add User |
| Infinite redirect loop | Middleware matching login page | Ensure `/login` path is excluded from auth redirect logic |
| Session lost on refresh | Cookie not being set | Verify `setAll` implementation in Supabase server client |
| "Invalid API key" error | Wrong `.env.local` values | Copy the correct URL and anon key from Supabase Dashboard → Settings → API |
| Auth works locally but not in production | Vercel env vars not set | Add env vars in Vercel Dashboard → Project → Settings → Environment Variables |

## Database Issues

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| No data returned from queries | RLS blocking requests | Check that the user is authenticated and RLS policies match `auth.uid()` |
| "relation does not exist" | Migration not run | Execute `001_initial_schema.sql` in Supabase SQL Editor |
| Foreign key violation on delete | Product referenced by sales_items | Products with existing sales cannot be deleted (ON DELETE RESTRICT) |
| Decimal precision errors | Using JavaScript floats | Use `Number(value.toFixed(2))` or multiply by 100 to work in cents |

## Tailwind / Styling Issues

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| Custom colors not working | Config syntax error | Check `tailwind.config.ts` for valid TypeScript syntax |
| Fonts not loading | CSS variable not applied | Ensure font variables are on the `<html>` element in `layout.tsx` |
| Material Symbols missing | Font CDN not loaded | Add Google Fonts `<link>` tag in `layout.tsx` or `globals.css` |
| Classes not purged correctly | Dynamic class names | Use complete class names, not template literals for Tailwind classes |

## Build / Deployment Issues

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| Build fails with "async Server Component" | Missing `async` keyword | Server Components using `await` must be `async function` |
| "Module not found" | Incorrect import path | Check `@/*` alias maps to `src/*` in `tsconfig.json` |
| Vercel deployment fails | Missing env vars | Set all `NEXT_PUBLIC_*` vars in Vercel project settings |
| Static file 404 (fonts, images) | Middleware blocking | Check middleware matcher excludes static file extensions |

## Mobile Issues

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| 300ms tap delay | Missing touch-manipulation | Add `touch-action: manipulation` to interactive elements |
| Bottom nav overlapping content | Missing bottom padding | Add `pb-20` or `pb-[80px]` to the main content area |
| Horizontal scroll on mobile | Element wider than viewport | Check for fixed-width elements or tables; use `overflow-x-auto` |
| PWA not installable | Missing manifest or icon | Verify `manifest.json` is linked in the `<head>` and icons exist |

## Chart Issues

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| Recharts not rendering | SSR conflict | Wrap chart components in `'use client'` and use `dynamic()` with `ssr: false` if needed |
| Chart data empty | Date range query wrong | Check timezone handling — use Philippine Time (UTC+8) |
| Chart too small | Missing ResponsiveContainer | Wrap charts in `<ResponsiveContainer width="100%" height={300}>` |
