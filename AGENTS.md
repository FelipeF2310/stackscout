# StackScout Agent Guide

This file defines the default working rules for Codex and other coding agents in
this repository. Before proposing work, read
`docs/PRODUCT_ROADMAP.md` for phase direction, `docs/NEXT_STEPS.md` for the
active execution queue, and `docs/STACKSCOUT_PROJECT_ALIGNMENT.md` plus
`docs/ARCHITECTURE.md` for durable product and implementation context. Use
`docs/PRD.md` as broad product vision, not as the active implementation queue.
Consult the relevant documents under `docs/` and `.claude/rules/` before
changing domain behavior. Before proposing or implementing a clarification
question, read `docs/CLARIFICATION_POLICY_CATALOG.md`. Before proposing ecosystem
asset classification, a pilot, or promotion, read
`docs/ECOSYSTEM_ASSET_CLASSIFICATION_CONTRACT.md`.

## Product purpose

StackScout is an AI-native architecture advisor for AI-assisted builders. A
user describes a product in plain English; StackScout identifies the required
capabilities, recommends compatible tools, explains tradeoffs and alternatives,
and produces a practical starter architecture.

The product should answer:

> Given what I am trying to build, what should I use and why?

## Core product rule

**Capability is the primary object, not Repository or Tool.**

- A capability describes what a system must do, such as Authentication,
  Vector Storage, or Document Parsing.
- A current Tool is a runtime-selectable implementation of one or more
  capabilities.
- A public repository is an evidence-bearing source and possible future asset,
  not automatically a Tool or recommendation.
- An AI-builder skill is development assistance for a builder or coding agent,
  not a runtime architecture dependency.
- An architecture is a collection of detected capabilities fulfilled by
  compatible selected tools, with rationale.
- Detect capabilities before recommending tools.
- Recommend and score tools relative to a capability, never as a global
  popularity ranking.
- Do not build repository-first discovery, tool-directory, trending, or
  popularity-driven experiences.
- Every recommendation must explain why the tool fits, its tradeoffs, relevant
  alternatives, and when an alternative may be preferable.
- Confidence is not correctness. Do not claim a recommendation is guaranteed or
  universally best.

## Current MVP baseline

The current application is deterministic and seed-driven. It uses the curated
corpus in `data/seed/` for capability detection, scoring, compatibility,
architecture generation, explanations, and alternatives.

Keep changes within the architecture-advisor experience:

- Natural-language project input
- Canonical capability detection
- Tool recommendations per capability
- Compatibility-aware architecture assembly
- Recommendation explanations, tradeoffs, and alternatives
- URL-backed refinement context in the live workspace
- Same-capability peer alternatives
- Product-fit metadata (`best_for` / `avoid_if`) for explanation quality

Current roadmap discipline:

- Prioritize the free product until it proves user value.
- Completed slices on `main` include refinement-context activation,
  capability-peer alternatives, focused RAG peer fit metadata, the
  realtime-collaboration capability, scheduling fit metadata, detector
  boundary-matching hardening, project-shape inference, the `internal → auth`
  shape migration, and AI-grounding clarification v1; do not redo those.
- Follow `docs/PRODUCT_ROADMAP.md` for the current phase and
  `docs/NEXT_STEPS.md` for the next approved execution slice.
- Scoring review should be evidence-driven and only follow concrete
  wrong-winner cases.
- Defer paid features, browser extensions, persistence, GitHub ingestion,
  runtime agents, RAG, and audit/report/evidence schemas until explicitly scoped.

The Phase 1 corpus should remain small and curated: roughly 50–100 tools,
15–20 capabilities, and 30–50 relationships. Relationship quality matters more
than breadth.

Do not implement the following unless the user explicitly requests that scope:

- Live LLM or Anthropic/OpenAI calls
- GitHub API calls or automated repository metadata fetching
- Database or ORM integration
- Persistence or API routes
- Authentication or user accounts
- Saved architectures, saved-architecture lists, or outcome persistence
- Paid tiers, pricing, or monetization features

Also keep the PRD's MVP non-goals out of scope: code generation, IDE or browser
extensions, trend feeds, workflow execution, team collaboration, enterprise
administration, social or marketplace features, stack monitoring, and security
scanning.

## Repository structure

- `app/` — Next.js App Router pages and route-level composition
- `components/` — React presentation and interaction components
- `lib/capabilities/` — capability taxonomy and detection
- `lib/recommendations/` — scoring, architecture generation, explanations, and
  alternatives
- `lib/relationships/` — relationship graph and compatibility logic
- `lib/outcomes/` — outcome-domain placeholders; do not add persistence by
  default
- `lib/validation/` — boundary schemas and input validation
- `lib/seed/` — typed access to the curated seed corpus
- `data/seed/` — authoritative Phase 1 capabilities, tools, and relationships
- `tests/` — tests mirroring the `lib/` domain structure
- `docs/` — PRD, domain context, architecture decisions, and model references
- `.claude/` — existing collaboration rules and domain-specific guidance

Keep domain logic in `lib/`, UI rendering in `components/`, and route
composition in `app/`. Do not hardcode tool data in application code; read it
from the seed corpus. Do not add new domain entities without updating the
relevant domain documentation.

## Engineering workflow

1. Inspect the working tree before editing and preserve unrelated changes.
2. Read the relevant product, domain, and decision documents.
3. Identify the capability-first behavior and the smallest correct seam.
4. Keep deterministic scoring/selection separate from explanation generation.
5. Make the smallest scoped change that satisfies the request.
6. Add or update focused tests using real seed data. Do not mock the
   recommendation engine or snapshot recommendation output.
7. Run the focused tests while iterating, then run the full required checks.
8. Review the final diff for scope expansion, stale copy, generated artifacts,
   and unrelated edits.

When available, use Matty's skills throughout development where they help with
TypeScript correctness, focused test quality, schema design, safe refactor
discipline, and review rigor.

Do not add packages unless the task explicitly requires them. Avoid broad UI
redesigns when a domain or pipeline change is sufficient.

## Test and build expectations

Before handing off a completed change, run:

```bash
npm test
npm run build
```

Tests must cover capability detection, deterministic scoring, compatibility,
architecture generation, and relevant rendering behavior. Integration tests
should exercise the real curated seed data. A successful production build is
required because it includes TypeScript validation and Next.js route checks.

Do not run `npm run build` while `npm run dev` is active in the same checkout;
both use `.next` and can produce mixed or stale artifacts. If generated chunks
become inconsistent, stop the dev server, remove `.next`, and restart.

## Definition of done

A task is done when:

- The requested behavior works at the correct domain or UI seam.
- The solution remains capability-first and architecture-focused.
- Recommendations retain useful reasoning, tradeoffs, and capability context.
- Relevant regression tests exist and the full test suite passes.
- `npm run build` passes.
- No unrelated source files, dependencies, integrations, or persistence were
  added.
- Documentation is updated when domain terminology or architectural decisions
  change.
- The final working tree contains only the intentional task changes.
- The handoff clearly reports changed files, verification results, and any
  remaining limitations.

## Git rules

- Never push to any remote without explicit user approval.
- Do not force-push, rewrite history, create tags, or create releases unless the
  user explicitly requests that exact action.
- Confirm the current branch and working-tree state before commits, merges, or
  pushes.
