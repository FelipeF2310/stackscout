# StackScout — Project Alignment

A single shared compass for everyone working on StackScout — Felipe, ChatGPT,
Claude, and any future agent. Read this before proposing or building anything.
Its job is to prevent three failure modes: **overbuilding**, **redoing
completed work**, and **misunderstanding the product direction**.

This is a durable orientation document, not a spec and not a backlog. When a
detail here goes stale, update it in a small docs PR rather than letting drift
accumulate.

_Last updated: 2026-07-15._

---

## 1. Product thesis

StackScout is **not** "AI search for GitHub repos."

StackScout is a **capability-first open-source ecosystem decision system**. It
helps a user understand:

- which repos/tools actually matter for what they're doing,
- how those tools relate to one another,
- what each tool is good for,
- when to avoid a tool,
- and how a tool could fit into a coherent stack.

The value is **decision support over an ecosystem**, organized around
capabilities — not a search box, and not generated prose. Repository discovery
is an important output, but it is not the organizing principle. Understanding
system composition is the point.

---

## 2. Core user jobs

StackScout should support three user situations:

1. **No formed project yet.** The user wants to discover useful repos, patterns,
   or possible stack directions — exploration before commitment.
2. **A project idea in hand.** The user wants the best repos/tools for that
   specific project, with reasoning.
3. **A specific repo in focus.** The user found or knows about a repo and wants
   to understand whether it's a missing puzzle piece: what it pairs with, what
   it replaces, what it complements, and when it's worth using.

Every feature should map back to one or more of these jobs. If it doesn't, it's
probably scope creep.

---

## 3. Core product model

The current, decided product model:

- **Capability** is the **primary product object** — a system requirement
  expressed as a named function (Authentication, Vector Storage, Document
  Parsing). Capability definitions are canonical and stable; which capabilities
  matter will vary by project.
- **Tools implement capabilities.** Existing Tool records are runtime-selectable
  implementations of one or more capabilities; a tool is not a capability.
- **Public repositories are evidence-bearing sources and possible implementation
  assets.** A repository is not automatically a Tool or a recommendation.
- **AI-builder skills help a builder or coding agent perform development work.**
  They are not runtime dependencies and must not occupy capability/tool slots in
  a selected product architecture.
- **Architectures / stacks** are collections of capabilities fulfilled by
  compatible, selected tools — with a rationale for why they fit.
- **Relationships** explain how tools interact: alternative-to, pairs-with /
  compatible-with, replaces, complements, avoid-with, commonly-used-with, etc.
  Relationship intelligence is a strategic asset, not a nicety.
- **Recommendations must be evidence-backed**, not just generated prose. Every
  recommendation should answer: why this, why not the alternatives, what
  tradeoffs, and under what circumstances to choose differently.

---

## 4. What StackScout is not

State this plainly to resist drift:

- **Not** a generic GitHub search wrapper.
- **Not** "ChatGPT over GitHub."
- **Not** a stars/popularity leaderboard. Popularity ≠ fit.
- **Not** an unreviewed agent that invents stack recommendations.
- **Not** a generic project-management planner.

---

## 5. Current completed milestones (current local `main`)

Already present in current branch history — **do not redo**:

- **Deterministic recommendation foundation** — capability detection → tool
  scoring → architecture generation → explanations, all deterministic.
- **Curated corpus module** — single interface for reading seed data.
- **Seed-based tool detail pages** — `/tools/[toolId]`, static/SSG from seed.
- **Capability detection evidence model** — `detectCapabilitiesWithEvidence()`
  with direct/inferred signal tagging and matched/assumed-floor origin.
- **Detection-transparency UI** — "How StackScout read your description":
  detected capabilities, direct evidence, inferred assumptions, fallback guess.
- **Capability data consolidation** — single source of truth established.
  - `capabilityTaxonomy.ts` is the canonical capability registry.
  - `tools.json` and `relationships.json` remain seed/corpus data.
  - `data/seed/capabilities.json` **removed** (was a duplicate).
- **Legacy results UI cleanup** — orphaned pre-workspace prompt/results
  components and their dead tests were removed; the live flow is the workspace.
- **Refinement-context activation** — the live workspace passes URL-backed
  refinement context into deterministic recommendations.
- **Capability-peer alternatives** — alternatives now fall back to
  same-capability peers when explicit alternative relationships are missing.
- **Focused RAG peer fit metadata** — `best_for` / `avoid_if` coverage was
  strengthened for the PDF/RAG document workflow slice.
- **Internal gated-access migration** — bare `internal → auth` detection was
  replaced by a narrow project-shape rule for internal software and content.
- **AI-grounding clarification v1** — unresolved AI prompts ask one
  deterministic, URL-backed grounding question before final recommendation
  selection; explicit source requirements bypass it.
- **Website frontend target precision** — external crawl/scrape targets no
  longer imply Frontend Framework, while explicitly built websites retain it.
- **Clarification-policy catalog** — question proposals now have a documented
  governance and evidence gate; this is documentation, not a runtime registry.
- **Capability-bound next-step guidance** — specialized document-RAG guidance
  requires the complete selected pipeline; partial stacks remain conservative.
- **Phase 1 decision-loop validation and final copy polish** — representative
  browser journeys passed and the workspace presents a clear review-ready state.

---

## 6. Current source-of-truth decisions

- `lib/capabilities/capabilityTaxonomy.ts` — **the canonical capability
  registry.** All capability identity, names, and categories come from here.
- `data/seed/tools.json` — the seed **tool** corpus.
- `data/seed/relationships.json` — the seed **relationship** corpus.
- `detectCapabilitiesWithEvidence()` — powers **detection transparency**
  (per-capability signals + origin).
- `detectCapabilities()` — remains the compatibility wrapper for callers that
  need only the initial capability list.
- `resolveWorkspaceRecommendation()` — resolves eligible URL-backed
  AI-grounding context before the workspace requests a final recommendation.
  Final selection remains deterministic and uses trusted structured data.
- **Tool detail pages are currently seed/static** (no live data).
- **Current trusted data:** the canonical capability taxonomy plus the curated
  seed corpus (`tools.json`, `relationships.json`). Runtime recommendations use
  this trusted structured data.
- **Not built:** repository or skill classification pilots, reviewed promotion,
  user-facing ecosystem discovery, live GitHub ingestion, database, auth,
  runtime LLMs, RAG, agents, paid features, and browser extensions.

---

## 7. Phased build discipline (the working rule)

This is how work happens on StackScout. It is not optional:

- **Plan first.** Audit and agree direction before writing code.
- **Build the smallest safe PR.**
- **Separate behavior changes from cleanup.** A behavior-preserving change and a
  cleanup/deletion belong in different PRs.
- **Don't mix concerns** — UI, data model, recommendation logic, and docs stay
  in separate PRs unless genuinely inseparable.
- **Park future ideas** instead of expanding the current PR.
- **Don't spend tokens or engineering time** on work not needed for the current
  phase.
- **If a topic matters later, document it as deferred** — don't build it now.

When in doubt: narrower PR, explicit deferral, ask before expanding scope.

Use Matty's skills where they help: TypeScript correctness, focused test quality,
schema design, safe refactor discipline, and review rigor.

---

## 8. Deferred / revisit items (parked — not in progress)

These are intentionally **not** built. Listed so they aren't re-proposed as new
or accidentally started:

- Generate or auto-sync `docs/CAPABILITY_TAXONOMY.md` from the canonical
  TypeScript taxonomy (later optional pass).
- Review the **10-character input gate** / short low-signal prompt behavior
  (should very short prompts show the assumed-floor state or nothing?).
- **Stack Map** artifact (capability-first ecosystem view).
- **Templates as a classified ecosystem asset type** — deferred until the
  classification contract demonstrates a need.
- **Outcome memory / feedback loop.**
- **RAG / retrieval layer.**
- **Paid version** — deferred until the free product proves value.
- **Browser extension** — deferred until the core audit/report artifact is useful.
- **ECC** (introduce later, when agent workflows become heavier).
- Cleanup of the leftover local `docs/ux-flow-findings` branch and untracked
  design/skill files, when useful.

---

## 9. Repo memory principle

The governing principle for any future ecosystem-learning work:

> **Agents propose. StackScout stores reviewed knowledge. Runtime
> recommendations use trusted structured data.**

Agents (or ingestion pipelines) may *suggest* facts about the ecosystem, but
StackScout only *stores* knowledge that has been reviewed, and runtime
recommendations only draw on **trusted, structured** data — never raw,
unreviewed model output.

Phase 2 planning applies this principle first to vetted public repositories and
AI-builder skills. Public ecosystem classification is distinct from a user
connecting, importing, or uploading their own repository; that is not part of
the phase. Future reviewed ecosystem knowledge may capture:

- repo metadata,
- AI-builder-skill metadata,
- capability mappings,
- the relationship graph,
- evidence references,
- review status,
- user outcomes,
- freshness / maintenance signals.

**None of this Phase 2 ecosystem work is implemented yet.** Agents may only
produce future structured proposals; raw agent or repository output cannot
influence runtime recommendations.

---

## 10. Current roadmap

Current product direction is **free product first**. Paid plans and browser
extensions are deferred until the free architecture-advisor experience proves
value and the core audit/report artifact is useful.

The canonical product and phase sequence lives in
[`PRODUCT_ROADMAP.md`](./PRODUCT_ROADMAP.md). The short active execution queue
lives in [`NEXT_STEPS.md`](./NEXT_STEPS.md). Clarification-question governance
lives in
[`CLARIFICATION_POLICY_CATALOG.md`](./CLARIFICATION_POLICY_CATALOG.md).
Phase 1 is complete: the Architecture Advisor decision loop passed
representative browser validation, including AI-grounding, website target
precision, capability-bound next-step guidance, stale-context handling, and
final workspace copy.

The next strategic phase is **Phase 2 — Architecture-directed repository and
AI-builder skill discovery**. It is organized around capabilities and an
emerging architecture, not around a GitHub search box:

1. **2A — Classification contract and review governance.** Documentation only;
   it authorizes no pilot or implementation.
2. **2B — Offline public-repository classification pilot.** Future public-source
   proposal work whose output remains untrusted and external to runtime data.
3. **2C — Offline AI-builder-skill classification pilot.** Future separate work,
   gated by 2B findings rather than started in parallel.
4. **2D — Explicit human-reviewed corpus promotion.** Future, separately scoped
   promotion of accepted structured knowledge.
5. **2E — User-facing architecture-directed discovery.** Future discovery over
   reviewed knowledge only.

This sequencing does not authorize GitHub API access, ingestion, agent workers,
runtime integration, database or persistence, seed-data changes, or changes to
the deterministic recommender. Templates remain deferred. Existing-product /
missing-piece guidance moves to Phase 3 and continues to use only current tools
and constraints described by the builder—never repository upload, connection,
or automatic inspection.

Still parked (not the current focus):

- **Ambiguous detector policies** (`support`, `requests`, `track`, `data`) and
  broader AI interaction-mode policy work — independently deferred unless review
  evidence demonstrates user harm. The completed `websites → Frontend Framework`
  target-context correction remains a separate narrow precision slice, not a
  precedent for a generic cleanup program.

This document does **not** prescribe implementation. Each phase gets its own
planning pass, then the smallest safe PR — per the phased discipline above.
