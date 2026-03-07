---
description: Create a feature plan with phases, requirements, and roadmap
---

You are starting a planning session for a new feature or task.

## Input
Feature/task description: $ARGUMENTS

## Templates
Read these templates for the planning structure:
- `.claude/templates/planning/STATE.md` — State file format
- `.claude/templates/planning/PHASE.md` — Per-phase detail format
- `.claude/templates/planning/SUMMARY.md` — Completion summary format

## Process

### 1. Understand
Read `.claude/current-work.md` and `CLAUDE.md` silently for context.
If $ARGUMENTS is empty, ask the user what they want to build.

### 2. Investigate
Before planning, investigate the codebase to understand:
- What exists that's relevant to this feature
- What files/modules will be affected
- What patterns are already established (check `.claude/patterns/`)
- Any cross-repo implications (check CLAUDE.md Cross-Repo Awareness)

### 3. Requirements
Present a concise requirements summary:
```
## Requirements: [Feature Name]

**Goal**: [One sentence]
**Affected repos**: [Backend / Frontend / MobileApp]
**Key changes**:
- [ ] Change 1
- [ ] Change 2
```

Ask the user to confirm or adjust.

### 4. Create Roadmap
Break the work into phases. Each phase should be completable in one session.
Keep phases small and focused — prefer 3 small phases over 1 large one.

```
## Roadmap

### Phase 1: [Name] — [small/medium/large]
- [ ] Task 1
- [ ] Task 2

### Phase 2: [Name] — [small/medium/large]
- [ ] Task 1
```

### 5. Save State
Create the planning directory and state file:

```bash
mkdir -p .planning
```

Write `.planning/STATE.md` using the template from `.claude/templates/planning/STATE.md`.
Fill in all placeholders with the actual feature details, requirements, and roadmap.

### 6. Link to Project Board
Check if there's a related GitHub issue:
```bash
gh issue list --repo Go-Do-AB/[repo] --state open --json number,title --limit 20
```
If found, mention it. If not, suggest creating one.

### 7. Output
End with:
- Summary of the plan
- Phase count and scope estimate
- Suggest: "Run `/execute` to start Phase 1, or `/progress` to review the plan"
- Context tracking line
