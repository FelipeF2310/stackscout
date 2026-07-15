# StackScout — Repo Memory & Ecosystem Learning (Architecture, Planning Only)

**This is a planning document. Nothing here is implemented.** It defines the
*future* shape of StackScout's repo memory and ecosystem learning so that, when
the time comes, implementation is deliberate, phased, and small — not a rush to
bolt agents and RAG onto the product.

The canonical phase sequence lives in
[`PRODUCT_ROADMAP.md`](./PRODUCT_ROADMAP.md), with durable product constraints in
[`STACKSCOUT_PROJECT_ALIGNMENT.md`](./STACKSCOUT_PROJECT_ALIGNMENT.md). This
document owns future trust and agent architecture, not active sequencing. Where
it disagrees with either canonical document, this document should be corrected.

**Core thesis.** StackScout should not become "ChatGPT over GitHub." It should
become a **structured open-source decision system** that *remembers* tools,
capabilities, relationships, evidence, outcomes, freshness, and review status —
and recommends from trusted, reviewed, structured data rather than from raw model
output.

**The user jobs this memory must serve** (from the compass):

1. **Discover** useful repos, patterns, or stack directions *before* having a
   fully formed project.
2. **Find** the best repos/tools for a project being built.
3. **Evaluate** a specific repo — is it a missing puzzle piece, what does it pair
   with, what does it replace, and when is it worth using?

_Last updated: 2026-07-15._

---

## 1. Purpose

Why this document exists:

- To **define future repo memory** before any of it is built.
- To **avoid overbuilding** — to keep agents, RAG, and a database from being
  introduced before the structured core justifies them.
- To **prevent agents/RAG from becoming the product brain too early.** The brain
  is reviewed, structured knowledge; agents and retrieval are support systems.
- To **guide later implementation phases** so each one is a small, reviewable PR
  with a clear job.
- To preserve the durable trust boundary without duplicating the separate future
  ecosystem asset classification contract.

This document grants **no** permission to start building. It is a map, not a
work order.

---

## 2. Guiding principle

> **Agents propose.**
> **StackScout stores reviewed knowledge.**
> **Runtime recommendations use trusted structured data.**

In practice:

- **Agents (and ingestion pipelines) propose.** They may read repos, READMEs, and
  metadata and *suggest* structured facts — a capability mapping, a relationship,
  a risk signal. Proposals are candidates, not truth.
- **StackScout stores reviewed knowledge.** A proposal becomes part of StackScout's
  memory only after it passes an explicit review path. Phase 2 requires explicit
  human review before promotion. Any later automated approval would require its
  own reviewed policy and evidence. Promotion is the boundary between "a model
  said so" and "StackScout knows."
- **Runtime recommendations use trusted structured data.** The live recommender
  reads only reviewed, structured records — never raw model output at request
  time. This keeps recommendations deterministic, explainable, and accountable.

This principle is the spine of everything below. If a future design violates it
(e.g. an agent that silently writes to the trusted corpus, or a recommender that
calls an LLM to invent a stack), the design is wrong.

---

## 3. What StackScout should remember

Future memory categories (none implemented yet):

- **Public repository metadata** — identity, language/ecosystem, license,
  description, links, freshness, and review state. A repository is not
  automatically a Tool or recommendation.
- **Tool metadata** — the existing runtime-selectable implementations of
  capabilities.
- **AI-builder-skill metadata** — development assistance for a builder or coding
  agent, never a runtime dependency or capability/tool slot.
- **Capability mappings** — which capabilities a tool implements. (Capabilities
  themselves stay canonical in `lib/capabilities/capabilityTaxonomy.ts`.)
- **Relationship graph** — typed, directional links between tools (see §4).
- **Evidence references** — pointers backing a claim (see §6).
- **Review status** — the trust state of each record (see §10).
- **User outcomes** — what happened after a recommendation (see §5).
- **Freshness & maintenance signals** — release cadence, issue activity, last
  commit, deprecation notices.
- **User / project context patterns** — recurring project shapes and the stacks
  that fit them, to power discovery (job #1) and better matching (job #2).

Each category should be **structured and queryable**, with provenance and a
review state — not free-text blobs.

Phase 2 begins with public repositories and AI-builder skills as distinct asset
types. Templates remain deferred. A separate future ecosystem asset
classification contract will define repository and skill boundaries, asset
identity, claim types, evidence/provenance/freshness fields, proposal lifecycle,
pilot rubrics, and promotion criteria. This document does not define those
details.

---

## 4. Relationship memory

Relationships are **structured data, not prose.** A relationship is a typed,
directional, evidence-able record between two tools — the asset that lets
StackScout answer "what pairs with this," "what replaces this," "what to avoid
together."

Relationship types to support (illustrative, not final):

- `alternative_to` — solves the same capability a different way.
- `pairs_with` — commonly and cleanly used together.
- `replaces` — supersedes / is a newer answer to the same need.
- `extends` — builds on top of another tool.
- `depends_on` — requires another tool to function.
- `complements` — adds value alongside, different capability.
- `avoid_with` — known friction / redundancy / conflict when combined.
- `migration_path` — a supported route from one tool to another.

Each relationship record should eventually carry: type, direction, a confidence
or review state, and one or more evidence references (§6).

> **Source-of-truth note (important):** Do **not** introduce a new canonical
> `relationships.ts` yet. Relationships remain **seed/corpus data** in
> `data/seed/relationships.json`, read through the corpus module. A move to a
> database is a *later* phase, not part of this document's mandate. This mirrors
> the capability-consolidation discipline: decide the source of truth
> deliberately, change it in its own small PR.

---

## 5. Outcome / feedback memory

How StackScout could eventually learn whether a recommendation actually worked.
**Not implemented — design only.**

Possible outcome states (what the user did with the recommended stack):

- `used_as_recommended`
- `modified_slightly`
- `replaced_one_tool`
- `replaced_multiple_tools`
- `abandoned`

Possible reason codes (why a tool was changed or dropped):

- `setup_too_hard`
- `docs_poor`
- `wrong_language`
- `too_enterprise`
- `not_maintained`
- `missing_feature`
- `better_alternative_found`
- `cost_issue`
- `license_issue`

Outcome memory feeds back as *evidence* and as a context-pattern signal — it does
**not** auto-mutate recommendations. A pattern of `not_maintained` outcomes
becomes a reviewed maintenance signal, not a silent score change. **Do not
implement this yet.**

---

## 6. Evidence objects

Why evidence matters: a recommendation StackScout can't back up is just prose. The
product's promise is *evidence-backed* decisions — every claim should be able to
point at something.

Future recommendations should be able to reference:

- **README sections** — what the project says it is / how to start.
- **Docs pages** — depth and quality of documentation.
- **GitHub metadata** — language, license, topics.
- **Release activity** — cadence, recency.
- **Issue activity** — responsiveness, open/closed patterns.
- **Human notes** — curator/reviewer annotations.
- **Outcome patterns** — aggregated user outcomes (§5).

Evidence objects should be **first-class and referenceable**: a recommendation
claim ("recommended for your context"), a tradeoff, a maintenance signal, or a
relationship should each be able to attach one or more evidence references with
provenance and a review state. Evidence supports claims; it does not replace the
deterministic logic that makes them.

---

## 7. Agent-assisted ingestion

Agents are **enrichment workers, not authorities.** Their role is to widen and
deepen the corpus by *proposing* structured updates for review — never to be the
runtime brain.

Illustrative future workers:

- **RepoMetadataWorker** — fetches and normalizes repo metadata.
- **ReadmeUnderstandingWorker** — extracts purpose / setup / claims from READMEs.
- **CapabilityClassifierWorker** — proposes capability mappings for a tool.
- **RelationshipProposalWorker** — proposes typed relationships between tools.
- **RiskSignalWorker** — proposes maintenance / risk / freshness signals.
- **EvidenceValidatorWorker** — checks that proposed evidence references resolve
  and support their claim.

> **Boundary (non-negotiable):** Agents **propose structured updates**. They do
> **not** silently change trusted corpus data. Every proposal enters a review
> path (§10) before it can influence runtime recommendations. This is the
> guiding principle (§2) made concrete.

---

## 8. RAG / retrieval layer

RAG, if and when added, **retrieves evidence for decisions — it does not replace
the recommender.** The deterministic recommender stays in charge of *what* to
recommend; retrieval helps *surface and justify* with the right evidence and
context.

Future retrieval may combine:

- keyword matching,
- vector search,
- capability filters,
- relationship-graph traversal,
- freshness filters,
- outcome memory,
- review-status filters (trusted records only).

The output of retrieval is **evidence and candidates fed into structured logic**,
not a free-form answer shown to the user. **Do not implement RAG yet.**

---

## 9. Runtime recommendation tiers

A possible tiered model for how a request is served. The advanced retrieval and
curated tiers describe future architecture; current runtime remains
deterministic, with one narrowly governed AI-grounding clarification before
recommendation when eligible:

- **Tier 1 — Deterministic recommendation.** The default. Capability detection →
  scoring → architecture → explanation, from trusted structured data. Fast,
  explainable, accountable.
- **Tier 2 — Clarifying question.** One deterministic AI-grounding clarification
  is implemented for a narrowly governed ambiguity. Further questions require
  promotion through the clarification-policy catalog; this is not a generic
  clarification engine.
- **Tier 3 — Agentic retrieval.** For ambiguous / high-complexity prompts, use
  retrieval (§8) over trusted memory to assemble candidates and evidence — still
  feeding the deterministic recommender, not bypassing it.
- **Tier 4 — Human-reviewed / curated mode.** For high-trust recommendations,
  serve curated, human-reviewed stacks.

Tiers escalate only as needed; most requests should resolve at Tier 1.

---

## 10. Human review / trust boundaries

Every memory record carries a **review state**, and trust should be **visible in
the product** so users know how solid a claim is.

Review states (illustrative):

- `machine_extracted` — pulled directly from a source (e.g. a README field).
- `machine_inferred` — proposed by an agent's reasoning, not directly stated.
- `human_reviewed` — checked and accepted by a person.
- `disputed` — flagged as questionable / conflicting.
- `deprecated` — once true, no longer trusted.

During Phase 2, `machine_extracted` and `machine_inferred` are proposal states,
not runtime truth. Only explicitly human-reviewed, promoted structured records
may influence runtime recommendations; `disputed` and `deprecated` records remain
excluded. Surfacing trust ("human-reviewed" vs "inferred") in future discovery is
part of the product's honesty, consistent with confidence ≠ correctness.

---

## 11. What is **not** implemented yet

To prevent any of this being mistaken for current state — none of the following
exists:

- **No database.**
- **No RAG / retrieval layer.**
- **No runtime agents.**
- **No GitHub ingestion.**
- **No outcome tracking.**
- **No feedback memory.**
- **No review queue.**
- **No agentic recommendation loop.**

Current reality: deterministic recommendations over a curated seed corpus, with
the canonical capability taxonomy and a seed relationship graph. That's it.

---

## 12. Approved Phase 2 sequence

Phase 1's Architecture Advisor decision loop is complete. The canonical roadmap
now places architecture-directed public repository and AI-builder-skill discovery
in Phase 2, with this sequence:

1. **2A — Classification contract and review governance.** A separate planning
   document defines the asset and trust contract; it authorizes no pilot.
2. **2B — Offline public-repository classification pilot.** Public-source
   proposals remain external, untrusted, and unable to affect runtime data.
3. **2C — Offline AI-builder-skill classification pilot.** This is gated by 2B
   findings and requires a separate scope; it does not start in parallel.
4. **2D — Explicit human-reviewed corpus promotion.** Only accepted structured
   records cross the trusted runtime boundary.
5. **2E — User-facing architecture-directed discovery.** Discovery uses reviewed
   knowledge and remains organized by required capabilities and the emerging
   architecture.

The future classification contract, not this document, will own repository and
skill definitions, asset identity, claim types, evidence/provenance/freshness
fields, proposal lifecycle, pilot rubrics, and promotion criteria. Each substage
requires its own approval and scope. This sequence does not authorize a pilot,
GitHub API access, ingestion, agent workers, corpus changes, runtime integration,
or user-facing discovery.

Database storage, runtime RAG, autonomous behavior, broad automated discovery,
and user repository connection remain deferred. Skipping the review and promotion
boundary is the failure mode this document exists to prevent.

---

## 13. Build discipline

Reinforcing the project working rule (from the alignment compass):

- **This document is not permission to build everything now.** It is a plan.
- **Future implementation happens in small PRs** — one clear job each.
- **Keep concerns separated** — behavior changes, data-model changes, UI, and docs
  belong in different PRs unless genuinely inseparable.
- **Defer anything not needed for the current phase.** Park it as a documented
  item rather than expanding the active PR.

Each approved substage gets its own planning pass first — then the smallest safe
PR.
