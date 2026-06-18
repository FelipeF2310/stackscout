# Data Model Rules

Rules governing the database schema and seed data.

---

## Core Entities

The data model has five core entities. Do not add entities without updating `docs/DATA_MODEL.md`.

1. **Capability** — a system requirement (auth, database, vector storage)
2. **Tool** — an implementation of one or more capabilities
3. **Relationship** — a typed connection between two tools
4. **Architecture** — a saved collection of capability + tool selections
5. **ArchitectureOutcome** — user-reported outcome after 14 days

---

## Capabilities

- Capabilities are canonical — they live in the taxonomy, not in user input.
- capability_id is a stable slug (e.g., `auth`, `vector-storage`), not a UUID.
- Adding a capability requires updating: `data/seed/capabilities.json`, `lib/capabilities/capabilityTaxonomy.ts`, and `docs/CAPABILITY_TAXONOMY.md`.

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

- `project_description` stores the original user input verbatim — do not sanitize or truncate.
- `recommendation_rationale` is a per-tool map (`tool_id → string`), not a single string.
- Architecture IDs are UUIDs generated at creation time.

---

## Architecture Outcomes

- Outcomes are recorded 14 days after architecture creation.
- Valid status values: `using-as-recommended`, `modified-slightly`, `replaced-multiple`, `abandoned`.
- `modifications` and `replaced_tools` are nullable — only populated on modification/abandonment.

---

## Seed Data

- Phase 1 seed data lives in `data/seed/`.
- Target: 50–100 tools covering core capabilities.
- Seed data is the source of truth for the MVP. The database is populated from it.
- Do not hardcode tool data in application code — always reference from seed/db.
