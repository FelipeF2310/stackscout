import { describe, it, expect } from 'vitest'
import { scoreTools } from '../../lib/recommendations/scoreTools'
import { getCorpus } from '../../lib/corpus/corpus'

// Tool scoring runs against the real curated corpus (no mocks). getCorpus()
// also loads the relationship graph that compatibility scoring depends on.

describe('scoreTools (deterministic baseline)', () => {
  const { tools } = getCorpus()

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

// `supabase-auth` models the Supabase Auth product, not the full Supabase
// platform (the separate `supabase` tool covers database/file-storage). It must
// remain a valid Auth candidate but must not fill the Database slot. These
// assertions are corpus-tagging contracts, not hardcoded tool winners.
describe('database slot uses a real database tool, not the auth product', () => {
  const { tools } = getCorpus()
  const DATABASE_TOOLS = ['supabase', 'neon', 'planetscale']

  it('does not consider supabase-auth eligible for the database capability', () => {
    const ids = scoreTools(tools, 'database', {}, []).map((s) => s.tool_id)
    expect(ids).not.toContain('supabase-auth')
  })

  it('picks a genuine database tool as the top database result (even after clerk is selected)', () => {
    // clerk pre-selected for auth previously pulled supabase-auth to the top of
    // the database slot via the clerk -> supabase-auth pairing.
    const top = scoreTools(tools, 'database', {}, ['clerk'])[0]
    expect(top).toBeDefined()
    expect(top.tool_id).not.toBe('supabase-auth')

    const winner = tools.find((t) => t.tool_id === top.tool_id)!
    expect(winner.capability_ids).toContain('database')
    // A real database tool wins — no single hardcoded winner required.
    expect(DATABASE_TOOLS).toContain(top.tool_id)
  })

  it('keeps supabase-auth as a valid auth candidate', () => {
    const ids = scoreTools(tools, 'auth', {}, []).map((s) => s.tool_id)
    expect(ids).toContain('supabase-auth')
  })
})
