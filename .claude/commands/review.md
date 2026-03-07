---
description: Review staged/unstaged changes before committing
---

Review all current changes for quality, correctness, and GODO conventions.

## Process

### 1. See What Changed
```bash
git diff --stat
git diff
git diff --cached --stat
git diff --cached
```

### 2. Review Checklist
For each changed file, check:

**Code Quality:**
- [ ] Follows existing patterns in the codebase
- [ ] No unnecessary changes (only what was requested)
- [ ] No leftover debug code (console.log, print, TODO hacks)
- [ ] Error handling at system boundaries

**Security:**
- [ ] No hardcoded secrets, API keys, or connection strings
- [ ] No SQL injection, XSS, or command injection risks
- [ ] Sensitive files not staged (.env, credentials)

**Conventions:**
- [ ] Naming follows repo conventions
- [ ] Types/DTOs match backend (if frontend/mobile)
- [ ] i18n used for user-facing text (if mobile)

**Cross-Repo:**
- [ ] API contract changes flagged
- [ ] DTO changes need syncing to other repos?

### 3. Report
```
## Code Review

### Files Changed
[list with brief description of each change]

### Issues Found
[List issues or "None — looks good"]

### Suggestions
[Optional improvements, clearly marked as optional]

### Verdict
[Ready to commit / Fix issues first]
```

End with context tracking line.
