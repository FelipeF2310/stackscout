# ADR 005: External Read-Only GitHub API Acquisition for Phase 2B

## Status

Accepted

## Context

Phase 2B requires reproducible, bounded public-source acquisition before a
fixed corpus, evidence freezing, or proposal evaluation can occur. Two bounded,
browser-only candidate-nomination activities encountered GitHub secondary rate
limits before producing a usable candidate set. These attempts are operational
feasibility evidence, not pilot findings. Browser-only discovery is therefore
unsuitable as the default Phase 2B acquisition method.

This decision does not change StackScout's capability-first or architecture-
directed product direction. GitHub transport remains upstream of reviewed
knowledge and outside the deterministic recommendation path.

Background on the operational constraint is available in GitHub's official
[REST API rate-limit documentation](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)
and [REST API best practices](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api).

## Decision

A future, separately authorized Phase 2B scope may use an external, read-only
GitHub API channel. The channel is limited to public GitHub sources and a named,
reviewed endpoint and field allowlist.

Candidate nomination may retrieve only the minimum public metadata needed to
record a repository coordinate and intended test category. A later human-only
corpus-freeze step may retrieve only the separately approved static evidence
surfaces and immutable revisions. All retrieval stays external to StackScout's
application, seed corpus, trusted runtime data, and user request path.

Requests must be serial, budgeted, rate-aware, and stop on a rate-limit, access,
scope, retention, or containment failure. There are no silent retries, scraping,
broad crawling, or fallback to another provider.

Authentication type, exact permissions, endpoint and field allowlist, request
budget, retry and backoff policy, retention, external workspace, and execution
procedure remain unresolved until a later reviewed API access scope packet.
This ADR does not prescribe a personal access token, GitHub App, token scope, or
endpoint, and neither it nor the later packet authorizes an API call. For
nomination, the existing Stage 2 candidate-nomination authorization is the
distinct actual-run decision and may define a bounded API preflight within that
same Stage 2 activity. For later source freezing, the existing Stage 4 corpus-
freeze go/no-go is the distinct actual-run decision. This mapping creates no
seventh or unnumbered execution stage, gate, or authority.

Credentials may never enter repository files, application code, prompts, model
input, logs, evidence, fixtures, proposals, or trusted data. No agent or model
may control credentials or make arbitrary API requests.

## Consequences

- Phase 2B remains blocked until a later API access scope packet is reviewed and
  the applicable existing authority approves a precise, least-privilege
  activity: Stage 2 for bounded API preflight and nomination, or Stage 4 for
  source freezing.
- API output remains external and untrusted. It cannot affect discovery,
  recommendations, or trusted corpus data without the existing human review and
  destination-specific promotion gates.
- The current six-stage Phase 2B lifecycle remains unchanged; this decision adds
  no stage and grants no lifecycle authority.
- Prior browser artifacts remain quarantined and cannot become corpus input.
- Phase 2B gains a reproducible acquisition path without creating runtime
  GitHub integration, generic search, user-connected access, or a live
  recommendation dependency.

## Alternatives Considered

**Continue browser-only nomination.** Rejected as operationally unreliable after
two bounded activities stopped on secondary rate limits.

**Generic GitHub search or crawling.** Rejected because it conflicts with
architecture-directed, reviewed discovery and the prohibition on popularity-led
recommendations.

**Immediate runtime GitHub integration.** Rejected as outside Phase 2B and the
deterministic recommendation boundary.

**Private or user-connected access.** Rejected as outside Phase 2.

**Automatic model-led acquisition or promotion.** Rejected because agents and
models may propose only; human review and separate promotion remain mandatory.
