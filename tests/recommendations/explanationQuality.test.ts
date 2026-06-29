import { describe, it, expect } from 'vitest'
import { recommendArchitecture } from '../../lib/recommendations/recommendArchitecture'

// Quality checks for the deterministic explanation layer. These assert the
// output reads like an architecture advisor, not a generic tool list.

const SAAS_PROMPT = 'Build a SaaS app with authentication, billing, database, and deployment'
const STALE = /not yet wired|pending|deterministic baseline/i
const GENERIC = /every tool involves tradeoffs/i

describe('architecture summary quality', () => {
  it('names the actual tools and reads as a stack summary', async () => {
    const { architecture } = await recommendArchitecture(SAAS_PROMPT)
    const summary = architecture.architecture_rationale

    expect(summary.length).toBeGreaterThan(40)
    expect(summary).not.toMatch(STALE)
    // Mentions concrete tools from the selection rather than vague filler.
    const someToolNamed = architecture.selected_tools.some((t) => summary.includes(t.tool_id))
    expect(someToolNamed).toBe(true)
  })

  it('explains cohesion when the stack has a known pairing', async () => {
    const { architecture } = await recommendArchitecture(SAAS_PROMPT)
    // nextjs + vercel are commonly-used-with in the seed, so the summary should
    // call out that the pieces fit together.
    expect(architecture.architecture_rationale).toMatch(/fit together|work together/i)
  })
})

describe('per-tool explanation quality', () => {
  it('answers why / capability / fit / tradeoff per tool, with no stale or generic copy', async () => {
    const { explanations } = await recommendArchitecture(SAAS_PROMPT)
    expect(explanations.length).toBeGreaterThan(0)

    for (const e of explanations) {
      expect(e.capability_ids.length).toBeGreaterThan(0)
      expect(e.capability_label.length).toBeGreaterThan(0)
      expect(e.simple).toContain(e.tool_id)
      expect(e.why.length).toBeGreaterThan(0)
      expect(e.tradeoff.length).toBeGreaterThan(0)

      for (const field of [e.simple, e.why, e.tradeoff, e.fits_with ?? '', e.consider_alternative ?? '']) {
        expect(field).not.toMatch(STALE)
        expect(field).not.toMatch(GENERIC)
      }
    }
  })

  it('tradeoffs are specific (mention vendor/scale/self-host/production)', async () => {
    const { explanations } = await recommendArchitecture(SAAS_PROMPT)
    for (const e of explanations) {
      expect(e.tradeoff).toMatch(/vendor|cost|scale|self-host|operate|production/i)
    }
  })

  it('names a concrete alternative when one exists for the capability', async () => {
    const { explanations, alternatives } = await recommendArchitecture(SAAS_PROMPT)
    const capsWithAlternatives = new Set(alternatives.map((a) => a.capability_id))

    for (const e of explanations) {
      if (e.capability_ids.some((id) => capsWithAlternatives.has(id))) {
        expect(e.consider_alternative).toBeTruthy()
        expect(e.consider_alternative).toMatch(/try \w|alternative/i)
      }
    }
  })

  it('keeps useful context for every capability served by one tool', async () => {
    const { explanations } = await recommendArchitecture(
      'Build a PDF chatbot for internal company documents'
    )
    const llamaindex = explanations.find((e) => e.tool_id === 'llamaindex')

    expect(llamaindex).toBeDefined()
    expect(llamaindex?.capability_ids).toEqual(
      expect.arrayContaining(['retrieval', 'document-parsing'])
    )
    expect(llamaindex?.capability_label).toMatch(/Retrieval/)
    expect(llamaindex?.capability_label).toMatch(/Document Parsing/)
    expect(llamaindex?.simple).toMatch(/retrieval/)
    expect(llamaindex?.simple).toMatch(/document parsing/)
  })

  it('names a concrete peer alternative when same-capability fallback is used', async () => {
    const { explanations } = await recommendArchitecture(
      'Build a PDF chatbot for internal company documents'
    )
    const openai = explanations.find((e) => e.tool_id === 'openai-sdk')

    expect(openai).toBeDefined()
    expect(openai?.capability_ids).toContain('llm-api')
    expect(openai?.consider_alternative).toMatch(/try (vercel-ai-sdk|anthropic-sdk)/)
  })
})

describe('alternative reason quality', () => {
  it('gives each alternative a useful, capability-relevant reason', async () => {
    const { alternatives } = await recommendArchitecture(SAAS_PROMPT)
    expect(alternatives.length).toBeGreaterThan(0)

    for (const group of alternatives) {
      for (const alt of group.alternatives) {
        expect(alt.reason_not_selected.length).toBeGreaterThan(0)
        expect(alt.reason_not_selected).not.toMatch(STALE)
      }
    }
  })
})
