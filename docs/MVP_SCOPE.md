# MVP Scope

This file describes the **current free MVP scope**, not the whole PRD. The PRD
is broad product vision; the current implementation queue lives in
`STACKSCOUT_PROJECT_ALIGNMENT.md`, `NEXT_STEPS.md`, and `ARCHITECTURE.md`.

## In Scope Now

- Natural language project input (text prompt, 10–2000 chars)
- Deterministic capability detection from project description
- Tool recommendations per capability
- Recommendation explanations (simple + technical depth)
- Tradeoff and alternative surfacing
- Refinement options: skill level, project stage, hosting, ecosystem, model preference
- Capability-peer alternatives
- Fit metadata (`best_for` / `avoid_if`) that improves free recommendation quality

## Deferred

- Architecture persistence, saved architecture lists, and outcome follow-up
- Audit/report/evidence schemas
- RAG and self-learning
- GitHub ingestion and runtime agents
- Paid features
- Browser extensions

## Out of Scope

See `.claude/rules/mvp-non-goals.md` for the full exclusion list.

Summary:
- No code generation
- No IDE integrations
- No trend data or popularity feeds
- No team collaboration
- No community tool submissions
- No browser extensions
- No stack monitoring
- No security scanning

## Phase Roadmap

| Phase | Focus |
|---|---|
| 1 (Free MVP) | Architecture Advisor — deterministic, seed-backed recommendations |
| 2 | Recommendation Foundation — refinement context, peer alternatives, fit metadata, scoring structure |
| 3 | Evidence & Review — audit/report/evidence schemas and review boundaries |
| 4 | Learning & Intelligence — RAG/self-learning over reviewed knowledge |

## Corpus Size

Phase 1 target: 50–100 tools, 15–20 capabilities, 30–50 relationships.

Focus: quality of relationships over breadth of coverage.

Better to have 50 well-understood tools with strong relationship data than 200 tools with weak relationship data.
