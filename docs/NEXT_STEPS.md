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

Authoritative current roadmap: `STACKSCOUT_PROJECT_ALIGNMENT.md`,
`NEXT_STEPS.md`, and `ARCHITECTURE.md`. `PRD.md` is broad product vision, not the
active implementation queue.

## Where StackScout is

Deterministic, seed-based, capability-first advisor — **no LLM / DB / network at
request time** (deliberate trust boundary, not the end state). Built through
PRs #15–#28 plus subsequent slices pushed to `main` (through the project-shape
inference commit `4849890`):

- **Flow:** Start (`/`) → two-pane Workspace (`/workspace?idea=…`) → living
  Architecture Brief. Legacy `/?q=` redirects into the workspace; the old
  stacked results shell is gone.
- **Pipeline (deterministic):** detect capabilities (boundary-safe keyword
  matching + project-shape inference, with evidence) → parse URL-backed
  refinement context → score per capability → assemble (top tool per slot) →
  explain → alternatives. Engine in `lib/`, corpus in `data/seed/`.
  Capabilities come from `lib/capabilities/capabilityTaxonomy.ts` (canonical;
  18 incl. `web-scraping` and `realtime-collaboration`).
- **Detection quality:** keyword matching is word-boundary regexes with explicit
  stems and optional plurals (`lib/capabilities/keywordMatcher.ts`), not raw
  substrings. Project-shape rules (`lib/capabilities/projectShapes.ts`) infer
  supporting capabilities from product artifacts (docs site, support inbox,
  admin review, source-grounded answering) with authored rationale evidence;
  shape-only capabilities append after keyword detections and the assumed floor
  fires only when both are empty.
- **Refinement context:** URL-backed refinement params flow from the live
  workspace into `recommendArchitecture`; no params still means the default
  deterministic recommendation path.
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

Recently completed and pushed to `origin/main` — do not redo these slices:

- Refinement-context activation, same-capability peer alternatives, and focused
  RAG peer fit metadata (earlier slices).
- **Realtime/collaboration capability slice** (`realtime-collaboration`,
  Liveblocks/Yjs; PartyKit deferred).
- **Scheduling/background-job fit metadata** (Inngest / Trigger.dev
  `best_for` / `avoid_if` and fit-aware alternative reasoning).
- **Detector boundary-matching hardening** (`1459f16`): word-boundary/stem/plural
  matching replaced raw substrings; fixed false positives (authors→auth,
  "the rest of"→api-layer, team→auth, therapist→api-layer, ghost→deployment).
  `internal → auth` was deliberately kept, deferred to the migration below.
- **Project-shape inference first slice** (`4849890`): four entailment-based
  rules — documentation site → frontend; support inbox → frontend + database;
  admin review → database; answers-from-sources → retrieval — with authored
  rationale on each shape signal.

Queue:

1. **Next: PR 2 — `internal → auth` migration (plan before implementing).**
   Remove/narrow the bare `internal → auth` keyword and replace it with a
   deliberate project-shape rule using the already-built `requires`
   co-occurrence machinery: cue `internal` / `staff` / `operator`, requiring a
   surface/content noun (`tool`, `dashboard`, `portal`, `console`, `app`,
   `docs`, `documents`). Must preserve auth for the praised/golden internal
   prompts ("internal company documents", "internal analytics dashboard") and
   avoid auth for "internal API refactor", "internal logic", and "a tool to
   track inventory for our team".
2. **After PR 2: soft-trigger cleanup review.** Broad inferred keywords
   (`support`, `requests`, `websites`, `track`, `data`) produce right-ish
   answers for wrong reasons; review them only once shape rules can take over
   the principled cases. The 14-prompt recommendation review set now lives in
   `tests/fixtures/recommendationReviewPrompts.ts` (the golden set sources its
   prompts from it) — include it in every before/after detector and
   selected-tool diff audit.
3. **Optional later: rationale-display UI slice.** Shape signals already carry
   authored rationales; surfacing them in DetectionTransparency is a small
   copy/UI slice.
4. **Scoring structure review only if justified.** Examples:
   `primary_capability` or per-capability role, only after recommendation review
   shows concrete wrong-winner evidence.
5. **Later: evidence/audit/report schemas.** Design after the recommendation
   foundation is stronger.
6. **Later still: RAG/self-learning.** Requires evidence objects and explicit
   review boundaries first.

Known-tool/current-stack evaluation remains Phase 2B — not immediate unless
Phase 2A recommendation quality is judged strong enough.

Free product comes first. Paid plans are deferred until the free product proves
value. Browser extensions are deferred until the core audit/report artifact is
useful.

## Deferred backlog (with rationale — the why matters)

- **More frontend frameworks (SvelteKit, Nuxt):** deferred — they differ from
  Next.js mainly by language/ecosystem (Svelte/Vue) = *preference*, not product
  fit. Add only with a clear product-fit contrast. (Astro went first because
  content/SSG vs full-stack app is a real architecture decision.)
- **Realtime / collaboration capability:** first focused slice covers
  Liveblocks/Yjs with precise detector coverage. Keep future expansion small;
  do not broaden into generic WebSocket/pubsub or whiteboard UI libraries.
- **Reconcile `REPO_MEMORY_AND_LEARNING.md` wording:** it still says "never raw
  model output at request time"; align with the PR #27-era framing —
  *unreviewed* model output is never authoritative for facts/scores/selection,
  but AI may assist at runtime (intent, clarification, grounded explanations).
- **Optional `docs/ALIGNMENT_AUDIT.md`:** the alignment/wording audit as a
  tracked doc (currently only in chat).
- **Corpus quality / thin capabilities:** several capabilities have 1–2 tools
  (few/no alternatives) — expand with fit metadata, not breadth-for-breadth.
- **Deeper scoring refinement:** latent only — `capabilityFit` is flat 1 and
  compatibility is slot-blind. Touch ONLY when a 2nd "wrong tool wins" output
  proves it necessary (the supabase-auth case was fixed via corpus, not scoring).
- **Persistence / GitHub ingestion / agents / RAG / paid / browser extension:**
  deferred. None is part of the near product metadata work unless explicitly
  scoped.

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
