# StackScout — Project Alignment

A single shared compass for everyone working on StackScout — Felipe, ChatGPT,
Claude, and any future agent. Read this before proposing or building anything.
Its job is to prevent three failure modes: **overbuilding**, **redoing
completed work**, and **misunderstanding the product direction**.

This is a durable orientation document, not a spec and not a backlog. When a
detail here goes stale, update it in a small docs PR rather than letting drift
accumulate.

_Last updated: 2026-06-29._

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
- **Tools / repos implement capabilities.** A tool is not a capability; it is an
  implementation of one or more.
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

---

## 6. Current source-of-truth decisions

- `lib/capabilities/capabilityTaxonomy.ts` — **the canonical capability
  registry.** All capability identity, names, and categories come from here.
- `data/seed/tools.json` — the seed **tool** corpus.
- `data/seed/relationships.json` — the seed **relationship** corpus.
- `detectCapabilitiesWithEvidence()` — powers **detection transparency**
  (per-capability signals + origin).
- `detectCapabilities()` — remains the **compatibility wrapper** that drives
  recommendation behavior; output is unchanged from before the evidence model.
- **Tool detail pages are currently seed/static** (no live data).
- **Current trusted data:** the canonical capability taxonomy plus the curated
  seed corpus (`tools.json`, `relationships.json`). Runtime recommendations use
  this trusted structured data.
- **Deferred (not built):** live GitHub ingestion, database, auth, runtime LLMs,
  RAG, agents, paid features, and browser extensions.

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
- **Repo memory / ecosystem learning** architecture.
- **Outcome memory / feedback loop.**
- **Evidence objects** (first-class, referenceable evidence).
- **Agent-assisted ingestion.**
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

When repo memory / ecosystem learning is eventually built, it should capture:

- repo metadata,
- capability mappings,
- the relationship graph,
- evidence references,
- review status,
- user outcomes,
- freshness / maintenance signals.

**None of this is implemented yet.** This section describes the intended shape,
not current state.

---

## 10. Current roadmap

Current product direction is **free product first**. Paid plans and browser
extensions are deferred until the free architecture-advisor experience proves
value and the core audit/report artifact is useful.

Completed recommendation-foundation slices on `main`: URL-backed refinement
context, capability-peer alternatives, focused RAG peer `best_for` / `avoid_if`
metadata, the realtime-collaboration capability slice, scheduling fit metadata,
detector boundary-matching hardening, and the project-shape inference first
slice.

Near-term PR order:

1. **Default next product PR: `internal → auth` migration (plan first).**
   Replace the bare `internal → auth` detector keyword with a deliberate
   project-shape rule using the `requires` co-occurrence machinery — details
   and required prompt behavior in [`NEXT_STEPS.md`](./NEXT_STEPS.md).
2. **Improve scoring structure only if proven necessary** — for example
   `primary_capability` or per-capability tool role, only after recommendation
   review shows concrete wrong-winner evidence.
3. **Design evidence/audit/report schemas later.** Do not start this until the
   recommendation foundation is stronger.
4. **Add RAG/self-learning later still**, only after evidence objects and review
   boundaries exist.

Still parked (not the current focus):

- **Repo memory / ecosystem learning** architecture — design captured in
  [`REPO_MEMORY_AND_LEARNING.md`](./REPO_MEMORY_AND_LEARNING.md), not implemented.
- **Soft-trigger keyword review** (`support`, `requests`, `websites`, `track`,
  `data`) — after the `internal → auth` migration, once shape rules can take
  over the principled cases.

This document does **not** prescribe implementation. Each phase gets its own
planning pass, then the smallest safe PR — per the phased discipline above.
