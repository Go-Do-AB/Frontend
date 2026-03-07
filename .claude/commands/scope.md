---
description: Load reference files for a specific area — /scope <area>
---

Load the right context files based on what you want to work on.

## Input
Area: $ARGUMENTS

## Process

### 1. Match Area to Reference Files

**Backend areas:**
| Area keyword | Files to read |
|-------------|---------------|
| `categories`, `cats` | `.claude/reference/categories.md` |
| `endpoints`, `api` | `.claude/reference/endpoints.md` |
| `files`, `structure` | `.claude/reference/key-files.md` |
| `tests`, `testing` | `.claude/reference/testing.md` |
| `ai`, `classification` | `.claude/reference/ai-classification.md` |
| `production`, `deploy` | `.claude/reference/production.md` |
| `cqrs`, `commands` | `.claude/reference/cqrs-map.md` |
| `all` | All reference files |

**Frontend areas:**
| Area keyword | Files to read |
|-------------|---------------|
| `form`, `steps` | `.claude/reference/form-architecture.md` |
| `files`, `structure` | `.claude/reference/key-files.md` |
| `api`, `integration` | `.claude/reference/api-integration.md` |
| `components` | `.claude/reference/components.md` |
| `all` | All reference files |

**MobileApp areas:**
| Area keyword | Files to read |
|-------------|---------------|
| `screens`, `routes` | `.claude/reference/screens-map.md` |
| `components` | `.claude/reference/components-inventory.md` |
| `data`, `flow` | `.claude/reference/data-flow.md` |
| `filter`, `context` | `.claude/reference/filter-context.md` |
| `events`, `hook` | `.claude/reference/use-events.md` |
| `types`, `sync` | `.claude/reference/types-sync.md` |
| `i18n`, `translations` | `.claude/reference/i18n-coverage.md` |
| `refactor`, `backlog` | `.claude/reference/refactoring-backlog.md` |
| `all` | All reference files |

### 2. Read Files
Read the matched files and confirm what was loaded.

### 3. If No Match
If $ARGUMENTS doesn't match any area:
```
Available scopes for this repo:
[list available areas with descriptions]

Usage: /scope <area>
Example: /scope api
```

End with context tracking line.
