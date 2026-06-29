# Testing Rules

---

## What to test

| Module | Test type | Priority |
|---|---|---|
| `lib/capabilities/detectCapabilities.ts` | Unit | High |
| `lib/capabilities/capabilityTaxonomy.ts` | Unit | High |
| `lib/recommendations/scoreTools.ts` | Unit | High |
| `lib/recommendations/alternatives.ts` | Unit | Medium |
| `lib/relationships/compatibility.ts` | Unit | High |
| Architecture generation (end-to-end) | Integration | High |

---

## Testing rules

- Do not mock the recommendation engine. Run it against real seed data.
- There is no current database. Integration tests should exercise the real
  curated seed data and deterministic pipeline.
- Unit test scoring logic with fixed inputs and expected score ranges, not exact floats.
- Capability detection tests must cover: ambiguous input, multi-capability projects, minimal input.
- Relationship tests must verify bidirectionality where required by the relationship type.

---

## Test file locations

Tests mirror the `lib/` structure under `tests/`:

```
tests/
  capabilities/   → tests for lib/capabilities/
  recommendations/ → tests for lib/recommendations/
  relationships/  → tests for lib/relationships/
```

---

## What not to test

- Do not test AI model output content — it is non-deterministic. Test the shape and presence of required fields.
- Do not test GitHub API responses — mock the GitHub client.
- Do not write snapshot tests for recommendation output.
