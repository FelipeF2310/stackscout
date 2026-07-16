# Architecture-Directed Discovery Product Contract

This document defines the minimum builder-facing Repository discovery result
for StackScout's first architecture-directed discovery experience. It is a
human-readable product contract, not a runtime schema, UI specification, API
plan, storage model, pilot plan, or implementation authorization.

## 1. Purpose, authority, and document boundaries

[`PRODUCT_ROADMAP.md`](./PRODUCT_ROADMAP.md) owns the Phase 2 outcome and
sequence. [`ECOSYSTEM_ASSET_CLASSIFICATION_CONTRACT.md`](./ECOSYSTEM_ASSET_CLASSIFICATION_CONTRACT.md)
owns asset identity, evidence, trust, review, and promotion boundaries. This
document owns the minimum builder-facing Repository discovery result and the
product requirements that Phase 2B must evaluate.

For the first Phase 2B evaluation, this contract applies only to public GitHub
Repositories; any public-source provider expansion requires a separate product,
security, and contract decision.

[`PHASE2B_REPOSITORY_CLASSIFICATION_PRE_EXECUTION_PLAN.md`](./PHASE2B_REPOSITORY_CLASSIFICATION_PRE_EXECUTION_PLAN.md)
owns pilot procedure and execution gates. Nothing here authorizes candidate-
nomination research, source access, corpus freezing, classification, promotion,
or Phase 2E implementation.

The product question is:

> Is this reviewed public Repository a useful, evidence-backed implementation
> aid for this specific architecture context?

It is not:

> Which stack should StackScout choose for me?

## 2. Trigger and architecture context

Discovery is a deliberate builder action after a final Architecture Brief
exists. The builder explores one named context:

- a required Capability;
- a selected Tool;
- an identified implementation gap; or
- a concrete implementation task.

The finalized architecture is an input to discovery. Discovery is never an
input back into deterministic architecture recommendation. It must not
interrupt idea intake, appear before the Brief, silently populate the Brief, or
alter selected Capabilities, Tool scoring, Tool selection, alternatives,
explanations, or recommendation ordering.

## 3. Minimum Repository discovery projection

A useful discovery result must communicate:

- **Asset type:** Repository, visibly distinct from a current Tool.
- **Identity:** provider-qualified identity, immutable revision when available,
  and reviewed rename, fork, mirror, or other lineage context.
- **Architecture context:** the named Capability, selected Tool, gap, or task
  that caused the Repository to surface.
- **Controlled relevance:** an evidence-backed explanation using approved non-
  runtime relevance language. Relevance does not mean runtime Capability
  fulfillment.
- **Qualified observations:** fit, prerequisites, limitations, and tradeoffs
  when the evidence supports them.
- **Claim-level evidence:** a reproducible locator, revision or version when
  available, observation date, and direct-extraction or inference label.
- **Trust context:** visible review state and freshness or observation state.
- **Honest uncertainty:** explicit unknowns, limitations, and abstentions.
- **Effect boundary:** a plain statement that the result does not modify the
  Architecture Brief or selected stack.

The first projection does not require popularity, stars, a global rank, a
runtime Capability mapping, a Tool ID, a current relationship-graph edge, or a
claim of production suitability.

Only explicitly reviewed and promoted records may appear in a future discovery
experience. A proposal or pilot result is not a discovery result.

## 4. Repository and Tool duplicate boundary

A Repository that merely backs a currently selected Tool is not a separate
discovery recommendation. It may later be exposed as source or provenance for
that Tool, but it must not be framed as a newly recommended implementation
asset.

A Repository may surface only when a separately reviewed, context-specific
implementation aid goes beyond the already-selected Tool relationship.
Multiple current Tools that share one Repository must not create duplicate
discovery results. Repository identity remains separate from Tool identity even
when the same source backs more than one Tool.

## 5. Honest no-result behavior

If no reviewed Repository meets the named architecture context and evidence
boundary, StackScout says that no reviewed implementation asset is available
yet.

It does not substitute generic GitHub search, popularity-led suggestions, raw
proposals, or unreviewed assets. An honest no-result is a valid outcome, not a
failure to hide.

## 6. Ordering and relationship boundaries

First discovery ordering is contextual and review- and evidence-led, not
popularity-led. This contract defines no numeric rank or scoring formula.

A relationship, integration, dependency, alternative, or extension claim may
appear only when it is reviewed, evidence-backed, and materially useful to the
named architecture context. Such a discovery claim does not create or modify a
current Tool relationship-graph edge.

## 7. Representative contract journeys

These journeys pressure-test the product contract without nominating real
Repositories.

### Helpful result

- **Architecture input:** A final Brief exists, and the builder deliberately
  explores a named implementation task or selected-Tool integration need.
- **Expected behavior:** StackScout surfaces a reviewed Repository with
  documented, relevant implementation support as optional assistance. The
  result shows why it is relevant, its evidence and review context, and its
  supported limitations.
- **User decision:** Decide whether the reviewed aid is worth inspecting for
  this task.
- **Prohibited behavior:** Do not replace the selected Tool, modify the stack,
  imply runtime Capability fulfillment, or present the Repository as a new
  architecture recommendation.

### Duplicate or suppressed result

- **Architecture input:** A final Brief selects a Tool whose backing Repository
  is known.
- **Expected behavior:** The backing Repository is suppressed as a separate
  discovery result. Its source may later appear as provenance for the selected
  Tool.
- **User decision:** No second decision is demanded for the same selected
  implementation.
- **Prohibited behavior:** Do not display the Repository as a redundant
  recommendation, create one result per Tool when multiple Tools share the
  source, or imply that source identity adds a new architecture choice.

### Honest no-result

- **Architecture input:** A final Brief exists, and the builder explores a named
  context for which no reviewed Repository meets the evidence and relevance
  boundary.
- **Expected behavior:** StackScout states that no reviewed implementation asset
  is available yet.
- **User decision:** Continue with the Architecture Brief without mistaking a
  weak suggestion for reviewed guidance.
- **Prohibited behavior:** Do not broaden into GitHub search, rank by popularity,
  expose raw proposals, or silently relax evidence and review requirements.

## 8. Usefulness and failure criteria

The contract is coherent when a result helps a builder decide whether to
inspect an optional, reviewed implementation aid for a specific architecture
context while preserving why it is shown and what it does not change.

The contract fails when discovery:

- behaves like generic repository search;
- duplicates a selected Tool and its backing Repository;
- shows unexplained or unsupported relevance;
- hides evidence, observation, freshness, or review state;
- substitutes popularity or unreviewed output for an honest no-result; or
- changes or appears to change the final stack.

These journeys pressure-test design coherence only. Later user-facing
validation is required to demonstrate actual builder usefulness.

## 9. Minimum Phase 2B proposal output

For this first discovery projection, the Phase 2B repository pilot must test
whether a proposal can produce, or correctly abstain from producing:

- Repository identity and lineage;
- evidence locators and direct-extraction or inference labels;
- the Repository-versus-current-Tool distinction;
- relevance to a fixed, named architecture context using approved non-runtime
  language;
- qualified fit, prerequisite, limitation, and tradeoff observations when
  evidence supports them;
- source-relationship information needed to identify a duplicate or suppression
  case;
- observation, freshness, and review-ready status information; and
- explicit unknowns and abstentions.

The named architecture context is an evaluation input, not a conclusion that an
agent invents from a Repository in isolation. Unsupported claims must be absent
or explicitly abstained from. These requirements define human-readable pilot
expectations, not a schema, trusted record, promotion, or runtime mapping.

Pilot success may show that these outputs are reproducible and reviewable. It
cannot prove user value or authorize user-facing discovery.

## 10. Explicit deferrals

The following remain separately deferred:

- user-facing discovery UI implementation;
- runtime entities, schemas, APIs, persistence, or ingestion;
- GitHub access or search;
- candidate nominations and corpus selection;
- source acquisition and classification execution;
- AI-builder Skill and Template discovery;
- current Tool corpus or relationship-graph changes;
- runtime ranking, scoring, or recommendation changes;
- private or user-connected repositories; and
- claims of ecosystem completeness or proven user value.

Deferral is not authorization. Each later activity must follow the roadmap,
classification contract, and applicable Phase 2B execution gate.
