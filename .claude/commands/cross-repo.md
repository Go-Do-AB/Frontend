---
description: Check cross-repo consistency — types, APIs, categories
---

Check that the 3 GODO repos are consistent with each other.

## Process

### 1. Category Alignment
Check that all repos have the same categories:

**Backend** — DataSeeder (source of truth):
```bash
grep -n "Code\s*=" "C:/InFiNetCode/Projects/GODO/BACKEND/Backend/Infrastructure/Database/Seeding/DataSeeder.cs" | head -30
```

**Frontend** — contentText.tsx:
```bash
grep -n "code" "C:/InFiNetCode/Projects/GODO/FORM/Frontend/src/lib/content/contentText.tsx" | head -30
```

**MobileApp** — types/api.ts or constants:
```bash
grep -rn "category" "C:/InFiNetCode/Projects/GODO/APP/MobileApp/types/" | head -20
```

### 2. API Types
Check that DTOs match across repos:
- Backend: `Application/Events/Dtos/EventDtos.cs`
- Frontend: `src/types/events.ts`
- MobileApp: `types/api.ts`

### 3. API Endpoints
Check that endpoint URLs used by clients match backend controllers.

### 4. Report
```
## Cross-Repo Consistency Report

### Categories
- Backend: [N] categories, [N] subcategories
- Frontend: [N] categories, [N] subcategories
- MobileApp: [N] categories, [N] subcategories
- Status: [ALIGNED / MISMATCHED — details]

### Types
- [List any mismatches between DTOs]

### Endpoints
- [List any URL mismatches]

### Actions Needed
- [ ] [Fix 1]
- [ ] [Fix 2]
```

End with context tracking line.
