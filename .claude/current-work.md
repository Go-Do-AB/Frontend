# Current Work - Session Tracker

> **This file is read at the start of every Claude Code session and updated on every commit/push.**
> It provides continuity between sessions.

Last updated: 2026-02-26

## Active Task
**Preview Redesign Complete** — Phone mockup fully redesigned to match Expo accessibility-redesign branch with realistic Swedish data.

### What was done (2026-02-26):

**Preview Redesign (PR #38, merged to main):**

1. **`constants.ts`** — New design tokens matching Expo WCAG 2.1 AAA:
   - Brand palette: Go.Do Yellow (#F3C10E), warm background (#FAF8F3), surface (#FFFEFA)
   - Category colors with AAA contrast, soft tints, gradient pairs
   - Category emojis for map pins, GPS mock locations
2. **`PhoneFrame.tsx`** — Warm off-white background
3. **`AppPreview.tsx`** — Multi-select categories, map toggle, Go.Do! flow
4. **`HomeScreen.tsx`** — Category tiles with checkmarks, tag chips, Go.Do! button, upcoming cards, featured card with RGB border
5. **`ResultsScreen.tsx`** — Toolbar, subcategory chips, styled map view with city pins, result cards, pagination
6. **`EventDetailScreen.tsx`** — Hero gradient, floating buttons, tag pills, content sheet, sticky CTA
7. **`globals.css`** — `@keyframes rgbShift` animation

**Swedish Mock Events (PR #39, merged to main):**

8. **`mockEvents.ts`** — 63 realistic Swedish events from Helsingborg/NV Skåne:
   - Real organizers: Helsingborgs stad, Dunkers kulturhus, Sofiero Slott, Fredriksdals museer, HIF, Rögle BK
   - Real addresses: Stortorget, Kungsgatan 11, Sofiero Slottsväg, Olympiavägen, Catena Arena
   - All category/subcategory/tag names in Swedish
   - Detailed Swedish descriptions

**Documentation (PR #37, merged to main):**

9. **`docs/ARCHITECTURE.md`** — 8 Mermaid diagrams for tech stack, user flow, data flow, JWT auth, form state, deployment

### What's next:
1. Connect preview to live API data (replace mock events with real API calls)
2. Add real event images/thumbnails (currently gradient placeholders)
3. Docker deployment to GleSYS VPS
4. Consider adding search functionality to preview

## Key Decisions
- **Preview matches Expo** — Phone mockup mirrors the accessibility-redesign branch design
- **All Swedish** — Event titles, descriptions, organizers, categories, tags all in Swedish
- **Go.Do Yellow #F3C10E** as primary brand color
- **WCAG 2.1 AAA** — Contrast-safe category colors, 48dp touch targets
- **Styled CSS map** — Preview uses CSS-based map (not real map integration)
- **RGB animated border** — Featured card uses `@keyframes rgbShift` CSS animation

## Project Structure (Preview Components)
```
src/components/preview/
├── AppPreview.tsx          # State machine: home → results → detail
├── PhoneFrame.tsx          # Phone bezel with status bar + home indicator
├── constants.ts            # Design tokens matching Expo app
├── mockEvents.ts           # 63 realistic Swedish events + filter helper
└── screens/
    ├── HomeScreen.tsx       # Category tiles, tags, Go.Do!, upcoming cards
    ├── ResultsScreen.tsx    # Toolbar, map/list, subcategory chips, cards
    └── EventDetailScreen.tsx # Hero, content sheet, sticky CTA
```

## Environment Notes
- Frontend repo: `C:\InFiNetCode\Projects\GODO\FORM\Frontend`
- Backend repo: `C:\InFiNetCode\Projects\GODO\BACKEND\Backend`
- Mobile app repo: `C:\InFiNetCode\Projects\GODO\APP\MobileApp`
- Preview page: `/preview` route
- Build: `npx next build` (Next.js 16.1.4 with Turbopack)
