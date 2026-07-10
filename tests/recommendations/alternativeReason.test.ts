import { describe, it, expect } from 'vitest'
import { alternativeReason } from '../../lib/recommendations/explanationCopy'
import { getToolById } from '../../lib/corpus/corpus'

// Fit-aware alternative reasons (PR #27).
//
// When an alternative is connected only by a plain `alternative-to` edge, the
// reason used to fall back to a generic trait line ("A self-hosted and
// production-ready option for X"). Now, if the alternative carries curated
// `best_for` metadata, the reason surfaces that instead — so alternatives read
// as "when you'd pick this instead", not a lookalike list. Relationship-specific
// reasons (better-for-*, managed/self-hosted-alternative) still take precedence,
// and tools without fit metadata keep the generic fallback. Selection is
// unchanged (this only affects explanation copy).

describe('alternativeReason (fit-aware)', () => {
  it('uses the alternative best_for for a metadata-backed alternative-to pair (pinecone↔qdrant)', () => {
    const reason = alternativeReason('qdrant', 'pinecone', 'vector-storage')
    const pineconeBestFor = getToolById('pinecone')!.best_for![0]
    expect(reason).toContain('Good fit when:')
    expect(reason).toContain(pineconeBestFor)
    // negative guard: no longer the generic trait fallback
    expect(reason).not.toContain('self-hosted and production-ready option')
    expect(reason).not.toContain('managed and production-ready option')
  })

  it('uses best_for for the database pair (supabase↔neon)', () => {
    const reason = alternativeReason('supabase', 'neon', 'database')
    expect(reason).toContain('Good fit when:')
    expect(reason).toContain(getToolById('neon')!.best_for![0])
  })

  it('uses best_for for document-parsing peer alternatives without alternative-to edges', () => {
    const reason = alternativeReason('llamaindex', 'unstructured', 'document-parsing')
    expect(reason).toContain('Good fit when:')
    expect(reason).toContain(getToolById('unstructured')!.best_for![0])
  })

  it('uses best_for for vector-storage peer alternatives without alternative-to edges', () => {
    const reason = alternativeReason('qdrant', 'weaviate', 'vector-storage')
    expect(reason).toContain('Good fit when:')
    expect(reason).toContain(getToolById('weaviate')!.best_for![0])
  })

  it('uses best_for for deployment peer alternatives without alternative-to edges', () => {
    const railwayReason = alternativeReason('vercel', 'railway', 'deployment')
    const flyReason = alternativeReason('vercel', 'fly-io', 'deployment')

    expect(railwayReason).toContain('Good fit when:')
    expect(railwayReason).toContain(getToolById('railway')!.best_for![0])
    expect(flyReason).toContain('Good fit when:')
    expect(flyReason).toContain(getToolById('fly-io')!.best_for![0])
  })

  it('uses best_for for realtime collaboration alternatives', () => {
    const reason = alternativeReason('liveblocks', 'yjs', 'realtime-collaboration')

    expect(reason).toContain('Good fit when:')
    expect(reason).toContain(getToolById('yjs')!.best_for![0])
  })

  it('uses best_for for scheduling alternatives', () => {
    const reason = alternativeReason('inngest', 'trigger-dev', 'scheduling')

    expect(reason).toContain('Good fit when:')
    expect(reason).toContain(getToolById('trigger-dev')!.best_for![0])
  })

  it('preserves relationship-specific reasons over best_for (typesense→algolia is self-hosted-alternative)', () => {
    const reason = alternativeReason('typesense', 'algolia', 'search')
    expect(reason).toMatch(/managed, hosted option/)
    expect(reason).not.toContain('Good fit when:')
  })

  it('keeps the generic trait fallback for an alternative without fit metadata (clerk→authjs)', () => {
    const reason = alternativeReason('clerk', 'authjs', 'auth')
    expect(reason).toContain('option for auth')
    expect(reason).not.toContain('Good fit when:')
  })
})
