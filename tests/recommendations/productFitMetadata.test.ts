import { describe, it, expect } from 'vitest'
import { getCorpus } from '../../lib/corpus/corpus'
import { recommendArchitecture } from '../../lib/recommendations/recommendArchitecture'

// Product-fit metadata v1 (PR #24): optional, curated best_for / avoid_if notes
// on tools, surfaced in the recommendation experience. These are tool-level fit
// notes — NOT archetype-matched reasoning — and must not change selection.
describe('product-fit metadata (best_for / avoid_if)', () => {
  it('corpus validates tools that carry best_for / avoid_if', () => {
    const { tools } = getCorpus() // throws if the schema rejects the new fields
    const supabase = tools.find((t) => t.tool_id === 'supabase')!
    expect(supabase.best_for?.length ?? 0).toBeGreaterThan(0)
    expect(supabase.avoid_if?.length ?? 0).toBeGreaterThan(0)
  })

  it('covers the focused PDF/RAG peer alternative metadata slice', () => {
    const { tools } = getCorpus()
    const targetIds = ['langchain', 'unstructured', 'weaviate', 'chroma']

    for (const toolId of targetIds) {
      const tool = tools.find((t) => t.tool_id === toolId)!
      expect(tool.best_for?.length ?? 0).toBeGreaterThan(0)
      expect(tool.avoid_if?.length ?? 0).toBeGreaterThan(0)
    }
  })

  it('covers the focused deployment peer metadata slice', () => {
    const { tools } = getCorpus()
    const targetIds = ['vercel', 'railway', 'fly-io']

    for (const toolId of targetIds) {
      const tool = tools.find((t) => t.tool_id === toolId)!
      expect(tool.best_for?.length ?? 0).toBeGreaterThan(0)
      expect(tool.avoid_if?.length ?? 0).toBeGreaterThan(0)
    }
  })

  it('covers the focused realtime collaboration metadata slice', () => {
    const { tools } = getCorpus()
    const targetIds = ['liveblocks', 'yjs']

    for (const toolId of targetIds) {
      const tool = tools.find((t) => t.tool_id === toolId)!
      expect(tool.best_for?.length ?? 0).toBeGreaterThan(0)
      expect(tool.avoid_if?.length ?? 0).toBeGreaterThan(0)
    }
  })

  it('treats the fields as optional — tools without them still load', () => {
    const { tools } = getCorpus()
    const authjs = tools.find((t) => t.tool_id === 'authjs')!
    expect(authjs.best_for).toBeUndefined()
    expect(authjs.avoid_if).toBeUndefined()
  })

  it('carries product-fit notes into the recommendation explanations', async () => {
    const result = await recommendArchitecture(
      'Build a PDF chatbot for internal company documents'
    )
    // at least one selected tool surfaces fit notes
    expect(result.explanations.some((e) => e.best_for.length > 0)).toBe(true)
    // explanations always expose arrays (empty, never undefined) so render is safe
    for (const e of result.explanations) {
      expect(Array.isArray(e.best_for)).toBe(true)
      expect(Array.isArray(e.avoid_if)).toBe(true)
    }
  })

  it('does not change selection — marketplace still uses a real database tool, not supabase-auth', async () => {
    const result = await recommendArchitecture(
      'Build a marketplace app where users can list items and accept payments'
    )
    const dbTool = result.architecture.selected_tools.find((t) =>
      t.capability_ids.includes('database')
    )
    expect(dbTool).toBeDefined()
    expect(dbTool!.tool_id).not.toBe('supabase-auth')
    expect(['supabase', 'neon', 'planetscale']).toContain(dbTool!.tool_id)
  })
})
