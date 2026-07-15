# StackScout Product Roadmap

This is the canonical product and phase roadmap. It defines the outcomes each
phase must prove and the boundaries that keep StackScout focused. See
[`NEXT_STEPS.md`](./NEXT_STEPS.md) for the short active execution queue.

The PRD describes the long-term vision. Repo-memory and ecosystem-learning
documents describe future architecture. Neither is an active implementation
queue.

## Product north star

> Help builders move from an idea or an existing stack to an
> implementation-ready architecture they understand and can revise.

## Product model

StackScout is capability-first decision support:

- A capability describes what the product must do.
- Tools implement capabilities; they are not the primary organizing object.
- Architectures combine capabilities with compatible selected tools and
  explain the tradeoffs.
- Trusted, structured capability, tool, and relationship data determines final
  recommendations.
- Future AI may help interpret intent and choose from approved clarification
  policies. It must not invent final stack decisions or treat unreviewed output
  as trusted product knowledge.

The product is an architecture decision loop:

1. Understand the builder's idea or current stack conservatively.
2. Detect an initial capability hypothesis.
3. Ask zero to two targeted, decision-changing questions only when needed.
4. Recommend from trusted, structured capability and tool data.
5. Explain, compare, and let the builder revise the decision.

The detector supplies the initial hypothesis. It is not StackScout's complete
understanding system and should not become an endless keyword-cleanup project.

## Three user jobs

1. **Explore before a project is formed.** Discover useful capabilities, stack
   patterns, and possible directions without pretending a decision is final.
2. **Turn a project idea into an architecture.** Identify required
   capabilities, recommend compatible tools, and explain why the stack fits.
3. **Evaluate a known tool or current stack.** Understand whether it is a
   missing puzzle piece, what it pairs with or replaces, and when it fits.

## Current product status

StackScout is a deterministic, seed-based architecture advisor. It detects
capability evidence, applies narrow project-shape inference, recommends from a
curated structured corpus, and renders an Architecture Brief. Material decisions
and refinement context are URL-backed, visible, and editable; the resulting
Brief is revisable through those decisions.

AI-grounding clarification v1 is complete and merged. It asks one deterministic
question only when an AI product's source-grounding decision remains unresolved.
Website frontend target precision is also complete: external crawl/scrape targets
no longer imply a frontend product, while explicitly built websites retain
Frontend Framework. Phase 1 decision-loop validation is complete: representative
browser journeys passed, capability-bound next-step guidance is in place, and
the final workspace review copy is clear.

[`CLARIFICATION_POLICY_CATALOG.md`](./CLARIFICATION_POLICY_CATALOG.md) governs
when an ambiguity warrants a question, precision correction, conservative
default, or deferral.

There is no live LLM, persistence, database, GitHub ingestion, repository
inspection, runtime agent, or autonomous recommendation loop.

## Decision-loop UX contract

- Render the Architecture Brief immediately for unambiguous prompts.
- Ask one question at a time only when the answer materially changes the
  architecture.
- Normally ask zero or one question. Never ask more than two without
  demonstrated user value.
- Always offer a visible **not sure / sensible default** choice.
- Treat explicit user requirements as authoritative and bypass questions they
  already answer.
- Keep material decisions and refinement context URL-backed, visible, and
  editable; label answers as user-confirmed.
- Keep final recommendations deterministic, evidence-backed, and explainable.
  Keep the resulting Brief revisable through those decisions.
- Do not ask questions that merely confirm a generic implementation fact.

## Roadmap phases

### Phase 1 — Architecture Advisor decision loop (completed)

**User outcome:** A builder can move from a project idea to a coherent,
understandable Architecture Brief with minimal friction and revise the decisions
that materially affect the stack.

**Completed scope:**

- Validated the decision-loop UX contract against the review corpus and
  representative browser journeys.
- AI-grounding clarification v1 — **completed**.
- `websites → Frontend Framework` target precision — **completed** as a narrow
  detector correction for external crawl targets, not a clarification question
  or a generic keyword cleanup.
- Capability-bound Architecture Brief next-step guidance and final workspace
  review copy — **completed**.
- Keep `support`, `requests`, `track`, and `data` as independent deferred
  policies unless evidence demonstrates user harm.
- Use the clarification-policy catalog as the governance gate before planning
  another question vertical. A candidate must satisfy its evidence gate before
  promotion; the catalog does not authorize implementation.
- Improve explanation, comparison, and revision only where review evidence
  shows the decision loop is unclear or unhelpful.

**Explicit non-goals:**

- An open-ended keyword-cleanup program.
- A generic clarification engine or long intake flow.
- Live AI interpretation, repository inspection, persistence, ingestion, or
  autonomous stack selection.
- Scoring changes without a demonstrated wrong-winner case.

**Exit criteria:**

- The review corpus and representative journeys satisfy the decision-loop UX
  contract.
- Clarification remains exceptional, bounded, and materially useful.
- Builders can understand the evidence, selected tools, tradeoffs, and
  alternatives, then revise the material decisions and refinement context that
  produce the Brief.
- The phase has a clear stop; detector precision work does not become the
  product roadmap.

These exit criteria have been met. Later evidence may justify a separate Phase 1
correction, but Phase 1 is no longer an open-ended active phase.

### Phase 2 — Architecture-directed repository and AI-builder skill discovery

**User outcome:** A builder can discover vetted public repositories and
AI-builder skills that fit required capabilities and their emerging
architecture, with understandable fit, tradeoffs, relationships, evidence,
freshness, and review status.

**In scope:**

- Keep Capability as the primary organizing object and existing Tool records as
  runtime-selectable implementations of capabilities.
- Treat a public Repository as an evidence-bearing source and possible
  implementation asset, not automatically as a Tool or recommendation.
- Treat an AI-builder skill as help for a builder or coding agent, not as a
  runtime dependency or a capability/tool slot in the selected architecture.
- **2A — Classification contract and review governance:** a separate
  governance-only document defining the boundaries required before any pilot.
- **2B — Offline public-repository classification pilot:** future, fixed-scope,
  public-source proposal work whose output remains untrusted and outside the
  runtime corpus.
- **2C — Offline AI-builder-skill classification pilot:** future, separate
  public-source proposal work that starts only if 2B findings justify it.
- **2D — Explicit human-reviewed corpus promotion:** a future, separately
  scoped path for accepted structured knowledge; agents never write directly to
  trusted data.
- **2E — User-facing architecture-directed discovery:** future discovery over
  reviewed knowledge only, after 2D establishes an explicit promotion path.

**Explicit non-goals:**

- Generic GitHub search, popularity-led recommendations, or broad crawling as a
  success metric.
- User repository upload, connection, import, automatic inspection, or private
  repository access.
- Raw repository content, raw model output, or unreviewed proposals influencing
  runtime recommendations.
- Templates as an approved Phase 2 asset type; they remain deferred until the
  classification contract demonstrates a need.
- Runtime agents, runtime RAG, database or persistence implementation, or
  changes to the current deterministic recommender.
- Treating this roadmap as authorization for a pilot, GitHub API access,
  ingestion worker, corpus change, or user-facing implementation.

**Exit criteria:**

- The classification contract and review governance are approved before any
  pilot begins.
- Separate offline repository and skill pilots, if authorized, demonstrate
  useful evidence-backed proposals without touching trusted runtime data.
- Every promoted record crosses an explicit human-review boundary with
  provenance, freshness, and review status intact.
- Representative journeys show that reviewed discovery improves architecture
  decisions without becoming generic search or silently changing final stack
  selection.
- Deterministic recommendation behavior and fallback remain trustworthy.

### Phase 3 — Existing-product / missing-piece mode

**User outcome:** A builder can describe a current stack or known tool and
receive capability-first guidance about what is missing, redundant, compatible,
or worth replacing.

**In scope:**

- User-described current tools, constraints, and missing capabilities.
- Comparison against the same trusted structured corpus and relationship graph.
- Clear distinction between known user-provided context and StackScout's
  recommendations.

**Explicit non-goals:**

- Repository upload or automatic repository inspection.
- GitHub connection, ingestion, persistence, or background synchronization.
- Treating a named tool as complete evidence about the user's implementation.

**Exit criteria:**

- Representative current-stack journeys produce useful missing-piece decisions.
- Recommendations explain keep, add, replace, and avoid decisions without
  requiring repository access.
- The mode demonstrates distinct value beyond the project-idea flow.

### Phase 4 — Decision artifact and usefulness validation

**User outcome:** A builder can use the Architecture Brief as a durable decision
artifact and StackScout can validate whether the advice remains useful.

**In scope:**

- Define the minimum useful decision artifact and review/export experience.
- Validate usefulness through explicit, consented feedback and representative
  user research before selecting storage architecture.
- Define outcome language and success measures before collecting outcome data.

**Explicit non-goals:**

- Assuming persistence, accounts, sharing, or outcome tracking before the
  artifact proves useful.
- Automated score changes from unreviewed feedback.
- Team workflow or project-management features.

**Exit criteria:**

- Builders repeatedly use or reference the artifact during implementation.
- The product has evidence for which decisions and explanations remain useful.
- Any persistence or outcome-data proposal has a separate reviewed scope and
  trust model.

### Phase 5 — Assisted intelligence at scale

**User outcome:** Larger-scale assistance reduces interpretation and curation
effort while StackScout remains accountable for every final recommendation.

**In scope:**

- Larger-scale propose-only workflows after Phase 2 proves the review boundary.
- Retrieval over trusted evidence only when reviewed knowledge and product
  evidence justify it.
- AI-assisted intent interpretation within approved product policies.
- Grounded explanations that remain subordinate to structured decisions.

**Explicit non-goals:**

- An agent that invents or silently approves final stacks.
- Raw model output as authoritative tool, score, relationship, or capability
  data.
- Bypassing review boundaries for speed or coverage.
- Removing deterministic fallback behavior.

**Exit criteria:**

- Assistance improves measured decision quality or operating efficiency.
- Every influential fact and recommendation remains traceable to trusted data
  and explicit policy.
- Deterministic fallback behavior remains available and trustworthy.

## Roadmap governance

- This file owns strategic phase direction and exit criteria.
- `NEXT_STEPS.md` owns the short active execution queue.
- `CLARIFICATION_POLICY_CATALOG.md` governs whether an ambiguity warrants a
  question, precision correction, conservative default, or deferral.
- `STACKSCOUT_PROJECT_ALIGNMENT.md` owns the durable thesis and build discipline.
- `ARCHITECTURE.md` describes implemented technical reality.
- `PRD.md` remains long-term product vision, not the active queue.
- Future-planning documents do not authorize implementation by themselves.
