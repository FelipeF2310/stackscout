# ADR 002: Confidence Is Not Correctness

## Status
Accepted

## Context

AI-generated recommendations can sound authoritative. Users who trust a recommendation and build on it may discover months later that it was wrong for their context.

A recommendation system that confidently presents wrong recommendations is worse than one that presents uncertain recommendations transparently.

## Decision

StackScout separates confidence (how sure we are this recommendation fits) from correctness (whether it will actually work in practice).

Concrete policies:

1. **Language constraints**: Never use "best", "always", "guaranteed". Use "recommended for your context", "commonly used with", "tends to work well."

2. **Outcome tracking**: Collect user-reported outcomes 14 days after an architecture is saved. Track drift — tools replaced, architectures abandoned. Use this to calibrate recommendation confidence over time.

3. **Confidence scores on relationships**: Every relationship in the graph carries a confidence score (0–1) representing how reliable that relationship signal is.

4. **Transparency on tradeoffs**: Every recommendation includes tradeoffs. A recommendation without stated tradeoffs is incomplete.

## Consequences

- The recommendation UI must surface uncertainty without undermining trust.
- Outcome data is required to validate recommendation quality — it's not optional.
- Relationship confidence scores must be maintained and updated as evidence accumulates.
- The explanation layer must be built before launch — explanations are not optional polish.

## Alternatives Considered

**Confident recommendations only**: Present single "best" recommendations per capability without uncertainty. Rejected because it erodes trust when recommendations fail and provides no signal for improvement.
