# ADR 003: Small Curated Tool Corpus for Phase 1

## Status
Accepted

## Context

StackScout could try to cover thousands of tools at launch. This would give broader coverage but weaker relationship data, which is the core of the recommendation engine.

The quality of architecture recommendations depends entirely on the quality of relationship data between tools. A tool with no relationship data produces no compatibility signal.

## Decision

Phase 1 will use a manually curated corpus of 50–100 tools covering the most common capabilities for AI-assisted builders.

Criteria for inclusion:
- Must fulfill at least one core capability
- Must have ≥1 relationship defined
- Must have maintenance/maturity/documentation scores set
- Must be actively maintained (maintenance_score ≥ 0.6)

Tools are not added because they are popular — they are added when they can contribute to the relationship graph.

## Consequences

- Some tools users expect to see will not be in the MVP corpus.
- Recommendations for niche capabilities may have limited alternatives.
- The corpus must be reviewed and updated on a regular cadence.
- Phase 2 community contributions and Phase 4 automated discovery will expand the corpus — but the quality bar for relationships must be maintained.

## Alternatives Considered

**Large corpus, weak relationships**: Index many tools with minimal relationship data. Rejected because it produces generic recommendations indistinguishable from a search result.

**Community-sourced from day one**: Open tool submissions immediately. Rejected because it requires moderation infrastructure and risks low-quality data entering the recommendation engine before validation patterns are established.
