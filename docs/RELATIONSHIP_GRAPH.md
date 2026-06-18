# Relationship Graph

The relationship graph is StackScout's primary strategic asset.

It powers:
- Compatibility scoring during architecture generation
- Alternative tool surfacing
- Coherence validation of generated stacks

## Relationship Types

### `compatible-with`
These tools work well together without configuration friction.

Direction: source → target (read: "source is compatible with target")

Example: `vercel-ai-sdk` → `nextjs`

### `alternative-to`
These tools serve the same capability and can replace each other.

Direction: bidirectional in practice — both tools can replace the other.

Example: `clerk` → `authjs`

### `commonly-used-with`
These tools are frequently chosen together in practice.

Direction: source → target (read: "source is commonly used with target")

Example: `nextjs` → `vercel`

### `better-for-beginners`
Source tool has lower onboarding friction than target for new builders.

Direction: source is the beginner-friendly option.

Example: `clerk` → `authjs` (Clerk is better for beginners than Auth.js)

### `better-for-production`
Source tool is more suitable for production workloads than target.

Direction: source is the production-grade option.

Example: `pinecone` → `chroma`

### `managed-alternative`
Source tool is a managed (hosted) version of what target offers self-hosted.

Example: `pinecone` → `weaviate`

### `self-hosted-alternative`
Source tool is a self-hosted version of what target offers managed.

Example: `typesense` → `algolia`

## Confidence Scores

Every relationship has a confidence score (0–1):

- 0.9–1.0: High confidence — well-established, widely observed
- 0.7–0.9: Moderate confidence — common but with notable exceptions
- 0.5–0.7: Low confidence — plausible but context-dependent
- Below 0.5: Not recommended for MVP seed data

## Phase 1: Manual Curation

All relationships in Phase 1 are manually curated with `source_of_truth: "manual"`.

Target: 30–50 high-confidence relationships covering the core tool corpus.

Quality over quantity. A weak relationship adds noise; a missing relationship is just a gap.

## Phase 2: Behavior-driven Learning

Signals from architecture drift will surface candidate relationships for review:
- Most replaced tools → may indicate weak compatibility
- Most retained pairings → may indicate strong compatibility

Automated discovery will not be added without human review of each candidate relationship.
