# Capability Detection Audit

Status: **audit only — no code or runtime changes.** Prepared to scope the
"What StackScout detected" (detection transparency) feature.

> **Addendum (detector hardening, July 2026).** The substring matcher described
> in Section 1 and the boundary-guard candidates in Section 4 are **superseded**:
> the detector now compiles each keyword into a word-boundary regex (multi-word
> phrases match across whitespace, normal keywords accept a trailing plural 's',
> and explicit `stem: true` keywords match word continuations like
> `summar` → "summarizes"). Hand-padded entries (`' ai '`, `' ui '`,
> `' document '`, `'rest '`) were removed. Keyword changes in that pass:
> `rest ` replaced with `rest api`/`restful`/`rest endpoint`; `team` removed
> from auth; recall-compensation added for auth (`authentication`,
> `authenticate`, `authenticated`, `authorization`, `oauth`) and deployment
> (`hosted`). `internal` → auth was deliberately retained pending the
> project-shape inference decision. Evidence phrases now report the actual
> matched text rather than the keyword. The direct/inferred tagging model and
> Sections 2–3 remain accurate.

Scope reminder: agents may help author/review keyword tags **during
development**. The production detector stays **deterministic** — no runtime LLM,
no agent scoring/classification/inference. This audit proposes how to expose the
evidence the detector already computes (and currently discards), plus a
conservative direct/inferred tagging pass.

---

## 1. Current detector summary

**Where it lives.** `lib/capabilities/detectCapabilities.ts`. The taxonomy of
canonical capabilities lives in `lib/capabilities/capabilityTaxonomy.ts`
(`CAPABILITY_TAXONOMY`, 16 capabilities). A second, partially overlapping
capability source exists at `data/seed/capabilities.json` — consolidating these
is a known future item (`docs/NEXT_STEPS.md`) and is **out of scope here**.

**How keywords map to capabilities.** A single module-level constant,
`KEYWORD_MAP: Record<string, string[]>`, maps each `capability_id` to a list of
trigger strings. Detection is:

1. Lower-case the description and pad it with one leading/trailing space:
   `` ` ${desc.toLowerCase()} ` ``.
2. For each capability, if **any** of its keywords is a **substring** of the
   padded text, the capability matches (`text.includes(kw)`).
3. Matched ids go into a `Set` (dedup), then are mapped through
   `getCapabilityById` and filtered to valid `Capability` objects.

Matching is plain substring containment — not word-boundary or token matching.
A few keywords are manually padded with spaces (`' ai '`, `' ui '`, `'rest '`)
to dodge the worst substring collisions (`email`, `build`, `interest`).

**What evidence is discarded.** Everything except the final capability list:

- **Which keyword matched** — `keywords.some(...)` returns a boolean; the
  specific triggering phrase is thrown away.
- **How many keywords matched** a capability (one vs several).
- **Whether the match was a named capability vs a proxy/implication.**
- **Whether a capability came from a real match vs the fallback floor.**

All four are needed by the transparency feature and none survive today. The
triggering phrase and the matched-vs-floor origin are recoverable for free
(just stop discarding them). The direct-vs-inferred distinction is **not**
recoverable post-hoc — it must be authored (Section 2).

**Fallback / default behavior.** If nothing matches (`matched.size === 0`), the
detector adds `frontend-framework` as a floor ("any buildable product needs
somewhere to render"). This is a **silent assumption** — the user is never told
it was a guess rather than a detection.

**Callers (full list).** Only two:

- `lib/recommendations/recommendArchitecture.ts:48` — the production pipeline.
- `tests/capabilities/detectCapabilities.test.ts` — 4 baseline tests.

This small caller surface is what makes a backward-compatible wrapper safe.

---

## 2. Keyword tagging proposal

Definitions used (conservative — when unsure, do **not** mark `direct`):

- **direct** — the phrase names or clearly describes the capability.
- **inferred** — the phrase implies the capability but does not ask for it.
- **ambiguous** — the phrase may map to the capability in some contexts but is
  broad enough to cause false positives (often via substring matching).

> **Runtime note:** `ambiguous` is a **development-time review bucket, not a
> runtime value.** The shipped evidence type carries only `direct | inferred`
> (Section 7). Every `ambiguous` keyword must be resolved before it can surface
> in the UI: default it to **inferred**, or remove/fix it in a **separate
> behavior-changing PR** (Section 10). For this phase, ambiguous keywords are
> tagged `inferred` so we never overclaim.

Tags below are a proposal for review, not yet code.

### auth
| keyword | tag | note (inferred/ambiguous only) |
|---|---|---|
| `auth`, `login`, `log in`, `sign in`, `sign-in`, `sign up` | direct | |
| `session`, `permission`, `permissions`, `rbac` | direct | |
| `account`, `accounts` | direct | |
| `multi-tenant`, `tenant` | direct | (`tenant` borderline — rental/property domain) |
| `internal` | inferred | "internal tool" implies gated access; the tool itself isn't auth |
| `admin` | inferred | implies access control, but "admin dashboard" may just mean a UI |
| `saas` | inferred | implies accounts; also fires database + frontend (multi-fire, see §4) |
| `user`, `users` | ambiguous | appears in most product prompts ("users can browse") without implying auth |
| `role`, `roles` | ambiguous | "role" is often a domain/job noun, not RBAC |
| `members` | ambiguous | could be domain data (gym members) not authenticated members |
| `team` | ambiguous | very broad ("team dashboard", "team of three") |

### database
| keyword | tag | note |
|---|---|---|
| `database`, `persist`, `postgres`, `sql`, `crud`, `store data` | direct | |
| `reports`, `reporting` | inferred | implies stored data, but could be a static/generated report |
| `inventory`, `tickets`, `submissions`, `catalog` | inferred | domain nouns implying persisted records |
| `entries` | ambiguous | "blog entries", "diary entries" may be content, not DB rows |
| `records`, `record` | ambiguous | substring hits "recording/recorded"; "track record" |
| `data` | ambiguous | extremely broad; matches "metadata", "data science", etc. |
| `tracking`, `track` | ambiguous | overlaps monitoring ("error tracking"); substring of "soundtrack" |
| `requests`, `request` | ambiguous | "API request", "pull request", "HTTP request" — overlaps api-layer |

### vector-storage
| keyword | tag | note |
|---|---|---|
| `vector`, `embedding`, `embeddings`, `similarity`, `semantic`, `rag` | direct | |
| `chatbot` | inferred | a chatbot need not use vectors; also fires llm-api + retrieval (multi-fire) |
| `search documents` | inferred | could be keyword search, not vector; overlaps retrieval (same phrase) |

### file-storage
| keyword | tag | note |
|---|---|---|
| `upload`, `uploads`, `file storage`, `blob`, `attachments` | direct | |
| `images` | inferred | images imply storage, but may be static/decorative |
| `assets` | ambiguous | "financial assets", "brand assets" — broad |

### deployment
| keyword | tag | note |
|---|---|---|
| `deploy`, `deployment`, `hosting`, `ship it` | direct | |
| `host` | ambiguous | substring of "ghost/hostile"; "host an event" |

### scheduling
| keyword | tag | note |
|---|---|---|
| `schedule`, `scheduling`, `cron`, `background job`, `queue`, `recurring`, `reminders` | direct | |
| `jobs` | ambiguous | "job board", "job listings" (employment app, not background jobs) |
| `worker` | ambiguous | "gig workers", "healthcare workers" — domain noun |

### monitoring
| keyword | tag | note |
|---|---|---|
| `monitor`, `monitoring`, `observability`, `error tracking`, `metrics` | direct | |
| `logging`, `telemetry`, `uptime` | direct | |
| `analytics` | inferred | often product analytics (frontend + database), not ops monitoring |
| `logs` | ambiguous | substring of "blogs"; "dialogue" near-miss |

### agent-framework
| keyword | tag | note |
|---|---|---|
| `agentic`, `orchestrat`, `tool calling`, `autonomous` | direct | |
| `multi-step` | inferred | implies orchestration, but could be a form wizard / checkout |
| `agent`, `agents` | ambiguous | "real estate agent", "support agent", "user agent" — strong false positive |

### llm-api
| keyword | tag | note |
|---|---|---|
| `llm`, `gpt`, `claude`, `generate text`, `nlp`, `copilot`, `' ai '` | direct | (`ai` is space-padded already) |
| `conversational` | inferred | conversational UI implies an LLM, but could be scripted |
| `assistant` | inferred | "personal assistant app" / "shopping assistant" may not be LLM |
| `chatbot` | inferred | multi-fire (vector-storage + retrieval) |
| `summar` | ambiguous | matches "summary": "order summary", "account summary" are not LLM features |

### retrieval
| keyword | tag | note |
|---|---|---|
| `rag`, `retrieval`, `knowledge base`, `q&a`, `question answering`, `ask questions` | direct | |
| `search documents` | inferred | could be keyword search; overlaps vector-storage |
| `documents` | inferred | could be document storage/parsing without RAG; overlaps document-parsing |
| `chatbot` | inferred | multi-fire |
| `knowledge` | ambiguous | "knowledge worker", "knowledge of X" — broad |

### document-parsing
| keyword | tag | note |
|---|---|---|
| `pdf`, `parse`, `docx`, `ocr`, `word file`, `spreadsheet` | direct | |
| `document`, `documents` | direct | (but also fires retrieval — overlap, see §4) |
| `extract` | ambiguous | "extract value", "data extraction" generally — broad |

### email
| keyword | tag | note |
|---|---|---|
| `email`, `e-mail`, `transactional`, `newsletter` | direct | |
| `notification`, `notifications` | inferred | could be push/in-app, not email |
| `mail` | ambiguous | redundant substring of "email"; "mailing", "blackmail" |
| `support` | ambiguous | "customer support", "we support X", "support tickets" — very broad, overlaps |

### payments
| keyword | tag | note |
|---|---|---|
| `payment`, `payments`, `subscription`, `subscriptions`, `billing`, `checkout`, `stripe`, `invoice`, `paywall` | direct | |
| `pricing` | inferred | a "pricing page" is marketing/frontend; doesn't require payment processing |

### api-layer
| keyword | tag | note |
|---|---|---|
| `endpoint`, `endpoints`, `graphql`, `rpc`, `webhooks` | direct | |
| `api` | ambiguous | substring of "therapist", "capital", "rapid", "apiary" — strong false positive |
| `rest ` | ambiguous | space-padded, but still matches "the rest of the app" |

### frontend-framework
| keyword | tag | note |
|---|---|---|
| `frontend`, `front-end`, `web app`, `webapp`, `website` | direct | |
| `dashboard`, `dashboards`, `portal`, `admin panel`, `landing page`, `' ui '` | direct | |
| `saas` | inferred | multi-fire (auth + database + frontend) |
| `interface` | ambiguous | "API interface", "TypeScript interface" — broad |

### search
| keyword | tag | note |
|---|---|---|
| `full-text search`, `faceted`, `search bar` | direct | |
| `filtering` | inferred | implies a filter UI, but could be generic data filtering |

---

## 3. Rationale roll-up

The rationale for each inferred/ambiguous keyword is in the per-capability
tables above (the "note" column). The recurring patterns:

- **Substring collisions** (no word boundaries): `api`→therapist, `logs`→blogs,
  `host`→ghost, `record`→recording, `summar`→summary, `mail`→blackmail.
- **Domain-noun homographs**: `agent` (real-estate), `worker` (gig), `jobs`
  (employment), `members` (gym), `role` (job title), `tenant` (rental).
- **Implication, not request**: `internal`/`admin`/`saas` (→ auth),
  `analytics` (→ monitoring), `pricing` (→ payments), `images` (→ file-storage),
  `notifications` (→ email), `conversational`/`assistant` (→ llm-api).
- **Over-broad nouns**: `data`, `support`, `knowledge`, `assets`, `interface`,
  `request`.

---

## 4. False-positive risks

**Too broad / likely false positives (highest priority to review):**

- `api` (api-layer) — matches inside common words ("therapist", "capital").
- `data` (database) — matches almost anything data-adjacent.
- `agent`/`agents` (agent-framework) — homograph with support/real-estate/etc.
- `support` (email) — extremely common word, rarely means "send email".
- `user`/`users` (auth) — present in most prompts without implying auth.
- `logs` (monitoring) — substring of "blogs".
- `track`/`tracking` (database) — substring of "soundtrack"; semantics overlap
  monitoring.
- `record`/`records` (database) — substring of "recording".
- `summar` (llm-api) — substring of "summary".
- `rest ` (api-layer) — matches "the rest of…".
- `host` (deployment) — substring of "ghost".

**Cross-capability overlaps (one phrase → several capabilities).** These are not
bugs per se — they are the system's *inferred assumptions* and are exactly what
the transparency UI should surface honestly:

- `saas` → **auth + database + frontend-framework**
- `chatbot` → **vector-storage + llm-api + retrieval**
- `documents` / `document` → **document-parsing + retrieval**
- `search documents` → **vector-storage + retrieval**
- `tracking`/`track` → **database**, semantically near monitoring's
  `error tracking`

**Candidates to split / rename / remove (defer to a behavior-changing PR):**

- Remove or word-boundary-guard: `api`, `logs`, `host`, `summar`, `record(s)`,
  `rest `, `data`.
- Reconsider as too broad: `support`, `agent(s)`, `user(s)`, `knowledge`,
  `assets`, `interface`, `jobs`, `worker`.
- Note: `mail` is fully redundant with `email` (substring) — can be dropped with
  no recall loss.

> ⚠️ **Do not change these in this phase.** Editing keywords changes the detected
> capability set, which changes recommendations and would break/alter existing
> tests. Cleanup is its own PR with its own test updates (Section 10).

---

## 5. Missing signals (suggestions only — DO NOT add to code yet)

Separated from existing keywords; these are candidates for a later, deliberate
recall-improvement pass:

- **auth**: `oauth`, `sso`, `magic link`, `2fa`, `passwordless`.
- **database**: `orm`, `mongodb`, `mysql`, `sqlite`, `supabase`, `relational`.
- **realtime** (no capability exists yet): `realtime`, `websocket`, `live
  collaboration`, `presence` — would need a taxonomy addition first, so out of
  scope.
- **file-storage**: `s3`, `cdn`, `media`, `video upload`.
- **email**: `sms`, `push notification` (arguably a *different* capability).
- **payments**: `marketplace payout`, `connect`, `usage-based`.
- **llm-api**: `embeddings model`, `prompt`, `fine-tune` (some overlap with
  vector-storage).
- **search**: `elasticsearch`, `typesense`, `algolia`, `meilisearch`.

These are intentionally **not** tagged direct/inferred yet — tagging follows a
decision to add them, which is a separate recall question from this transparency
feature.

---

## 6. Fallback assumptions

**Current behavior.** When `matched.size === 0`, the detector injects
`frontend-framework`. This is the only implicit default, and it is invisible to
the user.

**How to surface it.** In the evidence model, this capability carries
`origin: 'assumed-floor'` and an empty `signals` array. The UI presents it
distinctly from matched capabilities, e.g.:

> _Assumption: we didn't find a specific capability in your description, so we
> assumed you at least need a **Frontend Framework** to render the app. Add more
> detail to refine this._

More broadly, **all `inferred` signals are assumptions** and should read as
such in the UI ("You said *'SaaS'*, so we assumed **Authentication**"), visually
separated from `direct` evidence ("You said *'PDF'* → **Document Parsing**").
This is the core honesty mechanic of the feature: direct = detected, inferred =
assumed, floor = guessed.

---

## 7. Proposed implementation shape

New function alongside the existing one, in
`lib/capabilities/detectCapabilities.ts` (or a sibling
`detectCapabilitiesWithEvidence.ts`):

```ts
export type SignalType = 'direct' | 'inferred'
export type CapabilityOrigin = 'matched' | 'assumed-floor'

export interface DetectionSignal {
  phrase: string          // the trigger that matched, trimmed for display
  type: SignalType        // 'ambiguous' resolves to 'inferred' before runtime
}

export interface CapabilityEvidence {
  capability: Capability
  signals: DetectionSignal[]      // [] when origin === 'assumed-floor'
  origin: CapabilityOrigin
}

export function detectCapabilitiesWithEvidence(
  projectDescription: string
): CapabilityEvidence[]
```

To carry tags, evolve the map from `Record<string, string[]>` to tagged entries,
e.g.:

```ts
type TaggedKeyword = { phrase: string; type: SignalType }
const KEYWORD_MAP: Record<string, TaggedKeyword[]>
```

Behavior of `detectCapabilitiesWithEvidence`:

- Same lower-case + space-pad + `includes` matching as today (unchanged, so the
  matched **set** is identical).
- Collect **all** matching keywords per capability (not just the first) →
  `signals[]` (this satisfies "multiple signals merging under one capability").
- A capability is `direct` evidence if it has ≥1 `direct` signal; otherwise it is
  shown as inferred/assumption. (Individual signals keep their own type so the UI
  can show mixed evidence.)
- Preserve `KEYWORD_MAP` iteration order so output ordering matches the current
  detector exactly.
- Apply the same floor: if no capability matched, return a single entry with
  `origin: 'assumed-floor'`, `capability: frontend-framework`, `signals: []`.

**Compatibility wrapper** keeps the existing signature and output:

```ts
export function detectCapabilities(projectDescription: string): Capability[] {
  return detectCapabilitiesWithEvidence(projectDescription).map((e) => e.capability)
}
```

Because the matching logic and ordering are unchanged, `.map(e => e.capability)`
reproduces today's `Capability[]` exactly.

---

## 8. Backward compatibility

Guarantees and how they hold:

- **Recommendation outputs unchanged** — `recommendArchitecture` calls
  `detectCapabilities()`, which still returns the same `Capability[]` in the same
  order, because the keyword set and iteration order are untouched. Tagging is
  **additive metadata only**; no keyword is added, removed, reworded, or
  reordered in this phase.
- **Selected tools unchanged** — tool selection is downstream of the capability
  list; identical input → identical output.
- **Existing tests pass** — the 4 tests in `detectCapabilities.test.ts` assert
  on `capability_id`s from `detectCapabilities()`, which is preserved. No
  recommendation/scoring test inputs change.
- **New evidence powers only the new UI** — `detectCapabilitiesWithEvidence` is
  consumed solely by the detection-transparency component; the pipeline never
  calls it.

The one thing that would break this guarantee is "fixing" ambiguous keywords
(Section 4). That is explicitly deferred.

---

## 9. Tests needed

New tests (e.g. `tests/capabilities/detectCapabilitiesWithEvidence.test.ts`):

1. **Direct keyword detection** — `"PDF"` → document-parsing with a `direct`
   signal whose `phrase` is `pdf`.
2. **Inferred keyword detection** — `"internal tool for the team"` → auth present
   with an `inferred` signal (`internal`), no direct signal.
3. **Ambiguous handling** — confirm an ambiguous-origin keyword (e.g. `agent`)
   surfaces as `inferred`, never `direct` (guards the "never overclaim" rule).
4. **Multiple signals merge under one capability** — a prompt containing both
   `pdf` and `document` yields **one** document-parsing entry with **two**
   signals.
5. **Multi-fire assumption** — `"a SaaS app"` yields auth + database +
   frontend-framework, each carrying the `saas` signal as `inferred`.
6. **Fallback / floor assumption** — gibberish / `"asdf"` → exactly one entry,
   `frontend-framework`, `origin: 'assumed-floor'`, `signals: []`.
7. **Phrase is preserved** — the matched trigger string is returned (not just a
   boolean), trimmed of padding (`ai`, not `' ai '`).
8. **Ordering preserved** — evidence order matches `KEYWORD_MAP` order.

Backward-compat tests (extend `detectCapabilities.test.ts`, do not edit existing
cases):

9. **`detectCapabilities()` unchanged** — for a fixed set of prompts (PDF
   chatbot, internal dashboard, gibberish), the `Capability[]` output equals the
   pre-change result. Implement as `detectCapabilities(p)` deep-equals
   `detectCapabilitiesWithEvidence(p).map(e => e.capability)`.
10. **Pipeline unchanged** — a `recommendArchitecture` snapshot/shape test for a
    representative prompt confirms detected capabilities and selected tool ids
    are identical to current output. (Use existing
    `recommendArchitecture.test.ts` expectations as the baseline.)

---

## 10. Recommendation

1. **Proceed with direct/inferred tagging now — but behavior-preserving.** Tag
   the existing keywords in place (additive metadata) and ship
   `detectCapabilitiesWithEvidence` + the compatibility wrapper. Do **not**
   delete, reword, split, or reorder any keyword in this phase. This unlocks the
   transparency UI with zero risk to recommendations.

2. **Manually review before implementation** the keywords flagged `ambiguous` in
   Section 4 — especially `api`, `data`, `agent`, `support`, `logs`, `user`,
   `summar`, `rest `, `host`, `record(s)`, `track(ing)`. For this phase they must
   all default to **inferred** so the UI never presents a shaky match as
   confirmed. Confirm that default is acceptable, or pick specific ones to drop —
   noting any drop becomes a behavior change (item below).

3. **Split into PRs:**
   - **PR 1 — detection evidence (behavior-preserving).** Tagged `KEYWORD_MAP`,
     `detectCapabilitiesWithEvidence`, compatibility wrapper, tests 1–10. No UI,
     no recommendation change.
   - **PR 2 — detection-transparency UI.** "What StackScout detected": direct
     evidence vs inferred assumptions vs floor assumption, consuming PR 1. No
     `lib` logic change.
   - **PR 3 (later, optional) — keyword cleanup.** Remove/guard the false
     positives in Section 4. This **changes runtime behavior and tests** and must
     be evaluated on its own, with recommendation-diff review.

This sequencing keeps each PR independently reviewable and keeps the
"deterministic, no behavior drift" guarantee auditable at every step.

---

## Stop point

Audit complete. **Awaiting approval before any implementation.** Open decisions
for you:

- Confirm ambiguous-keywords-default-to-inferred for this phase (Rec. 2).
- Confirm the 3-PR split, or collapse PR 1 + PR 2 into one.
- Confirm keyword cleanup (PR 3) is genuinely deferred, not part of this feature.
