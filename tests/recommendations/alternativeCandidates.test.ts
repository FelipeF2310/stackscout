import { describe, expect, it } from 'vitest'
import { getAlternativeCandidatesForCapability } from '../../lib/recommendations/alternativeCandidates'
import { getAlternativesForCapability } from '../../lib/recommendations/alternatives'

describe('alternative candidates from capability peers', () => {
  it('falls back to same-capability LLM API peers without alternative-to edges', () => {
    const alts = getAlternativesForCapability('openai-sdk', 'llm-api')
    const ids = alts.map((alt) => alt.tool_id)
    const candidates = getAlternativeCandidatesForCapability('openai-sdk', 'llm-api')

    expect(ids).toEqual(expect.arrayContaining(['vercel-ai-sdk', 'anthropic-sdk']))
    expect(ids).not.toContain('openai-sdk')
    // openai-sdk and vercel-ai-sdk have a compatibility edge; that remains a
    // pairing signal, not an alternative relationship signal.
    expect(sourceFor(candidates, 'vercel-ai-sdk')).toBe('capability-peer')
  })

  it('falls back to deployment peers without alternative-to edges', () => {
    const alts = getAlternativesForCapability('vercel', 'deployment')
    const ids = alts.map((alt) => alt.tool_id)

    expect(ids).toEqual(expect.arrayContaining(['railway', 'fly-io']))
    expect(ids).not.toContain('vercel')
  })

  it('falls back to document-parsing peers without alternative-to edges', () => {
    const alts = getAlternativesForCapability('llamaindex', 'document-parsing')
    const ids = alts.map((alt) => alt.tool_id)

    expect(ids).toEqual(expect.arrayContaining(['llamaparse', 'unstructured']))
    expect(ids).not.toContain('llamaindex')
  })

  it('keeps explicit relationship-backed alternatives before generic peers', () => {
    const candidates = getAlternativeCandidatesForCapability('supabase', 'database')
    const ids = candidateIds(candidates)

    expect(ids).toEqual(expect.arrayContaining(['neon', 'planetscale']))
    expect(ids.indexOf('neon')).toBeLessThan(ids.indexOf('planetscale'))
    expect(sourceFor(candidates, 'neon')).toBe('explicit-relationship')
    expect(sourceFor(candidates, 'planetscale')).toBe('capability-peer')
  })

  it('keeps fit-comparison peers before purely generic peers when the seed supports it', () => {
    const candidates = getAlternativeCandidatesForCapability('chroma', 'vector-storage')
    const ids = candidateIds(candidates)

    expect(ids).toEqual(expect.arrayContaining(['pinecone', 'weaviate']))
    expect(ids.indexOf('pinecone')).toBeLessThan(ids.indexOf('weaviate'))
    expect(sourceFor(candidates, 'pinecone')).toBe('fit-comparison')
    expect(sourceFor(candidates, 'weaviate')).toBe('capability-peer')
  })

  it('de-duplicates relationship candidates and caps alternatives at three', () => {
    const candidates = getAlternativeCandidatesForCapability('clerk', 'auth')
    const ids = candidateIds(candidates)

    expect(ids.filter((id) => id === 'authjs')).toHaveLength(1)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).not.toContain('clerk')
    expect(ids.length).toBeLessThanOrEqual(3)
  })
})

type Candidate = ReturnType<typeof getAlternativeCandidatesForCapability>[number]

function candidateIds(candidates: Candidate[]): string[] {
  return candidates.map((candidate) => candidate.tool.tool_id)
}

function sourceFor(candidates: Candidate[], toolId: string): Candidate['source'] | undefined {
  return candidates.find((candidate) => candidate.tool.tool_id === toolId)?.source
}
