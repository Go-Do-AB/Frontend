# Feature: Preview Redesign — MobileApp Parity (3D Carousel & Full Surface)

> Created: 2026-05-03
> Status: Planned — ready to execute Phase 1

## Goal

Bring the FE FORM `/preview` phone mockup up to parity with the GODO MobileApp's current visual design — anchored on the 3D perspective category carousel and extended to cover every shipped screen (Home, Results, Detail, Auth, Profile, Favorites, Lists, Near Me, Subscription) — so the marketing preview reflects what users actually see in the app today.

## Requirements

- [ ] Faithfully replicate the **3D category carousel** (CoverFlow-style, ±35° rotateY, perspective 800, opacity falloff, gesture-driven snap with spring physics)
- [ ] Add **Framer Motion** for gesture + spring animations (Approach A — full fidelity)
- [ ] Refresh design tokens (`constants.ts`) to match current MobileApp `theme.ts` — yellow ramp, neutrals, category gradients, typography (Calibri-Bold via `next/font`)
- [ ] Build reusable preview primitives: `GodoButton`, `GodoCard`, `GodoChip`, `RGBBorderCard` matching mobile press-scale springs
- [ ] **Animated subcategory dropdown** beneath the active category card
- [ ] Redesign Home, Results, Event Detail screens with new primitives
- [ ] Add `SpotlightCarousel` to Results with 4s auto-rotate + pause/play + yellow glow border
- [ ] Add new screens that don't exist in the preview yet: **Auth (Login/Register), Profile, Favorites, Lists, Near Me, Subscription modal**
- [ ] Extend `AppPreview.tsx` state machine to support a **bottom tab bar** (Home / Favorites / Profile) and modal stack
- [ ] Honour `prefers-reduced-motion` — flat fallback for the 3D carousel
- [ ] No backend or API changes — preview stays on `mockEvents.ts`
- [ ] All checks pass: `npm run lint`, `npm run typecheck`, `npm run build`

## Roadmap

### Phase 1: Design system foundation — small (COMPLETE)
- [x] Added `framer-motion` (^12.x) to `package.json`
- [x] Refreshed `constants.ts`: added `Semantic` colors (success/error/warning/info), updated `FontFamily.brand` to use Carlito CSS var with Calibri/system fallback chain
- [x] Wired Carlito (open-source Calibri-metric clone) via `next/font/google` in `src/app/layout.tsx`, exposed as `--font-brand`
- [x] Created primitives in `src/components/preview/ui/`: `GodoButton.tsx`, `GodoCard.tsx`, `GodoChip.tsx`, `RGBBorderCard.tsx`, plus `index.ts` barrel
- [x] All gates pass: `tsc --noEmit` clean, `npm run lint` clean, `npm run build` succeeds

### Phase 2: 3D Category Carousel — large (COMPLETE)
- [x] New `src/components/preview/components/CategoryCarousel3D.tsx` using framer-motion `useMotionValue` + `onPan`
- [x] Geometry: card width 42% of phone, ±35° rotateY, perspective 800, opacity falloff (0 → 0.4 → 0.7 → 1 → 0.7 → 0.4 → 0), z-index interpolation
- [x] Spring snap (damping 18, stiffness 150, mass 0.8) on drag end past 40px threshold
- [x] Animated subcategory dropdown beneath active card (height + opacity + marginTop spring, damping 20 / stiffness 200)
- [x] `prefers-reduced-motion` fallback: flat horizontal scroll (`scroll-snap` + `overflow-x: auto`)
- [x] Selection badge (gradient border + checkmark, lucide-react `Check`) on selected categories
- [x] `categories.ts` with Swedish labels for all 8 categories + 24 subcategories
- [x] Demo route at `/preview/carousel-demo` for visual verification (will be removed in Phase 9)
- [x] All gates pass: `tsc --noEmit` clean, `npm run lint` clean, `npm run build` succeeds

### Phase 3: Home screen redesign — medium (COMPLETE)
- [x] Rebuilt `screens/HomeScreen.tsx` around `CategoryCarousel3D` (~770 LoC, full rewrite)
- [x] Header: Calibri-Bold "Go.Do." logo + 🇸🇪/🇬🇧 language flag toggle (working — switches placeholder/labels) + bell icon
- [x] Greeting line ("Vad vill du göra?" / "What do you want to do?" — language-aware)
- [x] Search bar (48dp, Neutral[100] bg, rounded `Radii.input`, lucide Search/X icons)
- [x] City pill (white, MapPin icon, opens existing CityModal) + Near Me pill (yellow, Compass + Lock — preview-only no-op for now, full premium-aware wiring in Phase 8)
- [x] Date picker pill (`GodoYellow[50]` bg + yellow border, opens CalendarModal)
- [x] Black 56dp Go.Do! button (Calibri-Bold, letter-spacing 1, Shadows.md)
- [x] Calendar bottom-sheet modal (radius 24, swipe-up overlay, Swedish month/day names, `Go.Set.` confirm)
- [x] City modal preserved with search + multi-select + "Alla städer" + selected-count badge
- [x] Clear All button surfaces when carousel state is dirty (dashed neutral border)
- [x] Carousel state local: `expandedCategory`, `selectedSubs`, `everything`, `showAll`
- [x] All gates pass: `tsc --noEmit` clean, `npm run lint` clean, `npm run build` succeeds

### Phase 4: Results screen + SpotlightCarousel — medium (COMPLETE)
- [x] New `components/SpotlightCarousel.tsx`: 160dp, 4s auto-rotate (setInterval, pausable), framer-motion `AnimatePresence` crossfade, 2px `GodoYellow[400]` border + yellow glow shadow, top-left Spotlight badge with Star (filled), category gradient background, 5px left color stripe per category, white date pill, title with text-shadow, pause/play button bottom-right
- [x] `ResultsScreen.tsx`: SpotlightCarousel wired at top (top-3 events), already had toolbar/sort/filter/map-toggle/subcategory chips/event cards/pagination
- [x] Provider info chip on each event card — "Helsingborgs stad" (sky blue) for `sourceProvider === "helsingborg"`, "Go.Do" (yellow) for internal events
- [x] Hidden when on map view (spotlight is list-only)
- [x] All gates pass: `tsc --noEmit` clean, `npm run lint` clean, `npm run build` succeeds

### Phase 5: Event Detail screen — small (COMPLETE)
- [x] Rebuilt `screens/EventDetailScreen.tsx` as faithful port of MobileApp `app/event/[id].tsx`: 300dp yellow brand gradient hero (`GodoYellow[500]CC → GodoYellow[500]`), floating top row (back + heart/calendar/share, 40dp white pills with framer-motion `whileTap` press-spring), subcategory label on hero bottom, rounded sheet (overlap -20), title 24/700, date 16/600, tag chips (Neutral[100]), About/Organiser/Location/När sections
- [x] Inline action button row: Boka (primary Neutral[800] + Ticket), Besök webbplats (yellow + ExternalLink), Vägbeskrivning (transparent + Neutral[300] border + Navigate)
- [x] Heart button toggles favourited state (red fill when active)
- [x] Web Share API fallback to clipboard for share button
- [x] New `components/CalendarConfirmModal.tsx` — bottom-sheet modal with framer-motion slide-up spring (damping 24 / stiffness 240) + fade backdrop, drag handle, GodoYellow[100] icon circle, Neutral[50] details box, yellow confirm + ghost cancel
- [x] Removed sticky bottom CTA (MobileApp doesn't use one — actions are inline at bottom of sheet)
- [x] All gates pass: `tsc --noEmit` clean, `npm run lint` clean, `npm run build` succeeds

### Phase 6: Tab-bar navigation model — medium (COMPLETE)
- [x] Extended `AppPreview.tsx` state machine: `activeTab` (home / favorites / profile) layered above per-tab screen state. Home tab keeps the home → results → detail substack; switching tabs preserves it. Tapping the Hem tab while already on it pops back to the home root (mirrors MobileApp behaviour).
- [x] New `components/TabBar.tsx` — 3 tabs (Hem / Sparat / Profil) with lucide icons, active GodoYellow[500] tint + inactive Neutral[500], framer-motion press scale 0.92, top-divider line, 60dp tall, FavoritesCount badge prop ready
- [x] `PhoneFrame.tsx` accepts optional `bottomBar` slot (rendered between scroll area and home indicator) and `overlay` slot (for modal stack — sits absolutely above content + bottomBar)
- [x] Tab bar hidden on event detail screen for immersive feel (matches MobileApp where event detail pushes above the tabs)
- [x] Modal stack: `ModalState = null | { type: "loginPrompt" }` (extensible for premium/payment in their owning phases). Single overlay renderer in `PhoneFrame`.
- [x] New `components/LoginPromptModal.tsx` — port of MobileApp `LoginPromptModal.tsx`. Bottom-sheet with framer-motion slide-up spring (damping 24 / stiffness 240) + fade backdrop, heart icon, primary "Logga in" (Neutral[800]) + secondary "Skapa konto" (yellow), close X.
- [x] Placeholder `screens/FavoritesScreen.tsx` and `screens/ProfileScreen.tsx` — logged-out empty states with CTAs that drive the modal-stack end-to-end. Full versions (auth-aware) come in Phase 8.
- [x] All gates pass: `tsc --noEmit` clean, `npm run lint` clean, `npm run build` succeeds

### Phase 7: Auth screens — medium
- [ ] `screens/LoginScreen.tsx` — email + password, social login buttons (Apple/Google placeholders)
- [ ] `screens/RegisterScreen.tsx` — same shell, register flow
- [ ] `LoginPromptModal` reachable from Favorites/Near Me when "logged out"

### Phase 8: Account & feature screens — large
- [ ] `screens/ProfileScreen.tsx` — avatar (initials), saved count, lists link, language toggle, logout
- [ ] `screens/FavoritesScreen.tsx` — swipeable event cards, empty state
- [ ] `screens/ListsScreen.tsx` + `ListDetailScreen.tsx` — list cards, create-list modal
- [ ] `screens/NearMeScreen.tsx` — radius slider (10–50km), map/list toggle, distance badges, premium prompt
- [ ] `SubscriptionModal` — plan badge, features list, upgrade CTA

### Phase 9: Polish & verify — small
- [ ] Reduce-motion test pass
- [ ] `npm run lint` clean
- [ ] `npm run typecheck` (or `tsc --noEmit`) clean
- [ ] `npm run build` succeeds
- [ ] Manual smoke in browser: every screen reachable, every animation plays
- [ ] Update `.claude/current-work.md`
- [ ] PR to `main` with screenshots

## Current Position

```
Phase: 7 of 9
Task:  0 of 3
Status: Phase 6 complete — ready to execute Phase 7 (Auth screens)
```

## Progress

[████████████░░░░░░░░] 6/9 phases

## Affected Repos

- [ ] Backend
- [x] Frontend
- [ ] MobileApp (read-only reference)

## Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-03 | Approach A (full Framer Motion + drag fidelity) | Marketing preview must sell the *feeling* of the app — gesture-driven 3D is the wow moment |
| 2026-05-03 | Full scope (all screens incl. Auth/Profile/Lists/Near Me) | Nemo Sensei wants a true mirror of what users see, not just discovery flow |
| 2026-05-03 | Add `framer-motion` to deps | ~50KB gzipped is acceptable for the preview's job; alternative is hand-rolled spring math |
| 2026-05-03 | Plan lives in Frontend repo `.planning/`, not Backend | Work is Frontend-only; Backend `.planning/STATE.md` is its own completed feature |

## Cross-Repo Actions

[None — pure Frontend feature. MobileApp is read-only reference for design parity.]

## Session Log

| Date | Session | What happened |
|------|---------|---------------|
| 2026-05-03 | Planning | Investigated MobileApp current design (3D carousel, Spotlight, new screens), identified 9-phase roadmap, locked Approach A + Full scope + framer-motion |
| 2026-05-03 | Phase 1 | Installed framer-motion, wired Carlito brand font via next/font/google, added Semantic colors to constants, built GodoButton/GodoCard/GodoChip/RGBBorderCard primitives. Issue #58 opened on Frontend repo. Branch `feature/preview-mobileapp-parity`. |
| 2026-05-03 | Phase 2 | Built CategoryCarousel3D (framer-motion useMotionValue + onPan, ring-modulus index, useTransform-driven per-card transforms). Added preview/categories.ts with Swedish labels. Demo route at /preview/carousel-demo. |
| 2026-05-03 | Phase 3 | Full rewrite of HomeScreen around the 3D carousel. Header (logo+flags+bell), greeting, search, carousel, Clear All, City+Near Me row, date pill, black Go.Do button, City modal, Calendar modal. Language toggle wired (sv/en). |
| 2026-05-03 | Hotfix | Inline SVG flags (FlagSE, FlagGB) replace emoji 🇸🇪🇬🇧 — Windows lacks colour emoji for regional flags. Committed as `6dd857c3`. |
| 2026-05-03 | Phase 4 | SpotlightCarousel ported (auto-rotate, crossfade, glow border, spotlight badge, color stripe). Wired to ResultsScreen (top-3 events). Provider chip ("Helsingborgs stad" / "Go.Do") on event cards. |
| 2026-05-03 | Phase 5 | EventDetailScreen rewritten as MobileApp port: 300dp yellow brand-gradient hero, floating top-row buttons (back/heart/calendar/share with framer-motion press-spring), subcategory label, rounded sheet, inline action row (Boka/Besök/Vägbeskrivning). New CalendarConfirmModal (bottom-sheet, slide-up spring, fade backdrop). Sticky bottom CTA removed for MobileApp parity. |
| 2026-05-03 | Phase 6 | Tab-bar navigation model. AppPreview state machine refactored: activeTab + per-tab stack + modal stack. New TabBar (Hem/Sparat/Profil) and LoginPromptModal. PhoneFrame gets bottomBar + overlay slots. Tab bar hidden on event detail. Placeholder Favorites + Profile screens drive the modal stack end-to-end. |
