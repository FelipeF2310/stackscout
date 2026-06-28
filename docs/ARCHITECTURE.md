# Technical Architecture

This document describes what is **implemented today**. StackScout is currently a
deterministic, seed-based system — no live LLM calls, no database, no network
lookups at request time. The intended longer-term shape is captured separately
in [Future architecture direction](#future-architecture-direction) and, in more
detail, in [`STACKSCOUT_PROJECT_ALIGNMENT.md`](./STACKSCOUT_PROJECT_ALIGNMENT.md),
[`REPO_MEMORY_AND_LEARNING.md`](./REPO_MEMORY_AND_LEARNING.md), and the PRD
(product vision, broader than the current build). Today's determinism is a
foundation for that vision, not a replacement of it.

## Implemented today

### Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 19 |
| Language | TypeScript |
| Validation | Zod |
| Styling | Tailwind CSS |
| Testing | Vitest |
| CI | GitHub Actions (`.github/workflows/ci.yml`) |

Runtime dependencies are `next`, `react`, `react-dom`, and `zod` — there is no
AI SDK, ORM, or database client wired in.

### Request Flow — Architecture Recommendation

Everything below is **deterministic**. The entry point is
`lib/recommendations/recommendArchitecture.ts`, called from the
`/workspace` server component.

```
Prompt (?idea=…)
  → Capability detection      (lib/capabilities/detectCapabilities.ts)
      keyword/synonym matching against the canonical taxonomy, with evidence
  → Tool scoring per capability (lib/recommendations/scoreTools.ts)
      deterministic score: capability fit, context fit, compatibility, maintenance
  → Architecture assembly      (lib/recommendations/generateArchitecture.ts)
      picks the top-scored tool per capability; one card per tool
  → Explanations               (lib/recommendations/explainRecommendation.ts
                                + lib/recommendations/explanationCopy.ts)
      deterministic, templated simple/why/tradeoff/fits-with copy
  → Alternatives               (lib/recommendations/alternatives.ts)
      same-capability peers via the relationship graph, each with a reason
  → Client render              (Architecture Brief in the two-pane workspace)
```

Capabilities come from the canonical taxonomy
(`lib/capabilities/capabilityTaxonomy.ts`); there is no separate capability seed
file. Zod schemas in `lib/validation/` define the input/output shapes.

### Separation of Concerns

Today, **all selection and explanation is deterministic**:

- **Scoring logic** selects tools (capability fit, context fit, compatibility,
  maintenance). Compatibility is scored greedily against the tools already
  chosen, so neighbouring choices influence later ones.
- **Templated copy** produces the simple/why/tradeoff/fits-with/alternative
  text — generated from corpus data, not from a model.

No model output is used as a score, and no model is called at all in the current
build. (In the future direction, an LLM would *explain* and help *detect*, but
scores would still drive selection — see below.)

### Data Flow — Seed Data

The seed data in `data/seed/` (`tools.json`, `relationships.json`) is the
authoritative corpus. It is loaded **into memory from the JSON files at request
time** (`lib/corpus/corpus.ts`); loading the corpus also populates the
in-memory relationship graph. There is no database and no migration step.

### Key Files

| File | Responsibility |
|---|---|
| `lib/capabilities/capabilityTaxonomy.ts` | Canonical capability registry |
| `lib/capabilities/detectCapabilities.ts` | Deterministic keyword/evidence capability detection |
| `lib/recommendations/recommendArchitecture.ts` | End-to-end deterministic pipeline orchestration |
| `lib/recommendations/scoreTools.ts` | Deterministic tool scoring |
| `lib/recommendations/generateArchitecture.ts` | Deterministic architecture assembly (top tool per capability) |
| `lib/recommendations/explainRecommendation.ts` | Per-tool explanation assembly |
| `lib/recommendations/explanationCopy.ts` | Deterministic explanation/tradeoff/alternative copy |
| `lib/recommendations/alternatives.ts` | Same-capability alternative lookup |
| `lib/relationships/relationshipGraph.ts` | In-memory relationship graph operations |
| `lib/relationships/compatibility.ts` | Compatibility scoring over the graph |
| `lib/corpus/corpus.ts` | Loads the seed corpus + graph into memory |
| `lib/tools/toolPage.ts` | Data for the static `/tools/[toolId]` pages |
| `lib/validation/` | Zod input/output schemas |
| `lib/outcomes/recordOutcome.ts` | Outcome-recording placeholder (no persistence yet) |

## Future architecture direction

These are **not implemented** — they describe where the architecture is headed,
kept explicitly separate from the current build. StackScout is meant to become an
**AI-assisted open-source decision system**, deliberately *not* "ChatGPT over
GitHub." The governing principle (from `REPO_MEMORY_AND_LEARNING.md`):

> **Agents propose. StackScout stores reviewed knowledge. Runtime recommendations
> use trusted, structured data.**

- **AI-assisted intent interpretation** — use AI to help interpret project intent
  and constraints during capability detection, instead of keyword matching alone.
- **Agent-assisted repo discovery & scoring** — AI agents and ingestion pipelines
  **scan, score, and propose** candidate repositories and structured facts
  (capability mappings, relationships, risk/freshness signals). Proposals are
  candidates, not truth.
- **Review / trust boundary** — a proposal becomes part of StackScout's memory
  only after an explicit review path (human or tightly-scoped validation).
  Storage is the line between "a model said so" and "StackScout knows."
- **Persistence / trusted repo intelligence** — a database (e.g. Drizzle + a
  Postgres host) storing the **reviewed, structured repo intelligence** plus
  saved architectures and outcome surveys; the corpus also moves out of flat JSON.
- **Product-fit recommendation modeling** — the runtime reads trusted structured
  data and explains **product fit, pairings, tradeoffs, and alternatives** — not
  broad repo dumping and not generic model output.

A deliberate constraint carries through all of this: **unreviewed model output is
never treated as authoritative repo facts, scores, or final tool selection.** AI
may assist at runtime — interpreting intent, asking clarifying questions, and
producing grounded explanations — but the trusted repo intelligence, scores, and
the final selection come from reviewed, structured data. That boundary (not the
absence of AI) is what keeps recommendations accountable. The deterministic engine
today is the trustworthy base that layer builds on.

The immediate next step is a **codebase alignment audit focused on product-fit
recommendation modeling**. See
[`STACKSCOUT_PROJECT_ALIGNMENT.md`](./STACKSCOUT_PROJECT_ALIGNMENT.md) and
[`REPO_MEMORY_AND_LEARNING.md`](./REPO_MEMORY_AND_LEARNING.md) for the full
vision and phasing.
