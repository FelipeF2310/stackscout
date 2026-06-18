# Claude Code — StackScout

This file intentionally defers to the root [`CLAUDE.md`](../CLAUDE.md) to avoid
duplicating instructions. Read that first.

- **Working rules:** `.claude/rules/` (load the relevant file before working in that domain)
- **Custom agents:** `.claude/agents/`
- **Skills:** `.claude/skills/`

## Phase 1 baseline status

Capability detection, architecture generation, and explanations currently run
as **deterministic placeholders** in `lib/`. The following are intentionally
**not wired yet**:

- Live LLM / Anthropic SDK calls
- Database persistence (Drizzle/Neon not yet decided)
- GitHub metadata fetching
- API routes

The project stays centered on capabilities, recommendations, relationships, and
the curated seed data in `data/seed/`.
