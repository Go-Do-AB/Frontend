# Current Work - Session Tracker

> **This file is read at the start of every Claude Code session and updated on every commit/push.**
> It provides continuity between sessions.

Last updated: 2026-05-20

## Active Task
**Admin Moderation Dashboard (Frontend#48 / Backend#74)** — FE implementation complete, pending BE endpoints.

### What was done (2026-05-20):

**Admin Moderation Dashboard (branch `feature/admin-moderation-dashboard`):**

1. **`src/types/events.ts`** — added `ReportReason` enum (8 values) + `ReportReasonLabel`
   Swedish label map, `ReportStatus` enum, `EventReportDto`, `ReportedEventSummaryDto`.
2. **`src/hooks/useReports.ts`** — `useAdminReports()` (GET `/api/admin/reports`) and
   `useDismissReports()` (POST `/api/admin/reports/{eventId}/dismiss`).
3. **`src/app/admin/moderation/page.tsx`** — admin-gated dashboard (same JWT role-check
   pattern as quick-create). 6-column table sorted by report count: title, report count badge,
   reason chips (Swedish, truncated), AI score badge (green/amber/red), status pill,
   Remove + Dismiss actions. Dialog confirm before remove. Skeleton / empty / error states.
4. **`src/app/admin/moderation/layout.tsx`** — server layout holding page metadata
   ("Moderation | GODO Admin"). Needed because page.tsx is a client component.
5. **`src/app/landing/page.tsx`** — added "Moderation" button for admin users beside
   "Quick Add Place", linking to `/admin/moderation`.

All phases complete. All gates green: tsc, lint, build (19 static pages).

### Decisions made
- Used `Dialog` (available) instead of `AlertDialog` (not installed) for confirm flow.
- Metadata placed in `layout.tsx` because `metadata` export is not allowed in `"use client"` pages.
- No pagination — report volume expected to be low; can add later if needed.

### What's next:
1. **PR to main** once this is reviewed.
2. **Wire to real data** when Backend ships `GET /api/admin/reports` and
   `POST /api/admin/reports/{eventId}/dismiss` (tracked in Backend#74).
3. Confirm response shape with BE: assumed `OperationResult<ReportedEventSummaryDto[]>`.
4. Move Frontend#48 to "In Review" on the project board after PR is opened.

## Previous Session (2026-05-19)
Privacy Policy page (bilingual, DRAFT) — branch `feature/privacy-policy`.
See git log for details.

## Environment Notes
- Frontend repo: `C:/Nemanja/Företag/FIRMA/InFiNet Code AB/Projects/GODO/FEProject/godo-fe-web` (NOT what CLAUDE.md still says)
- Backend repo: `C:/Nemanja/Företag/FIRMA/InFiNet Code AB/Projects/GODO/BEProject/CleanArchitectureBE-DOTNET`
- Mobile app repo: `C:/Nemanja/Företag/FIRMA/InFiNet Code AB/Projects/GODO/APP/MobileApp`
- Build: `npm run build` (Next.js 16.1.4 with Turbopack)
