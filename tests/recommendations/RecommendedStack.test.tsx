import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import RecommendedStack from '../../components/architecture/RecommendedStack'
import { recommendArchitecture } from '../../lib/recommendations/recommendArchitecture'

describe('RecommendedStack', () => {
  it('renders one card for a tool that serves multiple capabilities', async () => {
    const { explanations } = await recommendArchitecture(
      'Build a PDF chatbot for internal company documents'
    )
    vi.stubGlobal('React', React)
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    try {
      const html = renderToStaticMarkup(<RecommendedStack explanations={explanations} />)
      const llamaindexHeadings = html.match(/<h3[^>]*>llamaindex<\/h3>/g) ?? []

      expect(llamaindexHeadings).toHaveLength(1)
      expect(html).toContain('Retrieval and Document Parsing')
      expect(consoleError).not.toHaveBeenCalledWith(
        expect.stringContaining('Encountered two children with the same key')
      )
    } finally {
      consoleError.mockRestore()
      vi.unstubAllGlobals()
    }
  })
})
