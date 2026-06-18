# ADR 001: Capabilities as First-Class Objects

## Status
Accepted

## Context

Most existing tools that help builders discover software (Awesome lists, GitHub Explore, Product Hunt) organize content around repositories or tools.

The problem with repository-first design:
- Users don't know what tools they need until they know what capabilities they need.
- Repository discovery doesn't help users understand system composition.
- Popularity signals (stars, forks) don't predict architectural fit.

StackScout's goal is to help builders design systems, not browse software.

## Decision

The primary object in StackScout is a **capability** — a system requirement expressed as a named function (Authentication, Vector Storage, Scheduling, etc.).

Tools are implementations of capabilities. Architectures are collections of capabilities fulfilled by compatible tools.

All data models, UI surfaces, and recommendation logic are organized around capabilities, not tools or repositories.

## Consequences

- The capability taxonomy becomes a core asset that must be maintained.
- Tools are secondary objects — they only appear in the context of a capability.
- The UI presents capabilities first, then tools that fulfill them.
- Scoring is capability-relative, not absolute tool ranking.
- Adding a new tool always requires linking it to ≥1 capability.

## Alternatives Considered

**Repository-first**: Surface GitHub repositories with AI-generated descriptions. Rejected because it doesn't help users understand system architecture — it's just discovery with AI labels.

**Category-first**: Organize tools into broad categories (Frontend, Backend, AI). Rejected because categories are too coarse to drive architecture decisions and don't capture capability relationships.
