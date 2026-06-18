---
name: stackscout-capability-taxonomy
description: Query, validate, or extend the StackScout capability taxonomy. Use when adding a new capability, checking capability coverage, or resolving taxonomy ambiguity.
---

# StackScout Capability Taxonomy

## Query mode

If the user asks "what capability covers X?":
1. Read `lib/capabilities/capabilityTaxonomy.ts`
2. Find the best matching capability
3. Return: capability_id, name, description, category
4. If no match: recommend a new capability (see Add mode)

## Validate mode

If the user asks "does this capability belong in the taxonomy?":
1. Check against existing capabilities for overlap
2. Check: is this a system requirement or a tool? (Only requirements belong)
3. Check: is this specific enough to drive tool selection?
4. Return: VALID, OVERLAPS WITH (existing capability), or TOO SPECIFIC/BROAD

## Add mode

If adding a new capability:
1. Validate it (see Validate mode)
2. Generate:
   - `capability_id`: kebab-case slug
   - `name`: Title Case, ≤3 words
   - `description`: one sentence, "X for Y" format
   - `category`: pick from existing categories or propose a new one
3. List files to update:
   - `lib/capabilities/capabilityTaxonomy.ts`
   - `data/seed/capabilities.json`
   - `docs/CAPABILITY_TAXONOMY.md`
4. List tools that should be linked to this new capability

## Current taxonomy

See `lib/capabilities/capabilityTaxonomy.ts` for the canonical list.
