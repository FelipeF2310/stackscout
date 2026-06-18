import { describe, it, expect } from 'vitest'
import { scoreTools } from '../../lib/recommendations/scoreTools'
import { getSeed } from '../../lib/seed/loadSeed'

// Tool scoring runs against the real seed corpus (no mocks). getSeed() also
// loads the relationship graph that compatibility scoring depends on.

describe('scoreTools (deterministic baseline)', () => {
  const { tools } = getSeed()

  it('only scores tools that fulfill the required capability', () => {
    const scored = scoreTools(tools, 'auth', {}, [])
    expect(scored.length).toBeGreaterThan(0)
    for (const s of scored) {
      const tool = tools.find((t) => t.tool_id === s.tool_id)
      expect(tool?.capability_ids).toContain('auth')
    }
  })

  it('returns results sorted by descending score, each within 0..1', () => {
    const scored = scoreTools(tools, 'vector-storage', {}, [])
    for (const s of scored) {
      expect(s.score).toBeGreaterThanOrEqual(0)
      expect(s.score).toBeLessThanOrEqual(1)
    }
    const scores = scored.map((s) => s.score)
    const sorted = [...scores].sort((a, b) => b - a)
    expect(scores).toEqual(sorted)
  })

  it('raises context fit for a beginner-friendly tool when skill level is beginner', () => {
    const withoutContext = scoreTools(tools, 'auth', {}, []).find((s) => s.tool_id === 'clerk')
    const asBeginner = scoreTools(tools, 'auth', { skillLevel: 'beginner' }, []).find(
      (s) => s.tool_id === 'clerk'
    )
    expect(withoutContext).toBeDefined()
    expect(asBeginner).toBeDefined()
    expect(asBeginner!.breakdown.context_fit).toBeGreaterThan(
      withoutContext!.breakdown.context_fit
    )
  })
})
