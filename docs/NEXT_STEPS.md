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

Authoritative product direction/vision: `STACKSCOUT_PROJECT_ALIGNMENT.md`,
`REPO_MEMORY_AND_LEARNING.md`, `ARCHITECTURE.md`.

## Where StackScout is

Deterministic, seed-based, capability-first advisor — **no LLM / DB / network at
request time** (deliberate trust boundary, not the end state). Built through
PRs #15–#28:

- **Flow:** Start (`/`) → two-pane Workspace (`/workspace?idea=…`) → living
  Architecture Brief. Legacy `/?q=` redirects into the workspace; the old
  stacked results shell is gone.
- **Pipeline (deterministic):** detect capabilities (with evidence) → score per
  capability → assemble (top tool per slot) → explain → alternatives. Engine in
  `lib/`, corpus in `data/seed/`. Capabilities come from
  `lib/capabilities/capabilityTaxonomy.ts` (canonical; 17 incl. `web-scraping`).
- **Product-fit layer:** optional `best_for` / `avoid_if` on tools, surfaced in
  the Brief and on `/tools/[id]` as "Good fit when:" / "Consider another option
  if:"; alternative reasons are fit-aware (use the alternative's `best_for`).
- **Guardrails:** GitHub Actions CI (`npm ci → test → build`) on every PR/push;
  golden-set regression tests over 6 canonical prompts
  (`tests/recommendations/goldenRecommendationSet.test.ts`).

## In flight

- **PR #28 — Astro as the first frontend-framework alternative.** Confirm via
  `gh pr list` whether it's merged. Astro is an `alternative-to nextjs` only
  (no compat edges); Next.js stays the selected frontend.

## Deferred backlog (with rationale — the why matters)

- **More frontend frameworks (SvelteKit, Nuxt):** deferred — they differ from
  Next.js mainly by language/ecosystem (Svelte/Vue) = *preference*, not product
  fit. Add only with a clear product-fit contrast. (Astro went first because
  content/SSG vs full-stack app is a real architecture decision.)
- **Realtime / collaboration capability:** needs a NEW capability (taxonomy +
  curated tools, e.g. Liveblocks/Yjs/PartyKit, + relationships + precise
  detector). The "realtime collaborative whiteboard" prompt is the known thin
  case (only Frontend today).
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

## Hard-won guardrails (don't relearn these the hard way)

- **Add a same-capability alternative without displacing the incumbent:** keep
  the new tool's maintenance avg `(maint+matur+doc)/3` BELOW the incumbent's
  (Next.js = 0.95) and add NO `compatible-with`/`commonly-used-with` edges (only
  `alternative-to`). High maintenance + compat edges are the two ways a newcomer
  flips the top pick. The golden set catches displacement.
- **Detection precision:** ambiguous keywords cause false positives (fixed:
  monitor/analytics→Monitoring, roles→Auth). Prefer precise multi-word phrases;
  add a negative over-fire test for any new keyword.
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
