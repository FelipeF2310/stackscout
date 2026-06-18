import { describe, it, expect } from 'vitest'
import { recommendArchitecture } from '../../lib/recommendations/recommendArchitecture'
import { getSeed } from '../../lib/seed/loadSeed'

// End-to-end test of the deterministic pipeline against the seed corpus.

describe('recommendArchitecture (end-to-end, deterministic)', () => {
  const PDF_CHATBOT_PROMPT = 'Build a PDF chatbot for internal company documents'

  it('produces an architecture covering the detected capabilities', async () => {
    const { tools } = getSeed()
    const result = await recommendArchitecture(PDF_CHATBOT_PROMPT)

    const capabilityIds = result.architecture.capabilities.map((c) => c.capability_id)
    expect(capabilityIds).toContain('document-parsing')
    expect(capabilityIds).toContain('llm-api')

    // One selected tool per capability that has corpus coverage.
    const selectedCapabilityIds = result.architecture.selected_tools.map((t) => t.capability_id)
    for (const capabilityId of capabilityIds) {
      expect(selectedCapabilityIds).toContain(capabilityId)
    }

    // Every selected tool is real (exists in the corpus) and capability-first:
    // its capability_id is one that was actually detected.
    const toolIds = new Set(tools.map((t) => t.tool_id))
    for (const selected of result.architecture.selected_tools) {
      expect(toolIds.has(selected.tool_id)).toBe(true)
      expect(capabilityIds).toContain(selected.capability_id)
      expect(selected.rationale.length).toBeGreaterThan(0)
    }
  })

  it('returns one explanation per selected tool', async () => {
    const result = await recommendArchitecture(PDF_CHATBOT_PROMPT)
    expect(result.explanations).toHaveLength(result.architecture.selected_tools.length)
    for (const explanation of result.explanations) {
      expect(explanation.simple.length).toBeGreaterThan(0)
      expect(explanation.technical.length).toBeGreaterThan(0)
    }
  })

  it('surfaces at least one alternative from the relationship graph', async () => {
    const result = await recommendArchitecture(PDF_CHATBOT_PROMPT)
    const totalAlternatives = result.alternatives.reduce(
      (sum, a) => sum + a.alternatives.length,
      0
    )
    expect(totalAlternatives).toBeGreaterThan(0)
  })
})
