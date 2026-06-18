---
name: stackscout-recommendation-review
description: Review a generated StackScout architecture recommendation for transparency, explanation quality, and architecture coherence. Use before shipping recommendation output changes.
---

# StackScout Recommendation Review

You are reviewing a generated architecture recommendation.

## Input

Provide:
- The original project description
- The generated architecture (capabilities + tools + rationale)
- The user's refinement context (if any)

## Step 1 — Transparency Check

For each recommended tool, verify:
- [ ] Rationale is present (not empty)
- [ ] Rationale answers: why this tool
- [ ] Rationale answers: what tradeoffs apply
- [ ] At least one alternative is listed
- [ ] Alternative includes: name + reason not selected

Flag any tool that fails any check.

## Step 2 — Language Check

Scan all rationale strings for:
- "best" → replace with "recommended for your context"
- "always" → replace with "commonly" or "tends to"
- "guaranteed" → remove or qualify

## Step 3 — Explanation Depth Check

For each tool:
- [ ] Simple explanation present (≤1 sentence, no jargon)?
- [ ] Technical explanation present (tradeoffs, constraints)?

## Step 4 — Coherence Check

- [ ] Is there an overall architecture rationale?
- [ ] Are the selected tools compatible with each other?
- [ ] Does the recommendation reflect the user's context?

## Step 5 — Output

Score: HIGH / MEDIUM / LOW

List:
- Issues found (category + specific problem)
- Suggested fixes
- Rationale strings to rewrite
