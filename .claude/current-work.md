# Current Work - Session Tracker

> **This file is read at the start of every Claude Code session and updated on every commit/push.**
> It provides continuity between sessions.

Last updated: 2026-08-06

## Latest (2026-08-06)

- ✅ **Organiser-entered event times were shifted by the browser's UTC offset**
  (`fix/event-time-utc-shift`). Reported via Martina: a new organiser (Vivianne, Östra
  Karups bygdegård) entered Maxida Märak as 19:00–20:00 and the app showed 17:00–18:00;
  re-editing the time in the form "didn't take effect". Not a sync issue — the event is
  `sourceProvider: internal`, served straight from the DB, so no nightly run is involved.

  **Root cause:** `combineDateAndTime` in `src/lib/validation/create-event-schema.ts`
  did `d.setHours(...)` (local) and then `d.toISOString()` (UTC), so 19:00 CEST was sent
  as `2026-08-27T17:00:00Z`. The platform stores and renders event times as **naive
  Swedish wall-clock** everywhere else — the API returns them with no offset, the app
  uses `parseISO` (local), `eventDtoToFormData.extractTime` reads them back with
  `getHours()`, and external providers land wall-clock on the UTC container. So the write
  path shifted −2h (summer) / −1h (winter) and the read path applied no inverse shift.
  Both `create-event` and `my-events/[id]/edit` go through the same `createPayload`,
  which is why re-saving never corrected it — and why an untouched re-save drifted a
  *further* −2h.

  **Fix:** serialise a naive local ISO string (`2026-08-27T19:00:00`, no `Z`) instead of
  `toISOString()`. Backend DTOs are `DateTime` (not `DateTimeOffset`), so an offset-less
  string binds as `DateTimeKind.Unspecified` — no backend change needed.

  Verified by driving the real `createPayload`/`eventDtoToFormData` under
  `TZ=Europe/Stockholm`: 4 assertions fail before the change, 0 after (entered time
  survives, edit form reopens correctly, re-save doesn't drift, winter CET also correct).
  `tsc --noEmit`, `eslint`, and `next build` all clean.

  **Prod data:** the Maxida Märak row (`97ED9F61-…`) was corrected in place on Glesys to
  19:00–20:00 and confirmed live via `/api/events/aggregated`.

  **Still open — needs Martina to confirm intent before touching:** 13 other internal
  events carry the same shift. Only 3 are still in the future — "Maxida Meräk gästar!"
  (Båstad, 24 Sep, stored 16:00–20:30), "Winter AI Bootcamp" (Askim, 4 Dec, stored
  07:00–16:00) and "Lär känna Go.Do." (Ängelholm, 24 Oct, stored 14:30–16:00). They were
  NOT auto-corrected: an organiser who noticed the shift may have compensated by typing a
  later time, so blindly adding the offset could break those rows.

## Active Task
**Remove legacy free-spotlight step** — branch `fix/remove-free-spotlight-step`, PR opened.

### What was done (2026-07-07):

Spotlight placement is now PAID via Stripe (PR #92), so the free wizard step that let
organisers set `spotlight` + `spotlightStartDate`/`spotlightEndDate` directly was removed.
Backend is being patched in parallel to ignore these fields for non-admin callers.

- `src/components/forms/steps/StepSpotlight.tsx` — DELETED (legacy free-spotlight step,
  step 4 of the wizard).
- `src/components/forms/EventFormStepper.tsx` — wizard is now 4 steps (Detaljer, Plats,
  Datum & Tid, Bekräfta); `LAST_STEP = 3`; spotlight validation/step-filled logic removed.
- `src/app/create-event/page.tsx` + `src/app/my-events/[id]/edit/page.tsx` — "Spotlight"
  removed from the step indicator lists.
- `src/lib/validation/create-event-schema.ts` — `spotlight`/`spotlightStartDate`/
  `spotlightEndDate` removed from schema, defaults, `createPayload` and
  `eventDtoToFormData` (fields OMITTED from payloads, never sent as null).
- `src/types/events.ts` — the three fields removed from `CreateEventDto` (write contract);
  `EventDto` (read) keeps them for the paid-flow display helpers.
- `src/components/forms/SpotlightImageUpload.tsx` — NEW: the Cloudinary spotlight banner
  upload was extracted from the deleted step and kept (mobile app uses the image for paid
  spotlight display). It now renders at the bottom of StepEventDetails (step 1) with a
  hint that placement is purchased from "Mina evenemang". `spotlightImageUrl` is still
  sent in create/update payloads.
- `src/components/forms/steps/StepEventReview.tsx` — legacy spotlight status + 99 kr/day
  pricing box replaced with the uploaded banner preview + purchase hint.
- PR #92 files (SpotlightPurchaseDialog, lib/spotlight, success/cancel pages,
  strings-en.ts) untouched.

### What's next:
1. Merge paired Backend PR that ignores spotlight fields for non-admin create/update.
2. Confirm mobile app reads `spotlightImageUrl` as before (no contract change).

## Earlier Task
**Spotlight Stripe Checkout (real payments)** — branch `feature/spotlight-stripe-checkout`, PR #92 MERGED.

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
