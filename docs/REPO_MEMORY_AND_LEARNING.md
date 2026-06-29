# StackScout — Repo Memory & Ecosystem Learning (Architecture, Planning Only)

**This is a planning document. Nothing here is implemented.** It defines the
*future* shape of StackScout's repo memory and ecosystem learning so that, when
the time comes, implementation is deliberate, phased, and small — not a rush to
bolt agents and RAG onto the product.

Governing compass: [`docs/STACKSCOUT_PROJECT_ALIGNMENT.md`](./STACKSCOUT_PROJECT_ALIGNMENT.md).
Where this document and the alignment compass appear to disagree, the compass
wins and this document should be corrected.

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

_Last updated: 2026-06-29._

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
  memory only after it passes an explicit review path. Early on, this should mean
  human review or tightly scoped validation; automated approval should be
  introduced only when the rules are clear and tested. Storage is the boundary
  between "a model said so" and "StackScout knows."
- **Runtime recommendations use trusted structured data.** The live recommender
  reads only reviewed, structured records — never raw model output at request
  time. This keeps recommendations deterministic, explainable, and accountable.

This principle is the spine of everything below. If a future design violates it
(e.g. an agent that silently writes to the trusted corpus, or a recommender that
calls an LLM to invent a stack), the design is wrong.

---

## 3. What StackScout should remember

Future memory categories (none implemented yet):

- **Repo / tool metadata** — name, repository, language/ecosystem, license,
  description, links.
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

A possible **future** tiered model for how a request is served. This describes
future architecture, **not current behavior** (today is Tier 1 only):

- **Tier 1 — Deterministic recommendation.** The default. Capability detection →
  scoring → architecture → explanation, from trusted structured data. Fast,
  explainable, accountable.
- **Tier 2 — Clarifying question.** When context is ambiguous, ask a targeted
  question before recommending. This builds on the transparency layer, but is not
  implemented yet.
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

Runtime recommendations should prefer `human_reviewed` and `machine_extracted`
data, treat `machine_inferred` with appropriate caution, and exclude `disputed` /
`deprecated`. Surfacing trust ("human-reviewed" vs "inferred") in the UI is part
of the product's honesty, consistent with confidence ≠ correctness.

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

## 12. Recommended future phases

A phased path, smallest-justifiable-step first (each its own planning + PR cycle):

The free recommendation foundation has recently been strengthened in local
`main` by activating refinement context, improving alternatives from capability
peers, and backfilling focused `best_for` / `avoid_if` metadata. Continue with
deployment/runtime metadata next by default; improve scoring structure only if
recommendation review shows concrete wrong-winner evidence.

After that foundation:

1. **Define evidence/audit/report schemas** — design first, as docs; then small
   structural PRs.
2. **Define review boundaries** — make clear how proposed facts become trusted
   knowledge.
3. **Define the outcome model** — states + reason codes as a schema, before any
   collection.
4. **Add agent-assisted ingestion** — propose-only workers writing to a review
   path, once schemas and review boundaries exist.
5. **Add RAG** — retrieval over trusted memory to support (not replace) the
   recommender.
6. **Add selective agentic behavior** — Tier 3/4, only where ambiguity or trust
   needs justify it.

Earlier phases unlock later ones. Skipping ahead (e.g. agents before schemas, RAG
before evidence/review boundaries) is the failure mode this document exists to
prevent.

---

## 13. Build discipline

Reinforcing the project working rule (from the alignment compass):

- **This document is not permission to build everything now.** It is a plan.
- **Future implementation happens in small PRs** — one clear job each.
- **Keep concerns separated** — behavior changes, data-model changes, UI, and docs
  belong in different PRs unless genuinely inseparable.
- **Defer anything not needed for the current phase.** Park it as a documented
  item rather than expanding the active PR.

When the next phase is chosen, it gets its own planning pass first — then the
smallest safe PR.
