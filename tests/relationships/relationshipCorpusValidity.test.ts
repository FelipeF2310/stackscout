import { describe, it, expect } from 'vitest'
import { getCorpus, getAllTools } from '../../lib/corpus/corpus'
import { RELATIONSHIP_DESCRIPTIONS } from '../../lib/relationships/relationshipTypes'

// Relationship corpus guardrails (test-only, behavior-preserving).
//
// The corpus already validates relationship *shape* via zod at load. These tests
// add *integrity* guardrails the schema doesn't cover, so future edits to
// data/seed/relationships.json can't silently introduce dangling tool ids,
// self-relationships, duplicates, or out-of-range confidence. No runtime code,
// recommendation logic, or UI is changed.
//
// Deferred (reported, not done): a guardrail asserting that the relationship-type
// list in lib/corpus/corpus.ts (`RELATIONSHIP_TYPES`, used for the zod enum)
// matches lib/relationships/relationshipTypes.ts. That const is module-private in
// corpus.ts; comparing the two cleanly would require exporting/restructuring it,
// which is out of scope here. Types are instead validated against the exported
// RELATIONSHIP_DESCRIPTIONS (the runtime mirror of the RelationshipType union).

const relationships = getCorpus().relationships
const toolIds = new Set(getAllTools().map((t) => t.tool_id))
const validTypes = new Set(Object.keys(RELATIONSHIP_DESCRIPTIONS))

// Direction-independent relationship types: A↔B is the same fact as B↔A, so a
// reverse record is a duplicate. Directional types (better-for-*, *-alternative)
// are NOT symmetric — a reverse record means something different.
const SYMMETRIC_TYPES = new Set([
  'compatible-with',
  'alternative-to',
  'commonly-used-with',
])

describe('relationship corpus validity (data/seed/relationships.json)', () => {
  it('has relationships to validate', () => {
    expect(relationships.length).toBeGreaterThan(0)
  })

  it('every source_tool_id resolves to an existing tool', () => {
    const dangling = relationships
      .filter((r) => !toolIds.has(r.source_tool_id))
      .map((r) => `${r.relationship_id}: ${r.source_tool_id}`)
    expect(dangling).toEqual([])
  })

  it('every target_tool_id resolves to an existing tool', () => {
    const dangling = relationships
      .filter((r) => !toolIds.has(r.target_tool_id))
      .map((r) => `${r.relationship_id}: ${r.target_tool_id}`)
    expect(dangling).toEqual([])
  })

  it('has no self-relationships (source !== target)', () => {
    const selfRefs = relationships
      .filter((r) => r.source_tool_id === r.target_tool_id)
      .map((r) => r.relationship_id)
    expect(selfRefs).toEqual([])
  })

  it('has unique relationship_id values', () => {
    const seen = new Set<string>()
    const dupes: string[] = []
    for (const r of relationships) {
      if (seen.has(r.relationship_id)) dupes.push(r.relationship_id)
      seen.add(r.relationship_id)
    }
    expect(dupes).toEqual([])
  })

  it('has no exact duplicate records (same source, target, and type)', () => {
    const seen = new Set<string>()
    const dupes: string[] = []
    for (const r of relationships) {
      const key = `${r.source_tool_id}|${r.target_tool_id}|${r.relationship_type}`
      if (seen.has(key)) dupes.push(`${r.relationship_id} (${key})`)
      seen.add(key)
    }
    expect(dupes).toEqual([])
  })

  it('has no reverse-duplicate records for symmetric relationship types', () => {
    const seen = new Map<string, string>() // key -> relationship_id
    const reverseDupes: string[] = []
    for (const r of relationships) {
      const fwd = `${r.source_tool_id}|${r.target_tool_id}|${r.relationship_type}`
      const rev = `${r.target_tool_id}|${r.source_tool_id}|${r.relationship_type}`
      if (SYMMETRIC_TYPES.has(r.relationship_type) && seen.has(rev)) {
        reverseDupes.push(`${r.relationship_id} (reverse of ${seen.get(rev)})`)
      }
      seen.set(fwd, r.relationship_id)
    }
    expect(reverseDupes).toEqual([])
  })

  it('every relationship_type is valid', () => {
    const invalid = relationships
      .filter((r) => !validTypes.has(r.relationship_type))
      .map((r) => `${r.relationship_id}: ${r.relationship_type}`)
    expect(invalid).toEqual([])
  })

  it('every confidence_score is within [0, 1]', () => {
    const outOfRange = relationships
      .filter(
        (r) =>
          typeof r.confidence_score !== 'number' ||
          r.confidence_score < 0 ||
          r.confidence_score > 1
      )
      .map((r) => `${r.relationship_id}: ${r.confidence_score}`)
    expect(outOfRange).toEqual([])
  })
})
