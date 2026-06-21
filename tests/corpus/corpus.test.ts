import { describe, it, expect } from 'vitest'
import {
  getCorpus,
  getAllCapabilities,
  getCapabilityById,
  getAllTools,
  getToolById,
  getToolsForCapability,
  getCapabilitiesForTool,
  getRelationshipsForTool,
  getAlternativesForTool,
  getCompatibleToolsForTool,
} from '../../lib/corpus/corpus'

// The corpus module is the single interface for reading seed data. These tests
// run against the real curated corpus (no mocks).

describe('corpus loading', () => {
  it('loads capabilities, tools, and relationships from the seed', () => {
    const corpus = getCorpus()
    expect(corpus.capabilities.length).toBeGreaterThan(0)
    expect(corpus.tools.length).toBeGreaterThan(0)
    expect(corpus.relationships.length).toBeGreaterThan(0)
  })

  it('returns the same instance on repeated loads (idempotent)', () => {
    expect(getCorpus()).toBe(getCorpus())
  })
})

describe('capability lookups', () => {
  it('lists all capabilities', () => {
    expect(getAllCapabilities().some((c) => c.capability_id === 'auth')).toBe(true)
  })

  it('looks up a capability by id', () => {
    const cap = getCapabilityById('vector-storage')
    expect(cap).toBeDefined()
    expect(cap?.name).toBe('Vector Storage')
  })

  it('returns undefined for an unknown capability', () => {
    expect(getCapabilityById('does-not-exist')).toBeUndefined()
  })
})

describe('tool lookups', () => {
  it('lists all tools', () => {
    expect(getAllTools().length).toBeGreaterThan(0)
  })

  it('looks up a tool by id', () => {
    const tool = getToolById('clerk')
    expect(tool).toBeDefined()
    expect(tool?.capability_ids).toContain('auth')
    expect(tool?.github_url).toMatch(/^https?:\/\//)
  })

  it('returns undefined for an unknown tool', () => {
    expect(getToolById('does-not-exist')).toBeUndefined()
  })
})

describe('tool <-> capability mapping', () => {
  it('maps a capability to the tools that fulfill it', () => {
    const toolIds = getToolsForCapability('vector-storage').map((t) => t.tool_id)
    expect(toolIds).toContain('pinecone')
    for (const tool of getToolsForCapability('vector-storage')) {
      expect(tool.capability_ids).toContain('vector-storage')
    }
  })

  it('maps a tool to the capabilities it implements', () => {
    const capabilityIds = getCapabilitiesForTool('llamaindex').map((c) => c.capability_id)
    expect(capabilityIds).toEqual(
      expect.arrayContaining(['retrieval', 'document-parsing'])
    )
  })
})

describe('relationship mapping', () => {
  it('returns relationships involving a tool', () => {
    const rels = getRelationshipsForTool('clerk')
    expect(rels.length).toBeGreaterThan(0)
    for (const rel of rels) {
      expect(rel.source_tool_id === 'clerk' || rel.target_tool_id === 'clerk').toBe(true)
    }
  })

  it('resolves alternatives to tool records of the same nature', () => {
    const alternatives = getAlternativesForTool('pinecone').map((t) => t.tool_id)
    expect(alternatives).toContain('weaviate')
    expect(alternatives).not.toContain('pinecone')
  })

  it('resolves compatible/commonly-used tools', () => {
    const compatible = getCompatibleToolsForTool('nextjs').map((t) => t.tool_id)
    // nextjs is commonly-used-with vercel in the seed.
    expect(compatible).toContain('vercel')
    expect(compatible).not.toContain('nextjs')
  })
})
