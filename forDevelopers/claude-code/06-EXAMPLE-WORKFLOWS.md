# Example Workflows

> Real-world scenarios showing how to use Claude Code for common GODO development tasks.

## Scenario 1: Quick Bug Fix

**Situation:** The aggregated endpoint returns 500 when the city parameter has special characters.

```
You: The /api/events/aggregated endpoint crashes when city contains "Malmö" —
     the ö character causes a 500.

Claude: Let me investigate...
  → Reading GetAggregatedEventsQueryHandler.cs
  → Found: string comparison using Contains() without ordinal comparison
  → Fix: Switch to StringComparison.OrdinalIgnoreCase
  → Running: dotnet test
  → All 250 tests pass

You: /review

Claude:
  ## Code Review
  1 file changed: GetAggregatedEventsQueryHandler.cs (+1 line, -1 line)
  - Fix uses OrdinalIgnoreCase — handles Unicode correctly
  - No security concerns
  Verdict: Good to commit

You: commit this as a fix

Claude:
  git add Application/Events/Queries/GetAggregatedEventsQueryHandler.cs
  git commit -m "fix: handle Unicode chars in city filter comparison"

You: /pr

Claude:
  Created PR #69: "fix: handle Unicode chars in city filter comparison"
  Project board: Issue #55 moved to "In Review"
```

**Time:** ~10 minutes. No planning needed.

---

## Scenario 2: Adding a New API Endpoint

**Situation:** You need a `GET /api/events/aggregated/nearby` endpoint that returns events within a radius of a GPS coordinate.

```
You: /plan add nearby events endpoint — GET /api/events/aggregated/nearby
     with lat, lon, radiusKm parameters

Claude: [investigates codebase, finds GPS pattern, existing aggregated controller]

  ## Feature: Nearby Events Endpoint

  ### Requirements
  - [ ] Accept latitude, longitude, radius parameters
  - [ ] Calculate distance using Haversine formula
  - [ ] Return events sorted by distance
  - [ ] Support existing filters (categories, dates) alongside proximity

  ### Roadmap

  #### Phase 1: Query + Handler — small
  - [ ] Create NearbyEventsQuery with lat/lon/radius params
  - [ ] Implement Haversine distance calculation
  - [ ] Add handler with distance sorting
  - [ ] Add 5 unit tests

  #### Phase 2: Controller + Integration — small
  - [ ] Add endpoint to AggregatedEventsController
  - [ ] Add integration test
  - [ ] Test with real coordinates

  Saved to .planning/STATE.md
  Run /execute to start Phase 1.

You: looks good, /execute

Claude: [works through Phase 1 — creates query, handler, Haversine helper, tests]
  Phase 1 complete! [██████████░░░░░░░░░░] 1/2 phases

You: /execute

Claude: [works through Phase 2 — adds controller endpoint, integration test]
  Phase 2 complete! [████████████████████] 2/2 phases

You: /verify

Claude:
  - [x] dotnet build — Success
  - [x] dotnet test — 258/258 passed (8 new)
  - [x] dotnet format — Clean
  - [!] MobileApp may want to use this for "Near Me" toggle
  Verdict: Ready for PR

You: /pr

Claude: Created PR #70: "feat: add nearby events endpoint with Haversine distance"
```

**Time:** ~30 minutes across 1 session.

---

## Scenario 3: Multi-Session Feature

**Situation:** Adding a full event favorites system — Backend API + MobileApp UI.

### Session 1

```
You: /plan add event favorites — users can save events and see a favorites list

Claude: [investigates both repos, designs the feature]

  ## Feature: Event Favorites

  ### Roadmap (4 phases)

  #### Phase 1: Backend Domain Model — small
  - [ ] Create UserFavorite entity
  - [ ] Add migration
  - [ ] Create repository

  #### Phase 2: Backend API — small
  - [ ] CreateFavoriteCommand + handler
  - [ ] DeleteFavoriteCommand + handler
  - [ ] GetFavoritesQuery + handler
  - [ ] Add controller endpoints
  - [ ] 8 unit tests

  #### Phase 3: MobileApp Integration — medium
  - [ ] Create favorites service
  - [ ] Create useFavorites hook
  - [ ] Add heart icon to event cards
  - [ ] Create favorites screen

  #### Phase 4: Testing & Polish — small
  - [ ] Integration tests (Backend)
  - [ ] Manual test end-to-end

You: /execute

Claude: [completes Phase 1 — entity, migration, repository]
  Phase 1 complete! [█████░░░░░░░░░░░░░░░] 1/4 phases

You: /execute

Claude: [completes Phase 2 — commands, query, controller, tests]
  Phase 2 complete! [██████████░░░░░░░░░░] 2/4 phases

You: let's commit and pause here

Claude:
  git add [Backend files]
  git commit -m "feat: add favorites API — domain model, CQRS handlers, controller"

You: /pause

Claude:
  Saved state:
    .claude/current-work.md — Phases 1-2 complete, Phase 3 (MobileApp) ready
    .planning/STATE.md — Updated progress, session logged
  0 uncommitted changes. Safe to close.
```

### Session 2 (Next Day)

```
Claude: [reads current-work.md silently]
  Resuming: Event Favorites — Phases 1-2 complete, Phase 3 (MobileApp) ready.

You: /execute

Claude: [spawns agent in MobileApp repo for Phase 3]
  → Creating services/favoriteService.ts
  → Creating hooks/useFavorites.ts
  → Adding heart icon to EventCard component
  → Creating favorites screen at /(tabs)/favorites.tsx
  Phase 3 complete! [███████████████░░░░░] 3/4 phases

You: /execute

Claude: [Phase 4 — integration tests, end-to-end verification]
  Phase 4 complete! [████████████████████] 4/4 phases

You: /verify

Claude:
  Backend: 262/262 tests passed ✓
  MobileApp: npm test — all passed ✓
  Cross-repo: Types aligned ✓
  Verdict: Ready for PR

You: /pr

Claude:
  Created Backend PR #71: "feat: add event favorites API"
  Created MobileApp PR #28: "feat: add favorites UI and heart icon"
  Project board updated.
```

**Time:** ~2 sessions, ~45 minutes each.

---

## Scenario 4: Cross-Repo Category Sync

**Situation:** Backend has 8 categories but Frontend only has 7 (missing "Fun for Kids").

```
You: /cross-repo

Claude:
  ### Categories
  - [x] Backend DataSeeder: 8 categories
  - [!] Frontend contentText: 7 categories — missing "Fun for Kids" (code 8)
  - [x] MobileApp: 8 categories

  1 mismatch found.

You: /orchestrate sync "Fun for Kids" category to Frontend

Claude:
  ## Orchestration Plan

  ### Frontend (only repo affected)
  - Add category 8 "Fun for Kids" / "Kul för barn" to contentText.tsx
  - Add subcategories 801, 802, 803

  Proceeding...
  → Working in Frontend repo
  → Editing src/lib/contentText.tsx
  → Added category 8 with 3 subcategories

  Running /cross-repo...
  All 3 repos aligned. ✓

You: that looks good — commit in the Frontend repo

Claude: [commits in Frontend directory]
```

**Time:** ~5 minutes.

---

## Scenario 5: Exploring the Codebase

**Situation:** New developer wants to understand how external event sync works.

```
You: Explain how the Helsingborg event sync works — from API call to database

Claude: Let me load the relevant context.
  /scope ai

  [reads ExternalEventSyncService, HelsingborgEventService, HelsingborgEventProfile,
   AiClassificationService]

  ## Helsingborg Event Sync Flow

  1. **Background job** runs every 15 minutes (incremental) or daily at 3 AM (full)
  2. **HelsingborgEventService** fetches events from Helsingborg's API
  3. **HelsingborgEventProfile** (AutoMapper) maps Helsingborg fields → GODO Event fields
     - Maps: title, description, location, dates, GPS, images
     - Does NOT assign categories (important!)
  4. **ExternalEventSyncService** orchestrates:
     - Fetches from Helsingborg service
     - Maps via AutoMapper
     - Calls **AiClassificationService** (Claude Haiku) to classify each event
     - AI returns category codes (e.g., {2: [202]} = Sports > Outdoors)
     - Resolves codes to GUIDs via CodebookService
     - Saves to database with SourceProvider = "helsingborg"
  5. Events appear in `/api/events/aggregated` alongside internal events

  Key insight: Categories are assigned POST-mapping by AI, never in the AutoMapper profile.

You: /scope endpoints

Claude: [loads endpoint reference]

You: Show me the admin endpoints for triggering sync manually

Claude:
  - POST /api/admin/sync/external — Trigger incremental sync
  - POST /api/admin/sync/external?full=true — Trigger full sync
  - GET /api/admin/sync/status — Check last sync time and status
  - POST /api/admin/enrich/ai-recategorize — Re-run AI classification
  - POST /api/admin/enrich/ai-recategorize?forceReassign=true — Force recategorize all
```

**Time:** ~5 minutes. No planning, no commits — just exploration.

---

## Scenario 6: Security Audit Before Release

```
You: /security

Claude:
  ## Security Audit — Backend

  ### Package Vulnerabilities
  - [x] dotnet list package --vulnerable: 0 vulnerabilities

  ### Secret Exposure Scan
  - [x] No hardcoded API keys
  - [x] No connection strings in source
  - [x] JWT secret in user-secrets (not appsettings)
  - [!] AI classification API key: ensure it's in user-secrets, not env file

  ### OWASP Check
  - [x] SQL injection: Parameterized via EF Core
  - [x] XSS: API only (no HTML rendering)
  - [x] Authentication: JWT + refresh rotation
  - [x] Rate limiting: 100 req/min global, 10/min auth
  - [x] Security headers: configured in middleware

  ### Recommendations
  1. Consider adding CORS origin validation for production
  2. Enable HTTPS redirect in production middleware
  3. Add request size limits to file upload endpoints

  Overall: Low risk. 0 critical, 3 recommendations.
```

---

## Scenario 7: Using Patterns for Scaffolding

**Situation:** Adding a new CQRS command for archiving events.

```
You: Create an ArchiveEventCommand following the project's command pattern

Claude: [reads .claude/patterns/command-template.md]
  Using the command template pattern...

  → Created Application/Events/Commands/ArchiveEventCommand.cs
    - Record: ArchiveEventCommand(Guid EventId) : IRequest<OperationResult<bool>>

  → Created Application/Events/Commands/ArchiveEventCommandHandler.cs
    - Gets event via IEventRepository.GetByIdWithRelationshipsAsync()
    - Sets IsActive = false (soft delete)
    - Returns OperationResult<bool>.Success(true)

  → Created Test/Events/Commands/ArchiveEventCommandHandlerTests.cs
    - Test: ArchiveEvent_ValidId_SetsIsActiveFalse
    - Test: ArchiveEvent_NotFound_ReturnsFailure
    - Test: ArchiveEvent_AlreadyArchived_ReturnsFailure

  Running: dotnet test --filter "Archive"
  3/3 tests passed.
```

The patterns ensure consistent code structure — same naming, same error handling, same test patterns as every other command in the codebase.

---

## Quick Reference: Command Cheat Sheet

| What You're Doing | Commands to Use |
|-------------------|-----------------|
| Quick bug fix | Fix → `/review` → commit → `/pr` |
| New feature (single session) | `/plan` → `/execute` → `/verify` → `/pr` |
| New feature (multi session) | `/plan` → `/execute` → `/pause` ... `/resume` → `/execute` → `/verify` → `/pr` |
| Cross-repo sync | `/cross-repo` → `/orchestrate` |
| Exploration | `/scope <area>` → ask questions |
| Pre-release check | `/verify` → `/security` |
| Team overview | `/team-status` → `/project-sync` |
| Start of day | `/resume` or `/status` |
| End of day | `/pause` |
