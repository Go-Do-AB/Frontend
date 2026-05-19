# Current Work - Session Tracker

> **This file is read at the start of every Claude Code session and updated on every commit/push.**
> It provides continuity between sessions.

Last updated: 2026-05-19

## Active Task
**Privacy Policy page (bilingual, DRAFT)** — public-facing legal page required
for App Store + Google Play submission of the mobile app.

### What was done (2026-05-19):

**Privacy Policy (branch `feature/privacy-policy`):**

1. **`src/components/legal/DraftBanner.tsx`** — yellow banner shown across the top
   of legal pages while pending counsel review.
2. **`src/components/legal/LegalLayout.tsx`** — shared chrome (banner + minimal
   header + language switch + back-to-home link). Keeps the long-form content
   components out of layout concerns.
3. **`src/components/legal/PrivacyPolicyEn.tsx`** — full English privacy policy.
   Sections: who we are, what we collect, how we use it, GDPR legal bases,
   subprocessors (Apple, Google, GleSYS, Resend, Expo), international transfers,
   retention, GDPR rights (Art. 15-22), account deletion (Profile -> Delete
   Account), children, security, changes, contact. Ends with HTML-comment block
   mapping data items to the Apple Privacy Nutrition Label and Google Play Data
   Safety form (copy-paste for App Store Connect / Play Console).
4. **`src/components/legal/PrivacyPolicySv.tsx`** — Swedish translation, "du"
   form to match the rest of the site. Same structure as EN; refers back to
   EN page for the (English-only) console mappings to avoid drift.
5. **`src/app/privacy/page.tsx`** — `/privacy` route. Server component, metadata
   incl. `alternates.languages` for SEO hreflang.
6. **`src/app/sv/privacy/page.tsx`** — `/sv/privacy` route, same pattern.
7. **`src/components/global/Footer.tsx`** — new site-wide footer (first one in
   the repo). Links to both language versions of the policy.
8. **`src/app/landing/page.tsx`** — drop the Footer onto the landing page.
9. **`src/app/(auth)/register/page.tsx`** — the "I agree to the terms" checkbox
   label now links to `/privacy` so the disclosure is reachable from signup.
10. **`src/app/robots.ts`** + **`src/app/sitemap.ts`** — Next.js App Router
    metadata routes. Sitemap exposes `/landing`, `/privacy`, `/sv/privacy` and
    declares hreflang alternates. `NEXT_PUBLIC_SITE_URL` honoured (defaults to
    `https://godo-dev.nu`).

Verified: `npx tsc --noEmit` clean, `npm run lint` clean, `npm run build`
green; both pages prerendered as static, `/robots.txt` and `/sitemap.xml`
appear in the build output.

### Decisions made
- **No new i18n library.** Repo currently has zero i18n. Used a simple `/sv/*`
  folder for the Swedish route instead of pulling in `next-intl`. Easy to
  migrate later if/when other pages need translation.
- **One canonical Apple/Google form mapping** lives in the EN page's HTML
  comment block. Counsel only needs to reconcile it once.
- **Account deletion path documented as Profile -> Delete Account** to satisfy
  both Apple (since June 2022) and Google (since May 2024) requirements.
- **Minimum age set to 16** (default GDPR Art. 8 Member-State maximum,
  unchanged in Sweden). Flagged `TODO` for counsel.
- **Privacy contact email** is `privacy@godo.nu` — flagged for counsel to set
  up if not already.

### TODO markers for legal counsel to resolve (search for `<!-- TODO`):
- Legal registered address (EN + SV)
- Swedish organisation number
- Whether a formal DPO / dataskyddsombud is appointed
- Any additional subprocessors (analytics, error tracking, push notifications)
- Confirm retention periods (currently proposed: 30 days post-deletion,
  7 years for accounting, 90 days for logs, 30 days for backups)
- Confirm minimum-age policy choice (currently 16)
- Confirm Swedish term for "dataportabilitet" wording
- Confirm legal postal address for the Contact section

### What's next:
1. Get counsel sign-off and remove the DraftBanner + TODO comments
2. Set the `/privacy` URL in App Store Connect and Google Play Console
3. Fill in Apple Privacy Nutrition Label / Google Data Safety form using
   the mapping in the HTML-comment block at the bottom of
   `PrivacyPolicyEn.tsx`
4. Consider also drafting a Terms & Conditions page (the register checkbox
   already references one but no page exists yet)
5. Add Footer to other top-level pages (login/register, my-events, etc.)
   so the policy is reachable from everywhere

## Previous Session (2026-02-26)
Preview Redesign (PRs #38/#39) and Architecture docs (PR #37) — see git log.

## Environment Notes
- Frontend repo: `C:/Nemanja/Företag/FIRMA/InFiNet Code AB/Projects/GODO/FEProject/godo-fe-web` (NOT what CLAUDE.md still says)
- Backend repo: `C:/Nemanja/Företag/FIRMA/InFiNet Code AB/Projects/GODO/BEProject/CleanArchitectureBE-DOTNET`
- Mobile app repo: `C:/Nemanja/Företag/FIRMA/InFiNet Code AB/Projects/GODO/APP/MobileApp`
- Build: `npm run build` (Next.js 16.1.4 with Turbopack)
- Production URL after deploy: `https://godo-dev.nu/privacy` and `https://godo-dev.nu/sv/privacy`
