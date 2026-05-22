# Feature: Admin Moderation Dashboard (Backend#74 / Frontend#48)

> Created: 2026-05-20
> Status: COMPLETE — all 3 phases done, ready for PR

## Goal

Build an admin-only moderation dashboard at `/admin/moderation` where admins can review reported events, inspect AI moderation scores, and take action (remove or dismiss).

## Requirements

- [ ] New types: `ReportReason`, `ReportStatus`, `EventReportDto`, `ReportedEventSummaryDto` in `src/types/events.ts`
- [ ] New hooks: `useAdminReports()` (GET `/api/admin/reports`) and `useDismissReports()` (POST `/api/admin/reports/{eventId}/dismiss`) in `src/hooks/useReports.ts`; `useDeleteEvent()` already exists
- [ ] New admin-gated page `src/app/admin/moderation/page.tsx` — DataTable sorted by report count; columns: title / report count / reasons / AI score / status / actions
- [ ] Confirm dialog before "Remove Event" (shadcn `AlertDialog`)
- [ ] Toast feedback on remove + dismiss (Sonner, already wired)
- [ ] Landing page: "Moderation" link next to "Quick Create" for admin users
- [ ] Empty state, loading skeleton, error state

## Roadmap

### Phase 1: Types + API layer — small (COMPLETE)
- [x] Add `ReportReason` enum, `ReportStatus` enum, `EventReportDto`, `ReportedEventSummaryDto` to `src/types/events.ts`
- [x] Create `src/hooks/useReports.ts` with `useAdminReports()` and `useDismissReports()`
- [x] All gates pass: `npx tsc --noEmit`, `npm run lint`, `npm run build`

### Phase 2: Moderation page — medium (COMPLETE)
- [x] `src/app/admin/moderation/page.tsx` — admin-gated (reuse role-check pattern from `quick-create/page.tsx`)
- [x] DataTable: columns = title, report count, reason chips, AI score badge (green <0.3 / amber 0.3–0.7 / red >0.7), status pill, action buttons
- [x] "Remove Event" → shadcn `Dialog` confirm → `useDeleteEvent()` → invalidate reports query → success toast
- [x] "Dismiss Reports" → `useDismissReports()` → toast on success/error
- [x] Loading skeleton (3 animated rows), empty state ("No reported events"), error state
- [x] All gates pass: tsc clean, lint clean, build 19 pages

### Phase 3: Navigation + polish — small (COMPLETE)
- [x] Landing page: add "Moderation" button for admin users (beside Quick Create)
- [x] Page metadata ("Moderation | GODO Admin") via layout.tsx (metadata can't export from client page)
- [x] Final `npm run lint && npx tsc --noEmit && npm run build` — all green, 19 static pages
- [x] Update `.claude/current-work.md`

## Current Position

```
Phase: 3 of 3
Task:  3 of 3
Status: COMPLETE — ready for PR
```

## Progress

[████████████████████] 3/3 phases ✅

## Affected Repos

- [ ] Backend (ships GET /api/admin/reports + dismiss endpoint — tracked in Backend#74)
- [x] Frontend (this plan)
- [ ] MobileApp (ships report dialog — tracked in Backend#74)

## Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-20 | Build types + hooks now with stubs | UI can be built and tested with mock data; wire to real endpoints when BE ships |
| 2026-05-20 | Reuse `useDeleteEvent()` for remove action | Endpoint already exists (`DELETE /api/events/{id}`); no new BE work needed for this action |
| 2026-05-20 | Use shadcn `AlertDialog` for confirm | Already in `src/components/ui/` — no new dependencies |
| 2026-05-20 | No pagination in Phase 2 | Report volume will be low; add pagination later if needed |

## Cross-Repo Actions

- **Backend#74** must ship `GET /api/admin/reports` and `POST /api/admin/reports/{eventId}/dismiss` before the dashboard shows real data.
- Response shape assumption: `OperationResult<ReportedEventSummaryDto[]>` (confirm with BE when endpoint is ready).

## Session Log

| Date | Session | What happened |
|------|---------|---------------|
| 2026-05-20 | Planning | Investigated Backend#74 epic, found linked Frontend#48. Mapped existing patterns (quick-create admin guard, useDeleteEvent, OperationResult wrapper). Created 3-phase plan. |
| 2026-05-20 | Phase 1 | Added ReportReason + ReportStatus enums, ReportReasonLabel map, EventReportDto, ReportedEventSummaryDto to src/types/events.ts. Created src/hooks/useReports.ts with useAdminReports + useDismissReports. All gates green. |
| 2026-05-20 | Phase 2 | Built src/app/admin/moderation/page.tsx — admin-gated, table with 6 columns (title, report count, reason chips, AI score badge, status pill, actions), Dialog confirm for remove, skeleton/empty/error states. Used Dialog instead of AlertDialog (not in ui/). All gates green, 19 static pages. |
| 2026-05-20 | Phase 3 | Added Moderation button to landing page for admin users. Added layout.tsx for page metadata (metadata can't export from client pages). All gates green. current-work.md updated. |
