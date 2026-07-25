# Appendix A: Mellow Artisanal Design System

> Complete design token reference for the Mellow Café System.
> Source: `Mellow UI/mellow_artisanal_interface/DESIGN.md` and UI reference code.

---

## Color Palette

### Core Surface Colors (Material Design 3 Tonal Surface System)

| Token | Hex | Usage |
|-------|-----|-------|
| `surface` | `#fcf9f3` | Main background |
| `surface-dim` | `#dcdad4` | Dimmed surface |
| `surface-bright` | `#fcf9f3` | Bright surface |
| `surface-container-lowest` | `#ffffff` | Cards, modals |
| `surface-container-low` | `#f6f3ed` | Secondary cards |
| `surface-container` | `#f0eee8` | Medium surface |
| `surface-container-high` | `#ebe8e2` | Chips, badges |
| `surface-container-highest` | `#e5e2dc` | Elevated surface |
| `on-surface` | `#1c1c18` | Primary text |
| `on-surface-variant` | `#4a4640` | Secondary text |
| `inverse-surface` | `#31312d` | Dark inverse |
| `inverse-on-surface` | `#f3f0ea` | Text on dark |
| `surface-variant` | `#e5e2dc` | Variant surface |
| `background` | `#fcf9f3` | Page background |
| `on-background` | `#1c1c18` | Text on background |

### Primary Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#000000` | Authority text, links |
| `on-primary` | `#ffffff` | Text on primary |
| `primary-container` | `#1c1b1a` | Primary buttons, dark charcoal |
| `on-primary-container` | `#868382` | Text on primary container |
| `inverse-primary` | `#cac6c4` | Primary on dark |

### Secondary Colors (Golden Amber Accent)

| Token | Hex | Usage |
|-------|-----|-------|
| `secondary` | `#7e5713` | Accent text |
| `on-secondary` | `#ffffff` | Text on secondary |
| `secondary-container` | `#fec97b` | Accent container |
| `on-secondary-container` | `#78520e` | Text on accent container |

### Tertiary Colors (Emerald Green)

| Token | Hex | Usage |
|-------|-----|-------|
| `tertiary-container` | `#002114` | Deep green container |
| `on-tertiary-container` | `#539072` | Text on green |
| `tertiary-fixed` | `#b1f0ce` | Light green |
| `on-tertiary-fixed-variant` | `#0e5138` | Text on light green |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `error` | `#ba1a1a` | Error states |
| `error-container` | `#ffdad6` | Error background |
| `outline` | `#7b766f` | Medium borders |
| `outline-variant` | `#ccc6bd` | Light borders, card borders |
| `emerald-600` | `#2D6A4F` | Positive financial (net profit) |
| `amber-600` | `#C58B38` | Warnings, low stock |

### Special UI Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Golden Amber CTA | `#D4A359` | Call-to-action buttons |
| Golden Amber Hover | `#C58B38` | CTA hover state |
| Oatmeal Canvas | `#F5F2EC` | Body background |
| Card Border | `#E6E1DA` | Card and input borders |
| Input Background | `#FAFAFA` | Form input backgrounds |
| Focus Border | `#D4A359` | Input focus state |

---

## Typography

### Font Families

| Role | Font | CSS Variable |
|------|------|-------------|
| Display/Headings | Bricolage Grotesque | `--font-bricolage` |
| Body/Data/Navigation | Manrope | `--font-manrope` |
| Icons | Material Symbols Outlined | (CDN link) |

### Type Scale

| Token | Size | Line Height | Weight | Font |
|-------|------|-------------|--------|------|
| `display-brand` | 48px | 1.1 | 800 | Bricolage |
| `headline-lg` | 32px | 1.2 | 700 | Bricolage |
| `headline-lg-mobile` | 24px | 1.2 | 700 | Bricolage |
| `headline-md` | 20px | 1.3 | 600 | Bricolage |
| `body-lg` | 18px | 1.6 | 400 | Manrope |
| `body-md` | 16px | 1.5 | 400 | Manrope |
| `nav-link` | 15px | 1.0 | 600 | Manrope |
| `label-md` | 14px | 1.2 | 500 | Manrope |
| `number-data` | 16px | 1.0 | 600 | Manrope |

---

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `base` | 8px | Base unit |
| `container-padding` | 24px | Page content padding |
| `gutter` | 16px | Grid gutter |
| `card-gap` | 20px | Gap between cards |
| `section-margin` | 48px | Vertical section spacing |

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 4px | Small elements |
| `DEFAULT` | 8px | Buttons, badges |
| `lg` | 10px | Inputs |
| `xl` | 16px | Cards |
| `full` | 9999px | Pills, circular |

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `ambient` | `0 4px 20px rgba(28,27,26,0.04)` | Cards, elevated surfaces |
| `soft` | Same as ambient | Alias |

## Max Content Width

- `1280px` — All content is centered within this max width
- Applied via: `max-w-[1280px] mx-auto px-container-padding`

---

## Component Patterns

### Card
```
bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-ambient
```

### Primary Button
```
bg-primary-container text-on-primary rounded-lg px-6 py-3 hover:opacity-90 transition-opacity
```

### Golden CTA Button
```
bg-[#D4A359] hover:bg-[#C58B38] text-white rounded-lg px-6 py-3 font-semibold
```

### Secondary Button (Outline)
```
bg-surface text-on-surface border border-outline-variant rounded-lg px-6 py-3 hover:bg-surface-container-high
```

### Form Input
```
w-full px-4 py-3 bg-[#FAFAFA] border border-outline-variant rounded-[10px] focus:border-[#D4A359] focus:ring-1 focus:ring-[#D4A359] outline-none
```

### Badge (Stock Status)
```
// In Stock
bg-tertiary-fixed/30 text-on-tertiary-fixed-variant px-2 py-0.5 rounded text-xs

// Low Stock
bg-secondary-fixed/50 text-on-secondary-fixed px-2 py-0.5 rounded text-xs

// Out of Stock
bg-error-container text-on-error-container px-2 py-0.5 rounded text-xs
```

### Metric Card Value
```
// Positive (profit): text-emerald-600 text-[32px] font-bold
// Neutral: text-primary text-[32px] font-bold
// Warning: text-amber-600 text-[32px] font-bold
```
