import { describe, it, expect } from 'vitest'
import { getCorpus, getToolById } from '../../lib/corpus/corpus'
import { scoreTools } from '../../lib/recommendations/scoreTools'
import { getAlternativesForCapability } from '../../lib/recommendations/alternatives'
import { alternativeReason } from '../../lib/recommendations/explanationCopy'
import { recommendArchitecture } from '../../lib/recommendations/recommendArchitecture'

// Astro as the first frontend-framework alternative (PR #28).
//
// Astro is added as an `alternative-to` Next.js with product-fit metadata, but
// must NOT be selected by default — Next.js stays the picked frontend tool. The
// guards: Astro has no compatibility/common-use edges (so it can't win the
// compatibility dimension on multi-tool stacks) and its maintenance average is
// below Next.js's (so it can't win the maintenance tiebreak on single-frontend
// stacks like the whiteboard known-gap case).

const CANONICAL = [
  'Build a marketplace app where users can list items and accept payments',
  'Build a web scraper that monitors job postings and summarizes new roles',
  'Build a PDF chatbot for internal company documents',
  'Build an internal analytics dashboard for city operations',
  'Build a realtime collaborative whiteboard',
  'Build an AI customer support agent for a SaaS product',
]

describe('astro frontend alternative', () => {
  it('corpus validates and Astro is a frontend-framework tool with fit metadata', () => {
    getCorpus() // throws if the new record fails schema validation
    const astro = getToolById('astro')!
    expect(astro).toBeDefined()
    expect(astro.capability_ids).toEqual(['frontend-framework'])
    expect(astro.best_for?.length ?? 0).toBeGreaterThan(0)
    expect(astro.avoid_if?.length ?? 0).toBeGreaterThan(0)
  })

  it('has an alternative-to relationship with Next.js (and no compat/common-use edges)', () => {
    const { relationships } = getCorpus()
    const astroEdges = relationships.filter(
      (r) => r.source_tool_id === 'astro' || r.target_tool_id === 'astro'
    )
    expect(astroEdges).toHaveLength(1)
    const edge = astroEdges[0]
    expect(edge.relationship_type).toBe('alternative-to')
    expect([edge.source_tool_id, edge.target_tool_id].sort()).toEqual(['astro', 'nextjs'])
    // explicitly no compatibility / common-use edges for Astro
    expect(
      astroEdges.some(
        (r) =>
          r.relationship_type === 'compatible-with' ||
          r.relationship_type === 'commonly-used-with'
      )
    ).toBe(false)
  })

  it('appears as an alternative for Next.js with a fit-aware reason', () => {
    const alts = getAlternativesForCapability('nextjs', 'frontend-framework')
    const astroAlt = alts.find((a) => a.tool_id === 'astro')
    expect(astroAlt).toBeDefined()
    // fit-aware reason from PR #27, not the generic fallback
    const reason = alternativeReason('nextjs', 'astro', 'frontend-framework')
    expect(reason).toContain('Good fit when:')
    expect(reason).toContain(getToolById('astro')!.best_for![0])
    expect(reason).not.toContain('self-hosted and production-ready option')
  })

  it('does not displace Next.js as the top frontend pick', () => {
    const { tools } = getCorpus()
    // single-frontend (empty stack): maintenance tiebreak — Next.js must win
    const top = scoreTools(tools, 'frontend-framework', {}, [])[0]
    expect(top.tool_id).toBe('nextjs')

    const astro = getToolById('astro')!
    const nextjs = getToolById('nextjs')!
    const avg = (t: typeof astro) =>
      (t.maintenance_score + t.maturity_score + t.documentation_score) / 3
    expect(avg(astro)).toBeLessThan(avg(nextjs))
  })

  it('is never selected by default across the six canonical prompts', async () => {
    for (const prompt of CANONICAL) {
      const result = await recommendArchitecture(prompt)
      const toolIds = result.architecture.selected_tools.map((t) => t.tool_id)
      expect(toolIds).not.toContain('astro')
      // where a frontend is selected, it is still Next.js
      const frontend = result.architecture.selected_tools.find((t) =>
        t.capability_ids.includes('frontend-framework')
      )
      if (frontend) expect(frontend.tool_id).toBe('nextjs')
    }
  })
})
