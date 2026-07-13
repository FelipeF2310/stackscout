import { describe, expect, it } from 'vitest'
import {
  applyRefinementContextToSearchParams,
  parseRefinementContextFromSearchParams,
} from '../../lib/validation/refinementContextParams'

describe('refinementContextParams', () => {
  it('parses valid refinement params', () => {
    expect(
      parseRefinementContextFromSearchParams({
        skillLevel: 'beginner',
        projectStage: 'production',
        hostingPreference: 'self-hosted',
        ecosystem: 'typescript',
        modelPreference: 'openai',
        aiGrounding: 'both',
      })
    ).toEqual({
      skillLevel: 'beginner',
      projectStage: 'production',
      hostingPreference: 'self-hosted',
      ecosystem: 'typescript',
      modelPreference: 'openai',
      aiGrounding: 'both',
    })
  })

  it('uses the first string when Next supplies an array value', () => {
    expect(
      parseRefinementContextFromSearchParams({
        hostingPreference: ['self-hosted', 'managed'],
      })
    ).toEqual({ hostingPreference: 'self-hosted' })
  })

  it('ignores invalid values without dropping valid siblings', () => {
    expect(
      parseRefinementContextFromSearchParams({
        skillLevel: 'expert',
        hostingPreference: 'self-hosted',
        ecosystem: '',
      })
    ).toEqual({ hostingPreference: 'self-hosted' })
  })

  it('serializes refinement params while preserving unrelated workspace params', () => {
    const params = new URLSearchParams(
      'idea=Build+authentication&source=shared&skillLevel=beginner&hostingPreference=self-hosted'
    )

    const next = applyRefinementContextToSearchParams(params, {
      ecosystem: 'typescript',
      hostingPreference: 'managed',
      aiGrounding: 'both',
    })

    expect(next.get('idea')).toBe('Build authentication')
    expect(next.get('source')).toBe('shared')
    expect(next.get('hostingPreference')).toBe('managed')
    expect(next.get('ecosystem')).toBe('typescript')
    expect(next.get('aiGrounding')).toBe('both')
    expect(next.has('skillLevel')).toBe(false)
  })
})
