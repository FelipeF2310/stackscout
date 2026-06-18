# StackScout

AI-native architecture advisor. Users describe what they want to build; StackScout identifies required capabilities, recommends compatible tools, explains tradeoffs, and generates a practical starter architecture.

## Core Concept

The primary object is a **capability** (e.g., Authentication, Vector Storage, Scheduling) — not a repository. Tools are implementations of capabilities. Architectures are collections of capabilities fulfilled by compatible tools.

## Project Structure

- `app/` — Next.js App Router pages
- `components/` — React UI components
- `lib/` — Core domain logic (capabilities, recommendations, relationships, outcomes)
- `data/seed/` — Curated tool/capability corpus (Phase 1: manually curated, 50-100 tools)
- `docs/` — Architecture decisions, domain documentation
- `.claude/` — AI collaboration rules, agents, and skills

## Key Rules

Read `.claude/CLAUDE.md` for the full Claude Code collaboration guide.

Critical constraints:
- Capabilities are first-class. Never design around repositories.
- Every recommendation must include reasoning (why this, why not alternatives, tradeoffs).
- MVP scope is strict — see `.claude/rules/mvp-non-goals.md` before adding features.
- Confidence is not correctness — never imply a recommendation is guaranteed correct.

## Docs

- `docs/PRD.md` — Full product requirements
- `docs/CONTEXT.md` — Domain model and terminology
- `docs/DATA_MODEL.md` — Data model reference
- `docs/DECISIONS/` — Architecture Decision Records

## Tech Stack

Current (wired in the Phase 1 baseline):
- Next.js 15, React 19, TypeScript
- Zod for validation
- Vitest for testing
- Tailwind CSS for styling

Planned (designed for, but intentionally NOT wired yet):
- Anthropic SDK (claude-sonnet-4-6) for capability detection and architecture generation — currently deterministic placeholders in `lib/`
- Drizzle ORM + Neon (PostgreSQL) for persistence — not yet decided/wired
- GitHub metadata fetching for maintenance signals — not yet wired

See `.claude/CLAUDE.md` for the Phase 1 baseline status.
