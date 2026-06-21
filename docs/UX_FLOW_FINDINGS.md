# UX Flow Findings — Onboarding/Planning Inspiration

Internal product note. Captures UX and product-flow findings from reviewing a
Cursor-style onboarding/planning flow, translated into implications for
StackScout's next UX milestone.

> This is inspiration, not a directive to copy Cursor. The goal is to learn from
> the *shape* of a calm, guided planning experience — not its visuals or its
> implementation. Where a lesson doesn't fit a capability-first architecture
> advisor, we drop it.

---

## 1. Executive Summary

StackScout already works: a user types a project idea, the deterministic pipeline
detects capabilities, a recommended stack renders, and tool cards link to
seed-based detail pages that explain rationale, tradeoffs, alternatives, and
compatibility. The engine is sound. What's thin is the **experience around** the
engine — today it behaves close to "type a query, get results."

The reference flow we reviewed matters because it demonstrates a different
posture: it **plans with the user before producing output**. It grounds the user
in what they're building, asks a few sharp questions, narrows scope, and ends
with a structured artifact the user can act on — all before any implementation.
That posture maps almost perfectly onto StackScout's actual job: helping someone
move from a rough idea to an architecture they understand and trust.

The opportunity is not a redesign. It's to add a thin layer of **understanding
and guidance** in front of (and around) the recommendation engine so that
StackScout reads as an advisor, not a search box. This document records what the
reference does well, why it matters for us, a proposed future flow, and — just as
importantly — what we should *not* build yet.

---

## 2. What the Reference Flow Does Well

**Strong starting point.** It opens by anchoring on intent ("what are you trying
to build?") rather than on tools, files, or settings. The first interaction is
about the user's goal, which immediately frames everything that follows.

**Guided progression.** Each step leads naturally to the next. The user is never
staring at a blank surface wondering what to do — there's a clear sense of "here's
where we are, here's what's next."

**Thoughtful questions.** It asks a small number of *targeted* questions that
visibly change the output. The questions feel earned, not like a form. The user
can tell the system is using their answers.

**Scope narrowing.** It actively reduces ambiguity before committing to an
answer. Instead of guessing widely, it converges — turning a vague idea into a
specific, bounded problem.

**Structured output.** It ends with a concrete artifact (a plan), not a wall of
options. The artifact is the payoff and the reference point for everything after.

**Sense of momentum.** Every step produces a little progress. The user feels
they're moving forward, which keeps them engaged through the planning phase.

**Reduced overwhelm.** It reveals complexity gradually. The user isn't shown
everything at once; they're walked through it. This is especially valuable when
the underlying domain (architecture) is intimidating.

**Confidence-building.** By reflecting the user's intent back to them ("here's
what I think you're building") it earns trust *before* asking them to trust the
output. The user believes the system understood them.

The throughline: it **separates understanding from doing**, and makes the
understanding phase feel calm, intentional, and worthwhile on its own.

---

## 3. Why This Matters for StackScout

**StackScout should not behave like a raw search box.** A query box implies
"I'll match keywords." An advisor implies "I'll understand your intent and reason
about it." Our value is the reasoning; the UX should signal that.

**StackScout should help users clarify what they are building.** Most users
arrive with a fuzzy idea ("an internal dashboard," "a PDF chatbot"). The fuzz is
where architecture mistakes happen. Helping users sharpen the idea is part of the
product, not a precursor to it.

**StackScout should identify architecture intent before recommending tools.**
This is just our existing principle — capabilities before tools — surfaced in the
UX. The user should *see* that we figured out what the system needs to do before
we name what to build it with.

**StackScout should support both technical and non-technical users.** A technical
founder wants depth and speed; a PM or early-career builder wants orientation and
plain language. A guided flow can serve both if it lets people go deeper or skip
ahead.

**StackScout should make users feel guided, not dumped into results.** Today the
jump from "idea" to "full stack + alternatives + scores" is abrupt. A brief
moment of reflected understanding before results would make the same output feel
intentional rather than spat out.

---

## 4. Proposed StackScout UX Flow

A future ideal flow. Not all of this is near-term; it's the target shape.

- **Step 1 — Enter a rough project idea.** Same low-friction entry we have now.
  Plain English, examples available, no required fields.
- **Step 2 — StackScout reflects understanding.** Before results, show a short
  "Here's what I think you're building" summary: the inferred project type,
  primary use case, and the capabilities it implies. This is the trust moment.
- **Step 3 — Ask 2–4 clarifying questions.** Only questions that would actually
  change the recommendation (stage, hosting, skill level, key capability
  ambiguities). Few, sharp, skippable.
- **Step 4 — User answers or skips.** Skipping is first-class. Defaults are
  sensible; answers refine. The user stays in control of how much they invest.
- **Step 5 — Generate an Architecture Brief.** A structured artifact (see §6)
  that frames the whole recommendation, not just a tool list.
- **Step 6 — Recommend capabilities and tools.** The current capability-first
  stack, now presented as the body of the brief rather than a standalone result.
- **Step 7 — Explore tool detail pages.** Existing seed-based `/tools/[toolId]`
  pages — rationale, tradeoffs, alternatives, compatibility, scores, notes.
- **Step 8 — Save/export or refine later.** Optionally keep or export the brief,
  or come back and adjust answers to regenerate. (Later milestone; see §8.)

The key change from today is **Step 2** (reflected understanding) and **Step 5**
(framing output as a brief). Steps 6–7 already exist.

---

## 5. Clarifying Questions StackScout Might Ask

Grouped by purpose. The system should ask *only* the few that matter for a given
idea — never the whole list. Each must visibly influence the output.

**Project type**
- Is this an internal tool, a customer-facing product, or a prototype/experiment?
- Is it web, API/service, data/AI, or a mix?

**User skill level**
- How comfortable are you setting up infrastructure — new to this, comfortable,
  or experienced?

**Prototype vs production**
- Are you trying to validate an idea quickly, or building something you'll run in
  production?

**Hosted vs self-hosted**
- Do you prefer managed services (less to operate) or self-hosted (more control)?

**Budget / cost sensitivity**
- Is keeping costs minimal a priority right now, or is speed-to-build more
  important?

**Speed vs control**
- Would you rather move fast with opinionated defaults, or keep maximum
  flexibility?

**Existing codebase vs new project**
- Starting fresh, or fitting into an existing stack/ecosystem (e.g. TypeScript,
  Python)?

**Data / storage needs**
- Do you need a database, file/blob storage, search, or vector storage?

**Authentication / team needs**
- Do users log in? Do you need roles/teams, or is it single-user/internal?

**AI / agent / RAG / scraping / deployment needs**
- Does it involve LLMs, agents, retrieval over documents, scraping, or scheduled
  jobs? Where will it run?

The aim is *triage*, not interrogation. Two or three well-chosen questions per
idea is the target; everything else is inferred or defaulted.

---

## 6. Architecture Brief Concept

A future artifact that frames a recommendation as a coherent plan. It's the
"structured output at the end" lesson, made StackScout-specific. It should read
like something a builder could paste into a doc and act on.

A brief should include:

- **What we think you're building** — one or two sentences reflecting intent.
- **Primary use case** — the core thing the system must do well.
- **MVP goal** — the smallest version worth building first.
- **Assumptions** — what we inferred or defaulted (made explicit so the user can
  correct them). This is also where uncertainty is surfaced honestly.
- **Required capabilities** — the capability-first backbone (auth, database,
  vector storage, etc.).
- **Recommended stack** — one tool per capability, with short rationale.
- **Alternatives** — credible swaps per capability and when you'd pick them.
- **Tradeoffs** — what the user is accepting with these choices.
- **What to avoid for now** — scope and tools to deliberately skip at MVP stage
  (anti-recommendations are part of good advice).
- **Next implementation step** — a concrete first move ("scaffold X, wire Y").

Most of this content already exists in the pipeline output and tool pages — the
brief is largely a *framing and assembly* of what we generate, not net-new data.

---

## 7. UX Principles for StackScout

- **Guide before recommending.** Reflect understanding before producing a stack.
- **Capabilities before tools.** Always show *what's needed* before *what to use*.
- **Explain tradeoffs, not just picks.** A recommendation without a tradeoff is
  incomplete.
- **Let users skip questions.** Guidance is optional; never block on input.
- **Don't overwhelm beginners.** Progressive disclosure; plain language first.
- **Give technical users enough depth.** Let them drill into rationale, scores,
  and alternatives without friction.
- **Make uncertainty visible.** State assumptions and confidence honestly rather
  than implying false precision.
- **Preserve momentum.** Every step should produce visible progress.
- **End with a useful artifact.** The user should leave with something actionable
  even before writing code.

---

## 8. What Not To Do Yet

These are explicit guardrails for this milestone:

- **Do not add LLM calls yet.** Reflected understanding and clarifying questions
  can start deterministic/seed-driven. LLM-authored briefs come later.
- **Do not add auth.** No accounts needed to plan an architecture.
- **Do not add persistence.** Save/export can wait until the flow is validated.
- **Do not add live GitHub ingestion.** Stay on the curated seed corpus.
- **Do not build a complex multi-step wizard yet.** A heavy wizard is premature;
  start with one lightweight "understanding" step.
- **Do not over-design before the product flow is validated.** Validate the shape
  before polishing pixels.
- **Do not copy Cursor's UI directly.** Borrow the posture (calm, guided,
  artifact-producing), not the interface.

---

## 9. Near-Term UX Opportunities

Small, practical steps that move toward the target without large bets:

- **Improve the home prompt framing.** Make the entry read like "describe what
  you're building and I'll plan the architecture," not "search."
- **Add a lightweight "what StackScout understood" summary** before (or atop) the
  results — inferred project type + detected capabilities — using existing
  deterministic detection. This is the highest-leverage, lowest-cost change.
- **Improve results information hierarchy.** Make capabilities-first structure
  more legible; group tools under the capability they serve.
- **Improve tool page readability.** Tighten the existing `/tools/[toolId]`
  layout and information order (acknowledged as functional MVP styling today).
- **Add clearer next-step guidance after recommendations.** End the results with
  "what to do next" rather than trailing off after the last card.
- **Eventually evaluate a simple Architecture Brief / export** once the
  understanding step proves valuable (see Open Questions).

None of these require new infrastructure; most are framing, copy, and layout over
data we already generate.

---

## 10. Open Questions

Decisions we still need to make before committing to the flow:

- **Sequencing:** Should clarifying questions happen *before* results, or should
  we show a first-draft architecture and then offer to refine via questions?
  (Draft-first preserves momentum; questions-first improves the first result.)
- **Non-technical path:** Should non-technical users get a simpler, more guided
  path, and if so, how do we detect or let them choose it?
- **Technical shortcut:** Should experienced users be able to skip straight to
  results, bypassing the understanding step entirely?
- **Brief lifecycle:** Should the Architecture Brief be saved, exported, or just
  displayed for now? (Ties directly to the "no persistence yet" guardrail.)
- **Design timing:** How much design polish is worth investing before deeper
  product features are validated?
- **Education vs recommendation:** How do we balance *teaching* the user about
  architecture against just *giving them the answer*? Different users want
  different mixes, and the flow may need to flex.
