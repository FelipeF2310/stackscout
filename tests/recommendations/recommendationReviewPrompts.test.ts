import { describe, it, expect } from 'vitest'
import {
  recommendationReviewPrompts,
  getReviewPrompt,
} from '../fixtures/recommendationReviewPrompts'
import { detectCapabilities } from '../../lib/capabilities/detectCapabilities'
import { recommendArchitecture } from '../../lib/recommendations/recommendArchitecture'

// Fixture integrity + smoke coverage for the 14-prompt review set. This test
// deliberately asserts NO exact capabilities or tools — enforcement lives in
// goldenRecommendationSet.test.ts; this fixture exists so diff audits are
// reproducible. See the fixture header for the division of labor.

describe('recommendationReviewPrompts (fixture integrity)', () => {
  it('contains exactly 14 prompts', () => {
    expect(recommendationReviewPrompts).toHaveLength(14)
  })

  it('has unique ids and unique prompts', () => {
    const ids = recommendationReviewPrompts.map((p) => p.id)
    const prompts = recommendationReviewPrompts.map((p) => p.prompt)
    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(prompts).size).toBe(prompts.length)
  })

  it('has non-empty ids, prompts, and purposes', () => {
    for (const p of recommendationReviewPrompts) {
      expect(p.id.trim().length).toBeGreaterThan(0)
      expect(p.prompt.trim().length).toBeGreaterThan(0)
      expect(p.purpose.trim().length).toBeGreaterThan(0)
    }
  })

  it('getReviewPrompt returns the prompt text for an id', () => {
    expect(getReviewPrompt('marketplace-payments')).toBe(
      'Build a marketplace app where users can list items and accept payments'
    )
  })
})

describe('recommendationReviewPrompts (pipeline smoke)', () => {
  it('every prompt runs through capability detection', () => {
    for (const p of recommendationReviewPrompts) {
      // The detector guarantees at least one capability (assumed floor).
      expect(detectCapabilities(p.prompt).length).toBeGreaterThan(0)
    }
  })

  it('every prompt runs through recommendArchitecture', async () => {
    for (const p of recommendationReviewPrompts) {
      const result = await recommendArchitecture(p.prompt)
      expect(result.architecture.selected_tools.length).toBeGreaterThan(0)
    }
  })
})
