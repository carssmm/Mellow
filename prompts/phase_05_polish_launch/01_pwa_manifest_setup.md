# 5.1 PWA Manifest Setup

## Context

<context>
This step makes the Mellow Café System installable as a Progressive Web App on the café owner's phone. They can add it to their home screen for instant, app-like access without going through an app store. This includes the web app manifest, app icons, theme color, and basic service worker registration.
</context>

## AI Implementation Prompt

<instructions>
1. **Create the Web App Manifest: `public/manifest.json`**
   ```json
   {
     "name": "Mellow Café System",
     "short_name": "Mellow",
     "description": "Smart café management — sales, stock, and financial intelligence",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#F5F2EC",
     "theme_color": "#1c1b1a",
     "orientation": "any",
     "icons": [
       { "src": "/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png" },
       { "src": "/icons/icon-512x512.png", "sizes": "512x512", "type": "image/png" },
       { "src": "/icons/icon-maskable-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
     ]
   }
   ```

2. **Create app icons**
   - Generate placeholder icons at `public/icons/`:
     - `icon-192x192.png` — Simple "M" on oatmeal background
     - `icon-512x512.png` — Same, larger
     - `icon-maskable-512x512.png` — With safe zone padding for adaptive icons
   - Use a simple canvas-generated icon or an SVG placeholder

3. **Add manifest to the root layout metadata**
   - In `src/app/layout.tsx`, add to the Next.js metadata export:
     - `manifest: '/manifest.json'`
     - `themeColor: '#1c1b1a'`
     - `appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Mellow' }`
   - Add Apple-specific meta tags for iOS:
     - `<link rel="apple-touch-icon" href="/icons/icon-192x192.png" />`

4. **Add viewport meta tag** (if not already present)
   - Ensure `viewport` metadata includes: `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no`
   - The `user-scalable=no` prevents double-tap zoom on the POS-like interface
</instructions>

<output_files>
1. `public/manifest.json` — Web App Manifest
2. `public/icons/` — App icons (placeholder SVGs or PNGs)
3. `src/app/layout.tsx` — MODIFIED: Add manifest link and PWA metadata
</output_files>

## Verification

<verification>
- [ ] Chrome DevTools → Application → Manifest shows valid manifest data
- [ ] "Add to Home Screen" prompt appears on mobile browsers
- [ ] Installed PWA launches in standalone mode (no browser chrome)
- [ ] Theme color applies to the status bar
</verification>

---

**Next**: [5.2 - Mobile Responsive Polish](./02_mobile_responsive_polish.md)
