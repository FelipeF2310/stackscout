# Phase 2B Public GitHub API Access Scope Packet

## 1. Status, authority, and lifecycle position

**Status:** Proposed for Terra review.

This document is a human-readable acquisition scope packet for one possible
future Phase 2B Stage 2 activity. It is not an implementation specification,
credential request, execution authorization, or API client design.

Reviewing, approving, or merging this packet grants no authority to:

- call an API or create, configure, validate, or use a credential;
- authenticate to GitHub or access a public, private, or user-connected source;
- nominate or classify a Repository;
- acquire source content, freeze a corpus, or create evidence;
- transmit data to a model or run an agent, classifier, or validator; or
- change StackScout code, data, runtime behavior, recommendations, or trusted
  knowledge.

The packet is a cross-cutting prerequisite inside the existing six-stage Phase
2B lifecycle. It creates no seventh or unnumbered stage, gate, or authority.
Only a later, explicit **Stage 2 candidate-nomination actual-run
authorization** could permit the bounded API preflight and nomination activity
proposed here. That later authorization must adopt this packet by immutable
revision and name the human operator, exact query set, date, workspace,
retention decision, and stop scope before any request occurs.

Stage 4 remains separately governed by a later corpus-freeze scope packet and
Stage 4 corpus-freeze go/no-go. This packet intentionally proposes no Stage 4
endpoint, evidence surface, revision-pinning procedure, or source-freezing
authority.

## 2. Problem statement and decision

Two bounded browser-only Stage 2 nomination activities encountered GitHub
secondary rate limits before producing a usable candidate set. Those events are
operational feasibility evidence, not pilot findings, Repository evidence, or
classification results. Browser-only operation does not provide a sufficiently
repeatable request boundary, field allowlist, transient rate-header inspection,
or enforceable stop policy for the first offline pilot.

The proposed decision is to make one narrowly bounded, human-operated use of
GitHub's public REST API eligible for a later Stage 2 authorization. The channel
would identify public `owner/repository` coordinates only. It would remain
external to StackScout and produce only the already approved external,
untrusted nomination-register fields.

GitHub documents primary and secondary rate limits, notes that secondary limits
can occur without published fixed limits, and exposes rate information through
response headers. That makes a bounded, header-aware stop policy possible, but
does not guarantee access or completion. See
[Rate limits for the REST API](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)
(observed 2026-07-16).

This transport decision does not change StackScout's one-way product model:

`final Architecture Brief -> named discovery context -> optional reviewed assets`

Discovery never feeds back into deterministic capability detection, Tool
scoring, Tool selection, alternatives, explanations, recommendation ordering,
or the Architecture Brief. API output remains upstream, external, and
untrusted until separate human review and promotion decisions occur.

## 3. Narrow proposed Stage 2 activity

A later Stage 2 authorization may propose exactly one public-GitHub-only API
preflight followed by one bounded candidate-nomination activity. The preflight
is the first request in the same Stage 2 budget; it is not a separate stage,
run, or authority.

The activity may produce one external, untrusted nomination register with at
most one row for each of the eleven approved test-category slots. Each row may
contain only:

1. public GitHub coordinate or URL;
2. intended test category;
3. observation date; and
4. short human-authored nomination rationale.

The eleven intended slots remain:

1. selected current seed-linked control — duplicate/suppressed Repository case;
2. discovery candidate not represented in the current seed — helpful-result
   case;
3. clear runtime implementation boundary case;
4. managed-service SDK boundary case;
5. multi-purpose or monorepo identity boundary case;
6. documentation-only or example-only boundary case;
7. archived or superseded boundary case;
8. fork, mirror, or renamed identity boundary case;
9. ambiguous capability-relevance boundary case;
10. missing or ambiguous licensing boundary case; and
11. explicit negative or out-of-scope boundary — honest no-result case.

The register format is exactly those four columns. It may contain fewer than
eleven rows. An absent row is the only retained indication that a slot was not
filled; Stage 2 retains no separate incomplete-category list, reason, status,
or activity record. Each rationale must be one short human-authored sentence
that identifies only the intended slot and explicitly makes no identity,
classification, capability, fit, license, security, lineage, inclusion, or
recommendation conclusion.

An intended category is an unverified testing hypothesis. It is not evidence
that a Repository has the named property.

A later Stage 2 authorization may nominate a coordinate for an intended slot
only when that hypothesis can be reached using the approved endpoint and query
boundary, or when the coordinate is the predeclared local seed-linked control.
If identifying a lead for a slot would require a forbidden response field,
description, license metadata, README, documentation, code, source content,
Repository classification, or a fit or Capability conclusion, the slot must
remain unfilled. The intended category remains a hypothesis about what a later
corpus review might test, never a claim about the nominated Repository.

The activity excludes:

- README, documentation, code, file, issue, discussion, pull-request, release,
  security-policy, package, license, commit, branch, tag, tree, or raw-content
  retrieval or review;
- source-content retention, immutable revision discovery, evidence collection,
  corpus selection, or corpus freezing;
- Repository classification, current-Tool candidacy, runtime Capability
  fulfillment, fit, prerequisite, limitation, tradeoff, maintenance, security,
  license, lineage, relationship, quality, or suitability conclusions;
- stars, forks, watchers, popularity, activity, or search order as eligibility,
  ranking, fit, or recommendation signals;
- agent or model access, classification, scoring, correction, or selection;
- promotion, trusted-data writes, runtime integration, or user-facing use; and
- private sources, authentication fallback, user-connected sources, providers
  other than public GitHub, or broader exploratory research.

Partial completion is valid and informative. A rate limit, access boundary,
unsupported category query, or absence of a suitable coordinate within the
fixed first page leaves the slot without a row. It must not trigger a broader
query, extra endpoint, browser or human source inspection, retry, replacement,
or substituted candidate.

## 4. Exact endpoint and field proposal

The proposed endpoint allowlist contains two read-only `GET` endpoints. GitHub
documents that both can be used without authentication for public resources.
See [REST API endpoints for search](https://docs.github.com/en/rest/search/search)
and [REST API endpoints for repositories](https://docs.github.com/en/rest/repos/repos)
(both observed 2026-07-16).

All requests must use `Accept: application/vnd.github+json`; text-match and
other custom media types are prohibited. The later Stage 2 authorization must
pin the GitHub REST API version then under review; this packet does not silently
float to a future API version. GitHub recommends that JSON media type in the two
endpoint references above (observed 2026-07-16).

### 4.1 Search repositories

**Endpoint:** `GET /search/repositories`

**Purpose:** Produce bounded public coordinate leads only for non-seed slots
whose intended hypotheses can be reached honestly through the approved query
surface. Ten searches is a ceiling, not a requirement to query every non-seed
slot.

**Permitted request parameters:**

- `q` is required. Every exact query must be predeclared in the later Stage 2
  authorization and mapped to one approved intended test category. The query
  terms and allowed qualifiers must be sufficient to explain why the coordinate
  is an unverified lead for that slot without inspecting any forbidden field or
  making a Repository claim.
- Every query must include `is:public` and `in:name`. GitHub documents
  `is:public` as the repository-visibility qualifier and `in:name` as limiting
  term matching to Repository names. See
  [Searching for repositories](https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories)
  (observed 2026-07-16).
- Only these category-bound metadata qualifiers may additionally appear when
  the later authorization names and justifies them: `fork:only`, `mirror:true`,
  `archived:true`, and `template:true`. They support only the corresponding
  boundary-test hypothesis; a match is not a classification or lineage fact.
  Exact predeclared coordinates use `GET /repos/{owner}/{repo}` rather than a
  search qualifier. Owner- or organization-scoped search is not necessary for
  this activity and is prohibited.
- `per_page=10` and `page=1` are fixed.
- `sort` and `order` must be omitted. Stars, forks, followers, size, activity,
  language, topic, license, sponsorship, issue-count, README, code, and content
  qualifiers are prohibited.

GitHub states that omitted `in` searches names, descriptions, and topics, while
`in:readme` searches README content. Requiring `in:name` prevents the proposed
activity from intentionally searching source-adjacent text. See
[Searching for repositories](https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories)
(observed 2026-07-16).

**Permitted response fields:**

- `items[].full_name` and `items[].html_url` may be exposed transiently to the
  human operator.
- `items[].private` and `items[].visibility`, when present, may be checked
  transiently only to fail closed on a non-public result. They must not enter
  the nomination register.
- `incomplete_results` may be checked only as an operational stop condition. An
  incomplete response cannot produce a nomination.

All other body fields must be discarded immediately. This includes Repository
IDs; owner objects and profile data; names or URLs other than the returned
coordinate and landing URL; descriptions; topics; language; license data;
stars, forks, watchers, scores, and counts; timestamps; sizes; default branches;
archive, fork, mirror, and template fields; and all source, issue, release,
package, security, and content URLs.

The human operator must ignore API result order. Within the permitted first
page, only `full_name` values may be normalized lexicographically to select the
first nonduplicate coordinate for the intended slot. Selection is permitted
only when the predeclared query itself supports the intended hypothesis within
the approved boundary. Otherwise the slot remains unfilled. The mechanical
rule is for reproducibility only; it makes no identity, classification, fit,
quality, popularity, or priority claim.

### 4.2 Get a repository

**Endpoint:** `GET /repos/{owner}/{repo}`

**Purpose:** Verify only that the returned public coordinate and landing URL
match the predeclared or search-returned lead, including the one seed-linked
control coordinate supplied by the later Stage 2 authorization from local
trusted data. A match is a transport check only. It does not establish canonical
identity, lineage, rename handling, or any Repository fact; those belong to
later reviewed corpus-freeze and classification work.

**Permitted request parameters:**

- `owner` and `repo` must exactly match either the predeclared seed-linked
  control coordinate or a lead returned by an approved search request in the
  same activity.
- No query parameters are permitted.

**Permitted response fields:**

- `full_name` and `html_url` may be retained in the nomination row.
- `private` and `visibility`, when present, may be checked transiently only to
  fail closed. They must not be retained.

Every other response field must be discarded immediately, including Repository
IDs, owner data, descriptions, topics, license metadata, popularity or activity
metrics, timestamps, branches, archive/template/fork/mirror indicators, parent
or source objects, and content-specific URLs. A redirect, returned-coordinate
mismatch, missing Repository, visibility ambiguity, or unexpected response
shape stops that slot; the operator must not follow a redirect or investigate
identity or lineage under this Stage 2 scope.

### 4.3 Transient operational inspection and excluded endpoints

For each allowed request, the human operator may inspect the response status;
`x-ratelimit-limit`, `x-ratelimit-remaining`, `x-ratelimit-used`,
`x-ratelimit-reset`, and `x-ratelimit-resource`; and `retry-after`, when
returned. Inspection is solely for deciding whether to stop. No status, header,
request count, timestamp, endpoint label, query identifier, or other
operational metadata may be retained in a manifest, log, register field, or
separate artifact.

GitHub documents those rate headers and the possible `retry-after` response for
rate-limit handling. See
[Rate limits for the REST API](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)
(observed 2026-07-16).

No other endpoint is permitted. In particular, the activity must not call
`GET /rate_limit`, because GitHub recommends using response headers where
possible and notes that the rate-limit endpoint can itself count toward
secondary limits. See the same rate-limit documentation (observed 2026-07-16).

README, content, tree, commit, branch, tag, release, license, topic, language,
community, security, issue, pull-request, package, user, organization-member,
GraphQL, archive, clone, raw-content, and search endpoints other than
`GET /search/repositories` are outside the allowlist.

Stage 4 would need different endpoints, fields, immutable-revision handling,
evidence surfaces, retention rules, and human review. None are proposed here.
Any Stage 4 API extension requires a later packet revision or separate scope
extension, review, and Stage 4 corpus-freeze go/no-go.

## 5. Authentication and credential containment recommendation

### 5.1 Viable approaches

**Unauthenticated public REST requests.** GitHub documents that the two proposed
endpoints work without authentication for public resources. Unauthenticated
requests have a lower primary rate limit associated with the originating IP,
and repository search has its own lower custom limit. See
[Rate limits for the REST API](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api),
[REST API endpoints for search](https://docs.github.com/en/rest/search/search),
and [REST API endpoints for repositories](https://docs.github.com/en/rest/repos/repos)
(observed 2026-07-16).

**Fine-grained personal access token.** GitHub documents that personal access
tokens act as the user's identity and recommends fine-grained tokens over
classic tokens when a personal access token is appropriate. The search endpoint
requires no fine-grained permission, while the repository endpoint documents
read access to Repository metadata for fine-grained tokens. See
[Authenticating to the REST API](https://docs.github.com/en/rest/authentication/authenticating-to-the-rest-api)
and [Keeping your API credentials secure](https://docs.github.com/en/rest/authentication/keeping-your-api-credentials-secure)
(observed 2026-07-16).

**GitHub App.** GitHub recommends an App when an integration acts on behalf of
an organization or another user. That introduces installation, permission, and
credential lifecycle overhead not justified by one human-operated public-data
activity. See
[Keeping your API credentials secure](https://docs.github.com/en/rest/authentication/keeping-your-api-credentials-secure)
(observed 2026-07-16).

### 5.2 Recommendation

Use **unauthenticated public REST requests** for the first future Stage 2
activity. This is the least-privilege design because it creates no credential,
conveys no private-resource authority, and supports the two proposed public
endpoints. The small request budget below is intentionally compatible with this
choice, although no rate-limit outcome is guaranteed.

If unauthenticated access is denied, throttled, unavailable, or operationally
insufficient, the activity stops. It must not create or fall back to a personal
access token, GitHub App, GitHub CLI session, shared credential, alternate
account, proxy, browser, scraper, or provider. A credentialed alternative would
require a revised packet, product/security review, and a new explicit Stage 2
actual-run decision.

Because the recommendation is unauthenticated, the proposed run has no
credential to contain. Nevertheless, any future revision that introduces a
credential must preserve these non-negotiable boundaries:

- only the human operator handles it in the approved external environment;
- it never enters StackScout files, application state, source bundles, prompts,
  model context, logs, screenshots, artifacts, fixtures, proposals, evidence,
  trusted data, shell history, or agent-controlled tools;
- no agent or model can read, control, transmit, refresh, rotate, or make a
  request with it; and
- exposure or suspected exposure stops the activity and triggers the reviewed
  incident/remediation path before any later work.

GitHub advises treating API credentials like passwords, limiting permissions
and lifetime, not hardcoding them, and not passing personal tokens as plaintext
on the command line. See
[Keeping your API credentials secure](https://docs.github.com/en/rest/authentication/keeping-your-api-credentials-secure)
(observed 2026-07-16). These official practices do not themselves authorize a
credential or define StackScout's future storage mechanism.

## 6. Rate, budget, pagination, and failure policy

### 6.1 Fixed proposed budget

The entire future Stage 2 activity is limited to **21 HTTP requests**, each
counted when attempted regardless of outcome:

- one `GET /repos/{owner}/{repo}` request for the predeclared seed-linked
  control; this first request is also the API preflight;
- at most ten `GET /search/repositories` requests, only for non-seed slots with
  an approved query that can reach the intended hypothesis without forbidden
  inspection or inference; and
- at most ten `GET /repos/{owner}/{repo}` confirmation requests, one for each
  selected search lead.

The activity may produce at most eleven nomination rows and no alternates. The
ten-search allowance is a ceiling, not a completion target. It does not spend
unused requests on unsupported slots, retries, replacement searches, additional
pages, new categories, or broader queries.

The budget tests only whether the bounded transport can support one nomination
register. It is not a throughput target, ecosystem-coverage claim, rate-limit
entitlement, or precedent for Stage 4.

### 6.2 Serial execution and pagination

Requests must be strictly serial: the next request starts only after the prior
response is complete and its allowed headers have been reviewed. GitHub advises
making requests serially to avoid secondary rate limits. See
[Best practices for using the REST API](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api)
(observed 2026-07-16).

Search requests must be separated by at least seven seconds. GitHub currently
documents a custom unauthenticated search limit of ten requests per minute; the
seven-second interval is StackScout's conservative dated operating rule, not a
guaranteed safe rate or permanent GitHub limit. See
[REST API endpoints for search](https://docs.github.com/en/rest/search/search)
(observed 2026-07-16). Any contrary response header or limit signal overrides
the interval and stops the activity.

Repository search is fixed to `per_page=10` and `page=1`. No `Link` pagination
URL may be followed. GitHub documents `per_page`, `page`, and `Link`-header
pagination behavior; the one-page restriction is StackScout's stricter scope,
not a GitHub platform limit. See
[Using pagination in the REST API](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api)
(observed 2026-07-16).

### 6.3 Rate and retry policy

Before each subsequent request, the human operator reviews the allowed rate
headers. No request is made when the prior response indicates exhaustion,
denial, a `retry-after` condition, or an unexplained rate-boundary concern.

There is **no automatic or same-activity retry** after a primary or secondary
rate-limit response, abuse signal, timeout, transport error, redirect,
incomplete search response, or access denial. The operator stops and retains no
operational finding, manifest, log, or stop report. Any already-written
four-field nomination row is the entire permissible external activity record;
no separate stop, status, manifest, or operational record may be created.
Absent rows are the only retained sign of partial completion. GitHub's general
best practices describe waiting and retry behavior for rate-limit responses;
StackScout deliberately adopts the stricter no-retry policy for this bounded
activity. See
[Best practices for using the REST API](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api)
and [Rate limits for the REST API](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)
(observed 2026-07-16).

### 6.4 Stop conditions

The activity stops immediately on any of these conditions:

- primary or secondary rate limiting, an abuse signal, access denial, timeout,
  transport failure, redirect, or `incomplete_results=true`;
- an absent or materially changed official endpoint contract;
- an unexpected field in the reduced operator view or retained output, response
  shape, content type, visibility state, endpoint, HTTP method, query,
  parameter, page, or field request;
- request-budget exhaustion or an attempted retry, pagination follow, query
  expansion, provider fallback, authentication, or source-content access;
- scope drift toward evidence, revisions, corpus selection, classification,
  ranking, fit, security, licensing, Tool candidacy, relationships, or runtime
  use;
- any credential creation, request, exposure, persistence, or agent/model
  access;
- any raw response, unapproved field, source content, or unreviewed observation
  entering StackScout, trusted data, a prompt, model context, or the nomination
  register;
- an unavailable official GitHub documentation source needed to interpret the
  request or response; or
- uncertainty about whether the approved boundary still applies.

Stopping produces no implied permission to repair, retry, authenticate, widen
scope, replace a candidate, or begin another activity. A later attempt requires
a new Terra decision. No stop record may be retained beyond any four-field rows
already present in the nomination register.

## 7. External workspace and retention proposal

The later Stage 2 authorization must name one host-local, disposable workspace
outside the StackScout repository, protected worktrees, trusted seed corpus,
application runtime, synchronized cloud folders, and model-accessible context.
This packet proposes the boundary but creates no directory or artifact.

Access is limited to the named human operator and the named human reviewer. No
agent, model, application process, worker, or runtime user request may access
the workspace.

The only activity artifact that may be retained there is the four-field
external, untrusted nomination register. The reviewed packet and Stage 2
authorization remain in their governance location; they are not copied into the
activity workspace. No request manifest, raw-response record, operational log,
header or status record, incomplete-category list, stop report, cache, or other
activity artifact may be retained.

Raw API response bodies, response statuses, rate headers, request counts, and
other operational state may exist only transiently long enough for the human
operator to reduce a permitted response to the four register fields or decide
to stop, then must be discarded. Credentials, source content, raw responses,
descriptions, topics, metrics, model inputs or outputs, browser artifacts,
screenshots, caches, and unreviewed observations must not be retained. The
register must not enter StackScout, seed data, fixtures, proposals, evidence,
trusted knowledge, runtime data, or a model context.

Before any future request, the Stage 2 authorization must record a named human
operational/retention decision covering the exact workspace, access list,
retention deadline, deletion owner, and deletion confirmation. The decision
must consider the GitHub API Terms and applicable data-handling terms. GitHub's
Terms of Service include API-specific conditions and prohibit attempts to evade
rate limits. See
[GitHub Terms of Service, API Terms](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service)
(observed 2026-07-16).

That human decision is a scoped operational and retention judgment, not a claim
of legal compliance. If the decision is absent, uncertain, or conflicts with
the reviewed terms, the activity remains blocked.

## 8. Human, agent, and model boundary

The proposed future activity is human-operated and read-only. The human operator
alone performs the predeclared requests and mechanical field reduction in the
approved external workspace.

No agent controls or receives:

- network requests, API clients, request timing, endpoint selection, query
  strings, parameters, pagination, redirects, retries, or fallback behavior;
- credentials, authentication state, environment secrets, or response bodies;
- nomination selection, retention, deletion, or operational stop decisions; or
- access to GitHub, the external workspace, the nomination register, or raw
  operational material.

No model receives any request, response, coordinate, query, Repository metadata,
source content, register row, or retained artifact under Stage 2. A future
model-inference transport belongs only to Stage 6 after a separately reviewed
classification execution packet, containment proof, and explicit Stage 6
classification-run go/no-go.

Public API data remains untrusted. It cannot alter an Architecture Brief,
Capability, current Tool, score, selection, ordering, explanation, relationship,
seed record, runtime recommendation, or user-facing discovery result.

## 9. Product-boundary checks

- **Repository is not Tool.** A coordinate in an untrusted nomination register
  is not a current Tool, runtime implementation, capability mapping, Tool
  candidate, or recommendation.
- **Nomination is not classification or evidence.** An intended category is a
  test-slot hypothesis. The four-field register contains no claim-level evidence
  and cannot become a frozen corpus without later independent review.
- **Backing Repository suppression remains unresolved downstream work.** A
  Repository that merely backs an already selected Tool must not later appear as
  a second discovery recommendation. Shared backing Repositories must not create
  duplicate discovery results. Stage 2 records no conclusion about that
  relationship.
- **No result remains valid.** Failure to nominate a coordinate or later failure
  to find a reviewed asset must remain visible and honest. It must not trigger
  generic GitHub search, wider crawling, raw proposals, or unreviewed suggestions.
- **Popularity is not relevance.** Stars, forks, watchers, activity, search
  position, and other popularity signals are discarded because they do not show
  evidence-backed usefulness for a named Architecture Brief context. They may
  not determine eligibility, ordering, fit, or recommendation.

## 10. Risks, alternatives, and unresolved Terra decisions

### 10.1 Risks and controls

- **Rate limiting and provider policy change:** primary or secondary limits may
  stop the activity, and official endpoint behavior may change. Control: dated
  documentation review, fixed budget, header monitoring, serial requests, no
  retry, and fail closed.
- **Credential leakage:** an authenticated fallback could expose user authority
  or secrets. Control: unauthenticated recommendation and no same-activity
  fallback. Any future credential requires a revised packet.
- **Over-collection:** Repository responses contain many fields beyond the four
  output fields. Control: explicit body-field reduction, immediate discard, no
  raw-response or operational-metadata retention, and stop on unexpected
  exposure.
- **Source/content boundary drift:** search can inspect README text and other
  endpoints can retrieve content. Control: mandatory `in:name`, two-endpoint
  allowlist, one page, and immediate stop on content access.
- **Popularity and result-order bias:** search results contain popularity fields
  and an ordered response. Control: discard metrics, ignore response order, and
  use coordinate-only lexical normalization.
- **Accidental Stage 4 expansion:** metadata endpoints could become a path toward
  revisions or evidence. Control: explicit Stage 4 exclusion and later separate
  scope, review, and Stage 4 go/no-go.
- **Misleading authority language:** a reviewed packet could be mistaken for
  permission to make requests. Control: packet status and NEXT_STEPS state that
  only a later explicit Stage 2 authorization may permit the named activity.
- **False confidence from an untrusted register:** a category label may be read
  as a fact or manufactured from forbidden metadata. Control: fixed hypothesis
  wording, query-supported nomination only, mandatory unfilled slots when the
  approved surface is insufficient, no classification fields, and independent
  corpus review.

### 10.2 Alternatives considered

- **Browser-only public nomination:** rejected as the default because two
  bounded attempts encountered secondary limits and did not establish a
  repeatable, auditable acquisition path.
- **Unauthenticated public REST API:** recommended for the first proposed
  Stage 2 activity. It avoids credentials and supports the required public
  endpoints, with lower rate headroom and possible shared-IP limits accepted as
  stop conditions.
- **Authenticated public REST API:** not recommended for the first activity.
  Higher rate headroom does not justify credential authority for 21 bounded
  public requests. It remains a possible later revision only after new
  product/security review.
- **Generic GitHub search, broad crawling, or scraping:** rejected because it is
  neither architecture-directed nor bounded reviewed discovery.
- **Runtime GitHub integration:** rejected because it would breach the
  deterministic recommendation and reviewed-data boundaries.

### 10.3 Genuine remaining Terra decisions

Before drafting a separate Stage 2 actual-run authorization, Terra must decide
whether to approve:

1. unauthenticated public REST as the first-run authentication decision, with no
   credentialed fallback;
2. the exact two-endpoint, field, qualifier, and one-page allowlist;
3. the 21-request ceiling, eleven-row ceiling, serial execution, lexical
   coordinate normalization, seven-second search interval, and no-retry policy;
4. the exact REST API version, future query strings, and their mapping to the
   reachable intended categories, including which slots must remain unfilled
   under the approved surface;
5. the named human operator and reviewer, exact external workspace, access
   boundary, observation date, retention deadline, deletion owner, and
   human-authored rationale template;
6. the exact human-operated client and field-reduction procedure, including how
   raw responses and operational metadata are kept out of retained artifacts;
   and
7. whether the current official documentation and applicable API/data-handling
   terms remain sufficient on the planned activity date.

The packet makes a clear recommendation on authentication, endpoints, fields,
budget, and failure policy. It does not manufacture a token choice, Stage 4
design, or execution permission.

## 11. Approval checklist

Terra must affirm every item below before a separate Stage 2 actual-run
authorization can be drafted:

- [ ] The packet remains Stage 2-only and creates no seventh stage.
- [ ] Packet approval grants no API, credential, authentication, source,
      nomination, model, or execution authority.
- [ ] Only a later explicit Stage 2 authorization may permit the bounded
      preflight and nomination activity.
- [ ] The only endpoints are `GET /search/repositories` and
      `GET /repos/{owner}/{repo}`; no Stage 4 or content endpoint is present.
- [ ] Search uses exact predeclared category queries, `is:public`, `in:name`,
      `per_page=10`, `page=1`, the narrow qualifier allowlist, and no sort.
- [ ] A coordinate receives an intended category only when the approved query
      surface or predeclared seed-linked control reaches that hypothesis without
      forbidden metadata, source inspection, classification, or fit/Capability
      conclusions; otherwise the slot remains unfilled.
- [ ] Only `full_name` and `html_url` may reach the nomination register;
      visibility fields and `incomplete_results` are transient fail-closed
      checks, and all other response fields are discarded.
- [ ] The activity is unauthenticated, with no credential creation or fallback.
- [ ] The maximum is 21 serial attempted requests, eleven rows, and ten searches;
      each is a ceiling, not a completion target. Search remains one page, at
      least seven seconds apart, with no alternates, retries, redirects, or
      pagination.
- [ ] Rate headers are reviewed before proceeding, and every listed stop
      condition fails closed without retaining headers, statuses, a manifest,
      log, incomplete-category list, or stop report.
- [ ] The exact external workspace, operator/reviewer access, retention
      deadline, deletion owner, and deletion confirmation will be named in the
      later authorization.
- [ ] The nomination register contains only coordinate/URL, intended category,
      observation date, and short human-authored rationale. Missing rows are the
      only retained indication of unfilled slots.
- [ ] No raw response, source content, credential, unreviewed observation, agent
      or model data, or external artifact can enter StackScout or trusted data.
- [ ] Repository remains distinct from Tool; nomination remains distinct from
      evidence, classification, corpus selection, review, promotion, and
      recommendation.
- [ ] Popularity and API result order cannot determine eligibility, fit,
      ordering, or recommendation.
- [ ] A partial register and honest no-result remain acceptable outcomes.
- [ ] Stage 4 source freezing requires a later separately scoped extension and
      Stage 4 go/no-go.
- [ ] A new Terra decision is required after any stop, scope change, provider
      policy change, or proposed credentialed access.

## Official GitHub documentation basis

All sources below were consulted only as platform-policy documentation and were
observed on 2026-07-16. No Repository page, search result, API response, source
file, or user profile was accessed.

- [REST API endpoints for search](https://docs.github.com/en/rest/search/search)
- [REST API endpoints for repositories](https://docs.github.com/en/rest/repos/repos)
- [Searching for repositories](https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories)
- [Authenticating to the REST API](https://docs.github.com/en/rest/authentication/authenticating-to-the-rest-api)
- [Keeping your API credentials secure](https://docs.github.com/en/rest/authentication/keeping-your-api-credentials-secure)
- [Rate limits for the REST API](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)
- [Best practices for using the REST API](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api)
- [Using pagination in the REST API](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api)
- [GitHub Terms of Service](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service)
