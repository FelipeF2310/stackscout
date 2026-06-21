import { describe, it, expect } from 'vitest'
import { buildToolPageData, getAllToolIds } from '../../lib/tools/toolPage'
import { getAllTools } from '../../lib/corpus/corpus'

// Seed-based tool page data. Runs against the real curated corpus (no mocks).

describe('buildToolPageData', () => {
  it('builds page data for a known tool from the corpus', () => {
    const data = buildToolPageData('clerk')
    expect(data).not.toBeNull()
    expect(data!.tool_id).toBe('clerk')
    expect(data!.repository_name.length).toBeGreaterThan(0)
    expect(data!.github_url).toMatch(/^https?:\/\//)
    expect(data!.capabilities.map((c) => c.capability_id)).toContain('auth')
    expect(data!.why.length).toBeGreaterThan(0)
    expect(data!.tradeoff.length).toBeGreaterThan(0)
  })

  it('includes maintenance/maturity/documentation scores from seed data', () => {
    const data = buildToolPageData('clerk')!
    for (const score of [data.scores.maintenance, data.scores.maturity, data.scores.documentation]) {
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(1)
    }
  })

  it('derives beginner/production/managed notes from seed flags', () => {
    const data = buildToolPageData('clerk')!
    expect(data.notes).toContain('Managed / hosted')
    expect(data.notes).toContain('Production-ready')
    expect(data.notes).toContain('Beginner-friendly')
  })

  it('lists all capabilities a multi-capability tool serves', () => {
    const data = buildToolPageData('llamaindex')!
    const ids = data.capabilities.map((c) => c.capability_id)
    expect(ids).toEqual(expect.arrayContaining(['retrieval', 'document-parsing']))
  })

  it('surfaces alternatives with reasons and compatible tools (relationship display)', () => {
    const data = buildToolPageData('clerk')!

    const altIds = data.alternatives.map((a) => a.tool_id)
    expect(altIds).toContain('authjs')
    for (const alt of data.alternatives) {
      expect(alt.reason.trim().length).toBeGreaterThan(0)
    }

    // clerk is compatible-with nextjs and commonly-used-with vercel in the seed.
    expect(data.compatible_with).toContain('nextjs')
    expect(data.compatible_with).not.toContain('clerk')
  })

  it('returns null for an unknown toolId (build-safe 404 handling)', () => {
    expect(buildToolPageData('does-not-exist')).toBeNull()
  })
})

describe('getAllToolIds', () => {
  it('returns every tool id in the corpus for static generation', () => {
    const ids = getAllToolIds()
    expect(ids).toContain('clerk')
    expect(ids.length).toBe(getAllTools().length)
    // unique
    expect(new Set(ids).size).toBe(ids.length)
  })
})
