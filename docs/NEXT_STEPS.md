# Next Steps

A short, practical snapshot of where StackScout is and what was already discussed
as possible next work. This is a status note, not new product direction.

## Current state

- `main` is synced with origin and clean.
- Recommendation flow works end-to-end (deterministic, seed-based).
- Curated corpus module is merged — single interface for reading seed data.
- Seed-based tool detail pages are merged at `/tools/[toolId]`.
- Tests pass: 50/50. Build passes. Manual QA passed.
- `/tools/[toolId]` pages are static / SSG from seed data.
- Unknown tool ids return 404.
- Design is functional MVP styling, not the final product design.

## Known future items (to preserve, not yet scheduled)

- Improve tool page design / information hierarchy.
- Evaluate whether to add simple saved/exportable architecture output.
- ~~Consolidate capability data sources~~ **Done** — `lib/capabilities/capabilityTaxonomy.ts` is now the single canonical capability registry; the duplicate `data/seed/capabilities.json` was removed.
- Improve seed corpus quality.
- Revisit static vs dynamic/ISR for tool pages if live GitHub metadata or
  freshness scoring is added later.

## Explicit non-goals for now

- No database
- No auth
- No LLM calls
- No live GitHub ingestion
- No persistence
- No team features
- No CLI
- No broad redesign
