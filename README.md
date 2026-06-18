# StackScout

Helps builders discover the right architecture and open-source tools for the product they want to build.

## What it does

Describe what you're building in plain English. StackScout:

1. Identifies required capabilities (auth, database, vector storage, etc.)
2. Recommends compatible tools for each capability
3. Explains tradeoffs and alternatives
4. Generates a practical starter architecture

## Phase 1 baseline status

This repository is a clean Phase 1 baseline. The capability, recommendation,
relationship, and explanation logic in `lib/` runs as **deterministic
placeholders** against the curated seed data in `data/seed/`.

Intentionally **not wired yet**:

- Live LLM / Anthropic SDK calls
- Database persistence (Drizzle/Neon not yet decided)
- GitHub metadata fetching
- API routes

The UI routes for saved architectures and the outcome survey are static
placeholders until the data layer is decided.

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
