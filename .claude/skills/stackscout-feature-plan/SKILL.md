---
name: stackscout-feature-plan
description: Plan a new StackScout feature against MVP scope, product principles, and the existing domain model. Use before implementing any new feature.
---

# StackScout Feature Plan

You are planning a new feature for StackScout.

## Step 1 — MVP Scope Check

Read `.claude/rules/mvp-non-goals.md`.

Is this feature explicitly excluded from MVP?
- If YES: stop. Report the specific exclusion and suggest a Phase 2+ timeline.
- If NO: continue.

## Step 2 — Product Principle Check

Read `.claude/rules/product-principles.md`.

For each of the 7 principles, answer:
- Does this feature support or violate this principle?
- If it violates: can the feature be redesigned to comply?

## Step 3 — Domain Model Impact

Read `docs/DATA_MODEL.md`.

Does this feature require:
- A new entity?
- A new field on an existing entity?
- A new relationship type?
- Changes to the capability taxonomy?

List all data model changes required.

## Step 4 — Implementation Plan

Identify:
- Files to create or modify
- New lib/ modules needed
- New components needed
- New API routes needed
- Tests required

## Step 5 — Output

Produce a feature plan with:
- Feature name and one-line description
- Scope check result
- Principle compliance notes
- Data model changes
- Implementation file list
- Estimated complexity (S/M/L)
- Open questions or risks
