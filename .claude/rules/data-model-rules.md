# Data Model Rules

Rules governing the current seed data and future data model. Current trusted
runtime data is the canonical capability taxonomy plus the curated seed corpus;
database persistence is deferred.

---

## Current Core Entities

Do not add entities without updating the relevant docs.

1. **Capability** — a system requirement (auth, database, vector storage)
2. **Tool** — an implementation of one or more capabilities
3. **Relationship** — a typed connection between two tools

Deferred persistence concepts:

4. **Architecture** — a future saved collection of capability + tool selections
5. **ArchitectureOutcome** — a future user-reported outcome after follow-up

---

## Capabilities

- Capabilities are canonical — they live in the taxonomy, not in user input.
- `lib/capabilities/capabilityTaxonomy.ts` (`CAPABILITY_TAXONOMY`) is the single canonical capability registry. The corpus and all other code read capabilities from it. There is no separate capability seed file.
- capability_id is a stable slug (e.g., `auth`, `vector-storage`), not a UUID.
- Adding a capability requires updating `lib/capabilities/capabilityTaxonomy.ts`. Keep `docs/CAPABILITY_TAXONOMY.md` in sync until that doc is generated from the taxonomy (deferred).

---

## Tools

- Every tool must be linked to ≥1 capability via `capability_ids`.
- `github_url` is required and must be a valid GitHub repository URL.
- `maintenance_score`, `maturity_score`, and `documentation_score` are floats 0–1.
- Do not add tools without a corresponding relationship entry.

---

## Relationships

- Every relationship has a `confidence_score` (0–1) and a `source_of_truth`.
- Valid `source_of_truth` values in Phase 1: `"manual"`.
- Relationship types are defined in `lib/relationships/relationshipTypes.ts` — do not use strings directly.
- A tool cannot have a relationship with itself.

---

## Architectures

Architecture persistence is deferred. Do not add saved architecture storage,
saved lists, or outcome collection unless that work is explicitly scoped.

- `project_description` stores the original user input verbatim — do not sanitize or truncate.
- `recommendation_rationale` is a per-tool map (`tool_id → string`), not a single string.
- Architecture IDs are UUIDs generated at creation time.

---

## Architecture Outcomes

- Outcome collection is future work, after persistence and review boundaries are scoped.
- Valid status values: `using-as-recommended`, `modified-slightly`, `replaced-multiple`, `abandoned`.
- `modifications` and `replaced_tools` are nullable — only populated on modification/abandonment.

---

## Seed Data

- Phase 1 seed data lives in `data/seed/` (`tools.json`, `relationships.json`). Capabilities are **not** seed data — they come from the canonical taxonomy (see Capabilities above).
- Target: 50–100 tools covering core capabilities.
- Tool and relationship seed data is the source of truth for the MVP corpus. There is no database population step today.
- Do not hardcode tool data in application code — always reference the seed corpus.
