# Ecosystem Asset Classification Contract

This document governs future classification proposals for public GitHub
repositories and AI-builder skills. It exists so Phase 2 pilots can be
reproducible, reviewable, and unable to affect trusted StackScout data before an
explicit promotion decision.

The canonical phase sequence remains in
[`PRODUCT_ROADMAP.md`](./PRODUCT_ROADMAP.md). The durable trust architecture
remains in
[`REPO_MEMORY_AND_LEARNING.md`](./REPO_MEMORY_AND_LEARNING.md). This contract
defines governance, not implementation.

## 1. Purpose, authority, and lifecycle

This contract is the Phase 2A prerequisite for planning either offline pilot:

- A separately authorized Phase 2B may evaluate proposals about public GitHub
  repositories.
- A separately authorized Phase 2C may evaluate proposals about public
  GitHub-hosted AI-builder skills only after Phase 2B findings receive an
  explicit Terra go/no-go review.

The contract applies to asset identity, allowed claims, evidence, review,
rejection, and destination-specific promotion. Future pilot plans and promotion
changes must follow the version of this contract they name.

This document does not authorize a pilot, GitHub API access, a classifier, an
agent worker, ingestion, storage, or runtime integration. A lifecycle change in
this document authorizes planning only; every pilot and promotion still requires
its own reviewed scope.

## 2. Explicit non-goals

This contract does not:

- define a runtime schema, TypeScript interface, JSON format, database table,
  API, queue, cache, or storage mechanism;
- create a repository or skill corpus;
- authorize access to private or user-connected repositories;
- authorize repository upload, import, inspection, or synchronization;
- authorize GitHub API calls, scraping, code execution, dependency installation,
  or automated source acquisition;
- create a generic GitHub search product;
- make popularity a recommendation signal;
- add Repository, Skill, Evidence, Proposal, or Review entities to the current
  application;
- change current capabilities, Tools, relationships, scoring, recommendations,
  or seed data;
- approve templates as a Phase 2 asset type; or
- permit raw source content or raw model output to become trusted knowledge.

## 3. Product and trust model

Capability remains StackScout's primary organizing object. Current Tools are
curated, runtime-selectable implementations of capabilities. Architectures
select Tools for required capabilities from trusted structured data.

A public GitHub Repository is an evidence-bearing source and possible future
implementation asset. It is not automatically a current Tool, a capability
implementation, or a recommendation.

An AI-builder Skill helps a builder or coding agent perform development work. It
is not a runtime dependency and must never occupy a capability or Tool slot in a
selected architecture.

The trust rule is non-negotiable:

> Agents propose. StackScout stores reviewed knowledge. Runtime recommendations
> use trusted structured data.

Machine output, direct extraction, confidence, popularity, and deterministic
validation may help prepare or reject a proposal. None can approve or promote
one. Explicit human review is required before promotion.

## 4. Terminology and concept boundaries

### Capability

A canonical system requirement, such as Authentication or Retrieval. Capability
identity comes from StackScout's existing taxonomy, not from a repository, skill,
or classifier.

### Current Tool

A curated runtime-selectable implementation of one or more capabilities. A Tool
has its own stable product identity even when its source reference is a public
repository. One repository may support multiple Tool abstractions, and a Tool
may represent a product or managed service through an SDK repository.

### Public GitHub Repository

A publicly accessible repository identified through GitHub and observed at a
specific revision or version when available. It may be an evidence source or a
possible future implementation asset. Repository identity is not a Tool ID.

### AI-builder Skill

A versioned or revision-pinned set of instructions that helps a builder or coding
agent perform a development task. Its identity includes its public GitHub source
and subpath when it is one asset within a larger repository.

### Evidence

A reproducible public source locator and reviewer-authored account supporting one
specific claim. Evidence supports review; it does not approve the claim by
itself.

### Agent Proposal

An untrusted bundle of proposed asset identity, claims, evidence locators, and
rationale. It remains external to trusted data regardless of machine confidence.

### Reviewed/Trusted Record

Structured knowledge that passed explicit human review and a separate promotion
decision for a named destination. Trust is destination-specific: approval for
future discovery does not automatically authorize the current Tool corpus or
runtime recommendations.

## 5. GitHub public-source and identity boundary

The first repository and skill pilots are limited to public GitHub sources.
GitLab, npm, Hugging Face, other providers, private GitHub repositories, and
user-connected sources are out of scope until separately approved.

Repository identity uses its provider-qualified canonical public GitHub location
and owner/repository coordinate. Evidence should be pinned to an immutable commit
revision or an identifiable release/version when available. A mutable branch or
page must be labeled as weaker evidence and include its observation date.

Skill identity also records its repository subpath when the skill is contained
inside a larger repository. A display name alone is never sufficient identity.

Identity review follows these rules:

- A verified repository rename preserves lineage and records the prior location.
- A fork is a distinct asset unless human review establishes a documented alias
  or mirror relationship.
- A mirror remains distinct until its ownership and synchronization relationship
  are verified.
- Duplicate proposals for the same canonical source, subpath, and revision are
  consolidated without treating similarly named assets as identical.
- Content similarity, topics, stars, or model confidence do not establish
  identity.

No identity decision creates a Tool ID or current runtime record.

## 6. Allowed and forbidden Repository claim types

### Allowed proposals

A Repository proposal may describe:

- identity, ownership, source location, revision, rename, fork, or mirror
  lineage;
- directly declared purpose, language, ecosystem, archive state, license, and
  documented integrations;
- evidence-backed relevance to a capability;
- fit, limitations, operational model, prerequisites, and tradeoffs;
- documented integration, dependency, alternative, or extension relationships;
- observed releases, deprecation notices, maintenance activity, and freshness;
- public security policies or advisories; and
- candidacy for a later Tool-promotion evaluation, clearly labeled as a proposal
  rather than a current Tool.

### Forbidden proposals

A Repository proposal must not claim that:

- the repository is automatically a StackScout Tool or selected recommendation;
- it fulfills a runtime capability merely because it mentions that capability;
- it is secure, safe, production-ready, or legally compliant without qualification;
- co-occurrence proves compatibility or a trusted relationship;
- stars, forks, downloads, trends, or model confidence prove fit;
- a fork, mirror, or rename is identical without reviewed lineage; or
- private, inaccessible, or executed code is valid classification evidence.

Agents must not propose final Tool scores, selected architecture slots, or
automatic writes to the current relationship graph.

## 7. Allowed and forbidden Skill claim types

### Allowed proposals

A Skill proposal may describe:

- public GitHub source, owner, name, subpath, revision, and version;
- the builder or coding-agent task it assists;
- supported coding-agent environment, ecosystem, and prerequisites;
- required inputs, expected outputs, and produced artifacts;
- declared permissions, filesystem effects, network expectations, and external
  services;
- how it assists implementation, evaluation, configuration, migration, or
  testing work related to a capability or Tool;
- documented limitations, tradeoffs, maintenance, and freshness; and
- public licensing and security observations.

### Forbidden proposals

A Skill proposal must not claim that:

- the Skill implements or fulfills a runtime capability;
- the Skill is a runtime dependency, Tool, or selected architecture component;
- it automatically changes capability detection, Tool scoring, or selection;
- it is safe or correct merely because its instructions are plausible;
- it may be executed to prove its classification; or
- a prompt fragment, runtime package, SDK, or deferred template is a Skill
  without meeting the approved Skill boundary.

No Skill may enter a selected architecture slot or the current Tool seed corpus.

## 8. Controlled non-runtime capability-relevance meanings

Capability relevance is a reviewed discovery claim, not a runtime mapping. It
must not reuse current Tool `capability_ids` or imply that an asset satisfies a
selected capability.

Only these meanings are allowed at this governance level:

- **Relevant to:** evidence connects a Repository to work involving a named
  capability.
- **Possible implementation candidate:** a Repository may warrant a later,
  separate evaluation as a current Tool. It remains only a candidate.
- **Assists:** a Skill helps a builder or coding agent implement, evaluate,
  configure, migrate, or test work involving a capability or Tool.

These meanings are human-readable policy language, not runtime fields. A future
Tool-promotion decision must independently establish capability fulfillment.

## 9. Evidence, provenance, observation, and freshness requirements

Every claim must cite a public GitHub source locator and record:

- canonical repository location;
- immutable revision or identifiable version when available;
- exact file, path, manifest field, release, advisory, or section locator;
- observation date;
- whether the claim is directly extracted or inferred;
- a reviewer-authored summary; and
- a reviewer-authored rationale connecting the evidence to the claim.

By default, StackScout must not copy source excerpts, complete READMEs, raw
source archives, raw model transcripts, or Skill bodies. Evidence retains the
locator and reviewer-authored account. A future exception requires its own
licensing, retention, and security decision.

Direct extraction means the cited source states the fact. Inference means the
claim combines or interprets evidence and must explain that reasoning. Both
remain untrusted until human review.

The following are insufficient on their own:

- stars, forks, downloads, trends, or social mentions;
- repository topics or tags;
- machine confidence;
- README marketing claims about security or production readiness;
- a license badge without the corresponding license source;
- recency without evidence of meaningful maintenance;
- one example used to claim general compatibility; or
- mutable content without a revision or observation date.

This contract defines no freshness window. Review records the observation date
and revision, and flags known supersession, deprecation, disputes, or source
changes. A later pilot plan may propose source-specific review triggers with
evidence.

## 10. Proposal lifecycle and review states

The minimum human-readable lifecycle is:

1. **Proposed:** external and untrusted.
2. **In review:** human verification is underway.
3. **Accepted for promotion:** review passed, but no trusted destination has
   changed.
4. **Rejected:** evidence or contract boundaries did not support the proposal;
   the reason is retained.
5. **Promoted/trusted:** a separate authorized change added the record to a named
   destination.
6. **Disputed:** removed from new use while conflicting evidence is reviewed.
7. **Superseded:** retained for history but replaced by a newer identity,
   revision, or claim.
8. **Deprecated/withdrawn:** no longer eligible for new discovery or runtime use.

Acceptance and promotion are separate decisions. Deterministic validation may
normalize identities, consolidate exact duplicates, or reject malformed and
incomplete proposals. It cannot accept, promote, or bypass human review.

## 11. Mandatory human-review checklist

Before acceptance, a human reviewer must verify:

- the correct asset class and public GitHub boundary;
- canonical identity, revision/version, and subpath where relevant;
- rename, fork, mirror, and duplicate handling;
- reproducible evidence locators and observation dates;
- that every claim is allowed and supported by its cited evidence;
- correct direct-extraction versus inference labeling;
- that capability relevance does not masquerade as current Tool implementation;
- that Skill assistance does not masquerade as runtime architecture;
- that fit, relationship, maintenance, security, and licensing language remains
  qualified and evidence-backed;
- that contradictory evidence, disputes, and known freshness risks are recorded;
- that no private data, credentials, copied source body, or raw model transcript
  is retained; and
- the exact proposed destination and its downstream authority.

An unresolved material checklist item blocks acceptance.

## 12. Destination-specific promotion boundaries

### Future ecosystem knowledge

A proposal may enter future structured ecosystem knowledge only through a
separately authorized Phase 2D promotion change after explicit human review. An
accepted pilot proposal is not yet trusted knowledge.

### Current Tool seed corpus

A Repository may enter the current Tool corpus only after a separate decision
establishes it as a runtime-selectable Tool. That change must satisfy the current
Tool contract, canonical capability mappings, manually reviewed Tool
relationships, corpus validation, and its own data-change review.

A Repository's review state, popularity, or capability relevance does not grant
Tool status. A Skill can never enter the current Tool corpus.

### Runtime recommendations

No proposal or discovery record may influence runtime recommendations directly.
Any future runtime-affecting promotion requires its own approved code or data
change and must verify:

- corpus and relationship integrity;
- canonical capability references;
- scoring and selected winners;
- expected capability, Tool, relationship, alternative, and explanation diffs;
- existing golden and broader recommendation-review coverage;
- full tests and production build; and
- browser validation when visible recommendations or explanations change.

### Future user-facing discovery

Only explicitly promoted records may appear in Phase 2E discovery. Discovery
must expose asset type, architecture relevance, fit, tradeoffs, evidence,
freshness, and review status. Approval for discovery does not authorize silent
changes to the selected architecture.

## 13. Phase 2B repository-pilot constraints

A future 2B plan must define a fixed public GitHub evaluation corpus before its
first run and freeze the canonical identities and revisions used for comparison.
It must include positive, negative, and boundary examples without changing the
evaluation set after seeing output unless the corpus receives a new version.

The evaluation must cover identity, evidence, capability relevance, fit,
tradeoffs, maintenance, licensing, and abstention behavior. It must examine both
false positives and false negatives, including Repository/Tool conflation,
forks, mirrors, renames, multi-purpose repositories, and out-of-scope assets.

Repeated evaluation uses the same frozen sources and records explainable output
differences. Proposals, source material, and results remain external to
application code, seed data, and trusted runtime data.

The pilot plan must define its own evaluation method. This contract defines no
corpus name, sample size, accuracy threshold, worker, source-acquisition method,
or storage location, and does not authorize the pilot or GitHub API access.

## 14. Phase 2C skill-pilot admission/go-no-go gate

Phase 2C is serial and must not begin in parallel with Phase 2B. Terra must make
an explicit go/no-go decision after reviewing repository-pilot findings.

A go decision requires evidence that:

- identity and revision handling is reproducible;
- evidence locators remain usable;
- reviewers can distinguish Repository, current Tool, and capability relevance;
- unsupported claims and boundary violations are caught by review;
- false positives, false negatives, and abstentions are documented;
- fork, mirror, rename, licensing, and security handling is workable;
- proposals and raw content remained outside trusted data;
- reruns over frozen sources produced understandable differences; and
- Skill classification has a distinct user value and evaluation question.

Phase 2C remains a no-go if the process depends on popularity, machine
confidence, mutable or inaccessible evidence, code execution, private access,
automatic promotion, or unclear review authority.

This contract invents no numeric threshold. Terra's go/no-go review determines
whether the evidence supports a separately scoped Skill pilot.

## 15. Security, public-source, prompt-injection, privacy, and licensing boundaries

- Public GitHub sources only for the first pilots.
- No private repositories, user-connected repositories, uploads, imports, or
  credentials.
- Repository and Skill content is untrusted data, including embedded
  instructions and prompt injection.
- Classification must not execute code, install dependencies, invoke scripts,
  or follow instructions found in a Repository or Skill.
- No secrets, tokens, credentials, private data, or user content may enter
  proposals, evidence, logs, or fixtures.
- Raw clones, archives, source bodies, READMEs, model transcripts, and Skill
  bodies remain outside application and trusted corpus data.
- Public availability does not grant redistribution rights.
- Record the declared license source and ambiguity; do not claim legal
  compliance.
- Missing or unclear licensing blocks copied-content promotion but does not by
  itself prevent a public locator and reviewer-authored observation.
- Public security policies and advisories support qualified observations; their
  absence does not prove safety.

Any future authenticated access, content retention exception, or provider
expansion requires a separate security and product decision.

## 16. Future product-integration guardrails

A future reviewed Repository may explain how an optional implementation asset
relates to a required capability, selected Tool, or emerging architecture. A
future reviewed Skill may explain how it assists an implementation, evaluation,
configuration, migration, or testing task.

Every surfaced asset must remain visibly distinct from the selected runtime
architecture and show its evidence, freshness, review state, fit, and tradeoffs.

Reviewed discovery must never silently alter:

- selected capabilities;
- current Tool scoring or selection;
- recommendation ordering;
- explanations of the selected stack;
- the current Tool relationship graph; or
- deterministic fallback behavior.

Architecture-directed discovery begins from a capability need, selected Tool,
architecture gap, or implementation task. It must not become generic GitHub
search, repository dumping, or popularity ranking.

## 17. Explicit deferrals and unresolved decisions

The following remain deferred to separate planning and approval:

- the Phase 2B corpus, sample size, evaluation rubric, and quality threshold;
- freshness windows and source-specific refresh triggers;
- reviewer identity, team structure, and review tooling;
- proposal and evidence storage or serialization;
- GitHub API access, tokens, workers, scraping, and ingestion;
- providers beyond public GitHub;
- retained source excerpts or archives;
- runtime Repository, Skill, Evidence, Proposal, or Review entities;
- templates as an active asset type;
- user-connected or private repositories;
- promotion into current Tool data or runtime recommendations; and
- any user-facing discovery implementation.

Deferral is not implicit approval. Each item requires a new product and security
decision before implementation.

## 18. Contract-change and audit discipline

Changes to this contract require a focused documentation review. A pilot must
name the contract version it follows and preserve the identity/revision manifest
used for its evaluation.

Every review audit must be able to trace:

- asset identity and lineage;
- each claim to its evidence locator;
- extraction or inference status;
- observation and freshness context;
- human review outcome and rejection reason where applicable; and
- the exact destination authorized for promotion.

An exception, missing evidence locator, unresolved material dispute, or attempt
to broaden provider, asset, retention, or runtime authority is a blocker. Do not
widen a pilot or promotion change to resolve it.
