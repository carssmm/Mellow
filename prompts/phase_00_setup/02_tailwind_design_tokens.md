# 0.2 Tailwind Design Tokens — Mellow Artisanal Design System

## Context

<context>
This step configures the Tailwind CSS theme with the complete Mellow Artisanal design system. The design tokens (colors, typography, spacing, shadows, border radii) are extracted from the `Mellow UI/mellow_artisanal_interface/DESIGN.md` specification and the reference HTML code in `Mellow UI/*/code.html`. This ensures every component we build in later phases uses the exact same visual language as the UI mockups. The aesthetic is "Modern Artisanal" — warm oatmeal cream backgrounds, organic earthy tones, Bricolage Grotesque for headings, and Manrope for body/data text.
</context>

## Prerequisites

<prerequisites>
- Step 0.1 completed (Next.js project initialized with Tailwind CSS installed)
- `tailwind.config.ts` exists at the project root
- `src/app/globals.css` exists with Tailwind directives
- `src/app/layout.tsx` exists
</prerequisites>

## AI Implementation Prompt

<instructions>
Think step by step:

1. **Configure Google Fonts in the root layout**
   - In `src/app/layout.tsx`, import `Bricolage_Grotesque` and `Manrope` from `next/font/google`
   - Configure Bricolage Grotesque with weights: 600, 700, 800; subsets: ['latin']; variable: `--font-bricolage`
   - Configure Manrope with weights: 400, 500, 600; subsets: ['latin']; variable: `--font-manrope`
   - Apply both font CSS variables to the `<html>` element's className
   - Also add a link to Material Symbols Outlined in the `<head>` using the Next.js metadata API or a `<link>` tag: `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap`

2. **Configure the Tailwind theme in `tailwind.config.ts`**
   - Override/extend the theme with the COMPLETE Mellow Artisanal color palette:

   **Core Surface Colors (Material Design 3 tonal surface system):**
   - `surface`: `#fcf9f3` (main background)
   - `surface-dim`: `#dcdad4`
   - `surface-bright`: `#fcf9f3`
   - `surface-container-lowest`: `#ffffff` (cards)
   - `surface-container-low`: `#f6f3ed`
   - `surface-container`: `#f0eee8`
   - `surface-container-high`: `#ebe8e2` (chips, badges background)
   - `surface-container-highest`: `#e5e2dc`
   - `on-surface`: `#1c1c18` (primary text)
   - `on-surface-variant`: `#4a4640` (secondary text)
   - `inverse-surface`: `#31312d`
   - `inverse-on-surface`: `#f3f0ea`
   - `surface-variant`: `#e5e2dc`
   - `surface-tint`: `#605e5c`
   - `background`: `#fcf9f3`
   - `on-background`: `#1c1c18`

   **Primary Colors:**
   - `primary`: `#000000` (used for authority text and primary actions)
   - `on-primary`: `#ffffff`
   - `primary-container`: `#1c1b1a` (dark charcoal — primary buttons)
   - `on-primary-container`: `#868382`
   - `inverse-primary`: `#cac6c4`
   - `primary-fixed`: `#e6e2df`
   - `primary-fixed-dim`: `#cac6c4`
   - `on-primary-fixed`: `#1c1b1a`
   - `on-primary-fixed-variant`: `#484645`

   **Secondary Colors (Golden Amber accent):**
   - `secondary`: `#7e5713`
   - `on-secondary`: `#ffffff`
   - `secondary-container`: `#fec97b`
   - `on-secondary-container`: `#78520e`
   - `secondary-fixed`: `#ffddb1`
   - `secondary-fixed-dim`: `#f2be71`
   - `on-secondary-fixed`: `#291800`
   - `on-secondary-fixed-variant`: `#614000`

   **Tertiary Colors (Emerald Green for positive metrics):**
   - `tertiary`: `#000000`
   - `on-tertiary`: `#ffffff`
   - `tertiary-container`: `#002114`
   - `on-tertiary-container`: `#539072`
   - `tertiary-fixed`: `#b1f0ce`
   - `tertiary-fixed-dim`: `#95d4b3`
   - `on-tertiary-fixed`: `#002114`
   - `on-tertiary-fixed-variant`: `#0e5138`

   **Semantic Colors:**
   - `error`: `#ba1a1a`
   - `on-error`: `#ffffff`
   - `error-container`: `#ffdad6`
   - `on-error-container`: `#93000a`
   - `outline`: `#7b766f` (medium borders)
   - `outline-variant`: `#ccc6bd` (light borders — primary card border)

   **Extended Semantic Colors:**
   - `emerald-600`: `#2D6A4F` (positive financial — net profit)
   - `amber-600`: `#C58B38` (warnings, low stock alerts)

3. **Configure Typography in Tailwind**
   - Add custom font families mapping to the CSS variables:
     - `display-brand`: `var(--font-bricolage)` (Bricolage Grotesque)
     - `headline-lg`: `var(--font-bricolage)`
     - `headline-lg-mobile`: `var(--font-bricolage)`
     - `headline-md`: `var(--font-bricolage)`
     - `body-lg`: `var(--font-manrope)` (Manrope)
     - `body-md`: `var(--font-manrope)`
     - `nav-link`: `var(--font-manrope)`
     - `label-md`: `var(--font-manrope)`
     - `number-data`: `var(--font-manrope)`

   - Add custom font sizes with line-height, letter-spacing, and font-weight:
     - `display-brand`: 48px, line-height 1.1, letter-spacing -0.02em, weight 800
     - `headline-lg`: 32px, line-height 1.2, weight 700
     - `headline-lg-mobile`: 24px, line-height 1.2, weight 700
     - `headline-md`: 20px, line-height 1.3, weight 600
     - `body-lg`: 18px, line-height 1.6, weight 400
     - `body-md`: 16px, line-height 1.5, weight 400
     - `nav-link`: 15px, line-height 1.0, weight 600
     - `label-md`: 14px, line-height 1.2, letter-spacing 0.01em, weight 500
     - `number-data`: 16px, line-height 1.0, letter-spacing -0.01em, weight 600

4. **Configure Spacing tokens**
   - `base`: `8px`
   - `container-padding`: `24px`
   - `gutter`: `16px`
   - `card-gap`: `20px`
   - `section-margin`: `48px`

5. **Configure Border Radius**
   - `DEFAULT`: `0.25rem` (4px)
   - `lg`: `0.5rem` (8px)
   - `xl`: `16px` (cards)
   - `full`: `9999px` (pills)

6. **Configure Box Shadows**
   - `ambient`: `0 4px 20px rgba(28, 27, 26, 0.04)` (soft ambient lift)
   - `soft`: `0 4px 20px rgba(28,27,26,0.04)` (alias)

7. **Update `src/app/globals.css`**
   - Keep the three Tailwind directives
   - Add base styles:
     - Set `body` background color to `#F5F2EC` (the oatmeal canvas from DESIGN.md)
     - Set Material Symbols Outlined default font-variation-settings: `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24`
     - Add a `.material-symbols-outlined.fill` class with `font-variation-settings: 'FILL' 1`
   - Add any CSS custom properties needed for the design system

8. **Create a test page to verify**
   - Update `src/app/page.tsx` to display:
     - A heading using `text-display-brand font-display-brand` → "Mellow Café"
     - A sub-heading using `text-headline-md font-headline-md` → "Design System Test"
     - Body text using `text-body-md font-body-md text-on-surface-variant`
     - A card with `bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-ambient`
     - An emerald metric: `text-emerald-600` → "₱2,450.00"
     - An amber warning: `text-amber-600` → "3 Items Low"
     - A primary button: `bg-primary-container text-on-primary rounded-lg px-6 py-3`
     - A golden-amber accent button: `bg-[#D4A359] text-white rounded-lg px-6 py-3`
     - A Material Symbols icon: `<span class="material-symbols-outlined">local_cafe</span>`
</instructions>

<requirements>
### Functional Requirements
- Every color from the DESIGN.md must be available as a Tailwind utility class (e.g., `bg-surface`, `text-on-surface-variant`)
- Typography classes must match the exact sizes, weights, and line-heights from DESIGN.md
- Bricolage Grotesque must render for headings, Manrope for body text
- Material Symbols Outlined must be available globally

### Technical Requirements
- Use `next/font/google` for font loading (not CDN `<link>` tags) for Bricolage Grotesque and Manrope — this provides font optimization
- Material Symbols Outlined should be loaded via a `<link>` tag since `next/font` doesn't support icon fonts
- Tailwind config must use the `extend` pattern to preserve defaults while adding custom tokens
- All color values must exactly match the hex codes from DESIGN.md

### File Naming Conventions
- `tailwind.config.ts` (TypeScript config)
- `src/app/globals.css` (global styles)
- `src/app/layout.tsx` (root layout with fonts)
</requirements>

<output_files>
Generate/modify the following files:

1. `tailwind.config.ts` — Complete Mellow Artisanal theme configuration
2. `src/app/globals.css` — Updated with base styles and Material Symbols config
3. `src/app/layout.tsx` — Updated with Google Fonts (Bricolage Grotesque + Manrope) and Material Symbols
4. `src/app/page.tsx` — Design system test page
</output_files>

## Directory Structure

After completing this step, the project should have:

```
mellow-cafe/
├── public/
├── src/
│   └── app/
│       ├── globals.css          ← MODIFIED (base styles added)
│       ├── layout.tsx           ← MODIFIED (fonts configured)
│       └── page.tsx             ← MODIFIED (design test page)
├── tailwind.config.ts           ← MODIFIED (full theme config)
└── ... (other config files unchanged)
```

## Verification

<verification>
After completing this step, confirm:

- [ ] The test page at `http://localhost:3000` shows Bricolage Grotesque for headings and Manrope for body text
- [ ] Cards have the warm oatmeal background (`#F5F2EC` on body, `#ffffff` cards, `#E6E1DA`-style borders)
- [ ] The emerald green metric text is clearly different from the amber warning text
- [ ] Material Symbols Outlined icons render (e.g., `local_cafe` icon appears)
- [ ] The primary button has a dark charcoal background (`#1c1b1a`)
- [ ] The golden-amber accent button is clearly visible with `#D4A359` background
- [ ] `npx tsc --noEmit` still passes with zero errors
</verification>

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Fonts not rendering (browser defaults shown) | `next/font/google` CSS variable not applied to `<html>` | Check that font variables are added to `className` on the `<html>` element in `layout.tsx` |
| Tailwind custom colors not working | Config syntax error or not using `extend` | Check `tailwind.config.ts` for valid syntax; ensure colors are under `theme.extend.colors` |
| Material Symbols not appearing | Font not loaded | Verify the Google Fonts `<link>` tag is in the `<head>` and URL is correct |
| Body background is white instead of oatmeal | `globals.css` override not applied | Ensure `body` style sets `background-color: #F5F2EC` in `globals.css` |

---

**Previous**: [0.1 - Next.js Project Init](./01_nextjs_project_init.md) | **Next**: [0.3 - Supabase Setup](./03_supabase_setup.md)
