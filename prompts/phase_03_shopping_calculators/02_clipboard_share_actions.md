# 3.2 Clipboard & Share Actions

## Context

<context>
This step adds the "Copy to WhatsApp/SMS" and "Copy Plain Text List" functionality to the Smart Restock List. The formatted message is optimized for pasting into WhatsApp or SMS to send to suppliers. It also optionally uses the Web Share API for native device sharing on mobile.
</context>

## Prerequisites

<prerequisites>
- Step 3.1 completed (Restock List component with items)
</prerequisites>

## AI Implementation Prompt

<instructions>
1. **Create clipboard/share utilities: `src/lib/clipboard.ts`**

   **`formatRestockForWhatsApp(items, adHocItems?, estimatedCost?)`:**
   - Format the restock list as a WhatsApp-friendly message:
     ```
     🛒 *Mellow Café Restock List*
     📅 [Today's Date]
     ───────────────
     ☐ Buy 8 bags Espresso Beans
     ☐ Buy 12 boxes Fresh Milk
     ───────────────
     💰 Est. Total: ₱4,140.00
     ```
   - Use WhatsApp-compatible formatting: `*bold*`, line breaks, emoji checkboxes

   **`formatRestockPlainText(items, adHocItems?, estimatedCost?)`:**
   - Plain text version without emoji/formatting:
     ```
     Mellow Café Restock List - [Date]
     - Buy 8 bags Espresso Beans
     - Buy 12 boxes Fresh Milk
     Est. Total: P4,140.00
     ```

   **`copyToClipboard(text)`:**
   - Use `navigator.clipboard.writeText(text)`
   - Return success/failure
   - Fallback: create a temporary textarea, select, and `document.execCommand('copy')`

   **`shareNative(text, title?)`:**
   - Check if `navigator.share` is available (Web Share API)
   - If available, call `navigator.share({ title, text })`
   - If not available, fall back to `copyToClipboard`

2. **Create copy/share buttons in the Restock List**
   - Two buttons at the bottom of the restock list card:
     - "Copy to WhatsApp / SMS" — charcoal primary button with play icon + WhatsApp emoji
       - On click: format with `formatRestockForWhatsApp`, copy to clipboard, show "Copied!" toast
     - "Copy Plain Text List" — secondary outline button with clipboard icon
       - On click: format with `formatRestockPlainText`, copy to clipboard, show "Copied!" toast
   - Both buttons need `'use client'` since they use browser APIs
   - Show a brief "✓ Copied!" feedback state on the button for 2 seconds after copying

3. **Wrap the restock list buttons in a client component**
   - Since the restock list is a Server Component, create a Client Component wrapper for the action buttons
   - `src/components/inventory/restock-actions.tsx` — receives the formatted items data and renders the buttons
</instructions>

<requirements>
### Functional Requirements
- WhatsApp format uses bold text markers and emoji for readability
- Plain text format works in any messaging app or notes app
- Clipboard copy shows visual feedback ("Copied!")
- Web Share API used on mobile when available
- Graceful fallback when Clipboard API is not supported

### Technical Requirements
- Clipboard API requires HTTPS or localhost
- Web Share API only available on mobile browsers (progressive enhancement)
- Button state feedback managed with React useState
</requirements>

<output_files>
1. `src/lib/clipboard.ts` — Clipboard and share utilities
2. `src/components/inventory/restock-actions.tsx` — Client-side copy/share buttons
3. `src/components/inventory/restock-list.tsx` — MODIFIED: Include restock-actions
</output_files>

## Verification

<verification>
- [ ] "Copy to WhatsApp / SMS" copies formatted text to clipboard
- [ ] Pasting into WhatsApp shows bold headings and checkboxes
- [ ] "Copy Plain Text List" copies plain version
- [ ] Button shows "Copied!" feedback for 2 seconds
- [ ] Works on both desktop and mobile browsers
</verification>

---

**Previous**: [3.1 - Automated Shopping List](./01_automated_shopping_list.md) | **Next**: [3.3 - Business Calculators](./03_business_calculators.md)
