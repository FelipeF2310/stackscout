import { describe, expect, it } from 'vitest'
import { detectCapabilitiesWithEvidence } from '../../lib/capabilities/detectCapabilities'
import {
  applyAiGrounding,
  getAiGroundingQuestion,
  resolveAiGrounding,
} from '../../lib/capabilities/aiGrounding'

function capabilityIds(prompt: string, grounding?: Parameters<typeof applyAiGrounding>[1]) {
  return applyAiGrounding(detectCapabilitiesWithEvidence(prompt), grounding).map(
    (entry) => entry.capability.capability_id
  )
}

describe('AI grounding clarification', () => {
  it('asks an AI support-agent builder how the product should ground its answers', () => {
    const evidence = detectCapabilitiesWithEvidence(
      'Build an AI customer support agent for a SaaS product'
    )

    expect(getAiGroundingQuestion(evidence, undefined)?.id).toBe('ai-grounding')
  })

  it('does not ask non-AI builders the grounding question', () => {
    const evidence = detectCapabilitiesWithEvidence('Build a marketplace app with payments')

    expect(getAiGroundingQuestion(evidence, undefined)).toBeNull()
  })

  it('ignores a stale product-sources answer for a non-AI prompt', () => {
    const evidence = detectCapabilitiesWithEvidence('Build a marketplace app with payments')
    const resolution = resolveAiGrounding(evidence, 'product-sources')

    expect(resolution.effectiveGrounding).toBeUndefined()
    expect(resolution.question).toBeNull()
    expect(resolution.evidence.map((entry) => entry.capability.capability_id)).not.toContain(
      'retrieval'
    )
  })

  it('does not ask when a prompt already settles source grounding', () => {
    const sourceGrounded = detectCapabilitiesWithEvidence(
      'Build an AI research assistant that answers questions from sources'
    )
    const documentGrounded = detectCapabilitiesWithEvidence(
      'Build a PDF chatbot for internal company documents'
    )

    expect(getAiGroundingQuestion(sourceGrounded, undefined)).toBeNull()
    expect(getAiGroundingQuestion(documentGrounded, undefined)).toBeNull()
  })

  it('adds clarified retrieval, but no unsupported source-type capabilities, for product sources', () => {
    const ids = capabilityIds('Build an AI assistant for a SaaS product', 'product-sources')
    const evidence = applyAiGrounding(
      detectCapabilitiesWithEvidence('Build an AI assistant for a SaaS product'),
      'product-sources'
    )
    const retrieval = evidence.find((entry) => entry.capability.capability_id === 'retrieval')

    expect(ids).toContain('retrieval')
    expect(ids).not.toContain('vector-storage')
    expect(ids).not.toContain('document-parsing')
    expect(retrieval?.origin).toBe('clarified')
    expect(retrieval?.signals).toContainEqual(
      expect.objectContaining({ type: 'clarified' })
    )
  })

  it('does not retain a vector database inferred only from broad chatbot language', () => {
    const ids = capabilityIds('Build an AI chatbot for a SaaS product', 'product-sources')

    expect(ids).toContain('retrieval')
    expect(ids).not.toContain('vector-storage')
  })

  it('applies both without retaining chatbot-only Vector Storage', () => {
    const ids = capabilityIds('Build an AI chatbot', 'both')

    expect(ids).toContain('retrieval')
    expect(ids).not.toContain('vector-storage')
  })

  it('adds only Retrieval source grounding to a minimal AI prompt', () => {
    const before = capabilityIds('Build an AI assistant')
    const after = capabilityIds('Build an AI assistant', 'product-sources')

    expect(before).not.toContain('database')
    expect(after).toContain('retrieval')
    for (const unsupported of [
      'database',
      'web-scraping',
      'document-parsing',
      'vector-storage',
    ]) {
      expect(after).not.toContain(unsupported)
    }
  })

  it('removes the inferred RAG assumptions from a chatbot when general knowledge is chosen', () => {
    const ids = capabilityIds('Build an AI chatbot for a SaaS product', 'general-knowledge')

    expect(ids).toContain('llm-api')
    expect(ids).not.toContain('retrieval')
    expect(ids).not.toContain('vector-storage')
  })

  it('uses the same conservative source default as general knowledge', () => {
    const ids = capabilityIds('Build an AI chatbot for a SaaS product', 'default')

    expect(ids).not.toContain('retrieval')
    expect(ids).not.toContain('vector-storage')
  })

  it('does not let a grounding answer remove explicit RAG requirements', () => {
    for (const grounding of ['general-knowledge', 'default'] as const) {
      const ids = capabilityIds('Build a RAG chatbot with vector search', grounding)

      expect(ids).toContain('retrieval')
      expect(ids).toContain('vector-storage')
    }
  })

  it('does not let stale general/default answers remove document-grounded Retrieval', () => {
    for (const grounding of ['general-knowledge', 'default'] as const) {
      const ids = capabilityIds(
        'Build an AI chatbot for internal company documents',
        grounding
      )

      expect(ids).toContain('document-parsing')
      expect(ids).toContain('retrieval')
      expect(ids).toContain('vector-storage')
    }
  })
})
