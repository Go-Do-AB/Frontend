# Current Work - Session Tracker

> **This file is read at the start of every Claude Code session and updated on every commit/push.**
> It provides continuity between sessions.

Last updated: 2026-05-03

## Active Task
**Preview Redesign — MobileApp Parity** (Issue #58, branch `feature/preview-mobileapp-parity`) — Bringing the `/preview` phone mockup up to parity with the *current* MobileApp design (3D carousel + every shipped screen). 9-phase plan tracked in `.planning/STATE.md`. Phase 1 (foundation) complete; Phase 2 (3D carousel) up next.

### Phase 1 done (2026-05-03):
- `framer-motion` installed for gesture-driven 3D carousel + spring physics
- Carlito brand font wired via `next/font/google` → `--font-brand`
- `constants.ts` extended with `Semantic` colors; `FontFamily.brand` now uses CSS var
- New primitives in `src/components/preview/ui/`: GodoButton, GodoCard, GodoChip, RGBBorderCard

### Phase 2 done (2026-05-03):
- New `src/components/preview/components/CategoryCarousel3D.tsx` — full Reanimated→framer-motion port (gesture-driven drag, ring-modulus index, ±35° rotateY, perspective 800, opacity falloff, spring snap damping 18 / stiffness 150 / mass 0.8)
- `src/components/preview/categories.ts` — 8 Swedish categories + 24 subcategories matching MobileApp
- Animated subcategory dropdown (height + opacity + marginTop, spring damping 20 / stiffness 200)
- `prefers-reduced-motion` fallback: flat scroll-snap horizontal carousel
- Visual verification page at `/preview/carousel-demo` (temporary — will be removed in Phase 9)

### Phase 3 done (2026-05-03):
- Full rewrite of `src/components/preview/screens/HomeScreen.tsx` around the new carousel
- Layout (top→bottom): Header → Greeting → Search → 3D Carousel → Clear All (when dirty) → City + Near Me row → Date pill → Big Go.Do! button
- Language toggle (SV/GB) actually flips the on-screen Swedish/English copy
- Inline SVG flags (FlagSE, FlagGB) — Windows lacks colour emoji for regional flag codepoints
- Calendar bottom-sheet modal: Swedish month/day labels, range selection, "Go.Set." confirm
- City modal preserved with search, multi-select, count badge, "Alla städer" reset
- Near Me pill is yellow with Lock icon (premium-locked placeholder — wired in Phase 8)
- Live at `/preview` — `npm run dev` to view

### Phase 4 done (2026-05-03):
- New `components/SpotlightCarousel.tsx` — 160dp, 4s auto-rotate, framer-motion crossfade, yellow glow border, Spotlight badge, color stripe, pause/play
- `ResultsScreen.tsx` shows SpotlightCarousel at top (top-3 events) when in list view
- Provider chip on each event card: "Helsingborgs stad" (blue) or "Go.Do" (yellow) based on `sourceProvider`

### Phase 5 done (2026-05-03):
- Full rewrite of `screens/EventDetailScreen.tsx` as faithful port of MobileApp `app/event/[id].tsx`
- 300dp yellow brand-gradient hero (`GodoYellow[500]CC → GodoYellow[500]`), floating top-row buttons (back left; heart/calendar/share right) — 40dp white pills with framer-motion `whileTap` press-spring (damping 18 / stiffness 320)
- Subcategory label on hero bottom-left
- Rounded content sheet (-20 overlap), title 24/700, date+time 16/600, tag chips Neutral[100]/700
- About / Arrangör / Plats / När sections with small uppercase labels
- Inline action button row (NOT sticky — parity with MobileApp): Boka (Neutral[800] + Ticket), Besök webbplats (yellow + ExternalLink), Vägbeskrivning (transparent + Neutral[300] border + Navigate)
- Heart button toggles favourited state (red fill when active)
- Web Share API with clipboard fallback
- New `components/CalendarConfirmModal.tsx` — bottom-sheet with framer-motion slide-up spring (damping 24 / stiffness 240) + fade backdrop, drag handle, GodoYellow[100] icon circle, Neutral[50] details box, yellow confirm + ghost cancel

### Earlier history (preserved for reference):

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
