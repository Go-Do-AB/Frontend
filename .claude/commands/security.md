---
description: Run security audit for this repo
---

Run a security audit tailored to the current repo.

## Process

### 1. Detect Repo Type
Read `CLAUDE.md` to determine which repo this is.

### 2. Run Package Audit

**Backend (.NET):**
```bash
dotnet list package --vulnerable --include-transitive 2>&1
```

**Frontend (Next.js) / MobileApp (Expo):**
```bash
npm audit 2>&1
```

### 3. Check for Exposed Secrets
```bash
grep -rn "sk-ant-\|password\s*=\|secret\s*=\|apikey\s*=" --include="*.ts" --include="*.tsx" --include="*.cs" --include="*.json" . | grep -v node_modules | grep -v ".git" | grep -v "*.md" | head -20
```

### 4. Check Environment Files
```bash
ls -la .env* 2>/dev/null
cat .gitignore | grep -i "env\|secret\|credential"
```

### 5. Report
```
## Security Audit Report

### Package Vulnerabilities
[Results from audit command]

### Exposed Secrets Scan
[Results or "None found"]

### Environment Files
[Status of .env files and .gitignore coverage]

### Recommendations
- [Any action items]
```

End with context tracking line.
