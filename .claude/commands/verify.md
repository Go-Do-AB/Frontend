---
description: Verify completed work — tests, types, lint, cross-repo consistency
---

Verify that the completed work is correct, tested, and ready for PR.

## Process

### 1. Load Context
Read `.planning/STATE.md` to understand what was built.
Read `CLAUDE.md` for repo-specific verification commands.

### 2. Run Checks (repo-specific)

**Backend (.NET):**
```bash
dotnet build --no-restore 2>&1 | tail -5
dotnet test --no-build 2>&1 | tail -10
dotnet format --verify-no-changes --no-restore 2>&1 | tail -5
```

**Frontend (Next.js):**
```bash
npm run lint 2>&1 | tail -10
npx tsc --noEmit 2>&1 | tail -10
npm run build 2>&1 | tail -10
```

**MobileApp (Expo):**
```bash
npm test -- --watchAll=false 2>&1 | tail -10
npx tsc --noEmit 2>&1 | tail -10
```

### 3. Review Changes
```bash
git diff --stat
git diff
```

Check for:
- Unintended file changes
- Hardcoded secrets or URLs
- Missing error handling at system boundaries
- Files that shouldn't be committed (.env, credentials)

### 4. Cross-Repo Consistency
If changes affect the API contract:
- Check if DTOs match between repos
- Check if endpoint URLs are consistent
- Flag any types that need syncing

### 5. Report

```
## Verification Report

### Checks
- [ ] Build: PASS/FAIL
- [ ] Tests: PASS/FAIL (X tests)
- [ ] Lint: PASS/FAIL
- [ ] Type check: PASS/FAIL
- [ ] No secrets exposed: PASS/FAIL

### Changes Summary
[X files changed, Y insertions, Z deletions]

### Cross-Repo Impact
[None / List of impacts]

### Verdict
[Ready for PR / Issues found — fix before proceeding]
```

### 6. Route
- **All pass** → "Ready! Run `/pr` to create a pull request"
- **Issues found** → List them with fix suggestions

End with context tracking line.
