---
description: Create a PR with GODO conventions
---

Create a pull request following GODO conventions.

## Process

### 1. Gather Context
```bash
git status --short
git diff --stat
git log main..HEAD --oneline
git branch --show-current
```

### 2. Analyze Changes
Look at all commits since diverging from main (not just the latest).
Understand the full scope of changes.

### 3. Create PR
Use `gh pr create` with GODO formatting:

```bash
gh pr create --title "<type>: <concise description>" --body "$(cat <<'EOF'
## Summary
- [Bullet point 1]
- [Bullet point 2]

## Changes
[Brief description of what changed and why]

## Test Plan
- [ ] Tests pass
- [ ] Type check passes
- [ ] Build succeeds
- [ ] Manual verification of [key feature]

## Cross-Repo Impact
[None / Description of impact on other repos]

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

### 4. Project Board
After PR is created, check for related project board items:
```bash
gh project item-list 3 --owner Go-Do-AB --format json
```
If a related issue exists, suggest moving it to "In Review".

### 5. Output
Return the PR URL and suggest next steps.

End with context tracking line.
