# Scoring Model

How StackScout selects and ranks tools for a given capability.

## Overview

Tools are scored across four dimensions. The final score determines recommendation order within a capability.

## Dimensions

### 1. Capability Fit (30%)

Binary: does this tool fulfill the required capability?

All tools in the scoring pool already pass this filter (they're pre-filtered by capability_id). Score is always 1.0 for tools in the pool.

---

### 2. Context Fit (30%)

How well does the tool match the user's refinement context?

| Signal | Weight |
|---|---|
| beginner_friendly = true when skillLevel = beginner | +0.25 |
| production_ready = true when projectStage = production | +0.25 |
| managed = true when hostingPreference = managed | +0.25 |
| managed = false when hostingPreference = self-hosted | +0.25 |
| ecosystems includes user's ecosystem preference | +0.25 |

Base score: 0.5. Maximum: 1.0. Scores are capped at 1.0.

---

### 3. Compatibility Fit (25%)

How well does this tool work with the other tools already selected in the stack?

Computed by averaging the confidence score of all `compatible-with` and `commonly-used-with` relationships between this tool and already-selected tools.

If no relationships exist between this tool and selected tools: score defaults to 0.5.

---

### 4. Maintenance Fit (15%)

Is this tool actively maintained and well-documented?

Average of three stored signals:
- `maintenance_score` — recency of commits, archived status
- `maturity_score` — adoption signals
- `documentation_score` — documentation quality

These signals are pre-computed from GitHub metadata and stored on the Tool record.

---

## Final Score

```
score = (capability_fit × 0.30)
      + (context_fit × 0.30)
      + (compatibility_fit × 0.25)
      + (maintenance_fit × 0.15)
```

The highest-scoring tool is recommended as primary. Alternatives are drawn from the next-highest scorers + `alternative-to` relationships.

## What is NOT scored

- GitHub stars (raw count)
- npm download counts
- Trend data or social signals
- Recency of news coverage

These are noise for architecture fit.
