# Technical Architecture

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 19 |
| Language | TypeScript |
| AI | Anthropic SDK (claude-sonnet-4-6) |
| Database | Neon (PostgreSQL), Drizzle ORM |
| Validation | Zod |
| Testing | Vitest |
| Deployment | Vercel |

## Request Flow — Architecture Generation

```
User Input
  → Zod validation (lib/validation/projectInputSchema.ts)
  → Capability detection (lib/capabilities/detectCapabilities.ts)
      → Claude: project description → capability_ids[]
  → Tool scoring per capability (lib/recommendations/scoreTools.ts)
      → Deterministic: no AI
  → Architecture generation (lib/recommendations/generateArchitecture.ts)
      → Claude: capabilities + top tools → selected_tools + rationale
  → Explanation generation (lib/recommendations/explainRecommendation.ts)
      → Claude: architecture → simple + technical explanations per tool
  → Alternative surfacing (lib/recommendations/alternatives.ts)
      → Relationship graph lookup: alternative-to edges
  → Response validation (lib/validation/recommendationSchema.ts)
  → Client render
```

## Separation of Concerns

**AI does:** capability detection, rationale generation, explanation writing.

**Deterministic logic does:** tool scoring, compatibility scoring, alternative lookup, outcome analysis.

These concerns must not be mixed. AI output is never used as a score. Scores drive selection; AI explains the selection.

## Data Flow — Seed Data

The seed data in `data/seed/` is the authoritative source for Phase 1 tool corpus.

On startup (or via migration), the seed data is loaded into the database.

The relationship graph is loaded into memory at request time from the database, not re-queried per recommendation.

## Key Files

| File | Responsibility |
|---|---|
| `lib/capabilities/detectCapabilities.ts` | AI-based capability detection |
| `lib/recommendations/scoreTools.ts` | Deterministic tool scoring |
| `lib/recommendations/generateArchitecture.ts` | AI-based architecture generation |
| `lib/recommendations/explainRecommendation.ts` | AI-based explanation generation |
| `lib/recommendations/alternatives.ts` | Relationship graph alternative lookup |
| `lib/relationships/compatibility.ts` | Compatibility scoring |
| `lib/relationships/relationshipGraph.ts` | In-memory graph operations |
| `lib/db/schema.ts` | Drizzle schema |
| `lib/db/queries.ts` | Database query functions |
| `lib/outcomes/recordOutcome.ts` | 14-day outcome recording |
| `lib/outcomes/analyzeDrift.ts` | Drift analysis (Phase 2) |
