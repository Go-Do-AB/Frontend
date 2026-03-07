---
description: Sync GitHub Project Board — update issue statuses based on PRs
---

Synchronize the GitHub Project Board with actual PR/branch status.

## Process

### 1. Load Current State
```bash
gh project item-list 3 --owner Go-Do-AB --format json 2>/dev/null
```

### 2. Check PRs Across Repos
```bash
gh pr list --repo Go-Do-AB/Backend --state all --json number,title,state,mergedAt,closedAt --limit 20 2>/dev/null
gh pr list --repo Go-Do-AB/Frontend --state all --json number,title,state,mergedAt,closedAt --limit 20 2>/dev/null
gh pr list --repo Go-Do-AB/MobileApp --state all --json number,title,state,mergedAt,closedAt --limit 20 2>/dev/null
```

### 3. Find Mismatches
Compare project board status vs actual state:
- Issue has merged PR but board says "In Progress" → should be "Done" or "In Review"
- Issue has open PR but board says "In Progress" → should be "In Review"
- Issue has no PR and no recent activity → flag as potentially stale

### 4. Report
```
## Project Board Sync Report

### Mismatches Found
| Issue | Board Status | Actual | Suggested |
|-------|-------------|--------|-----------|
| #N: Title | In Progress | PR merged | → Done |

### Actions
[For each mismatch, suggest the gh command to update]
```

### 5. Apply (with confirmation)
For each mismatch, ask: "Apply these changes? (y/n)"

To update project board status:
```bash
gh project item-edit --project-id PVT_kwDODYCU1c4BCJzJ --id [ITEM_ID] --field-id PVTSSF_lADODYCU1c4BCJzJzg0cpoM --single-select-option-id [STATUS_OPTION_ID]
```

Status option IDs:
- Features: 2f189bcb
- Tasks: a169f698
- Ready for Sprint: 7cc61601
- In Progress: 47fc9ee4
- In Review: 3d9f4863
- Done: 98236657

End with context tracking line.
