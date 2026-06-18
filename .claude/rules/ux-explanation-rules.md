# UX Explanation Rules

Rules for the recommendation explanation layer.

---

## Two Depths, Always

Every tool recommendation must support two explanation depths:

### Simple
- One sentence max.
- No technical jargon.
- Answers: "What does this do for me?"

Example:
> Clerk handles user login so you don't have to build it yourself.

### Technical
- Full tradeoff analysis.
- Answers: why this tool, why not alternatives, what constraints apply.

Example:
> Clerk provides hosted authentication with OAuth, session management, RBAC, and prebuilt React components. Tradeoff: vendor dependency and cost at scale. Consider Auth.js if you need full data ownership, or Supabase Auth if your database is already on Supabase.

---

## Default Depth

Default to **simple** in the UI. Technical depth is opt-in (expandable section or toggle).

---

## Language Rules

- Never say "best" — say "recommended for your context."
- Never say "always" — say "commonly used with" or "works well with."
- Never say "guaranteed" — say "tends to" or "is designed to."
- Use active voice: "Clerk handles auth" not "Auth is handled by Clerk."

---

## Alternatives Display

- Show at least one alternative per capability.
- Every alternative must show: name + one-line reason why it wasn't the primary pick.
- Alternatives are not "worse" — frame them as "better if you need X."

---

## Tradeoff Display

Tradeoffs must appear in the recommendation, not only on click-through.
Minimum: one tradeoff sentence per recommended tool.

---

## Rationale Display

The architecture rationale must explain the architecture as a whole, not just individual tools.
Why do these tools fit together? What makes this architecture coherent for this project?
