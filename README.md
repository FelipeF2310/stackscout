# StackScout

Helps builders discover the right architecture and open-source tools for the product they want to build.

## What it does

Describe what you're building in plain English. StackScout:

1. Identifies required capabilities (auth, database, vector storage, etc.)
2. Recommends compatible tools for each capability
3. Explains tradeoffs and alternatives
4. Generates a practical starter architecture

## Current implemented state

StackScout today is a **deterministic, seed-based** advisor. Everything runs as
pure functions over the curated corpus in `data/seed/` — there are no live model
calls, no database, and no network lookups at request time.

**Implemented**

- Canonical **Start → Workspace** flow (`/` → `/workspace?idea=…`)
- Deterministic **capability detection** with per-capability evidence
- Deterministic **recommendation pipeline**: detect → score → assemble → explain
- Curated **seed corpus** of tools (`data/seed/tools.json`)
- **Relationship graph** (`data/seed/relationships.json`) feeding compatibility scoring
- **Same-capability alternatives**, each with a reason it wasn't the primary pick
- **Architecture Brief** UI: capabilities → recommended tools → pairings → tradeoffs → alternatives → next step
- **Web Scraping** capability (Firecrawl, Crawlee)
- **CI** via GitHub Actions — `npm ci → npm test → npm run build` on every PR and push to `main`
- Cleaned-up detection false positives (e.g. job-role language no longer triggers Auth; "monitors"/"analytics" no longer force Monitoring on scrapers/dashboards)

**Intentionally not wired yet**

- Live LLM / Anthropic SDK calls — detection and explanations are deterministic
- Database / persistence — no Drizzle/Neon; the saved-architectures and outcome-survey routes are static placeholders
- GitHub metadata fetching
- API routes
- Auth / user accounts
- Realtime / collaboration
- Agent-assisted repo ingestion or review

### Where it's heading

StackScout is intended to become an **AI-assisted open-source decision system** —
deliberately *not* "ChatGPT over GitHub." The guiding principle:

> **Agents propose. StackScout stores reviewed knowledge. Runtime recommendations
> use trusted, structured data.**

AI agents and ingestion pipelines will **scan, score, and propose** structured
repo intelligence (capabilities, relationships, risk/freshness signals); those
proposals enter StackScout's memory only after review; and the live recommender
reads that **reviewed, structured** data for the authoritative repo facts, scores,
and final tool selection, so recommendations stay truthful and accountable. AI may
also assist at runtime — interpreting intent, asking clarifying questions, and
grounding explanations — it just never gets to treat unreviewed model output as
trusted repo facts or as the final pick. Today's deterministic engine is the
foundation that layer builds on, and keeping the runtime trustworthy is a design
choice, not a limitation.

See [`docs/STACKSCOUT_PROJECT_ALIGNMENT.md`](docs/STACKSCOUT_PROJECT_ALIGNMENT.md)
and [`docs/REPO_MEMORY_AND_LEARNING.md`](docs/REPO_MEMORY_AND_LEARNING.md) for the
full vision, and [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the technical
direction.

**Recommended next direction:** a codebase alignment audit focused on
product-fit recommendation modeling.

## Getting Started

```bash
npm install
npm run dev
```

No API keys or database are required to run the baseline.

## Running Tests

```bash
npm test
```

## Documentation

See `docs/` for the full PRD, architecture decisions, domain model, scoring
model, and relationship graph documentation.
