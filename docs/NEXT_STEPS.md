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
and merged.

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

Completed on `main`, plus the roadmap reset completed by this documentation
slice — do not redo:

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
- **Product roadmap alignment (this documentation slice):**
  `PRODUCT_ROADMAP.md` is the canonical phase roadmap and this file is the short
  execution queue.

Queue:

1. **Next: plan the separate `websites → Frontend Framework` target-context
   precision slice.** This is a narrowly verified detector correction, not a
   clarification question or generic cleanup. Its implementation specification
   belongs in its own planning pass.
2. **Before another question vertical: define the clarification policy
   catalog.** Each proposed question needs eligibility, priority, user-facing
   wording, sensible default, capability/tool effect, explicit-evidence bypass,
   and negative examples.

The remaining ambiguous triggers — `support`, `requests`, `track`, and `data` —
are independent and deferred unless review evidence demonstrates user harm. Do
not bundle them with the websites policy or with each other. Use the 14-prompt
fixture in `tests/fixtures/recommendationReviewPrompts.ts` plus the broader
detector-test corpus for every behavior-changing audit.

## Deferred

- Existing-product / missing-piece mode follows Phase 1 and begins with
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
