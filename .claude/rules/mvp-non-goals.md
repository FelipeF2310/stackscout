# MVP Non-Goals

The following are explicitly out of scope for the current free MVP. Paid features
and browser extensions are deferred until the free product proves value and the
core audit/report artifact is useful.

Check this list before adding any new feature.

---

## Excluded Features

- **Code generation** — StackScout recommends architectures, not code.
- **IDE integrations** — no VS Code extension, no Cursor plugin.
- **Trend feeds** — no "trending stacks" or popularity charts.
- **Workflow execution** — no running or deploying stacks.
- **Browser extensions** — no GitHub sidebar or similar.
- **Paid tiers or monetization** — no pricing, billing, or paywall work.
- **Team collaboration** — no shared workspaces, comments, or mentions.
- **Enterprise administration** — no SSO, org management, or audit logs.
- **Social networking** — no follows, likes, or activity feeds.
- **Marketplace functionality** — no tool submissions from third parties.
- **Stack monitoring** — no runtime alerts or dependency tracking.
- **Security scanning** — no vulnerability detection.

---

## Common Temptations — Explicitly Rejected

- "Add a 'most popular stacks' section" → No. Popularity ≠ fit.
- "Let users rate tools" → Not in MVP.
- "Generate a starter repo / boilerplate" → Not in MVP.
- "Show GitHub stars on tool cards" → Stars are not a compatibility signal.
- "Add a tool comparison table" → Not in MVP. Tradeoffs live in the explanation layer.
- "Add social sharing" → Not in MVP.
- "Let users submit tools" → Phase 3 at earliest.

---

## What IS in scope

- Natural language project input
- Capability detection
- Tool recommendations with explanations
- Architecture generation
- Refinement (skill level, stage, hosting, ecosystem, model preference)
- Capability-peer alternatives
- Fit metadata (`best_for` / `avoid_if`)
- Scoring structure improvements only when a recommendation review proves the need

## Deferred Until Explicitly Scoped

- Architecture persistence, saved architecture lists, and outcome follow-up
- Audit/report/evidence schemas
- GitHub ingestion
- Runtime agents
- RAG and self-learning
