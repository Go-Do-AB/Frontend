---
description: Quick lint + type check + build
---

Run all frontend quality checks in sequence.

## Process

### 1. Lint
```bash
npm run lint 2>&1 | tail -15
```

### 2. Type Check
```bash
npx tsc --noEmit 2>&1 | tail -15
```

### 3. Build
```bash
npm run build 2>&1 | tail -15
```

### 4. Report
```
## Build Check

- Lint: PASS/FAIL
- Type check: PASS/FAIL
- Build: PASS/FAIL

[Details of any failures]
```

End with context tracking line.
