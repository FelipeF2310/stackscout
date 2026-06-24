import { describe, expect, it } from 'vitest'
import {
  CAPABILITY_TAXONOMY,
  getCapabilityById as taxonomyGetCapabilityById,
} from '../../lib/capabilities/capabilityTaxonomy'
import {
  getAllCapabilities,
  getCapabilityById as corpusGetCapabilityById,
} from '../../lib/corpus/corpus'
import {
  detectCapabilities,
  detectCapabilitiesWithEvidence,
} from '../../lib/capabilities/detectCapabilities'
import { recommendArchitecture } from '../../lib/recommendations/recommendArchitecture'
import { buildToolPageData, getAllToolIds } from '../../lib/tools/toolPage'

// Capability source-of-truth tests. The corpus sources capabilities from the
// canonical taxonomy (CAPABILITY_TAXONOMY in lib/capabilities/capabilityTaxonomy.ts),
// which is the single source of truth — there is no separate capability seed file.
// These pin that the corpus and taxonomy agree, and that detector, evidence,
// recommendation, and tool-page behavior is unchanged.

const EXPECTED_IDS = [
  'auth',
  'database',
  'vector-storage',
  'file-storage',
  'deployment',
  'scheduling',
  'monitoring',
  'agent-framework',
  'llm-api',
  'retrieval',
  'document-parsing',
  'email',
  'payments',
  'api-layer',
  'frontend-framework',
  'search',
]

const onlyFields = (c: {
  capability_id: string
  name: string
  description: string
  category: string
}) => ({
  capability_id: c.capability_id,
  name: c.name,
  description: c.description,
  category: c.category,
})
const byId = (a: { capability_id: string }, b: { capability_id: string }) =>
  a.capability_id.localeCompare(b.capability_id)

describe('capability source of truth (corpus reads the taxonomy)', () => {
  it('getAllCapabilities() returns the same 16 capabilities as the taxonomy', () => {
    const corpus = getAllCapabilities()
    expect(corpus).toHaveLength(16)
    expect(corpus.map((c) => c.capability_id).sort()).toEqual([...EXPECTED_IDS].sort())
    // Same records as the canonical taxonomy.
    expect(corpus.map(onlyFields).sort(byId)).toEqual(
      CAPABILITY_TAXONOMY.map(onlyFields).sort(byId)
    )
  })

  it('corpus.getCapabilityById returns the same values as the taxonomy', () => {
    for (const id of EXPECTED_IDS) {
      const fromCorpus = corpusGetCapabilityById(id)
      const fromTaxonomy = taxonomyGetCapabilityById(id)
      expect(fromCorpus).toBeDefined()
      expect(fromCorpus).toEqual(fromTaxonomy)
    }
    expect(corpusGetCapabilityById('does-not-exist')).toBeUndefined()
  })
})

describe('behavior is unchanged after re-sourcing capabilities', () => {
  const PROMPT = 'Build a PDF chatbot for internal company documents'
  // Pinned detector output for the prompt (key-map order). Unchanged by PR 1.
  const PROMPT_CAP_IDS = ['auth', 'vector-storage', 'llm-api', 'retrieval', 'document-parsing']

  it('detector output is unchanged', () => {
    expect(detectCapabilities(PROMPT).map((c) => c.capability_id)).toEqual(PROMPT_CAP_IDS)
  })

  it('evidence model output is unchanged', () => {
    const evidence = detectCapabilitiesWithEvidence(PROMPT)
    expect(evidence.map((e) => e.capability.capability_id)).toEqual(PROMPT_CAP_IDS)
    const dp = evidence.find((e) => e.capability.capability_id === 'document-parsing')!
    expect(dp.signals).toContainEqual({ phrase: 'pdf', type: 'direct' })
  })

  it('recommendation output is unchanged (capabilities + names + tools present)', async () => {
    const result = await recommendArchitecture(PROMPT)
    expect(result.architecture.capabilities.map((c) => c.capability_id)).toEqual(PROMPT_CAP_IDS)
    // Names in the recommendation match the canonical taxonomy names.
    for (const cap of result.architecture.capabilities) {
      expect(cap.name).toBe(taxonomyGetCapabilityById(cap.capability_id)!.name)
    }
    expect(result.architecture.selected_tools.length).toBeGreaterThan(0)
  })

  it('tool page capability names match the canonical taxonomy', () => {
    const toolId = getAllToolIds()[0]
    const page = buildToolPageData(toolId)
    expect(page).not.toBeNull()
    expect(page!.capabilities.length).toBeGreaterThan(0)
    for (const cap of page!.capabilities) {
      expect(cap.name).toBe(taxonomyGetCapabilityById(cap.capability_id)!.name)
    }
  })
})
