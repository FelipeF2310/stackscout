# Canonical UX visual references

The **tracked, finalized visual source of truth** for StackScout's UX. These are
the references [`../UX_CANONICAL_DIRECTION.md`](../UX_CANONICAL_DIRECTION.md)
points to. If a screen disagrees with these, these win.

They are **self-contained single HTML files** — open any one directly in a
browser (no server, no external assets).

| File | Role |
|---|---|
| `01-landing.html` | **Landing / prompt entry** — the home page (focused prompt, calm chrome). |
| `02-two-pane-workspace.html` | **Two-pane guided workspace** — the interaction rhythm after the user submits: guided conversation (left) building a living artifact (right). |
| `03-stack-map-artifact.html` | **Capability-first Stack Map** — the canonical right-pane artifact: capabilities → recommended tools → alternatives → relationships → tradeoffs. |

The three are wired as a mini-demo within this folder: `01` submits into `02`;
`03`'s brand link returns to `01`. (Links were repointed to stay inside this
canonical set — they do not reach any non-canonical sibling prototype.)

## Caveats (read before treating any detail as gospel)

- These began as **design-exploration prototypes**; they are carried over as the
  canonical *visual* spec. Judge the **visual design and flow**, not any embedded
  commentary.
- `02-two-pane-workspace.html` contains an original **"designer notes" panel**
  from the exploration phase. It references earlier explored variants — e.g.
  `simplified.html` and an older **"Architecture Brief"** framing. **Those are
  superseded / scrapped** (the canonical right-pane artifact is the
  capability-first Stack Map, `03`). The notes are kept only as design rationale.
- The **old stacked results-page** direction is scrapped and is intentionally
  **not** tracked here. Do not reintroduce it.

## Future enhancement (optional)

Static **screenshots** would be an even more stable reference than HTML (immune to
browser/JS drift). They aren't included now because no headless-browser tooling is
set up in this repo. Adding `*.png` exports of these three screens later is a
welcome, low-risk follow-up.
