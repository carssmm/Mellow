# 5.2 Mobile Responsive Polish

## Context

<context>
This step polishes the mobile experience across all pages. The café owner primarily uses the app on their phone during peak hours, so touch targets, loading states, and responsive layouts are critical. This includes adding bottom tab navigation for mobile, loading skeletons, error boundaries, and empty state components.
</context>

## AI Implementation Prompt

<instructions>
1. **Create Mobile Bottom Navigation: `src/components/layout/mobile-nav.tsx`**
   - Fixed bottom navigation bar (visible only on mobile, hidden on desktop: `lg:hidden`)
   - 5 tab items: Dashboard, Sales, Inventory, Analytics, Calculators
   - Each tab: icon (Material Symbols) + label text
   - Active tab: `text-secondary` (golden amber)
   - Inactive tab: `text-on-surface-variant`
   - Background: `bg-surface border-t border-outline-variant`
   - Height: 64px with safe area padding for notched phones: `pb-safe`
   - Hide the TopNav on mobile and show Bottom Nav instead (or keep TopNav as a simplified bar)

2. **Add loading skeletons**
   - Create `src/components/ui/skeleton.tsx` — reusable skeleton component
     - Animated pulse: `animate-pulse bg-surface-container-high rounded`
     - Variants: `text` (line), `card` (block), `circle` (avatar)
   - Create loading.tsx files for key routes:
     - `src/app/(dashboard)/loading.tsx` — Dashboard skeleton with 4 metric card placeholders
     - `src/app/(dashboard)/inventory/loading.tsx` — Table skeleton
     - `src/app/(dashboard)/sales/loading.tsx` — Sales page skeleton
     - `src/app/(dashboard)/analytics/loading.tsx` — Chart skeleton

3. **Add error boundaries**
   - Create `src/app/(dashboard)/error.tsx` — Client Component error boundary
     - Shows a friendly error message with the Mellow branding
     - "Something went wrong" heading, description, and "Try Again" button
     - Calls `reset()` on retry
   - Create `src/app/not-found.tsx` — Custom 404 page
     - "Page Not Found" with a link back to the dashboard

4. **Add empty states**
   - Create `src/components/ui/empty-state.tsx` — Reusable empty state component
     - Icon, title, description, optional action button
     - Used when: no products, no sales, no activity log items
   - Example: "No sales recorded today. Start by tapping 'Record New Sale'."

5. **Touch target optimization**
   - Audit all interactive elements for minimum 48×48px touch targets
   - Key areas to fix:
     - Product tiles in Quick Tap Logger: ensure min-height 48px
     - Category chips: ensure min-height 44px, min-width 44px
     - Cart item +/- buttons: ensure 44×44px
     - Nav items in bottom bar: ensure adequate spacing
   - Add `touch-manipulation` CSS to interactive elements to remove 300ms tap delay

6. **Responsive grid adjustments**
   - Dashboard metrics: `grid-cols-2` on mobile (2 cards per row), `grid-cols-4` on desktop
   - Inventory: table scrolls horizontally on mobile, or stacks as cards
   - Sales cart: moves below product grid on mobile (not sidebar)
   - Calculators: stack vertically on mobile
   - Analytics charts: full width on mobile

7. **Add `safe-area-inset` padding**
   - For phones with notches (iPhone X+), add safe area padding:
     - Bottom nav: `pb-[env(safe-area-inset-bottom)]`
     - Top content: `pt-[env(safe-area-inset-top)]` if in standalone PWA mode
</instructions>

<output_files>
1. `src/components/layout/mobile-nav.tsx` — Bottom tab navigation
2. `src/components/ui/skeleton.tsx` — Loading skeleton component
3. `src/components/ui/empty-state.tsx` — Empty state component
4. `src/app/(dashboard)/loading.tsx` — Dashboard loading skeleton
5. `src/app/(dashboard)/inventory/loading.tsx` — Inventory loading skeleton
6. `src/app/(dashboard)/sales/loading.tsx` — Sales loading skeleton
7. `src/app/(dashboard)/analytics/loading.tsx` — Analytics loading skeleton
8. `src/app/(dashboard)/error.tsx` — Error boundary
9. `src/app/not-found.tsx` — Custom 404 page
10. `src/app/(dashboard)/layout.tsx` — MODIFIED: Add bottom nav for mobile
</output_files>

## Verification

<verification>
- [ ] Bottom navigation appears on mobile screens (< 1024px)
- [ ] TopNav is hidden or simplified on mobile
- [ ] Loading skeletons appear during page transitions
- [ ] Error boundary catches and displays errors gracefully
- [ ] 404 page renders for invalid routes
- [ ] Empty states show for pages with no data
- [ ] All touch targets are at least 44×48px
- [ ] App works well on iPhone Safari and Android Chrome
</verification>

---

**Previous**: [5.1 - PWA Manifest](./01_pwa_manifest_setup.md) | **Next**: [5.3 - Vercel Deployment](./03_vercel_deployment.md)
