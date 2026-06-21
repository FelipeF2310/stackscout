import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import ToolRecommendationCard from '../../components/architecture/ToolRecommendationCard'
import type { ToolExplanation } from '../../lib/recommendations/explainRecommendation'

const explanation: ToolExplanation = {
  tool_id: 'clerk',
  capability_ids: ['auth'],
  capability_label: 'Authentication',
  github_url: 'https://github.com/clerk/javascript',
  simple: 'clerk handles authentication so you do not have to build it yourself.',
  why: 'Picked for authentication because it is a managed service.',
  fits_with: 'Compatible with nextjs.',
  tradeoff: 'As a managed service it adds vendor dependency.',
  consider_alternative: 'you would rather self-host — try authjs.',
}

describe('ToolRecommendationCard links', () => {
  it('links the tool name internally to /tools/[toolId] and keeps GitHub external', () => {
    vi.stubGlobal('React', React)
    try {
      const html = renderToStaticMarkup(<ToolRecommendationCard tool={explanation} />)

      // Internal link to the tool detail page.
      expect(html).toMatch(/href="\/tools\/clerk"/)
      // External GitHub link still points at the repo URL.
      expect(html).toContain('href="https://github.com/clerk/javascript"')
      expect(html).toContain('target="_blank"')
    } finally {
      vi.unstubAllGlobals()
    }
  })
})
