---
description: Delegate work across repos — /orchestrate <task description>
---

Orchestrate a task that spans multiple GODO repos.

## Input
Task: $ARGUMENTS

## Process

### 1. Analyze Scope
Determine which repos are affected:
- **Backend** — API changes, new endpoints, DB migrations, business logic
- **Frontend** — UI changes, form updates, new pages, type updates
- **MobileApp** — Screen changes, component updates, type sync, i18n

### 2. Plan Cross-Repo Work
```
## Orchestration Plan: [Task]

### Repo: Backend
- [ ] [Changes needed]
- Files: [affected files]

### Repo: Frontend
- [ ] [Changes needed]
- Files: [affected files]

### Repo: MobileApp
- [ ] [Changes needed]
- Files: [affected files]

### Execution Order
1. [Which repo first — usually Backend for API changes]
2. [Second repo]
3. [Third repo]

### Dependencies
- [What must be done before what]
```

### 3. Execute
For each repo, use the Agent tool to delegate work:

```
Use Agent tool with:
- Working directory set to the target repo path
- Full context about what to implement
- Reference to that repo's CLAUDE.md and patterns
```

Repo paths:
- Backend: `C:/InFiNetCode/Projects/GODO/BACKEND/Backend`
- Frontend: `C:/InFiNetCode/Projects/GODO/FORM/Frontend`
- MobileApp: `C:/InFiNetCode/Projects/GODO/APP/MobileApp`

### 4. Verify
After all repos are updated:
- Run `/cross-repo` to check consistency
- Run verification in each affected repo

### 5. Report
```
## Orchestration Complete

### Backend
[What was done, branch name]

### Frontend
[What was done, branch name]

### MobileApp
[What was done, branch name]

### PRs to Create
- [ ] Backend: [branch] → main
- [ ] Frontend: [branch] → main
- [ ] MobileApp: [branch] → main
```

End with context tracking line.
