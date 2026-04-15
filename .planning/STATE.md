# Feature: Organiser Password Reset UI

> Created: 2026-04-15
> Status: IN PROGRESS

## Goal

Mirror the MobileApp password reset flow (commit c5b6a9cd) on the Frontend for
organisers. Consumes the Backend `/api/organisers/auth/forgot-password` and
`/api/organisers/auth/reset-password` endpoints.

## Backend Contract

- `POST /api/organisers/auth/forgot-password` — `{ email }` → `OperationResult<object>` (always success — enumeration-safe)
- `POST /api/organisers/auth/reset-password` — `{ token, newPassword }` → `OperationResult<object>`
- Error string for bad token: `"Invalid or expired reset token."`
- Token TTL: 15 minutes
- Reset link shape: `https://godo-dev.nu/organisers/reset-password?token={EscapedToken}`

## Roadmap

### Phase 1: Forgot-password page ✅
- [x] Replace `src/app/(auth)/forgot-password/page.tsx` placeholder with real form
- [x] Email input, submit via axios, success toast, redirect to `/login`
- [x] Show enumeration-safe success state regardless of API outcome

### Phase 2: Reset-password page ✅
- [x] Create `src/app/(auth)/reset-password/page.tsx`
- [x] Read `?token=` from query string (Next.js `useSearchParams`)
- [x] Password + confirm password, match validation
- [x] Handle missing token with inline error
- [x] Surface "Invalid or expired token" from backend
- [x] Success toast, redirect to `/login`

### Phase 3: Polish ✅
- [x] Loading state, disabled submit button during request
- [x] Matches existing login/register Tailwind styling (yellow background, white card)
- [x] Verify `/forgot-password` link from login still works

## Current Position

```
Phase: 3 of 3
Task:  Complete — ready for draft PR
Status: Complete
```

## Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-15 | Skip i18n; hardcode English | FE has no i18n setup yet; login/register use English strings. Don't introduce a new dependency for 2 screens |
| 2026-04-15 | No authService abstraction | Existing login/register call `api.post` directly. Match that pattern to avoid scope creep |
| 2026-04-15 | Enumeration-safe success in forgot-password | Backend already does this; FE should never show "user not found" |
| 2026-04-15 | Pages are client components | Needs `useRouter`, `useSearchParams`, form state — must be client |

## Related Work

- Backend PR: password reset endpoints for organisers + users
- MobileApp commit c5b6a9cd: equivalent flow for users (uses `godo://` deep link)

## Open Question

- **Prod URL**: `OrganiserResetUrlBase` default is `https://godo-dev.nu/organisers/reset-password`.
  Confirm the prod host before Backend SMTP goes live.
