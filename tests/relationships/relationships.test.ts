import { describe, it, expect } from 'vitest'
import { getCorpus, getToolById } from '../../lib/corpus/corpus'
import { getAlternatives, getRelationshipsBetween } from '../../lib/relationships/relationshipGraph'
import { checkCompatibility } from '../../lib/relationships/compatibility'
import { getAlternativesForCapability } from '../../lib/recommendations/alternatives'

// Relationship and alternative lookups against the seeded graph.

describe('relationship graph (seeded)', () => {
  // Ensure the corpus (and its relationship graph) is loaded before any lookups.
  getCorpus()

  it('finds alternative-to neighbours for a tool', () => {
    const alternatives = getAlternatives('pinecone')
    expect(alternatives).toContain('weaviate')
    expect(alternatives).toContain('qdrant')
    expect(alternatives).not.toContain('pinecone')
  })

  it('reports compatibility confidence for a commonly-paired stack', () => {
    const result = checkCompatibility('nextjs', 'vercel')
    expect(result.compatible).toBe(true)
    expect(result.confidence).toBeGreaterThan(0.9)
  })

  it('returns a typed relationship between two tools', () => {
    const between = getRelationshipsBetween('clerk', 'authjs')
    expect(between.length).toBeGreaterThan(0)
    expect(between.some((r) => r.relationship_type === 'alternative-to')).toBe(true)
  })

  it('getAlternativesForCapability excludes the selected tool and caps the list', () => {
    const alts = getAlternativesForCapability('pinecone', 'vector-storage')
    expect(alts.length).toBeGreaterThan(0)
    expect(alts.length).toBeLessThanOrEqual(3)
    expect(alts.map((a) => a.tool_id)).not.toContain('pinecone')
  })

  it('only returns alternatives that serve the same capability', () => {
    const alts = getAlternativesForCapability('pinecone', 'vector-storage')
    for (const alt of alts) {
      expect(getToolById(alt.tool_id)?.capability_ids).toContain('vector-storage')
    }
  })

  it('gives every alternative a specific, non-generic reason', () => {
    const alts = getAlternativesForCapability('pinecone', 'vector-storage')
    for (const alt of alts) {
      expect(alt.reason_not_selected.trim().length).toBeGreaterThan(0)
      // No leftover placeholder phrasing.
      expect(alt.reason_not_selected).not.toMatch(/pending|not yet wired/i)
    }
  })
})
