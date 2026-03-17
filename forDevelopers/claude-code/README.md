# Claude Code Infrastructure Guide

> Step-by-step guides for using the `.claude` infrastructure across the GODO platform.

## What's Here

The GODO platform uses a shared Claude Code infrastructure across all 3 repos (Backend, Frontend, MobileApp). This folder explains how it works and how to use it effectively.

| Guide | What You'll Learn | Time |
|-------|-------------------|------|
| [Your First Session](01-YOUR-FIRST-SESSION.md) | What happens when you open Claude Code, and what to do first | 10 min |
| [Slash Commands Reference](02-SLASH-COMMANDS.md) | Every command with usage examples and expected output | 15 min |
| [Planning & Execution](03-PLANNING-AND-EXECUTION.md) | The full lifecycle: plan → execute → verify → PR | 20 min |
| [Context & Session Management](04-CONTEXT-AND-SESSIONS.md) | How context loading, session persistence, and pause/resume work | 10 min |
| [Cross-Repo Orchestration](05-CROSS-REPO-ORCHESTRATION.md) | Working across Backend, Frontend, and MobileApp simultaneously | 15 min |
| [Example Workflows](06-EXAMPLE-WORKFLOWS.md) | Real-world scenarios from bug fixes to multi-repo features | 15 min |

## Recommended Reading Order

```mermaid
graph LR
    A["1. First Session"] --> B["2. Slash Commands"]
    B --> C["3. Planning"]
    C --> D["4. Context & Sessions"]
    D --> E["5. Cross-Repo"]
    E --> F["6. Examples"]

    style A fill:#F3C10E,color:#000
    style B fill:#F3C10E,color:#000
    style C fill:#F3C10E,color:#000
    style D fill:#F3C10E,color:#000
    style E fill:#F3C10E,color:#000
    style F fill:#F3C10E,color:#000
```

**New to Claude Code?** Start with guide 1, then 2.
**Already using it?** Jump to guide 3 for planning workflows or guide 6 for examples.

## How This Relates to Other Files

| File / Folder | Purpose |
|---------------|---------|
| `CLAUDE.md` (repo root) | Instructions Claude reads automatically — you don't need to touch this |
| `.claude/commands/` | The actual slash command definitions — this guide explains how to *use* them |
| `.claude/reference/` | Detailed context files loaded on demand via `/scope` |
| `.claude/patterns/` | Code scaffolding templates Claude uses when generating code |
| `.claude/current-work.md` | Session memory — updated automatically, you rarely edit this manually |
| `.planning/STATE.md` | Active feature plan — created by `/plan`, updated by `/execute` |
| `forDevelopers/CLAUDE-CODE-GUIDE.md` | Single-page quick reference (kept for quick lookups) |
| `forDevelopers/claude-code/` | **This folder** — detailed guides with step-by-step walkthroughs |

## Prerequisites

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) installed
- Access to the GODO GitHub organization (`Go-Do-AB`)
- The repo cloned locally
- `gh` CLI authenticated (`gh auth login`)
