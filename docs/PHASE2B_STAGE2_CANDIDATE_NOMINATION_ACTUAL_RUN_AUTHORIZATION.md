# Phase 2B Stage 2 Candidate-Nomination Actual-Run Authorization

## 1. Status, authority, and governing revision

**Status:** Proposed for Terra TPM review and recommendation. Before and after
review, this is a scope packet only; it is inactive and grants no external
authority.

This document defines the exact bounded Stage 2 candidate-nomination activity
that Felipe may later approve or reject. It is one Stage 2 activity inside the
existing six-stage Phase 2B lifecycle, not a new stage, API entitlement, pilot,
or implementation plan.

This authorization explicitly adopts
[`PHASE2B_GITHUB_API_ACCESS_SCOPE_PACKET.md`](./PHASE2B_GITHUB_API_ACCESS_SCOPE_PACKET.md)
at immutable revision
`7790097d6f9889a1cd7ba9bb8b778f70fe121e71`. The adopted packet remains the
authority for endpoint, field, transport, retention, and stop boundaries. Any
conflict with that revision blocks the activity; this document cannot silently
override it.

Terra performs the required TPM review and recommends go or no-go only. Terra's
review, recommendation, documentation approval, merge, or publication grants no
API, source-access, nomination, workspace, model, or execution authority.
Felipe is the sole authority who may later issue an explicit Stage 2 actual-run
go/no-go. Only that later Felipe decision, after every checklist item in Section
13 is affirmed, may authorize the exact activity named here.

The agent/model-reviewable static controls are limited to the values named in
Section 12. The proposed activity date, workspace, and retention details are
human operational and retention details for scope review, not static controls
for agent/model use. No value becomes active merely because a date arrives. A
stop, expiration, or material change requires revised scope, renewed Terra
review and recommendation, and a new explicit Felipe go/no-go.

## 2. Exact purpose and non-goals

The possible activity is one human-operated, unauthenticated, public, read-only
GitHub REST preflight and candidate-nomination sequence. Its sole possible
output is one external, untrusted register of coordinate leads for later,
independent corpus-freeze planning.

It does not authorize or perform:

- Repository identity or lineage verification;
- source-content, README, documentation, code, release, license, security, or
  other evidence access;
- revision pinning, evidence creation, corpus selection, or corpus freezing;
- Repository classification, Tool candidacy, Capability relevance, fit,
  relationship, maintenance, security, licensing, quality, or suitability
  conclusions;
- popularity ranking, scoring, recommendation, promotion, or trusted-data
  writes;
- browser use, scraping, cloning, downloads, authentication, credentials,
  agent/model activity, or runtime integration; or
- Stage 3 or any later Phase 2B activity.

The activity tests bounded public transport and nomination discipline only. It
cannot prove ecosystem coverage, source quality, discovery usefulness, or user
value.

## 3. Pinned static transport controls

Every possible request is pinned to all of these controls:

- unauthenticated public GitHub REST only;
- host: `api.github.com` only;
- method: `GET` only;
- `Accept: application/vnd.github+json`;
- `X-GitHub-Api-Version: 2026-03-10`, subject to official-documentation
  revalidation on the activity date;
- `User-Agent: StackScout-Phase2B-Stage2-Nomination/1.0`;
- the two adopted routes only: `GET /search/repositories` and
  `GET /repos/{owner}/{repo}`;
- `per_page=10` and `page=1` for every search; and
- no `sort`, `order`, custom media type, redirect following, or pagination.

The exact `User-Agent` is a non-secret committed static control. A missing or
different value stops the activity and requires revised scope, renewed Terra
review and recommendation, and a new explicit Felipe go/no-go.

No token, GitHub CLI session, GitHub App, personal access token, authentication
state, proxy, browser, scraper, fallback, retry, pagination, or alternate
provider is permitted. Unauthenticated access failure is a stop condition, not
permission to create a credential or change transport.

Official GitHub documentation observed on 2026-07-16 identifies
`2026-03-10` as a supported REST API version, documents the approved repository
search qualifiers, and requires a valid `User-Agent`:

- [API versions](https://docs.github.com/en/rest/about-the-rest-api/api-versions)
- [Searching for repositories](https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories)
- [Getting started with the REST API](https://docs.github.com/en/rest/using-the-rest-api/getting-started-with-the-rest-api)

These documentation observations grant no request authority. If run-date
official documentation no longer supports any pinned control, the activity is
blocked.

## 4. Feasibility and slot boundary

Only six slots are honestly reachable through the approved static controls.
Each attempted category is an unverified boundary-test hypothesis, never a fact
about a Repository.

### Attempted slots

1. **Slot 1 — selected current seed-linked control, duplicate/suppression
   hypothesis.** Uses only the predeclared local control coordinate
   `supabase/supabase`.
2. **Slot 5 — multi-purpose or monorepo name-boundary hypothesis.** A
   `monorepo` name match is only a lead for later evaluation; it does not
   establish repository structure or purpose.
3. **Slot 6 — documentation-only or example-only name-boundary hypothesis.** An
   `examples` name match is only a lead; it does not establish documentation-
   only, example-only, or source-content status.
4. **Slot 7 — archived-boundary hypothesis.** The approved qualifier can
   nominate a lead for later review; Stage 2 does not establish identity,
   supersession, maintenance, or suitability.
5. **Slot 8 — mirror-boundary hypothesis.** The approved qualifier can nominate
   a lead for later review; Stage 2 does not establish lineage, ownership,
   synchronization, fork, or rename status.
6. **Slot 11 — Template/out-of-scope hypothesis.** The approved qualifier can
   nominate a Repository lead for a later negative-boundary test. It does not
   approve Templates as a Phase 2 asset type.

### Intentionally unfilled slots

- **Slot 2 — discovery candidate outside the current seed / helpful-result
  case:** requires a product-fit or seed-representation judgment.
- **Slot 3 — clear runtime implementation case:** requires an implementation
  and runtime-suitability conclusion.
- **Slot 4 — managed-service SDK case:** requires an SDK or service-boundary
  conclusion.
- **Slot 9 — ambiguous Capability-relevance case:** requires a Capability-
  relevance judgment.
- **Slot 10 — missing or ambiguous licensing case:** requires forbidden license
  metadata or source inspection.

Those five slots must remain absent. Their absence is valid and must not trigger
another query, endpoint, browser check, metadata inspection, substitute lead, or
unused-budget reuse.

## 5. Exact request matrix and sequence

Requests are serial and occur only in this order. Each attempt counts toward the
ceiling regardless of outcome.

1. **Seed-control preflight and Slot 1 transport check**
   - Request: `GET /repos/supabase/supabase`
   - Maximum: one request.
   - Purpose: verify only that returned `full_name` and `html_url` match the
     predeclared lead. It establishes no canonical identity, lineage,
     Repository fact, Tool relationship, or duplicate/suppression conclusion.

2. **Slot 5 search**
   - Endpoint: `GET /search/repositories`
   - Exact `q`: `monorepo in:name is:public`
   - Fixed parameters: `per_page=10`, `page=1`.
   - Maximum: one search plus at most one conditional
     `GET /repos/{owner}/{repo}` transport confirmation.

3. **Slot 6 search**
   - Endpoint: `GET /search/repositories`
   - Exact `q`: `examples in:name is:public`
   - Fixed parameters: `per_page=10`, `page=1`.
   - Maximum: one search plus at most one conditional transport confirmation.

4. **Slot 7 search**
   - Endpoint: `GET /search/repositories`
   - Exact `q`: `archived in:name is:public archived:true`
   - Fixed parameters: `per_page=10`, `page=1`.
   - Maximum: one search plus at most one conditional transport confirmation.

5. **Slot 8 search**
   - Endpoint: `GET /search/repositories`
   - Exact `q`: `mirror in:name is:public mirror:true`
   - Fixed parameters: `per_page=10`, `page=1`.
   - Maximum: one search plus at most one conditional transport confirmation.

6. **Slot 11 search**
   - Endpoint: `GET /search/repositories`
   - Exact `q`: `template in:name is:public template:true`
   - Fixed parameters: `per_page=10`, `page=1`.
   - Maximum: one search plus at most one conditional transport confirmation.

The maximum is eleven attempted requests: one seed-control preflight, five
searches, and at most five conditional transport confirmations. Search requests
must be separated by at least seven seconds. There is no same-activity retry,
replacement query, alternate result, expanded scope, pagination, fallback, or
reuse of an unspent request.

For a search, the human operator ignores API order and may normalize only
`full_name` values lexicographically to select the first nonduplicate lead from
the fixed first page. If no lead satisfies that mechanical rule, the slot
remains absent. A selected lead may receive only one conditional transport
confirmation. A failed confirmation leaves the slot absent; the operator must
not select another result.

No request or row is required. Partial completion and an empty register are
valid outcomes.

## 6. Human operation and review arrangement

The proposed human roles are:

- **Operator:** Felipe.
- **Nomination-row reviewer:** Felipe.
- **Deletion owner:** Felipe.
- **Later actual-run authority:** Felipe alone, after Terra's required TPM
  review and recommendation.

The same person acting as operator and row reviewer lacks independent review.
That limitation is explicit and is permitted only for this narrow, external,
untrusted four-field nomination register. It does not satisfy or weaken later
identity, evidence, corpus-selection, classification, promotion, or trusted-
record review requirements.

Sol, agents, and models may inspect only these committed static controls: the
exact queries, seed-linked control coordinate, endpoint names, REST version,
exact `User-Agent`, request ceiling, and static stop rules. The named workspace,
retention deadline, deletion owner, and deletion-confirmation method are human
operational and retention details recorded for scope review; they are not
agent/model-readable static controls. Agents and models may not access, operate
on, or receive workspace contents, retention material, the register, or any
operational output. They also receive no executed request or parameter, API
response, header, status, raw body, returned lead, or selected coordinate. They
cannot control the client, alter a query or header, select a lead, retry, or make
an operational decision.

## 7. Proposed external workspace and retention

The following values are proposed and inactive:

- **Activity and observation date:** 2026-07-20.
- **Disposable workspace:**
  `/private/tmp/stackscout-phase2b-stage2-nomination-2026-07-20`.
- **Permitted register path:**
  `/private/tmp/stackscout-phase2b-stage2-nomination-2026-07-20/stackscout-phase2b-stage2-nomination-register-2026-07-20.md`.
- **Retention deadline:** 2026-07-27 at 23:59 America/New_York.
- **Deletion owner:** Felipe.
- **Deletion-confirmation method:** after deleting the workspace, Felipe
  privately checks that the named path no longer exists. That private human
  check is the complete confirmation; it is not communicated or recorded.

No workspace or artifact exists by authority of this document. These proposed
values automatically expire unless Felipe's later explicit go/no-go names and
affirms them before the activity. A different date, path, deadline, owner, or
method is a material change requiring revised scope and review.

Deletion confirmation is a private human accountability action, not an activity
artifact or communication. It produces no message, verbal confirmation or
recording, file, log, screenshot, manifest, register field, or other artifact.
It contains no raw response, header, status, query text, coordinate, register
row, source content, or other operational material.

Before any later go/no-go, Felipe must make a scoped human operational and
retention decision that considers the GitHub API Terms and applicable data-
handling terms. That decision is not a claim of legal compliance. An absent,
uncertain, or conflicting decision blocks the activity.

## 8. Strict output and retention boundary

The only artifact that may persist is one external, untrusted register with
exactly these four fields:

1. public GitHub coordinate or URL;
2. intended test category;
3. observation date; and
4. short human-authored rationale.

The rationale template is:

> Unverified lead for the later “<intended test category>” coverage slot; it
> establishes no identity, asset classification, Capability relevance, fit,
> license, security, lineage, inclusion, or recommendation conclusion.

Only the category placeholder may change. An absent row is the only retained
indication that a slot was unfilled.

No raw response, header, status, query text, request count, timestamp, endpoint
label, log, manifest, cache, screenshot, stop report, incomplete-category list,
source content, evidence, classification, model input/output, or operational
record may be retained. Transient status and approved rate-header inspection is
allowed only long enough for Felipe to decide whether to stop. All other
response fields are discarded immediately in volatile memory.

The register remains external and untrusted. It cannot enter StackScout, seed
data, fixtures, proposals, evidence, trusted knowledge, runtime data, or model
context. It is not evidence, a frozen corpus, classification output, review
decision, Tool candidate, discovery result, or promotion artifact.

## 9. Exact human-operated `curl` and `jq` procedure

The only proposed client procedure uses exactly `/usr/bin/curl` 8.7.1 and
`/usr/bin/jq` 1.7.1. This section is a human-readable procedure specification,
not a runnable command, script, or client configuration. A different executable,
version, client, redirect behavior, persistence behavior, or field-reduction
procedure is a material change requiring revised scope, renewed Terra review and
recommendation, and a new explicit Felipe go/no-go.

The procedure is:

1. Felipe alone opens a dedicated, non-persistent terminal session and disables
   shell history before entering any command. He verifies locally that the exact
   executable paths and versions above are available. If history cannot be
   disabled and kept non-persistent, an executable is unavailable, or a version
   differs, the activity is blocked.
2. `/usr/bin/curl` makes only the pinned unauthenticated `GET` requests to
   `api.github.com`, using the two approved routes, exact queries and parameters,
   and all three pinned headers: `Accept`, `X-GitHub-Api-Version`, and
   `User-Agent`. It does not follow redirects, retry, paginate, use cookies or a
   cache, or write a response body or headers to a file.
3. The response body flows directly from `/usr/bin/curl` through volatile memory
   to `/usr/bin/jq`. Raw JSON never prints to the terminal. Curl exposes only the
   response status, content type, and approved rate-header values as transient
   stop inputs; it does not print or retain raw response headers.
4. For a search response, `/usr/bin/jq` fails closed on `private`, `visibility`,
   and `incomplete_results` and emits only `items[].full_name` and
   `items[].html_url`. For a transport-confirmation response, it fails closed on
   `private` and `visibility` and emits only `full_name` and `html_url`. No other
   response-body field may be displayed, transmitted, or retained.
5. Felipe writes a register row only after the transient status, content type,
   approved rate headers, and relevant `jq` checks have all passed. All response
   material is discarded from volatile memory before the next request begins.
6. No agent or model receives the client, workspace contents, request, response,
   selected lead, register, retention material, or operational output.

Any raw JSON or raw header display or persistence, inability to reduce the body
before display, unexpected executable behavior, or inability to enforce any
procedure condition blocks the activity. This documentation correction creates
no command, script, run file, client configuration, raw output, log, shell
history, cache, workspace, or other operational artifact. Felipe's later
go/no-go must affirm this exact procedure before any request.

## 10. Rate and fail-closed stop behavior

Requests are strictly serial. Before each subsequent request, Felipe transiently
reviews only response status and the adopted packet's approved rate headers.
The next search starts no sooner than seven seconds after the prior search.

The activity stops immediately on any condition in the adopted API scope packet,
including:

- primary or secondary rate limiting, abuse signal, access denial, timeout,
  transport error, redirect, or `incomplete_results=true`;
- missing, invalid, or changed `User-Agent`, `Accept`, REST version, endpoint,
  method, query, parameter, page, response shape, visibility state, or content
  type;
- an unsupported or changed official endpoint, version, or qualifier contract;
- request-ceiling exhaustion, retry, replacement, alternate result, query
  expansion, pagination, browser use, authentication, credential use, proxy,
  scraper, fallback, or alternate provider;
- any source-content access, forbidden field exposure to the retained view, raw
  response retention, or operational-record creation;
- drift toward identity, lineage, evidence, revision, corpus, classification,
  Capability, Tool, fit, relationship, security, license, popularity, ranking,
  promotion, runtime, or discovery conclusions;
- agent/model access to operational material;
- a workspace, date, role, retention, deletion, or terms decision that differs
  from the reviewed scope; or
- uncertainty about whether any approved boundary still applies.

A stop leaves only any four-field rows already written. It creates no permission
to repair, retry, authenticate, browse, widen, substitute a candidate, reuse the
budget, create another artifact, or begin Stage 3. A later attempt requires
revised scope, renewed Terra review and recommendation, and a new explicit
Felipe go/no-go.

## 11. Product and later-stage boundaries

- A name or qualifier match is an unverified lead, not a Repository fact.
- The seed control is a static transport control, not identity, lineage,
  evidence, Tool, or duplicate/suppression proof.
- Repository remains distinct from current Tool.
- Nomination remains distinct from classification, evidence, corpus selection,
  promotion, and discovery.
- Stars, popularity, activity, result order, and other discarded fields cannot
  determine eligibility, fit, ordering, or recommendation.
- A missing row, partial register, empty register, and later honest no-result
  are valid outcomes.
- Completion does not authorize Stage 3 corpus-freeze planning, Stage 4 source
  acquisition, any model activity, promotion, or user-facing discovery.

Any later corpus-freeze scope packet must independently evaluate nominations as
untrusted inputs and receive its own review and authority.

## 12. Static-control versus operational-material boundary

Only the exact queries, seed-linked control coordinate, endpoint names, REST
version, exact `User-Agent`, request ceiling, and static stop rules are committed
static controls that agents and models may review. They were not acquired from
GitHub and establish no Repository identity, lineage, classification,
Capability relevance, Tool status, fit, evidence, inclusion, or recommendation.

The named workspace, retention deadline, deletion owner, and private human
deletion-confirmation method are human operational and retention details
recorded for scope review, not agent/model-readable static controls. Agents and
models may not access, operate on, or receive workspace contents, retention
material, the register, or any operational output. Executed parameters, API
responses, headers, statuses, raw bodies, returned leads, and selected
coordinates are likewise operational material that agents and models must never
receive or control.

## 13. Felipe actual-run go/no-go checklist

Terra must first review this completed document and recommend go or no-go. That
recommendation grants no external authority. Before Felipe may issue a separate
explicit Stage 2 actual-run go/no-go, he must affirm every item:

- [ ] The adopted API scope packet revision is exactly
      `7790097d6f9889a1cd7ba9bb8b778f70fe121e71`, with no conflict.
- [ ] Terra completed TPM review and issued a favorable recommendation on this
      exact authorization revision.
- [ ] Felipe accepts the operator, row-reviewer, deletion-owner, and sole-
      authority roles and the same-person independence limitation.
- [ ] The activity date is 2026-07-20, the observation date is 2026-07-20, and
      the official documentation remains current on that date.
- [ ] The proposed workspace, register path, retention deadline, deletion owner,
      and non-retained deletion-confirmation method are exact and acceptable.
- [ ] The human operational/retention decision considered applicable GitHub API
      and data-handling terms without claiming legal compliance and is not
      absent, uncertain, or conflicting.
- [ ] Transport is unauthenticated and pins the exact host, routes, queries,
      parameters, `Accept`, REST version, and `User-Agent` in this document.
- [ ] The request sequence is one seed-control preflight, five one-page searches,
      and at most five conditional confirmations, with eleven attempts maximum.
- [ ] Requests are serial, searches are at least seven seconds apart, and there
      is no retry, replacement, alternate result, pagination, fallback, or
      unused-budget reuse.
- [ ] Only Slots 1, 5, 6, 7, 8, and 11 may be attempted; Slots 2, 3, 4, 9, and
      10 remain intentionally unfilled.
- [ ] The exact `/usr/bin/curl` 8.7.1 and `/usr/bin/jq` 1.7.1 procedure in
      Section 9 is available, shell history can be disabled before commands are
      entered, raw bodies and headers cannot be displayed or persisted, and
      field reduction occurs before any response-body value is displayed,
      without agent/model access.
- [ ] The only retained artifact is the four-field external, untrusted register,
      and every stop condition in Section 10 fails closed.
- [ ] No later Phase 2B stage becomes active through this decision.

If any item is false, incomplete, expired, uncertain, or changed, Felipe cannot
issue a go decision. Approval of the document itself is not a substitute for
this later checklist-based decision.

## 14. Inactive conclusion

This document names a possible bounded Stage 2 activity for review. It creates
no workspace, request, credential, coordinate lead, register row, nomination,
classification, source acquisition, model activity, or later-stage authority.
The next permitted decision after a favorable Terra recommendation is only
Felipe's explicit go/no-go on this exact scope.
