# Current Work - Session Tracker

> **This file is read at the start of every Claude Code session and updated on every commit/push.**
> It provides continuity between sessions.

Last updated: 2026-07-07

## Active Task
**Spotlight Stripe Checkout (real payments)** — branch `feature/spotlight-stripe-checkout`, PR opened.

### What was done (2026-07-07):

**Branch: `feature/spotlight-stripe-checkout`** (cherry-picked the mocked UI from
`feature/spotlight-payments-ui`, then rewired it to the LIVE backend Stripe endpoint —
the old mock branch is now superseded and can be deleted).

- `src/lib/spotlight.ts` — NEW single source for pricing: `SPOTLIGHT_PRICE_PER_DAY_SEK = 99`
  (PLACEHOLDER pending product-owner confirmation), min/max days (1–90), `formatSek`,
  `isSpotlightActive` / `isSpotlightScheduled` helpers.
- `src/types/spotlight.ts` — replaced mock packages/confirm types with the real contract:
  `SpotlightCheckoutRequest { days, startDate? }` → `SpotlightCheckoutResponse { checkoutUrl, sessionId }`.
- `src/hooks/useSpotlight.ts` — single `useSpotlightCheckout()` mutation:
  `POST /api/events/{eventId}/spotlight/checkout` (owner JWT, retry disabled).
- `src/components/spotlight/SpotlightPurchaseDialog.tsx` — kept the dialog UX/design
  (yellow chips, step states) but new flow: day presets (7/14/30) + custom input (1–90) +
  optional start-date picker (min today) + live `days × 99 kr` price → full-page redirect
  to Stripe `checkoutUrl`. Shows active/scheduled spotlight banner. Errors from
  `OperationResult.errors[]` + 403/404 messages.
- `src/app/spotlight/success/page.tsx` — NEW public Stripe return page (`?session_id=`),
  "activates within a minute" copy, CTA to /my-events.
- `src/app/spotlight/cancel/page.tsx` — NEW public cancel page, nothing charged, retry CTA.
- `src/app/my-events/page.tsx` — dialog now takes the whole `event`; `isSpotlightActive`
  moved to lib.
- `src/components/forms/steps/StepSpotlight.tsx` — price constant now imported from lib.
- `src/lib/content/strings-en.ts` — EN archive updated for the new flow + both pages.

### Decisions made
- Replaced the mock wiring instead of building a parallel UI (kept the dialog design).
- Success/cancel URLs are `/spotlight/success` + `/spotlight/cancel` — BAKED INTO BACKEND
  CONFIG, do not rename.
- 99 SEK/day is display-only; the authoritative price lives in the backend Stripe session.
- Payment confirmation is webhook-driven; the success page makes no API calls (public).

### What's next:
1. Product owner to confirm 99 SEK/day price (update `src/lib/spotlight.ts` if changed).
2. Delete superseded branch `feature/spotlight-payments-ui` after merge.
3. StepSpotlight in create/edit form still writes spotlight fields directly (legacy free
   path) — decide whether backend ignores them now that spotlight is paid.

## Earlier Task
**Translate frontend to Swedish — Issue #87** — PR #89 open, issue moved to "In Review".

### What was done (2026-06-12):

**Branch: `87-translate-event-creation-form-to-swedish`** — PR #89

All UI strings translated to Swedish across every page and form step:
- `create-event/page.tsx`, `my-events/page.tsx`, `my-events/[id]/edit/page.tsx`
- `landing/page.tsx`, `profile/page.tsx`, `quick-create/page.tsx`
- `(auth)/login`, `register`, `forgot-password`, `reset-password`
- All 5 form steps, `EventFormStepper.tsx`, `QuickCreateForm.tsx`, `Navbar.tsx`, `TimePicker.tsx`
- All Zod validation messages in `create-event-schema.ts`

Removals and fixes:
- `streetName2` removed from form/schema/payload/edit adapter (kept in `EventDto` for backend compat)
- "Not all fields required" notice removed
- `TimePicker` now stores and displays `HH:mm` (was `HH:mm:ss`, was showing AM/PM)
- `houseNumber` default fixed from `0` to `undefined`
- `filters` error message fixed to "Välj minst ett filter"
- Debug `console.log` calls removed from create and edit pages
- English strings archived in `src/lib/content/strings-en.ts`

### Decisions made
- `streetName2` kept in `EventDto`/`CreateEventDto` types for backend API compatibility
- No language toggle — Swedish only as specified

### What's next:
1. **PR #89 awaits review** — merge when approved.
2. Move issue #87 to "Done" on project board after PR is merged.

## Previous Session (2026-05-19)
Privacy Policy page (bilingual, DRAFT) — branch `feature/privacy-policy`.
See git log for details.

## Environment Notes
- Frontend repo: `C:/Nemanja/Företag/FIRMA/InFiNet Code AB/Projects/GODO/FEProject/godo-fe-web` (NOT what CLAUDE.md still says)
- Backend repo: `C:/Nemanja/Företag/FIRMA/InFiNet Code AB/Projects/GODO/BEProject/CleanArchitectureBE-DOTNET`
- Mobile app repo: `C:/Nemanja/Företag/FIRMA/InFiNet Code AB/Projects/GODO/APP/MobileApp`
- Build: `npm run build` (Next.js 16.1.4 with Turbopack)
