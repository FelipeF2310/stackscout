# RAG Relationship-Density Audit

**Purpose:** record why a small relationship-enrichment pass should happen
**before** building the canonical landing page / Stack Map. Audit only — no data,
code, or schema changes were made.

Governing docs: [`UX_CANONICAL_DIRECTION.md`](./UX_CANONICAL_DIRECTION.md)
(readiness/data-dependency note), [`REPO_MEMORY_AND_LEARNING.md`](./REPO_MEMORY_AND_LEARNING.md),
[`STACKSCOUT_PROJECT_ALIGNMENT.md`](./STACKSCOUT_PROJECT_ALIGNMENT.md).

_Date: 2026-06-25._

---

## Representative prompt

> "Build a PDF chatbot for internal company documents."

## Detected capabilities

`auth`, `vector-storage`, `llm-api`, `retrieval`, `document-parsing` (5).
(`agent-framework` is not detected without an explicit agent/orchestrate keyword.)

## Selected tools (representative deterministic stack)

- auth → `clerk`
- vector-storage → `qdrant`
- llm-api → an LLM SDK (e.g. `openai-sdk`)
- retrieval **+** document-parsing → `llamaindex`

≈ 4 unique tools.

## Alternatives available (well-populated)

- auth → `authjs`, `supabase-auth`
- vector-storage → `pinecone`, `weaviate`, `chroma`
- llm-api → `anthropic-sdk`, `vercel-ai-sdk`
- retrieval → `langchain`
- document-parsing → `llamaparse`, `unstructured`

## Existing relationship edges — among the selected tools

**Zero.** `clerk · qdrant · openai-sdk · llamaindex` have no edges between them.
The Stack Map's "pairs with" / "how it fits together" would render **empty** for
the flagship example.

## Existing relationship edges — selected → alternatives

These mostly exist, but only as the `alternative-to` axis (which is *how*
alternatives are derived): `clerk↔authjs`/`supabase-auth`, `qdrant↔pinecone`,
`llamaindex↔langchain`, `llamaindex↔llamaparse` (commonly-used-with).

**So the vertical (alternatives) axis is wired; the horizontal (pairs-with across
capabilities) axis is not.**

## Vertical density (16-tool RAG set: parsers, vector stores, retrieval/agent
frameworks, LLM SDKs, auth)

- **11 / 120** possible tool-pairs have ≥1 edge → **9.2% coverage**.
- Only **4 "fit-together" edges** in the whole vertical (2 `compatible-with`,
  2 `commonly-used-with`).
- `unstructured` (a document parser) has **0 edges** — fully orphaned.

## Missing relationship categories (the core RAG flow)

Expected but absent, all expressible with **existing** relationship types:

- **orchestrator ↔ vector store:** `llamaindex`/`langchain` ↔
  `qdrant`/`pinecone`/`chroma`/`weaviate`
- **orchestrator ↔ LLM:** `llamaindex`/`langchain` ↔ `openai-sdk`/`anthropic-sdk`
- **parser ↔ orchestrator/store:** `llamaparse`/`unstructured` ↔
  `llamaindex`/`langchain`/vector stores

Richer relationship semantics (`avoid_with`, `replaces`, `complements`,
`depends_on`, `migration_path`) are **out of scope** — they require new types
(schema change) and are deferred.

## Why today's Stack Map would feel partially useful but relationship-thin

It would correctly show **capabilities → recommended tools → alternatives →
tradeoffs**. But the **relationships/pairs-with axis would be empty for the
flagship stack** — exactly the differentiating axis. Result: a styled,
capability-organized list, not yet an ecosystem advisor.

## Recommendation

Do a **small RAG relationship-enrichment PR before landing-page work**: add
enough obvious, well-documented RAG pairings to make the flagship PDF/RAG flow
demonstrate ecosystem relationships — especially **orchestrator↔store**,
**orchestrator↔LLM**, and **parser↔orchestrator/store** relationships — as
`commonly-used-with` / `compatible-with` edges. The final count should be driven
by usefulness and evidence, not by hitting a specific number (the vertical
density numbers above are diagnostic, not a target). This takes the flagship
stack from **0 → meaningful** pairs-with and makes the future Stack Map
demonstrably an ecosystem view in this one vertical, operationalizing the
readiness note in `UX_CANONICAL_DIRECTION.md`.

## Success criteria for the enrichment PR

After the enrichment PR:

- the representative PDF/RAG stack should render meaningful relationship
  information for major selected tools where obvious ecosystem relationships
  exist;
- the Stack Map should show ecosystem intelligence without adding new
  recommendation logic;
- all additions should use existing tools and existing relationship types;
- relationship corpus validity tests should continue to pass;
- no schema changes, app code, RAG, agents, database, or runtime behavior changes
  should be introduced.

## Explicit non-goals

- No relationship **schema changes**; no **new relationship types**.
- No edits to `data/seed/relationships.json` or `data/seed/tools.json` in this
  audit (the enrichment is a separate, approved PR).
- No app code, tests, `lib/`, or package changes.
- No RAG runtime, agents, database, repo memory, or outcome tracking.
- Do not build from or modify the parked `feature/stack-map-artifact` branch.
