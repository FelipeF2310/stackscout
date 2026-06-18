import { describe, it, expect } from 'vitest'
import { detectCapabilities } from '../../lib/capabilities/detectCapabilities'

// Phase 1 baseline test: verifies the deterministic capability detector
// resolves a realistic prompt to relevant capabilities drawn from the current
// seed taxonomy. This asserts behavior that already exists — it does not add or
// change product behavior.

describe('detectCapabilities (deterministic baseline)', () => {
  const PDF_CHATBOT_PROMPT = 'Build a PDF chatbot for internal company documents'

  it('detects document parsing and LLM capabilities for a PDF chatbot prompt', () => {
    const ids = detectCapabilities(PDF_CHATBOT_PROMPT).map((c) => c.capability_id)

    expect(ids).toContain('document-parsing')
    expect(ids).toContain('llm-api')
  })

  it('detects a multi-capability stack for an internal dashboard prompt', () => {
    const ids = detectCapabilities(
      'Build an internal dashboard for tracking city service requests'
    ).map((c) => c.capability_id)

    // Should be more than just a generic web-app suggestion.
    expect(ids).toContain('frontend-framework')
    expect(ids).toContain('database')
    expect(ids).toContain('auth')
    expect(ids.length).toBeGreaterThanOrEqual(3)
  })

  it('detects a RAG-style stack for a document chatbot prompt', () => {
    const ids = detectCapabilities(
      'Build a PDF chatbot for internal company documents'
    ).map((c) => c.capability_id)

    expect(ids).toContain('document-parsing')
    expect(ids).toContain('llm-api')
    expect(ids).toContain('retrieval')
    expect(ids).toContain('vector-storage')
  })

  it('returns valid taxonomy capabilities and does not fall back to the default floor', () => {
    const result = detectCapabilities(PDF_CHATBOT_PROMPT)

    expect(result.length).toBeGreaterThan(0)
    for (const capability of result) {
      expect(capability).toHaveProperty('capability_id')
      expect(capability).toHaveProperty('name')
      expect(capability).toHaveProperty('category')
    }
    // The prompt has real matches, so the empty-input frontend fallback should
    // not be the only thing returned.
    expect(result.map((c) => c.capability_id)).not.toEqual(['frontend-framework'])
  })
})
