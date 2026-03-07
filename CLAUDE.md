# CLAUDE.md — GODO Platform

> AI assistant instructions for the GODO platform.

## Platform Identity

GODO is a **multi-city event management platform**. Currently live with Helsingborg as the first integrated municipality, with architecture built to onboard additional cities, scale across Scandinavia, and eventually serve all of Europe.

| Repo | Tech | Purpose | URL |
|------|------|---------|-----|
| [Backend](https://github.com/Go-Do-AB/Backend) | .NET 10 | API + DB | api.godo-dev.nu |
| [Frontend](https://github.com/Go-Do-AB/Frontend) | Next.js 16 | Organiser website | godo-dev.nu |
| [MobileApp](https://github.com/Go-Do-AB/MobileApp) | Expo SDK 54 | User mobile app | App stores (upcoming) |

**GitHub Org:** Go-Do-AB | **Project Board:** GoDoProject (#3) | **Brand:** Go.Do Yellow `#F3C10E`

## Session Persistence (MANDATORY)

**At the START of every session:**
1. Read `.claude/current-work.md` silently
2. Only mention it if there is unfinished work

**On every COMMIT and PUSH:**
1. Update `.claude/current-work.md` with: what was accomplished, what's next, decisions made
2. Include `.claude/current-work.md` in the commit

## Context Tracking (MANDATORY)

At the END of every response, append a context usage line:

- Under 50%: 📊 Context: ~X% used
- 50-70%: 📊 Context: ~X% used ⚠️
- Above 70%: 📊 Context: ~X% used 🔴 (suggest /compact)

Estimate based on conversation length. Start at ~5%, increment ~2-5% per exchange.

## Project Board Integration

**After every PR merge or PR opened:**
1. Check GitHub Project Board: `gh project item-list 3 --owner Go-Do-AB --format json`
2. Move related issues to match current status:
   - PR opened → move issue to "In Review"
   - PR merged (issue fully resolved) → move to "Done"
   - PR merged (more work needed) → keep "In Progress"

**Project Board statuses:** Features | Tasks | Ready for Sprint | In Progress | In Review | Done

## Cross-Repo Awareness

- **API contract**: Backend defines → Frontend and MobileApp consume
- **Category codes**: 1-8 (categories), 101-803 (subcategories), 1001-1006 (tags)
- **Subcategory pattern**: `categoryCode * 100 + index` (e.g., Sports=2 → 201, 202, 203)
- **Response format**: All endpoints return `OperationResult<T>` wrapper
- **Auth**: JWT (5-min) + refresh token rotation. Roles: User, Organiser, Admin
- When changing API contract (endpoints, DTOs, response shape), flag that other repos may need updates

## Orchestrator

All 3 repos live on the same machine. You can work cross-repo:

| Repo | Local Path |
|------|-----------|
| Backend | `C:/InFiNetCode/Projects/GODO/BACKEND/Backend` |
| Frontend | `C:/InFiNetCode/Projects/GODO/FORM/Frontend` |
| MobileApp | `C:/InFiNetCode/Projects/GODO/APP/MobileApp` |

When a task spans multiple repos, use the Agent tool to delegate work to the correct repo directory with its patterns and conventions.

## Shared Conventions

### Git
- Branch from `main` → PR back to `main`
- Names: `feature/`, `fix/`, `docs/`, `refactor/`, `test/`
- Never force-push to `main`

### Commits
- Format: `<type>: <description>` (e.g., `feat: add city filtering`)
- Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`
- Under 72 chars first line
- End with: `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`

### Docs
- Keep `docs/` and `forDevelopers/` current with significant changes
- Mermaid diagrams for architecture/flows
- Target junior developers — be explicit, use examples

### Security
- Never hardcode secrets, API keys, connection strings
- Use environment variables or user secrets
- Flag security concerns immediately

## Reference Files

Detailed reference lives in `.claude/reference/` — loaded on demand, not at startup.
Use `/scope <area>` to load the right context for your task.

---

# This Repo: Frontend Website (Next.js 16)

## Architecture

Next.js 16 App Router with React 19, TypeScript, Tailwind CSS 4, and shadcn/ui components.

```
src/
├── app/           → Pages and routes (App Router)
│   ├── (auth)/    → Login, registration
│   ├── create-event/ → Multi-step event creation form
│   ├── my-events/ → Organiser's event list + edit
│   ├── preview/   → Mobile app preview mockup
│   ├── quick-create/ → Admin quick-create
│   └── landing/   → Landing page
├── components/    → Reusable UI components
│   ├── forms/     → Multi-step form components (5 steps)
│   │   ├── EventFormStepper.tsx → Form orchestrator
│   │   ├── QuickCreateForm.tsx  → Admin quick-create
│   │   └── steps/               → Individual steps
│   ├── events/    → Event display (EventTicketCard)
│   ├── global/    → Layout, header (Navbar)
│   ├── preview/   → Mobile app preview
│   └── ui/        → shadcn/ui base components
├── hooks/         → Custom React hooks
│   ├── useEvents.ts      → CRUD hooks (useEvents, useEvent, useUpdateEvent, etc.)
│   ├── useCreateEvent.ts → Create mutation
│   └── useEventForm.ts   → Form hook with Zod resolver
├── lib/           → Utilities, API client, validation
│   ├── axios.ts           → Axios instance (JWT interceptor)
│   ├── utils.ts           → Utility functions
│   ├── content/contentText.tsx → Categories, subcategories, tags (hardcoded)
│   └── validation/        → Zod schemas + payload creators
├── providers/     → React context providers
└── types/
    └── events.ts  → TypeScript interfaces matching backend DTOs
```

### Tech Stack
| Technology | Purpose |
|------------|---------|
| Next.js 16 | Framework (App Router, Turbopack) |
| React 19 | UI library |
| TypeScript 5 | Type safety |
| Tailwind CSS 4 | Styling |
| shadcn/ui + Radix | Component library |
| React Hook Form + Zod | Form handling + validation |
| TanStack Query 5 | Server state management |
| Axios | HTTP client |
| Sonner | Toast notifications |
| Lucide React | Icons |

### Key Patterns
- **Multi-step form**: 5-step event creation (details → location → datetime → spotlight → review)
- **React Hook Form + Zod**: Form state + schema validation
- **TanStack Query**: API data fetching with caching
- **Server/Client components**: Server by default, `"use client"` only when needed
- **JWT via Axios interceptor**: Token from localStorage, auto-attached to requests

## Essential Context

### Multi-Step Event Form (core feature)
The form at `/create-event` is the main feature — 5 steps:
1. **Details** — Title, organiser, org nr, categories, subcategories, tags, description, URLs
2. **Location** — Street, city, postal code, GPS (optional)
3. **Date & Time** — Single dates or schedule, always-open toggle
4. **Spotlight** — Featured event promotion (99 SEK/day + 125 SEK VAT)
5. **Review** — Summary with cost breakdown, submit

Data flows: `FormProvider` → step components → `createPayload()` → `POST /api/events`
Edit mode: `eventDtoToFormData()` converts backend EventDto → form format

### Category System
7 categories (codes 1-7) with 21 subcategories defined in `src/lib/content/contentText.tsx`.
**Note**: Backend has 8 categories (code 8: "Fun for kids" is missing from FE — needs alignment).
Codes must match backend `DataSeeder`.

### Auth
- Organiser login/register via `/api/organisers/auth/login` and `/register`
- Token stored: `localStorage.getItem("accessToken")`
- Axios interceptor adds `Authorization: Bearer {token}`
- Admin detected from JWT `role` claim → shows Quick Create on landing
- User ID from JWT `nameid` claim → used for "My Events" filter

### Quick Reference
```bash
npm run dev        # Dev server with Turbopack
npm run build      # Production build
npm run lint       # ESLint
npm run format     # Prettier
npx tsc --noEmit   # Type check
```

### Environment
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.godo-dev.nu/api  # or http://localhost:5198/api
```

### Production
- **Local**: `http://localhost:3000`
- **Production**: `https://godo-dev.nu` (GleSYS VPS, Docker + Caddy)
- **CI/CD**: GitHub Actions → Docker → GHCR → GleSYS deploy

## Notes for AI

1. Use App Router conventions (not Pages Router)
2. Default to Server Components — add `"use client"` only when needed
3. Form components in `src/components/forms/` — follow existing step pattern
4. API types must match backend DTOs — check `src/types/events.ts`
5. Use shadcn/ui from `src/components/ui/` — don't add new UI libraries
6. Zod schemas in `src/lib/validation/` — `createPayload()` and `eventDtoToFormData()` live there
7. All API calls via shared Axios instance — never use raw `fetch()` with hardcoded URLs
8. Categories in `contentText.tsx` must match backend DataSeeder
9. Soft delete: always filter with `isActive: true`
10. Time format: form uses "HH:mm", backend uses TimeSpan
11. GPS coordinates: optional "lat,lon" string — backend auto-geocodes if missing
12. Run `npm run lint && npx tsc --noEmit && npm run build` before committing

## Commands

### Planning Lifecycle (shared across all repos)
| Command | Purpose |
|---------|---------|
| `/plan <feature>` | Create feature plan with phases and roadmap |
| `/execute` | Execute current phase from .planning/STATE.md |
| `/progress` | Show project state + route to next action |
| `/verify` | Run all checks (build, test, lint, types) |
| `/pause` | Save state for session continuity |
| `/resume` | Resume from saved state with briefing |

### Team & Project (shared)
| Command | Purpose |
|---------|---------|
| `/team-status` | Team dashboard — PRs, branches, project board |
| `/project-sync` | Sync PR status with GitHub Project Board |
| `/pr` | Create PR with GODO conventions |
| `/review` | Review changes before commit |

### Utilities (shared)
| Command | Purpose |
|---------|---------|
| `/status` | Quick overview — current work + git |
| `/scope <area>` | Load reference files on demand |
| `/cross-repo` | Check consistency across repos |
| `/orchestrate <task>` | Delegate work across repos |
| `/security` | Run security audit |

### Frontend-Specific
| Command | Purpose |
|---------|---------|
| `/build-check` | Quick lint + type check + build |

## Reference (on demand via /scope)

| File | Content |
|------|---------|
| `.claude/reference/form-architecture.md` | Multi-step form deep-dive |
| `.claude/reference/key-files.md` | All important file paths |
| `.claude/reference/api-integration.md` | API client setup and patterns |
| `.claude/reference/components.md` | Component inventory |
| `.claude/patterns/page-template.md` | New page scaffold |
| `.claude/patterns/form-step-template.md` | New form step scaffold |
| `.claude/patterns/component-template.md` | New component scaffold |
