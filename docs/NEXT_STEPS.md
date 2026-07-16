# Next Steps

A practical snapshot of where StackScout is and what's queued, written so a fresh
session can resume safely.

**Live status lives in git/GitHub, not here** — don't trust hardcoded numbers in
this file. Read it directly:

```
git log --oneline -12     # recent work
gh pr list                # open PRs + CI
git status                # working tree
npm test && npm run build # current test/build status
```

Canonical product and phase direction lives in `PRODUCT_ROADMAP.md`. This file
is the short active execution queue. `STACKSCOUT_PROJECT_ALIGNMENT.md` preserves
the durable thesis and build discipline; `ARCHITECTURE.md` describes implemented
technical reality. `PRD.md` is broad vision, not the active queue.

## Where StackScout is

Deterministic, seed-based, capability-first advisor — **no live LLM, database,
or network lookup at request time**. AI-grounding clarification v1 is complete
and merged. Website frontend target precision is complete, and the
clarification-policy catalog now governs proposals for another question. Phase
1 browser validation, capability-bound next-step guidance, and final workspace
copy polish are complete. The Phase 2A ecosystem asset classification contract
now defines governance for future proposals; no pilot or implementation exists.

- **Flow:** Start (`/`) → two-pane Workspace (`/workspace?idea=…`) → living
  Architecture Brief. Legacy `/?q=` redirects into the workspace; the old
  stacked results shell is gone.
- **Pipeline (deterministic):** detect capability evidence (boundary-safe
  keyword matching + project-shape inference) → resolve eligible URL-backed
  AI-grounding context → score per capability → assemble (top tool per slot) →
  explain → alternatives. Unresolved eligible prompts hold the final Brief for
  one question. Engine in `lib/`, corpus in `data/seed/`.
  Capabilities come from `lib/capabilities/capabilityTaxonomy.ts` (canonical;
  18 incl. `web-scraping` and `realtime-collaboration`).
- **Detection quality:** keyword matching is word-boundary regexes with explicit
  stems and optional plurals (`lib/capabilities/keywordMatcher.ts`), not raw
  substrings. Project-shape rules (`lib/capabilities/projectShapes.ts`) infer
  supporting capabilities from product artifacts (docs site, support inbox,
  admin review, source-grounded answering) with authored rationale evidence;
  shape-only capabilities append after keyword detections and the assumed floor
  fires only when both are empty.
- **Refinement context:** URL-backed refinement and grounding answers flow
  through workspace orchestration before final recommendation selection; no
  params still means the default deterministic path.
- **Alternatives:** relationship-backed alternatives remain preferred, with
  same-capability peer fallback when explicit alternative edges are missing.
- **Product-fit layer:** optional `best_for` / `avoid_if` on tools, surfaced in
  the Brief and on `/tools/[id]` as "Good fit when:" / "Consider another option
  if:"; alternative reasons are fit-aware (use the alternative's `best_for`).
  Recent local commits include a focused PDF/RAG peer metadata backfill.
- **Guardrails:** GitHub Actions CI (`npm ci → test → build`) on every PR/push;
  golden-set regression tests over 6 canonical prompts
  (`tests/recommendations/goldenRecommendationSet.test.ts`).

## Current queue

Completed on `main` — do not redo:

- Refinement-context activation, same-capability peer alternatives, and focused
  RAG peer fit metadata (earlier slices).
- **Realtime/collaboration capability slice** (`realtime-collaboration`,
  Liveblocks/Yjs; PartyKit deferred).
- **Scheduling/background-job fit metadata** (Inngest / Trigger.dev
  `best_for` / `avoid_if` and fit-aware alternative reasoning).
- **Detector boundary-matching hardening** (`1459f16`): word-boundary/stem/plural
  matching replaced raw substrings; fixed false positives (authors→auth,
  "the rest of"→api-layer, team→auth, therapist→api-layer, ghost→deployment).
- **Project-shape inference first slice** (`4849890`): four entailment-based
  rules — documentation site → frontend; support inbox → frontend + database;
  admin review → database; answers-from-sources → retrieval — with authored
  rationale on each shape signal.
- **Internal gated-access migration:** bare `internal → auth` was replaced by a
  narrow project-shape rule for internal software and content.
- **AI-grounding clarification v1:** unresolved AI source strategy now asks one
  deterministic, URL-backed question; explicit source requirements bypass it.
- **Website frontend target precision:** external crawl and scrape targets no
  longer imply Frontend Framework or Next.js; explicit website products retain
  the frontend path.
- **Product roadmap alignment:**
  `PRODUCT_ROADMAP.md` is the canonical phase roadmap and this file is the short
  execution queue.
- **Clarification-policy catalog:** question, precision-correction, conservative
  default, and deferral policies now have a shared governance and promotion
  gate.
- **Phase 1 decision-loop validation:** representative browser journeys passed;
  the crawler receives capability-bound generic guidance, explicit document RAG
  receives specialized guidance, stale grounding state is inert, and final
  review copy is clear.
- **Phase 2A ecosystem asset classification contract:** public GitHub Repository
  and AI-builder Skill identity, claim, evidence, review, and promotion
  boundaries are documented; this is governance, not a pilot or runtime model.
- **Phase 2B repository pre-execution plan:** the hypothesis, corpus-construction
  boundary, minimal evidence bundle, proposal-only workflow, human review,
  reproducibility, and Phase 2C gate are documented. Its six-stage lifecycle
  separates candidate nomination, corpus planning, human-only corpus freezing,
  agent-execution planning, and execution; the plan authorizes none of them.

Queue:

1. **Next: Terra must decide whether to authorize one bounded
   candidate-nomination research activity.** Any authorization must follow
   [`PHASE2B_REPOSITORY_CLASSIFICATION_PRE_EXECUTION_PLAN.md`](./PHASE2B_REPOSITORY_CLASSIFICATION_PRE_EXECUTION_PLAN.md),
   name its human-directed role, public GitHub listing/search and landing-page
   surfaces, candidate categories, maximum scope, external workspace, retention
   boundary, output format, and observation date.

The activity may produce only an external, untrusted nomination register with a
public URL or coordinate, intended test category, observation date, and short
human-authored rationale. It does not authorize corpus selection, source
acquisition, evidence freezing, agent execution, model-provider transmission,
classification, or a pilot run. It also does not authorize GitHub API access,
authentication, source-content review or retention, cloning, downloading, or
asset conclusions.

After nomination, a separately prepared and reviewed corpus-freeze scope packet
may use the register only as an untrusted input. The packet must independently
propose the intended corpus, inclusion rationale and mandatory coverage matrix,
permitted evidence surfaces, external workspace and retention boundary, human
roles, and acquisition stop conditions. Preparing or reviewing it grants no
source or execution authority.

After that packet is complete and reviewed, a separate Terra Stage 4 corpus-
freeze go/no-go is required before limited human-only, read-only acquisition may
pin the named sources to immutable revisions and create the approved minimal
evidence bundle, frozen manifest, evidence inventory, and hidden references.
That decision grants no agent, classifier, validator, or model-run authority.

After freezing, a separately prepared and reviewed Stage 5 classification
execution packet must name the exact contract commit, frozen inputs and integrity
identifiers, agent configuration and containment, workspace and retention
procedure, human roles, rubric, stop conditions, and exact scope of one initial
pass plus one clean identical rerun. Preparing, reviewing, or approving it grants
no execution authority.

Only a final, distinct Terra Stage 6 classification-run go/no-go may authorize
the named initial pass, one clean rerun, approved independent validation, human
adjudication, and the declared model-inference transport. No stage silently
authorizes the next one.

The pre-execution plan and this queue do **not** themselves authorize nomination
research, external source access, a pilot run, classification execution, GitHub
API access, ingestion, agent execution or workers, a classifier, runtime
integration, database or persistence, corpus or seed/data changes,
recommendation changes, or user-facing discovery. Phase 2C remains blocked
pending an explicit Terra go/no-go review of Phase 2B findings. Phase 2D and 2E
require their own later scopes.

Another clarification vertical requires a candidate to pass the evidence gate
in [`CLARIFICATION_POLICY_CATALOG.md`](./CLARIFICATION_POLICY_CATALOG.md) before
implementation planning begins.

The remaining ambiguous triggers — `support`, `requests`, `track`, and `data` —
are independent and deferred unless review evidence demonstrates user harm. Do
not bundle them with the websites policy or with each other. Use the 14-prompt
fixture in `tests/fixtures/recommendationReviewPrompts.ts` plus the broader
detector-test corpus for every behavior-changing audit.

The support-inbox observation and any broader AI interaction-mode policy work
also remain separate and deferred. Do not alter AI-grounding policy through the
Phase 2 discovery roadmap.

## Deferred

- Existing-product / missing-piece mode is Phase 3 and begins with
  user-described current context only; see `PRODUCT_ROADMAP.md`.
- Scoring structure changes require a concrete wrong-winner case.
- Corpus expansion requires a clear product-fit contrast, not breadth alone.
- Persistence, GitHub ingestion, runtime agents, RAG, paid plans, and browser
  extensions remain outside the active phase.

## Hard-won guardrails (don't relearn these the hard way)

- **Add a same-capability alternative without displacing the incumbent:** keep
  the new tool's maintenance avg `(maint+matur+doc)/3` BELOW the incumbent's
  (Next.js = 0.95) and add NO `compatible-with`/`commonly-used-with` edges (only
  `alternative-to`). High maintenance + compat edges are the two ways a newcomer
  flips the top pick. The golden set catches displacement.
- **Detection precision:** ambiguous keywords cause false positives (fixed:
  monitor/analytics→Monitoring, roles→Auth, plus the substring class fixed by
  boundary matching). Prefer precise multi-word phrases; add a negative
  over-fire test for any new keyword. Shape rules have a stricter bar: product
  nouns whose definition *entails* the capability, an authored rationale, and
  negative tests — see the rule-admission checklist in
  `lib/capabilities/projectShapes.ts`.
- **`supabase-auth` is auth-only (PR #19):** Database must never resolve to it.
- **Alternatives surface `best_for` (PR #27):** so corpus growth reads as
  decision support, not a popular-tool list.
- **Workflow:** branch per change → smallest safe PR → `npm test` + `npm run
  build` → show diffs → commit (no Co-Authored-By) → push → CI → user merges →
  safe cleanup (`git branch -d`, never `-D`, never force).
- **`feature/stack-map-artifact` is parked** (unpushed, `7a96c24`) — never touch.

## Explicit non-goals for now

No database, auth, live LLM calls, live GitHub ingestion, persistence, team
features, CLI, runtime agents, or broad redesign. These are FUTURE per the vision
docs — the deterministic engine today is the trustworthy base that the
AI-assisted (agents-propose → reviewed → trusted) layer will build on.
