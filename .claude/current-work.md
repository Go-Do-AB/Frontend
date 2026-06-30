# Current Work - Session Tracker

> **This file is read at the start of every Claude Code session and updated on every commit/push.**
> It provides continuity between sessions.

Last updated: 2026-06-30

## Active Task
**Spotlight placement purchase UI** — branch `feature/spotlight-payments-ui` (committed locally, not pushed).

### What was done (2026-06-30):

**Branch: `feature/spotlight-payments-ui`**

New organiser-facing flow to buy a Spotlight placement for an event. Consumes the new
Backend `/api/spotlight` API. Payments are MOCKED end-to-end (no real Stripe/Klarna/Swish SDK).

- `src/types/spotlight.ts` — types for SpotlightPackage, checkout/confirm requests + responses, SpotlightPayment.
- `src/types/events.ts` — added optional `isForbidden` / `isNotFound` to `OperationResult<T>` (matches BE contract).
- `src/hooks/useSpotlight.ts` — TanStack Query hooks: packages, payments, checkout, confirm.
- `src/components/spotlight/SpotlightPurchaseDialog.tsx` — 5-step state machine modal
  (package → method → processing → success → error). Checkout then immediate confirm
  (mock gateway auto-approves). Honest "Demo / testläge" badge on payment step.
- `src/app/my-events/page.tsx` — "Spotlight" button on each event card (entry point) +
  "Spotlight" badge when an event's spotlight window is active.
- `src/lib/content/strings-en.ts` — EN archive strings for the new flow.

### Decisions made
- Entry point = button on the my-events event card (best match for existing UX).
- Runtime copy is Swedish inline (matches the rest of the app post-#87); EN kept in the archive file.
- Providers shown: Stripe / Klarna / Swish (the real options to wire later); selected provider
  is sent to `/checkout`, which the mock gateway auto-approves via the immediate `/confirm` call.

### What's next:
1. Push branch + open PR when ready.
2. Wire real payment SDKs later (replace the immediate confirm with provider redirect/webhook return).

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
