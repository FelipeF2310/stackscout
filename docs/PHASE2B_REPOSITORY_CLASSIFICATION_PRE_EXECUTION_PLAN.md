# Phase 2B Repository Classification Pre-Execution Plan

This is a pre-execution planning artifact for one future offline evaluation of
public GitHub Repository classification. It follows
[`ECOSYSTEM_ASSET_CLASSIFICATION_CONTRACT.md`](./ECOSYSTEM_ASSET_CLASSIFICATION_CONTRACT.md),
which remains authoritative for asset, evidence, review, and promotion
boundaries. The minimum builder-facing result that the pilot must evaluate is
defined by
[`ARCHITECTURE_DIRECTED_DISCOVERY_PRODUCT_CONTRACT.md`](./ARCHITECTURE_DIRECTED_DISCOVERY_PRODUCT_CONTRACT.md).

This document is not an executable Phase 2B pilot plan. It does not nominate a
corpus, authorize source access, freeze evidence, configure an agent, or permit
classification. Those responsibilities are separated by the six-stage
lifecycle below so that no planning artifact silently grants authority assigned
to a later stage.

## 1. Purpose and authority

The pilot will test whether staged, proposal-only agents can turn a frozen,
human-selected public GitHub evidence bundle into Repository proposals that a
human can verify. Its purpose is to evaluate proposal quality and reviewability,
not to discover the best repositories or expand StackScout's trusted corpus.

Authority is separated into six stages:

1. **Pre-execution plan:** this document defines protocol and authorizes
   nothing, including preparation of a later packet.
2. **Candidate-nomination research authorization:** only a distinct, explicit
   Terra decision may authorize one bounded, human-directed activity that
   records possible public GitHub coordinates for later planning. Its external,
   untrusted register is neither evidence nor corpus selection.
3. **Corpus-freeze scope packet:** a later reviewed planning packet uses
   nominated coordinates only as untrusted inputs and independently proposes the
   intended corpus, coverage, evidence surfaces, external boundary, human roles,
   and acquisition stop conditions. It grants no authority.
4. **Corpus-freeze go/no-go:** only a separate, explicit Terra decision may
   authorize limited human-only, read-only acquisition of the named sources and
   creation of frozen external inputs. It grants no agent, model-execution,
   model-provider-transmission, or classification authority.
5. **Classification execution packet:** a later reviewed packet uses the frozen
   inputs to name the exact contract, corpus, evidence, agent configuration,
   containment, roles, evaluation, and run scope. It grants no agent or model
   execution, model-provider transmission, or additional source-access
   authority.
6. **Classification-run go/no-go:** only a distinct, explicit Terra decision may
   authorize the named initial proposal pass, one clean identical rerun, the
   approved independent validation pass, and human adjudication.

Each stage requires its own applicable review and authority. Completing or
approving one stage never authorizes the next. Merging this document does not
authorize candidate nomination, preparation of either packet, source
acquisition, an agent run, classification, or any other pilot activity. Section
18 defines the authority and limits of each stage in full.

## 2. Explicit non-goals

The pilot does not include or authorize:

- AI-builder Skill classification or a Phase 2C pilot;
- Templates as an active asset type;
- a generic GitHub search product, unbounded discovery, popularity ranking, or
  broad ecosystem coverage;
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

A proposal must also support the product contract's minimum discovery
projection. For a fixed, named architecture context, it must produce qualified
fit, prerequisite, limitation, tradeoff, and duplicate- or suppression-relevant
source observations only when evidence supports them. Otherwise, explicit
abstention is the correct output. These requirements do not turn a Repository
into a current Tool, runtime Capability implementation, relationship-graph
edge, or recommendation.

A useful result makes supported claims easy to trace, exposes unsupported claims
and boundary violations, and produces understandable differences on an
identical rerun. It also gives reviewers enough supported, review-ready context
to assess the product contract's helpful, duplicate/suppressed, and honest no-
result boundaries. A result is unhelpful when reviewers must reconstruct each
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

- Candidate sources are limited to public GitHub repositories independently
  proposed in an approved corpus-freeze scope packet. A prior nomination does
  not require inclusion, and no source is acquired merely because it appears in
  a nomination register or packet.
- Every acquired item is pinned to an immutable revision or identifiable version
  during an authorized human-only corpus-freeze step.
- Inputs, outputs, logs, and review artifacts remain outside StackScout's
  application repository, seed corpus, and trusted runtime data.
- Agents propose only. An independent contract validator produces untrusted
  validation output; it does not accept or promote records.
- Capability relevance uses only the contract's controlled non-runtime
  meanings. It does not reuse current Tool `capability_ids`.
- Directly documented integration or dependency may be recorded as a qualified
  secondary observation. No relationship score, current graph edge, alternative,
  compatibility, or best-fit conclusion is allowed.
- Product-contract observations remain specific to a fixed, named architecture
  context. They do not establish broad suitability or change the Architecture
  Brief.
- No pilot output affects capability detection, Tool scoring, Tool selection,
  recommendation order, explanations, or the current relationship graph.

### Candidate-nomination research boundary

Stage 2 exists only to produce an external, untrusted candidate-nomination
register for later corpus-freeze packet preparation. A future authorization for
one nomination activity must explicitly name:

- the human-directed researcher or research role;
- the permitted public GitHub surfaces;
- the allowed candidate categories;
- the maximum intended candidate scope or other stopping boundary;
- the external workspace and retention boundary; and
- the output format and observation date.

For the first pilot, the authorization may permit only public GitHub repository
listing or search and landing-page metadata needed to identify a repository
coordinate. The register may record only:

- the public GitHub URL or owner/repository coordinate;
- the intended coverage category;
- the observation date; and
- a short human-authored nomination rationale.

Stage 2 must not permit:

- GitHub API access;
- authentication or private, user-connected, uploaded, or imported sources;
- cloning, downloading, raw-file retrieval, README, documentation, or code
  review, release-body capture, or source-content retention;
- model or agent classification;
- Tool, capability, fit, relationship, security, or license conclusions;
- popularity ranking;
- scoring, recommendation, review, or promotion decisions;
- corpus selection or immutable revision pinning;
- evidence-bundle creation; or
- StackScout code, data, seed, runtime, or recommendation changes.

The nomination register is not evidence, a frozen corpus, classification output,
a review decision, or a promotion artifact. It cannot establish identity,
lineage, relevance, suitability, or inclusion. If nomination requires source
content, API access, authentication, private data, broader browsing, or any
conclusion beyond a coordinate and intended test category, the activity stops
and requires a revised scope and new explicit Terra decision.

Stage 2 authority does not carry into packet preparation or corpus freezing and
does not weaken the later human-only source-acquisition boundary.

## 5. Human-frozen stratified corpus construction

The corpus-freeze scope packet must independently select its intended corpus and
prepare a proposed coverage matrix before any corpus-freeze go/no-go. Nominated
coordinates are untrusted planning inputs, not automatic selections. The matrix
must name candidate coordinates or URLs, state the reason for inclusion,
identify the permitted evidence surfaces and fixed architecture context used to
evaluate product relevance, and show how the candidates cover:

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

The matrix is mandatory but does not claim that a mutable coordinate already has
a frozen revision. Its review must happen before any source acquisition. Current
seed-linked controls test known Repository/Tool boundaries; existing Tool IDs,
scores, capability mappings, and relationships are not expected truth for the
pilot.

After a corpus-freeze go/no-go, humans pin the packet's approved candidates to
immutable revisions or identifiable versions and create the frozen corpus
manifest. The manifest records each canonical identity, frozen revision or
version, coverage category, and human-authored reason for inclusion. A source
that cannot be resolved within the approved boundary is recorded as a freeze
failure; it is not silently replaced or replaced from the nomination register.

This pre-execution plan defines no corpus size and names no candidates. Corpus
membership must not change after freezing. A correction, replacement, or
addition requires a revised corpus-freeze scope packet and a new explicit
corpus-freeze go/no-go before acquisition.

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

Source acquisition happens only after a distinct Terra Stage 4 corpus-freeze
go/no-go authorizes the named minimal evidence surfaces. It remains a limited,
human-only, read-only responsibility. That decision may authorize pinning
immutable revisions, preparing the minimal evidence bundle, and creating the
frozen corpus manifest, evidence inventory, and hidden human-reference briefs in
the approved external workspace.

The corpus-freeze go/no-go does not authorize an agent, model run, transmission
to an external model provider, classifier, validator, code execution, dependency
installation, GitHub API use, scraping, broader source access, additional
repositories, promotion, runtime integration, or a StackScout repository change.
Raw clones, full archives, complete source bodies, raw model transcripts, and
copied Skill bodies must not enter StackScout or trusted data. Any exceptional
need for a broader snapshot requires a revised packet and a new go/no-go before
acquisition.

The external workspace and retention boundary must be approved in the
corpus-freeze scope packet before evidence is acquired. If an identity,
revision, evidence surface, retention need, or source boundary differs from the
approved packet, acquisition stops and a revised packet is required. Proposals
retain locators and reviewer-authored summaries rather than copied source bodies.
Expiration or deletion must follow the approved retention procedure; this
pre-execution plan defines no duration.

## 7. Hidden human-reference boundary method

During the authorized human-only corpus-freeze step, humans must author a hidden
reference brief for every frozen corpus item. It records:

- expected identity and lineage boundaries;
- expected asset class;
- the fixed, named architecture context used to evaluate relevance;
- allowed capability-relevance boundaries;
- the expected backing-source duplicate or suppression boundary when relevant;
- known evidence anchors; and
- expected abstentions or forbidden conclusions.

The reference sets review boundaries; it must not prescribe a complete ideal
proposal, preferred prose, current Tool mapping, or desired recommendation.
Agents and the contract validator must not see it before their output is frozen.

## 8. Staged proposal-only agent workflow

Only a Stage 6 classification-run go/no-go may authorize the later pilot
workflow. The approved classification execution packet must constrain it to
these ordered stages:

1. **Identity and lineage:** propose canonical owner/repository identity,
   revision, and any evidenced rename, fork, mirror, archive, or supersession
   context.
2. **Static evidence extraction:** record direct claims and exact locators from
   the approved bundle without following embedded instructions.
3. **Controlled capability relevance:** for the fixed architecture context,
   propose only `Relevant to` or `Possible implementation candidate` meanings
   from the classification contract, with evidence and inference labels.
4. **Product-contract observations:** record qualified fit, prerequisite,
   limitation, tradeoff, and duplicate- or suppression-relevant source
   observations only when evidence supports them; otherwise abstain.
5. **Secondary diagnostic observations:** record supported license,
   maintenance/freshness, security-policy/advisory, and directly documented
   integration or dependency observations without making broad suitability,
   ranking, legal-compliance, security, or recommendation claims.
6. **Independent contract validation:** identify missing locators, unsupported
   claims, incorrect extraction/inference labels, forbidden conclusions, and
   asset-boundary violations.
7. **Freeze output:** preserve the uncorrected proposal and validation result.
8. **Human review and adjudication:** compare frozen output with evidence and the
   hidden reference.

Agents may propose only. They must not see hidden references, correct output
after references are revealed, access secrets, execute code, install packages,
invoke repository scripts, follow repository instructions, or alter their
operating policy in response to source content.

The execution scope is one initial proposal pass plus one clean identical rerun.
It does not permit a third run, unlimited retries, or self-correction after
hidden references are revealed.

Repository content is inert, untrusted evidence. Embedded instructions are
recorded as prompt-injection risk and never followed.

## 9. Human review and adjudication responsibilities

Humans remain responsible for:

- corpus-freeze packet authorship and coverage-matrix review;
- the separately authorized revision freezing and evidence-bundle acquisition,
  minimization, and retention;
- hidden reference authorship;
- classification execution packet authorship, including agent instructions,
  configuration, permissions, and containment evidence;
- identity and lineage verification;
- deciding whether each locator supports its claim;
- verifying direct-extraction and inference labels;
- enforcing Repository, current Tool, Capability, Skill, and Template
  boundaries;
- qualifying product-contract and secondary diagnostic observations;
- verifying backing-source duplicate and suppression boundaries;
- adjudicating disagreements and abstentions;
- recording review burden and correction work; and
- making every continue, stop, acceptance, rejection, or future-phase decision.

Agent validation cannot replace human review or promote a proposal.

The classification execution packet must name the human reference-author and
adjudicator roles. If one person fills both roles, the packet must state the
resulting independence limitation rather than implying independent judgment.

## 10. Required external pilot artifacts

Any Stage 2 activity produces only the external, untrusted nomination register
defined in Section 4. That register remains separate from pilot evidence and the
frozen corpus artifacts below.

The human-only corpus-freeze step must produce external, human-readable:

- the frozen corpus manifest;
- the evidence-bundle inventory and source revisions;
- hidden human-reference briefs; and
- integrity identifiers or content digests for the approved evidence surfaces.

The later classification run must additionally produce external,
human-readable:

- a run manifest naming the contract, corpus, instructions, model/provider and
  version where available, agent configuration, permissions, evidence bundle,
  and observation date;
- one frozen Repository proposal per corpus item that produces or explicitly
  abstains from the product contract's minimum proposal information;
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

The primary safety rubric evaluates:

- canonical identity and lineage correctness;
- evidence-locator specificity and reproducibility;
- direct-extraction versus inference labeling;
- Repository-versus-current-Tool separation;
- controlled non-runtime capability relevance; and
- abstention when evidence is insufficient.

The product-contract rubric also requires, for the fixed architecture context:

- supported or correctly abstained fit, prerequisite, limitation, and tradeoff
  observations;
- correct identification of a backing-source duplicate or suppression case when
  the reviewed context supplies that relationship;
- observation, freshness, and review-ready status information; and
- explicit unknowns and limitations.

Secondary diagnostic lanes may record qualified observations about:

- license;
- maintenance and freshness;
- security policy and public advisories;
- directly documented integration or dependency.

Product-contract and secondary observations must not obscure the primary safety
hypothesis, become a composite score, or act as broad suitability, security,
legal-compliance, popularity, ranking, or recommendation claims. They create no
runtime mappings or relationship edges. The pilot defines no numeric threshold.

## 12. Reproducibility protocol

Before a Stage 6 classification-run go/no-go, the classification execution
packet must name the classification and discovery product contract versions by
immutable commit SHA; frozen corpus manifest; evidence inventory with immutable
locators, observation dates, and content digests or other integrity identifiers;
external workspace and artifact locations; access, retention, and deletion
boundaries; exact instructions; model, provider, and version where available;
configuration; prompt version; permissions; human roles; rubric; stop
conditions; and findings package.

The packet must also include containment evidence that agents can read only the
approved evidence bundle. Agents must have no agent-controlled browser or web-
search tools, arbitrary HTTP or network clients, GitHub or GitHub API access,
source-acquisition tools, shell or subprocess access, code-execution,
dependency-installation, or repository-script tools, secrets or credentials,
hidden human references, or access to files outside the approved external
workspace and frozen evidence bundle.

A model-inference provider connection is a narrow transport exception, not an
agent-controlled external tool. The packet must name and review:

- the provider and model/version where available;
- the exact purpose of processing only the approved frozen evidence bundle;
- whether the provider receives source content;
- the applicable input-retention, training, and data-handling terms or known
  limitations;
- a named human decision that transmission of the approved frozen evidence
  bundle to that provider is permitted under the applicable source terms and
  provider data-handling terms;
- how the connection is isolated from browser, GitHub or GitHub API, source-
  acquisition, shell, arbitrary HTTP, and other external-tool access; and
- confirmation that hidden references, secrets, and files outside the approved
  bundle are never transmitted.

The human transmission decision is a scoped operational and retention decision,
not a claim of legal compliance. If it is absent, uncertain, or conflicts with
the reviewed source or provider terms, the classification run is blocked.

This limited model-inference transport is not permission for browsing, source
acquisition, GitHub access, arbitrary network use, or additional tools. If the
execution environment cannot demonstrate the required containment, the
classification run is blocked.

The classification-run go/no-go may authorize exactly one initial proposal pass
and, after that output is frozen, exactly one clean identical rerun from the same
inputs and configuration. It may also authorize the independent proposal-only
validation pass defined in the packet and human adjudication. Compare claim
presence, claim boundaries, evidence locators, extraction/inference labels, and
abstentions—including product-contract fit, limitation, tradeoff, and duplicate
or suppression boundaries—not prose wording.

Every material difference requires a human-readable explanation and
adjudication. A correction is not part of the authorized two-run scope; it would
require a revised applicable packet and a new go/no-go while preserving prior
output. Stable prose with consistently unsupported claims is not reproducibility
success.

## 13. Stop conditions and failure interpretation

Stop candidate nomination and preserve the external activity record when:

- the authorized candidate limit or stopping boundary is reached;
- nomination would require source content, raw-file retrieval, README,
  documentation, code, or release-body review or retention;
- nomination would require GitHub API access, authentication, private or user-
  connected data, cloning, downloading, or broader browsing;
- the activity attempts a Tool, capability, fit, relationship, security,
  license, popularity, or corpus-selection conclusion; or
- the activity needs any output beyond a public coordinate, intended coverage
  category, observation date, and short human-authored rationale.

A stopped nomination cannot be widened in place. Broader activity requires a
revised nomination scope and a new explicit Terra decision.

Stop corpus freezing and preserve the acquisition record when:

- a proposed identity cannot be resolved within the approved public GitHub
  coordinate or URL;
- the immutable revision, evidence surface, retention need, source boundary, or
  required workspace differs from the approved corpus-freeze scope packet;
- acquisition would require GitHub API use, scraping, code execution,
  dependency installation, broader source access, or an additional repository;
- an input is private, user-connected, or outside public GitHub; or
- a credential, secret, private datum, or unauthorized access method would be
  required.

Stop the classification run and preserve the failure when:

- an input is not in the frozen manifest or does not match its integrity
  identifier;
- a credential, secret, private datum, or hidden reference is exposed;
- an agent gains browser, web-search, GitHub or GitHub API, source-acquisition,
  shell, subprocess, code-execution, dependency-installation, repository-script,
  arbitrary HTTP, or other agent-controlled external access;
- a model-provider connection is not explicitly named and approved in the
  classification execution packet;
- any content beyond the approved frozen evidence bundle is transmitted to the
  model provider;
- the provider, model, input-retention, training, data-handling, or containment
  boundary differs from the reviewed execution packet without a revised packet
  and new classification-run go/no-go;
- the required human transmission decision is absent, uncertain, or conflicts
  with the reviewed source or provider data-handling terms;
- source or output reaches StackScout application code, seed data, or trusted
  data;
- Repository identity is silently converted into current Tool identity;
- capability relevance is represented as runtime fulfillment;
- output is corrected after hidden references are revealed;
- a prompt, model, configuration, permission, evidence surface, corpus item, or
  artifact boundary differs from the reviewed execution packet; or
- completing the run requires a third run, self-correction, or broader authority
  than the execution scope.

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
- Candidate nomination may inspect only the public GitHub listing, search, and
  landing-page metadata named by a Stage 2 authorization. It may retain only the
  bounded nomination-register fields and creates no evidence or trusted record.
- Humans acquire only the minimal bundle authorized by a Terra corpus-freeze
  go/no-go. That stage permits no model run or transmission to an external model
  provider. Agents receive no GitHub credential or source-acquisition authority.
- Agents receive no browser, web-search, arbitrary HTTP or network client,
  GitHub or GitHub API, shell, subprocess, code-execution, dependency-
  installation, repository-script, or other agent-controlled external-access
  tool.
- Only the Stage 6 classification-run go/no-go may authorize the exact model-
  inference provider channel reviewed in the classification execution packet.
  The channel may process only the approved frozen bundle and must not transmit
  hidden references, secrets, or files outside that bundle.
- A model-inference channel does not authorize browsing, source acquisition,
  GitHub access, arbitrary network use, or another tool. A provider or data-
  handling boundary change requires a revised classification execution packet
  and a new classification-run go/no-go.
- The packet's human decision about transmitting the frozen bundle is an
  operational and retention boundary, not a claim of legal compliance. An
  absent, uncertain, or conflicting decision blocks the run.
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

The Stage 2 candidate-nomination authorization, not this pre-execution plan,
must resolve the human-directed role, permitted public GitHub surfaces, allowed
categories, maximum scope or stopping boundary, external workspace, retention
boundary, output format, and observation date.

The later reviewed corpus-freeze scope packet must independently resolve:

- intended public GitHub coordinates or URLs and inclusion rationale, using any
  nomination register only as an untrusted input;
- the mandatory coverage matrix;
- permitted static evidence surfaces;
- the proposed external workspace and access boundary;
- the proposed human-only source-acquisition procedure and stop conditions;
- the retention and deletion boundary; and
- human acquisition, reference-authoring, and review roles.

It deliberately does not need to claim immutable revisions before authorized
human acquisition can pin them.

The later classification execution packet must use the resulting frozen inputs
and resolve:

- the authoritative classification and discovery product contract versions by
  immutable commit SHA;
- the frozen corpus manifest and evidence inventory;
- integrity identifiers, observation dates, and artifact locations;
- exact agent instructions, prompt version, model/provider/version where
  available, configuration, permissions, provider data-handling boundary, and
  containment proof;
- human reference-author and adjudicator roles and any independence limitation;
- the claim-level rubric, stop conditions, and findings package; and
- the exact initial-pass, clean-rerun, validation, review, and stop scope.

Still deferred are full repository snapshots by default, automated acquisition,
GitHub APIs, agent workers, public-source providers beyond GitHub, numeric pass
thresholds, AI-builder Skill classification, Templates, promotion, user-facing
discovery, runtime integration, and changes to current Tools or relationships.
Deferral is not approval.

## 18. Six-stage authority and execution gates

### Stage 1 — Pre-execution plan

This existing document defines protocol only. It authorizes nothing: not packet
preparation, source access, acquisition, agent or model execution, model-provider
transmission, validation, or classification. It remains complete as a planning
artifact.

### Stage 2 — Candidate-nomination research authorization

Only a distinct, explicit Terra decision may authorize one bounded,
human-directed candidate-nomination activity. Its sole purpose is to produce an
external, untrusted register of possible public GitHub coordinates and intended
test categories for later packet preparation.

The authorization must name the human-directed researcher or role, permitted
public GitHub listing/search and landing-page surfaces, allowed candidate
categories, maximum intended scope or stopping boundary, external workspace and
retention boundary, output format, and observation date.

It may permit recording only the public URL or coordinate, intended coverage
category, observation date, and a short human-authored nomination rationale. It
does not authorize GitHub API access, authentication, private or user-connected
sources, source-content access or retention, cloning, downloading, raw-file,
README, documentation, code, or release-body review, model or agent
classification, conclusions about the asset, corpus selection, revision
pinning, evidence creation, scoring, recommendation, review, promotion, or
StackScout changes.

The register is not evidence, a frozen corpus, classification output, review
decision, or promotion artifact. Any need to cross the approved boundary stops
nomination until a revised scope receives a new explicit Terra decision.

### Stage 3 — Corpus-freeze scope packet

Terra may separately authorize preparation of one reviewed corpus-freeze scope
packet. It may use nominated coordinates as untrusted inputs, but must
independently propose the intended corpus, inclusion rationale, mandatory
coverage matrix, permitted static evidence surfaces, external workspace and
retention boundary, human roles, and acquisition stop conditions. It does not
need to claim frozen revisions.

Preparing, reviewing, or approving the packet grants no source access, source
acquisition, agent or model execution, model-provider transmission, validation,
or classification authority.

### Stage 4 — Corpus-freeze go/no-go

Only a separate, explicit Terra decision after review of the corpus-freeze
packet may authorize limited human-only, read-only acquisition of the named
public GitHub sources. Its authority is limited to pinning immutable revisions,
preparing the named minimal evidence bundle, and creating the frozen corpus
manifest, evidence inventory, and hidden human-reference briefs in the approved
external workspace.

It does not authorize agents, classifiers, validators, model runs, transmission
to an external model provider, code execution, dependency installation, GitHub
API use, scraping, broader source access, additional repositories, promotion,
runtime integration, or StackScout repository changes. If an identity,
revision, evidence surface, retention need, or source boundary differs from the
approved packet, acquisition stops and a revised packet plus a new corpus-freeze
go/no-go are required.

### Stage 5 — Classification execution packet

After corpus freezing, Terra may separately authorize preparation of one
reviewed classification execution packet. It must use the frozen outputs and
name:

- the classification and discovery product contract versions by immutable
  commit SHA;
- the frozen corpus manifest with identities, revisions, coverage categories,
  and rationale;
- the evidence inventory with immutable locators, observation dates, and
  content digests or other integrity identifiers;
- the external workspace, access boundaries, retention/deletion procedure, and
  artifact locations;
- exact agent instructions, model/provider/version where available,
  configuration, prompt version, and permissions;
- the model-inference channel's exact purpose, whether source content is
  transmitted, and applicable input-retention, training, and data-handling terms
  or limitations;
- a named human decision that transmitting the approved frozen evidence bundle
  is permitted under the applicable source terms and provider data-handling
  terms, scoped as an operational and retention decision rather than a claim of
  legal compliance;
- containment evidence showing agents can read only the approved evidence
  bundle and have no browser, web-search, arbitrary HTTP or network client,
  GitHub or GitHub API, source-acquisition, shell, subprocess, code-execution,
  dependency-installation, repository-script, secret, credential, hidden-
  reference, or outside-workspace access;
- evidence that the model-inference connection is isolated from those tools and
  never transmits hidden references, secrets, or files outside the approved
  bundle;
- human reference-author and adjudicator roles, including an explicit
  independence limitation if the same person fills both roles;
- the claim-level rubric, stop conditions, and findings package; and
- the exact pilot scope: one initial proposal pass plus one clean identical
  rerun, with no unlimited retries or self-correction.

Preparing, reviewing, or approving this packet grants no agent execution,
model execution, model-provider transmission, classification, additional source
access, promotion, or runtime authority.

### Stage 6 — Classification-run go/no-go

Only a distinct, explicit Terra decision after review of the completed
classification execution packet may authorize exactly the named initial
agent/classification pass, exactly one clean identical rerun against the frozen
bundle, the independent proposal-only validation pass described in the packet,
and human adjudication and creation of the external findings package.

This is the only stage that may authorize the predeclared model-inference
provider channel. That limited transport may process only the approved frozen
bundle and is not permission for browsing, source acquisition, GitHub access,
arbitrary network use, or additional tools. If the execution environment cannot
demonstrate the reviewed containment, the run is blocked.

It does not authorize new source acquisition, corpus expansion, changed evidence
surfaces, changed prompts, models, configuration, or permissions, a third run,
self-correction after hidden references, promotion, seed-data changes, runtime
integration, Phase 2C, or user-facing discovery.

Any change to the provider, model, source-content transmission, input-retention,
training, data-handling, or containment boundary requires a revised
classification execution packet and a new classification-run go/no-go before
execution.

Any material scope change stops work until the applicable packet is revised and
a new explicit go/no-go decision is approved. Authority never carries forward
implicitly from one stage to another.
