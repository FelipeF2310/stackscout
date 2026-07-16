# Phase 2B Repository Classification Pre-Execution Plan

This is a pre-execution planning artifact for one future offline evaluation of
public GitHub Repository classification. It follows
[`ECOSYSTEM_ASSET_CLASSIFICATION_CONTRACT.md`](./ECOSYSTEM_ASSET_CLASSIFICATION_CONTRACT.md),
which remains authoritative for asset, evidence, review, and promotion
boundaries.

This document is not the executable Phase 2B pilot plan described by the
classification contract. It does not name an exact contract version, frozen
corpus, immutable revisions, evidence-bundle contents, agent configuration,
external workspace, retention policy, or run scope.

## 1. Purpose and authority

The pilot will test whether staged, proposal-only agents can turn a frozen,
human-selected public GitHub evidence bundle into Repository proposals that a
human can verify. Its purpose is to evaluate proposal quality and reviewability,
not to discover the best repositories or expand StackScout's trusted corpus.

Authority is separated into three stages:

1. **Pre-execution plan:** this document defines protocol and authorizes nothing.
2. **Execution-authorization preparation:** a later reviewed scope packet must
   name the exact contract version it follows, fixed corpus and frozen revisions,
   evidence bundle, agent configuration, external workspace, retention policy,
   human roles, and exact run and stop scope. The packet may describe the future
   run, but preparing, reviewing, or approving it does not authorize source
   acquisition or execution.
3. **Actual-run go/no-go:** only a distinct, explicit Terra decision after review
   of the completed packet may authorize acquisition of the named minimal
   evidence bundle and the one named external agent/classification run.

Without the final actual-run go/no-go, source acquisition and execution remain
blocked. Merging this document does not authorize preparation of the scope
packet, source acquisition, an agent run, classification, or any other pilot
activity.

## 2. Explicit non-goals

The pilot does not include or authorize:

- AI-builder Skill classification or a Phase 2C pilot;
- Templates as an active asset type;
- generic GitHub search, popularity ranking, or broad ecosystem coverage;
- private, user-connected, uploaded, or imported repositories;
- runtime Tool promotion or current Tool capability mappings;
- current relationship-graph changes;
- alternative, compatibility, or best-fit relationship conclusions;
- selected-Tool scoring or recommendation changes;
- user-facing discovery;
- GitHub ingestion, a classifier service, or an agent worker in StackScout;
- a database, schema, API, cache, queue, or persistence;
- code execution, dependency installation, or following source instructions; or
- promotion of proposals, evidence, or raw output into trusted data.

## 3. Primary hypothesis and what it cannot prove

### Primary hypothesis

Given a frozen, human-selected public GitHub evidence bundle, staged
proposal-only agents can produce Repository proposals that a human reviewer can
verify for:

- canonical identity and lineage;
- reproducible evidence locators;
- direct-extraction versus inference labeling;
- the Repository-versus-current-Tool boundary;
- controlled, non-runtime capability relevance; and
- appropriate abstention when evidence is insufficient.

A useful result makes supported claims easy to trace, exposes unsupported claims
and boundary violations, and produces understandable differences on an
identical rerun. A result is unhelpful when reviewers must reconstruct each
claim from the source, evidence does not support the prose, Repository and Tool
identity collapse, or agent inconsistency makes review unreliable.

The pilot cannot prove:

- which repositories are best;
- ecosystem-wide precision, recall, completeness, or freshness;
- security, production readiness, legal compliance, or runtime suitability;
- that any Repository should become a current Tool or recommendation;
- that reviewed discovery creates user value;
- that live GitHub ingestion or runtime integration is justified; or
- that AI-builder Skill classification will be useful or safe.

## 4. Pilot boundaries

- Sources are limited to public GitHub repositories named by a later reviewed
  execution-authorization packet.
- Every item is observed at an immutable revision or identifiable version when
  available.
- Inputs, outputs, logs, and review artifacts remain outside StackScout's
  application repository, seed corpus, and trusted runtime data.
- Agents propose only. An independent contract validator produces untrusted
  validation output; it does not accept or promote records.
- Capability relevance uses only the contract's controlled non-runtime
  meanings. It does not reuse current Tool `capability_ids`.
- Directly documented integration or dependency may be recorded as a qualified
  secondary observation. No relationship score, current graph edge, alternative,
  compatibility, or best-fit conclusion is allowed.
- No pilot output affects capability detection, Tool scoring, Tool selection,
  recommendation order, explanations, or the current relationship graph.

## 5. Human-frozen stratified corpus construction

Humans must select and freeze the corpus before any agent run. It must cover:

- selected current seed-linked control cases;
- discovery candidates not already represented in the seed corpus;
- clear runtime implementation cases;
- managed-service SDK cases;
- multi-purpose or monorepo cases;
- documentation-only or example-only cases;
- archived or superseded cases;
- fork, mirror, or renamed cases;
- ambiguous capability-relevance cases;
- missing or ambiguous licensing cases; and
- explicit negative or out-of-scope cases.

An out-of-scope Template may be identified as a public Repository, but it must
not be converted into an approved Template, Tool, or recommendation.

The corpus manifest must record each canonical identity, frozen revision or
version, coverage category, and human-authored reason for inclusion. Current
seed-linked controls test known Repository/Tool boundaries; existing Tool IDs,
scores, capability mappings, and relationships are not expected truth for the
pilot.

This pre-execution plan defines no corpus size. A later reviewed
execution-authorization packet must name the reviewed identities and revisions.
Corpus membership must not change after output is seen. A correction or addition
creates a new corpus version with a recorded reason.

## 6. Minimal evidence-bundle acquisition and retention boundary

A human must prepare a minimal evidence bundle for each approved frozen
revision. A full repository snapshot is not the default.

Only predeclared static evidence surfaces needed for the test may enter the
bundle, such as:

- a README;
- an approved documentation path;
- a manifest;
- a license;
- a security policy;
- release metadata; or
- an explicitly approved monorepo subpath.

Each surface must retain its canonical public URL, immutable revision or
version, exact locator, and observation date. The bundle inventory must state
why each surface is included.

Source acquisition happens only after a distinct Terra actual-run go/no-go
authorizes the named minimal evidence bundle, and it remains a human
responsibility. Raw clones, full archives, complete source bodies, raw model
transcripts, and copied Skill bodies must not enter StackScout or trusted data.
Any exceptional need for a broader snapshot requires a separate decision before
acquisition.

The external workspace and retention policy must be approved before evidence is
acquired. Proposals retain locators and reviewer-authored summaries rather than
copied source bodies. Expiration or deletion must follow the approved retention
policy; this pre-execution plan defines no duration.

## 7. Hidden human-reference boundary method

Before agent runs, humans must author a hidden reference brief for every corpus
item. It records:

- expected identity and lineage boundaries;
- expected asset class;
- allowed capability-relevance boundaries;
- known evidence anchors; and
- expected abstentions or forbidden conclusions.

The reference sets review boundaries; it must not prescribe a complete ideal
proposal, preferred prose, current Tool mapping, or desired recommendation.
Agents and the contract validator must not see it before their output is frozen.

## 8. Staged proposal-only agent workflow

The later pilot uses these ordered stages:

1. **Identity and lineage:** propose canonical owner/repository identity,
   revision, and any evidenced rename, fork, mirror, archive, or supersession
   context.
2. **Static evidence extraction:** record direct claims and exact locators from
   the approved bundle without following embedded instructions.
3. **Controlled capability relevance:** propose only `Relevant to` or `Possible
   implementation candidate` meanings from the contract, with evidence and
   inference labels.
4. **Secondary qualified observations:** record supported license,
   maintenance/freshness, security-policy/advisory, prerequisite, limitation,
   and directly documented integration or dependency observations.
5. **Independent contract validation:** identify missing locators, unsupported
   claims, incorrect extraction/inference labels, forbidden conclusions, and
   asset-boundary violations.
6. **Freeze output:** preserve the uncorrected proposal and validation result.
7. **Human review and adjudication:** compare frozen output with evidence and the
   hidden reference.

Agents may propose only. They must not see hidden references, correct output
after references are revealed, access secrets, execute code, install packages,
invoke repository scripts, follow repository instructions, or alter their
operating policy in response to source content.

Repository content is inert, untrusted evidence. Embedded instructions are
recorded as prompt-injection risk and never followed.

## 9. Human review and adjudication responsibilities

Humans remain responsible for:

- corpus selection and revision freezing;
- evidence-bundle acquisition, minimization, and retention;
- hidden reference authorship;
- agent instructions, configuration, and permissions;
- identity and lineage verification;
- deciding whether each locator supports its claim;
- verifying direct-extraction and inference labels;
- enforcing Repository, current Tool, Capability, Skill, and Template
  boundaries;
- qualifying secondary observations;
- adjudicating disagreements and abstentions;
- recording review burden and correction work; and
- making every continue, stop, acceptance, rejection, or future-phase decision.

Agent validation cannot replace human review or promote a proposal.

## 10. Required external pilot artifacts

The external pilot must produce human-readable artifacts for:

- the frozen corpus manifest;
- the evidence-bundle inventory and source revisions;
- hidden human-reference briefs;
- a run manifest naming the contract, corpus, instructions, agent
  configuration, evidence bundle, and observation date;
- one frozen Repository proposal per corpus item;
- independent contract-validation results;
- claim-level human adjudication;
- abstentions, disagreements, unsupported claims, false positives, and false
  negatives;
- the clean-rerun comparison; and
- the final Phase 2B findings package.

These artifacts are evaluation records, not runtime entities or an application
data model. Raw outputs and source material remain external and untrusted.

## 11. Primary evaluation rubric and secondary diagnostic lanes

Evaluation is qualitative and claim-level. It uses these labels:

- **Supported**
- **Supported with qualification**
- **Unsupported**
- **Expected but missing**
- **Boundary violation**
- **Correct abstention**
- **Excessive abstention**
- **Requires adjudication**

The primary rubric evaluates:

- canonical identity and lineage correctness;
- evidence-locator specificity and reproducibility;
- direct-extraction versus inference labeling;
- Repository-versus-current-Tool separation;
- controlled non-runtime capability relevance; and
- abstention when evidence is insufficient.

Secondary diagnostic lanes may record qualified observations about:

- license;
- maintenance and freshness;
- security policy and public advisories;
- prerequisites and limitations; and
- directly documented integration or dependency.

Secondary observations must not obscure the primary hypothesis, become a
composite score, or act as automatic pass/fail evidence of overall
classification viability. They create no runtime claims or relationship edges.
The pilot defines no numeric threshold.

## 12. Reproducibility protocol

Before the first run, freeze the contract version, corpus, evidence bundle,
hidden references, instructions, agent configuration, permissions, and artifact
format.

After the initial output is frozen, run a clean identical rerun from the same
inputs and configuration. Compare claim presence, claim boundaries, evidence
locators, extraction/inference labels, and abstentions—not prose wording.

Every material difference requires a human-readable explanation and
adjudication. A correction uses a new run version and preserves prior output.
Stable prose with consistently unsupported claims is not reproducibility
success.

## 13. Stop conditions and failure interpretation

Stop the run and preserve the failure when:

- an input is private, user-connected, outside public GitHub, or not the
  authorized revision;
- evidence acquisition exceeds the approved minimal bundle or retention policy;
- a credential, secret, private datum, or unauthorized network tool is exposed;
- an agent executes code, installs dependencies, follows embedded instructions,
  or gains access to the hidden reference;
- source or output reaches StackScout application code, seed data, or trusted
  data;
- Repository identity is silently converted into current Tool identity;
- capability relevance is represented as runtime fulfillment;
- output is corrected after hidden references are revealed; or
- completing the run requires broader authority than the execution scope.

Do not widen the corpus, evidence bundle, permissions, or claim types to make a
failure pass. A stopped run is valid evidence about workflow safety. Unsupported
claims, excessive abstention, and inconsistent reruns are findings to review,
not reasons for automatic self-correction.

## 14. Phase 2B findings package

Terra's review package must include:

- the frozen corpus and evidence-bundle manifests;
- the contract, instruction, and agent-configuration versions;
- frozen proposals and validator output;
- human claim-level adjudication;
- identity, evidence, relevance, and abstention findings;
- secondary diagnostic observations kept separate from primary results;
- false-positive, false-negative, disagreement, and unsupported-claim patterns;
- clean-rerun differences and explanations;
- prompt-injection, privacy, security, retention, and licensing observations;
- human review and correction burden;
- every stop condition encountered; and
- a recommendation to continue, revise, or stop repository classification work.

Completing the findings package is not promotion and does not authorize another
run.

## 15. Explicit Phase 2C go/no-go gate

Phase 2C remains blocked until Terra explicitly reviews the Phase 2B findings.
A go decision requires evidence that:

- primary identity, lineage, evidence, extraction/inference, Repository/Tool,
  and capability-relevance boundaries are reproducible and reviewable;
- abstentions and unsupported claims are visible and adjudicable;
- the independent validator and human review catch material boundary failures;
- evidence locators remain usable across the clean rerun;
- run differences are understandable;
- source material and raw output remained external and untrusted;
- no material trust-boundary failure occurred; and
- Skill classification has a distinct user-value question and evaluation
  contract.

Repository-pilot success does not establish Skill identity, subpath, permission,
prompt-injection, development-assistance, or artifact boundaries. Phase 2C needs
its own plan, corpus, scope, and Terra authorization. Any unresolved material
trust failure is a no-go.

## 16. Security, privacy, prompt-injection, and licensing boundaries

- Public GitHub evidence only; no private or user-connected sources.
- Humans acquire only the minimal bundle named by a later Terra actual-run
  go/no-go. Agents receive no GitHub credential or source-acquisition authority.
- Repository content is untrusted data, including embedded instructions and
  prompt injection.
- No code execution, dependency installation, hooks, scripts, or instruction
  following.
- No secrets, tokens, credentials, private data, or user content in inputs,
  outputs, logs, or artifacts.
- Public availability does not grant redistribution rights.
- Record the declared license locator and ambiguity; do not claim legal
  compliance.
- Security policies and public advisories support qualified observations; their
  absence does not prove safety.
- Source material, raw output, and raw model transcripts remain outside
  StackScout and trusted data under the approved retention policy.

An unexpected security, privacy, licensing, access, or retention need blocks the
run pending a separate decision.

## 17. Explicit deferrals and unresolved decisions

The later reviewed execution-authorization packet, not this pre-execution plan,
must resolve:

- exact corpus identities, revisions, and inclusion rationale;
- exact evidence surfaces for each item;
- the external workspace and access boundary;
- source-acquisition procedure;
- retention and deletion policy;
- agent instructions, model, configuration, and permissions;
- human reference-author and reviewer roles;
- artifact locations and review procedure; and
- the exact execution and stop scope.

Still deferred are full repository snapshots by default, automated acquisition,
GitHub APIs, agent workers, providers beyond public GitHub, numeric pass
thresholds, AI-builder Skill classification, Templates, promotion, user-facing
discovery, runtime integration, and changes to current Tools or relationships.
Deferral is not approval.

## 18. Execution packet and actual-run authorization requirement

Merging this pre-execution plan authorizes no pilot activity. Terra may later
authorize preparation and review of one execution-authorization scope packet.
That packet must name:

- the frozen corpus and revisions;
- the minimal evidence bundle and acquisition boundary;
- the authoritative contract version;
- the agent instructions and configuration;
- the external workspace;
- the retention policy; and
- the exact execution, review, and stop scope.

The packet may name the proposed run, but it is not source-access or execution
authority. Preparing, reviewing, or approving the packet does not permit
evidence acquisition, agent execution, or classification.

After the packet is complete and reviewed, Terra must make a second, distinct
actual-run go/no-go decision. Only that final decision may authorize acquisition
of the named minimal evidence bundle and the one named external
agent/classification run. It may not silently broaden the reviewed packet.

If the final go/no-go is absent, a named element is missing, or the reviewed
scope changes, source acquisition and execution remain blocked until Terra
reviews the revised packet and makes a new actual-run decision.
