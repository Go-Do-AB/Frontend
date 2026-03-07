---
description: Show team dashboard — who's working on what, PRs, branches, project board
---

Show a team-wide status dashboard across all 3 GODO repos.

## Process

### 1. Fetch Project Board
```bash
gh project item-list 3 --owner Go-Do-AB --format json 2>/dev/null
```

### 2. Fetch Open PRs (all repos)
```bash
echo "=== Backend ===" && gh pr list --repo Go-Do-AB/Backend --json number,title,author,reviewDecision,createdAt --limit 10 2>/dev/null
echo "=== Frontend ===" && gh pr list --repo Go-Do-AB/Frontend --json number,title,author,reviewDecision,createdAt --limit 10 2>/dev/null
echo "=== MobileApp ===" && gh pr list --repo Go-Do-AB/MobileApp --json number,title,author,reviewDecision,createdAt --limit 10 2>/dev/null
```

### 3. Fetch Active Branches
```bash
echo "=== Backend ===" && git -C "C:/InFiNetCode/Projects/GODO/BACKEND/Backend" branch -r --sort=-committerdate | head -10
echo "=== Frontend ===" && git -C "C:/InFiNetCode/Projects/GODO/FORM/Frontend" branch -r --sort=-committerdate | head -10
echo "=== MobileApp ===" && git -C "C:/InFiNetCode/Projects/GODO/APP/MobileApp" branch -r --sort=-committerdate | head -10
```

### 4. Build Dashboard

Group by team member. Known members:
- **Nemanja1208** (Nemo) — Lead
- **KristinaK993** — Frontend
- **KaukabFarrukh** — MobileApp
- **miki1981-max** — MobileApp
- **mohald-3** — Backend
- **Martinas-GH** — Business/Strategy

```
## Team Status — [date]

### [Member Name] (@github_handle)
  Project Board: [In Progress items]
  Open PRs: [PR #N: title (repo)]
  Recent branches: [branch names]

### [Next Member]
  ...

### Summary
- Total open PRs: X
- Items In Progress: X
- Items In Review: X
- Items Done (this week): X
```

### 5. Highlight
Flag anything that needs attention:
- PRs waiting for review > 2 days
- Items stuck in "In Progress" with no recent commits
- Cross-repo items that may be blocked

End with context tracking line.
