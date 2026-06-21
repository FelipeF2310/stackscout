import { describe, it, expect } from 'vitest'
import { recommendArchitecture } from '../../lib/recommendations/recommendArchitecture'
import { getCorpus } from '../../lib/corpus/corpus'

// End-to-end test of the deterministic pipeline against the seed corpus.

describe('recommendArchitecture (end-to-end, deterministic)', () => {
  const PDF_CHATBOT_PROMPT = 'Build a PDF chatbot for internal company documents'

  it('produces an architecture covering the detected capabilities', async () => {
    const { tools } = getCorpus()
    const result = await recommendArchitecture(PDF_CHATBOT_PROMPT)

    const capabilityIds = result.architecture.capabilities.map((c) => c.capability_id)
    expect(capabilityIds).toContain('document-parsing')
    expect(capabilityIds).toContain('llm-api')

    // Every covered capability is assigned to a selected tool. One tool may
    // fulfill several capabilities, so capability ids are grouped per tool.
    const selectedCapabilityIds = result.architecture.selected_tools.flatMap(
      (t) => t.capability_ids
    )
    for (const capabilityId of capabilityIds) {
      expect(selectedCapabilityIds).toContain(capabilityId)
    }

    // Every selected tool is real (exists in the corpus) and capability-first:
    // all of its capability_ids were actually detected.
    const toolIds = new Set(tools.map((t) => t.tool_id))
    for (const selected of result.architecture.selected_tools) {
      expect(toolIds.has(selected.tool_id)).toBe(true)
      expect(selected.capability_ids.length).toBeGreaterThan(0)
      for (const capabilityId of selected.capability_ids) {
        expect(capabilityIds).toContain(capabilityId)
      }
      expect(selected.rationale.length).toBeGreaterThan(0)
    }
  })

  it('returns unique tools and groups the capabilities served by a multi-capability tool', async () => {
    const result = await recommendArchitecture(PDF_CHATBOT_PROMPT)
    const selectedToolIds = result.architecture.selected_tools.map((t) => t.tool_id)

    expect(new Set(selectedToolIds).size).toBe(selectedToolIds.length)

    const llamaindexSelections = result.architecture.selected_tools.filter(
      (t) => t.tool_id === 'llamaindex'
    )
    expect(llamaindexSelections).toHaveLength(1)
    expect(llamaindexSelections[0].capability_ids).toEqual(
      expect.arrayContaining(['retrieval', 'document-parsing'])
    )
  })

  it('returns one rich explanation per selected tool', async () => {
    const result = await recommendArchitecture(PDF_CHATBOT_PROMPT)
    expect(result.explanations).toHaveLength(result.architecture.selected_tools.length)
    for (const explanation of result.explanations) {
      expect(explanation.simple.length).toBeGreaterThan(0)
      expect(explanation.why.length).toBeGreaterThan(0)
      expect(explanation.tradeoff.length).toBeGreaterThan(0)
      expect(explanation.capability_ids.length).toBeGreaterThan(0)
      expect(explanation.capability_label.length).toBeGreaterThan(0)
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

  it('builds a multi-tool architecture for an internal dashboard (not just Next.js)', async () => {
    const result = await recommendArchitecture(
      'Build an internal dashboard for tracking city service requests'
    )

    const capabilityIds = result.architecture.capabilities.map((c) => c.capability_id)
    expect(capabilityIds).toContain('database')
    expect(capabilityIds).toContain('auth')

    const toolIds = result.architecture.selected_tools.map((t) => t.tool_id)
    expect(toolIds.length).toBeGreaterThanOrEqual(3)
    expect(toolIds.some((id) => id !== 'nextjs')).toBe(true)
  })

  it('uses builder-facing copy with no stale "not wired"/"pending" text', async () => {
    const result = await recommendArchitecture(
      'Build an internal dashboard for tracking city service requests'
    )

    expect(result.architecture.architecture_rationale).not.toMatch(
      /not yet wired|pending|deterministic baseline/i
    )
    for (const tool of result.architecture.selected_tools) {
      expect(tool.rationale).not.toMatch(/not yet wired|pending/i)
    }
    for (const explanation of result.explanations) {
      expect(explanation.tradeoff).not.toMatch(/not yet wired|pending/i)
      expect(explanation.why).not.toMatch(/not yet wired|pending/i)
    }
  })

  it('keeps alternatives within the same capability as the tool they replace', async () => {
    const { tools } = getCorpus()
    const byId = new Map(tools.map((t) => [t.tool_id, t]))
    const result = await recommendArchitecture(
      'Build a SaaS app with authentication, billing, database, and deployment'
    )

    for (const group of result.alternatives) {
      for (const alt of group.alternatives) {
        // The alternative must actually implement the capability it's offered for.
        expect(byId.get(alt.tool_id)?.capability_ids).toContain(group.capability_id)
      }
    }
  })
})
