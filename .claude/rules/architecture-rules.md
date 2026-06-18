# Architecture Rules

Rules governing the recommendation engine and relationship graph.

---

## Capability Detection

- Capability detection runs before tool recommendation.
- A project description must resolve to ≥1 capability before any tools are recommended.
- Capabilities come from the taxonomy in `lib/capabilities/capabilityTaxonomy.ts`.
- Do not invent capabilities outside the taxonomy without updating the taxonomy first.

---

## Tool Recommendation

- Tools are recommended per capability, not per project description.
- A tool must fulfill a detected capability to be recommended for it.
- Recommendations are scored — never randomly ordered.
- Scoring uses `lib/recommendations/scoreTools.ts`. See `docs/SCORING_MODEL.md`.

---

## Scoring Model

Score tools on four dimensions:
1. **Capability Fit** — does it fulfill the capability?
2. **Context Fit** — does it match skill level, stage, hosting, ecosystem?
3. **Compatibility Fit** — does it work well with other selected tools?
4. **Maintenance Fit** — is it actively maintained?

Never score on GitHub stars or raw popularity alone.

---

## Relationship Graph

- Relationships live in `lib/relationships/` and are seeded from `data/seed/relationships.json`.
- Relationship types are defined in `lib/relationships/relationshipTypes.ts`.
- Do not add relationships without a `confidence_score` and `source_of_truth`.
- In Phase 1 (MVP), all relationships are manually curated. Do not add automated relationship discovery.

---

## Architecture Generation

- An architecture is a collection of capabilities + selected tools + rationale.
- Every architecture must include a rationale string per tool.
- Architecture generation lives in `lib/recommendations/generateArchitecture.ts`.
- The AI model explains; the scoring logic selects. Keep these concerns separate.

---

## Alternatives

- Every recommendation must surface at least one alternative.
- Alternatives must include a brief reason why they were not the primary recommendation.
- Alternative logic lives in `lib/recommendations/alternatives.ts`.
