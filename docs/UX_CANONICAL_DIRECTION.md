# StackScout — Canonical UX Direction

**This is the authoritative description of StackScout's product UX.** If any other
doc, screenshot, component, or prototype disagrees with this, this wins. It exists
to stop the UX direction from drifting (which it has — see "Scrapped direction"
below).

Governing compass: [`STACKSCOUT_PROJECT_ALIGNMENT.md`](./STACKSCOUT_PROJECT_ALIGNMENT.md).

_Last updated: 2026-06-24._

---

## The canonical flow

StackScout is a **landing page → guided two-pane workspace**, not a search box
that returns a stacked results page.

### 1. Landing — prompt entry
A focused, calm prompt entry ("What are you building?"). One input, minimal
chrome. The home page.

### 2. Guided two-pane workspace (after the user submits)
The core experience is **two panes**:

- **Left pane — guided conversation.** What StackScout understood, the detected
  capabilities, short clarifying questions, and the ability to make adjustments.
  It helps the user *think*, narrows scope, and explains its reading of the
  project before and alongside recommendations.
- **Right pane — the living artifact.** Updates as the conversation progresses.

### 3. Right-pane artifact — the capability-first **Stack Map**
The canonical artifact is the **capability-first Stack Map / Tool Ecosystem map**:

> **capabilities → recommended tools → alternatives → relationships → tradeoffs**

- Brief-style summary copy *may* frame the artifact, but the **Stack Map is the
  primary artifact**, not a prose "Architecture Brief."
- Per capability: the recommended tool, alternatives ("better if you need X"),
  pairs-with / relationships, and tradeoffs — compact, with depth on the tool
  detail page (`/tools/[toolId]`).

---

## Visual target (tracked references)

The **finalized visual references are tracked** in this repo under
[`ux-references/canonical/`](./ux-references/canonical/) (self-contained HTML —
open directly in a browser). Treat them as the visual spec:

- **Landing:** [`ux-references/canonical/01-landing.html`](./ux-references/canonical/01-landing.html)
- **Two-pane guided workspace:** [`ux-references/canonical/02-two-pane-workspace.html`](./ux-references/canonical/02-two-pane-workspace.html)
- **Capability-first right-pane artifact:** [`ux-references/canonical/03-stack-map-artifact.html`](./ux-references/canonical/03-stack-map-artifact.html)
  (the refinement that made the right pane StackScout-native and capability-first;
  it supersedes the older "Architecture Brief" framing).

See [`ux-references/canonical/README.md`](./ux-references/canonical/README.md) for
roles and caveats. Borrow the **rhythm** of a calm, guided planning flow — not
Cursor's brand, colors, typography, or IDE chrome.

---

## Scrapped direction (must not guide implementation)

The **old stacked results-page** is scrapped: a single page that, after input,
renders `ArchitectureSummary` + capability chips + `RecommendedStack` +
`AlternativeTools` stacked vertically in functional MVP styling. It is **not** the
product. Do not build toward it, and do not treat the current `app/page.tsx`
layout as the target.

---

## Current app reality vs. the target (be honest about the gap)

As of this writing the live app is **still the scrapped shell**: `app/page.tsx`
renders the stacked sections inline (no landing page, no two-pane workspace, no
guided conversation). The gap between current and canonical is **large** — it is a
new experience, not a restyle.

A branch `feature/stack-map-artifact` exists with a "Stack Map v0" that
reorganized the stacked results page capability-first. **That branch is reference
only** (useful for capability grouping, multi-capability dedup, and test ideas).
It targeted the scrapped shell and is **not** the product implementation — it
should not be pushed, PR'd, or merged.

---

## Artifact readiness / data dependency

The canonical UX target is unchanged: **landing page → guided two-pane workspace →
right-pane capability-first Stack Map.** This section is a **readiness guardrail**,
not a change to that target.

- The Stack Map only **feels like an ecosystem advisor** if the underlying
  **relationship data is dense enough** to populate relationships, pairings,
  alternatives, and tradeoffs. A capability-first map over sparse relationship data
  reads as a styled list, not an ecosystem.
- The current relationship corpus is **intentionally small**. It should be
  **deepened in focused verticals** *before* over-investing in the full guided
  conversation experience — otherwise the workspace frames an artifact that has
  little ecosystem signal to show.
- Early validation should likely focus on **one dense vertical first** — e.g.
  PDF / RAG / document-chatbot tooling, where the seed already has real coverage.
- This does **not** change the canonical UX; it sequences *what makes the canonical
  UX land*. (No relationship-data work happens in this docs PR.)

---

## Current recommended implementation sequence (not permanent product truth)

> ⚠️ **This is current implementation guidance, not canonical product truth.** The
> sequence below may change as each phase is planned (and as dependencies like
> relationship-data depth are weighed). **The canonical UX target above does not
> change with it** — only the order/approach of building toward it might.

Smallest-safe-first, each its own planning pass + small PR:

1. **Landing page** — the focused prompt entry.
2. **Two-pane workspace shell** — layout + routing for left/right panes.
3. **Right-pane Stack Map artifact** — port the capability-first map into the
   right pane (reuse the v0 branch's capability-grouping/dedup logic), styled to
   the prototype.
4. **Left-pane guided conversation** — understanding, detected capabilities,
   clarifying questions, adjustments. **Note:** clarifying questions that change
   recommendations touch real `lib` (`RefinementContext`) — this step is **not**
   UI-only and needs its own plan.

Deterministic throughout (no LLM/DB/RAG/agents) unless a future phase explicitly
decides otherwise — per the alignment compass and the repo-memory architecture doc.

---

## Reference provenance

The canonical visual references are now **tracked** under
[`ux-references/canonical/`](./ux-references/canonical/), so this direction is
versioned and durable for collaborators and agents. The broader, unversioned
exploration set under `design-explorations/` (including the **scrapped** stacked
results-page and older variants) is **not** the source of truth and must not
guide implementation. Static screenshot exports of the three canonical screens
are a welcome future enhancement (more drift-proof than HTML) but aren't required.
