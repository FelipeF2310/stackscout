import { describe, expect, it, vi } from 'vitest'
import { detectCapabilitiesWithEvidence } from '../../lib/capabilities/detectCapabilities'
import { getAiGroundingQuestion } from '../../lib/capabilities/aiGrounding'
import { replaceAiGroundingInUrl } from '../../lib/validation/aiGroundingNavigation'
import { parseRefinementContextFromSearchParams } from '../../lib/validation/refinementContextParams'

describe('aiGroundingNavigation', () => {
  it('writes grounding while preserving the idea and unrelated URL params', () => {
    const replace = vi.fn()
    const href = replaceAiGroundingInUrl({
      pathname: '/workspace',
      searchParams: new URLSearchParams(
        'idea=Build+an+AI+chatbot&source=shared&hostingPreference=managed'
      ),
      context: { hostingPreference: 'managed' },
      grounding: 'product-sources',
      replace,
    })
    const params = new URL(href, 'https://stackscout.test').searchParams

    expect(params.get('idea')).toBe('Build an AI chatbot')
    expect(params.get('source')).toBe('shared')
    expect(params.get('hostingPreference')).toBe('managed')
    expect(params.get('aiGrounding')).toBe('product-sources')
    expect(replace).toHaveBeenCalledWith(href, { scroll: false })
  })

  it('removes grounding so an unresolved AI prompt becomes question-eligible again', () => {
    const replace = vi.fn()
    const prompt = 'Build an AI chatbot'
    const href = replaceAiGroundingInUrl({
      pathname: '/workspace',
      searchParams: new URLSearchParams(
        `idea=${encodeURIComponent(prompt)}&source=shared&aiGrounding=both`
      ),
      context: { aiGrounding: 'both' },
      grounding: undefined,
      replace,
    })
    const params = new URL(href, 'https://stackscout.test').searchParams
    const context = parseRefinementContextFromSearchParams(
      Object.fromEntries(params.entries())
    )

    expect(params.get('idea')).toBe(prompt)
    expect(params.get('source')).toBe('shared')
    expect(params.has('aiGrounding')).toBe(false)
    expect(context.aiGrounding).toBeUndefined()
    expect(
      getAiGroundingQuestion(detectCapabilitiesWithEvidence(prompt), context.aiGrounding)
    ).not.toBeNull()
    expect(replace).toHaveBeenCalledWith(href, { scroll: false })
  })
})
