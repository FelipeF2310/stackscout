# ADR 004: Outcome Tracking via 14-Day Survey

## Status
Accepted

## Context

A recommendation engine with no feedback loop cannot improve. Without knowing whether recommended architectures were actually used — and whether they held up — StackScout has no signal to distinguish good recommendations from lucky ones.

## Decision

StackScout will track architecture outcomes using a lightweight 14-day survey.

When a user saves an architecture, a follow-up is triggered 14 days later at `/feedback/[architectureId]`.

Survey questions:
1. Status: Using as recommended / Modified slightly / Replaced multiple components / Abandoned
2. (If modified/replaced): Which tools did you replace?
3. (Optional): What changed?

Outcomes are stored in the `architecture_outcomes` table linked to the original architecture.

## What outcome data powers

### Short-term
- Primary metric: Architecture Retention Rate (% still in use at 14 days)
- Secondary: Most replaced tools, most retained tools, abandonment rate

### Long-term (Phase 2)
- Drift analysis: Which tools are most commonly replaced?
- Relationship improvement: Strong retention pairs → higher confidence_score
- Weak recommendations: High replacement rate → candidate for removal or demotion

## Survey timing rationale

14 days was chosen because:
- Long enough that the user has made real implementation decisions
- Short enough that the recommendation is still fresh
- Short enough that users remember what they changed

## Consequences

- Architecture saving is the trigger event — users who don't save get no follow-up.
- Outcome data is sparse initially. The retention metric is not meaningful until sufficient data accumulates.
- The survey must be frictionless. Too many questions will reduce completion rate.
- Abandoned architectures are valuable signal — the survey must not feel like failure when users abandon.
