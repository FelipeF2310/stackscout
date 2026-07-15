import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { recommendArchitecture } from '../../lib/recommendations/recommendArchitecture'
import { detectCapabilitiesWithEvidence } from '../../lib/capabilities/detectCapabilities'
import { getCapabilityById } from '../../lib/capabilities/capabilityTaxonomy'
import type { RefinementContext } from '../../lib/recommendations/generateArchitecture'
import { resolveWorkspaceRecommendation } from '../../lib/recommendations/resolveWorkspaceRecommendation'

// The canonical submitted state must be the two-pane workspace, never the old
// stacked-results shell. These tests render the workspace from real deterministic
// output and assert the new structure AND the absence of the old shell.
vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

const navigationMocks = vi.hoisted(() => ({
  replace: vi.fn(),
  searchParams: new URLSearchParams('idea=Build+a+PDF+chatbot'),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: navigationMocks.replace }),
  usePathname: () => '/workspace',
  useSearchParams: () => navigationMocks.searchParams,
}))

import ArchitectureWorkspace from '../../components/workspace/ArchitectureWorkspace'
import ArchitectureBrief from '../../components/workspace/ArchitectureBrief'

const PROMPT = 'Build a PDF chatbot for internal company documents'
const CRAWLER_PROMPT =
  'Build an AI research assistant that crawls websites and answers questions from sources'
const GENERIC_NEXT_STEP =
  'Start with the smallest working path through the stack, then refine tools after the first test.'
const DOCUMENT_RAG_NEXT_STEP =
  'Validate the document-RAG path first: parse one representative source, store embeddings, retrieve relevant chunks, and validate a grounded response.'

async function renderWorkspace(context: RefinementContext = {}): Promise<string> {
  const result = await recommendArchitecture(PROMPT, context)
  const evidence = detectCapabilitiesWithEvidence(PROMPT)
  vi.stubGlobal('React', React)
  try {
    return renderToStaticMarkup(
      <ArchitectureWorkspace
        idea={result.architecture.project_description}
        capabilities={result.architecture.capabilities}
        explanations={result.explanations}
        alternatives={result.alternatives}
        rationale={result.architecture.architecture_rationale}
        evidence={evidence}
        refinementContext={context}
      />
    )
  } finally {
    vi.unstubAllGlobals()
  }
}

async function renderGroundingWorkspace(
  idea: string,
  requestedContext: RefinementContext = {}
): Promise<string> {
  const { refinementContext, clarification, evidence, result } =
    await resolveWorkspaceRecommendation(idea, requestedContext)
  vi.stubGlobal('React', React)
  try {
    return renderToStaticMarkup(
      <ArchitectureWorkspace
        idea={idea}
        capabilities={
          result?.architecture.capabilities ?? evidence.map((entry) => entry.capability)
        }
        explanations={result?.explanations ?? []}
        alternatives={result?.alternatives ?? []}
        rationale={result?.architecture.architecture_rationale ?? ''}
        evidence={evidence}
        refinementContext={refinementContext}
        clarification={clarification}
      />
    )
  } finally {
    vi.unstubAllGlobals()
  }
}

function renderBriefForCapabilities(capabilityIds: string[]): string {
  const capabilities = capabilityIds.map((capabilityId) => {
    const capability = getCapabilityById(capabilityId)
    if (!capability) throw new Error(`Unknown capability: ${capabilityId}`)
    return capability
  })

  vi.stubGlobal('React', React)
  try {
    return renderToStaticMarkup(
      <ArchitectureBrief
        idea="Capability guidance test"
        capabilities={capabilities}
        explanations={[]}
        alternatives={[]}
        rationale=""
      />
    )
  } finally {
    vi.unstubAllGlobals()
  }
}

describe('ArchitectureWorkspace (canonical submitted state)', () => {
  it('renders a two-pane layout with left conversation and right brief', async () => {
    const html = await renderWorkspace()
    // left pane (conversation / Architecture Mode)
    expect(html).toContain('Architecture Mode')
    expect(html).toContain('>You<')
    expect(html).toContain(PROMPT) // echoed idea
    // right pane (living Architecture Brief)
    expect(html).toContain('Architecture Brief')
    expect(html).toContain("What you")
    expect(html).toContain('Capabilities → recommended tool')
  })

  it('renders capability and tool content from deterministic output', async () => {
    const result = await recommendArchitecture(PROMPT)
    const html = await renderWorkspace()
    // a real detected capability name
    expect(html).toContain(result.architecture.capabilities[0].name)
    // a real recommended tool id (linked into the brief)
    const toolId = result.explanations[0].tool_id
    expect(html).toContain(toolId)
    expect(html).toContain(`href="/tools/${toolId}"`)
  })

  it('does NOT render the old stacked results shell', async () => {
    const html = await renderWorkspace()
    expect(html).not.toContain('Architecture for') // old results summary heading
    expect(html).not.toContain('Recommended stack') // old stack heading
    expect(html).not.toContain('Alternatives to consider') // old alternatives heading
    // old prompt example chips
    expect(html).not.toContain('AI customer support agent')
    expect(html).not.toContain('Internal analytics dashboard')
  })

  it('surfaces relationships / pairs-with when the explanation data provides them', async () => {
    const result = await recommendArchitecture(PROMPT)
    const withFit = result.explanations.find((e) => e.fits_with)
    // The enriched RAG vertical produces real pairings for this prompt.
    expect(withFit).toBeDefined()

    const html = await renderWorkspace()
    // the relationship sentence renders verbatim (already a complete sentence,
    // e.g. "Commonly used with llamaindex.") — no redundant label wrapping it
    expect(html).toContain(htmlEscape(withFit!.fits_with as string))
  })

  it('renders alternatives with their reasons, not bare names', async () => {
    const result = await recommendArchitecture(PROMPT)
    const altWithReason = result.alternatives
      .flatMap((a) => a.alternatives)
      .find((a) => a.reason_not_selected && a.reason_not_selected.trim().length > 0)
    expect(altWithReason).toBeDefined()

    const html = await renderWorkspace()
    expect(html).toContain('Alternatives:')
    // the alternative's reason text appears, not just its id
    expect(html).toContain(htmlEscape(altWithReason!.reason_not_selected))
  })

  it('de-duplicates multi-capability tool rows (grouped, not repeated)', async () => {
    const result = await recommendArchitecture(PROMPT)
    const html = await renderWorkspace()

    // One capability→tool row per unique recommended tool, fewer than the
    // capability count because a multi-capability tool is grouped into one row.
    const rows = html.match(/data-brief-row="/g) ?? []
    const uniqueTools = new Set(result.explanations.map((e) => e.tool_id)).size
    expect(rows).toHaveLength(uniqueTools)
    expect(rows.length).toBeLessThan(result.architecture.capabilities.length)

    // The grouped row lists both capabilities the shared tool covers.
    expect(html).toContain('Retrieval, Document Parsing')
    // ...and the shared tool's "simple" sentence renders only once.
    const multi = result.explanations.find((e) => e.capability_ids.length > 1)!
    const occurrences = html.split(htmlEscape(multi.simple)).length - 1
    expect(occurrences).toBe(1)
  })

  it('surfaces product-fit notes (best_for / avoid_if) for tools that have them', async () => {
    const result = await recommendArchitecture(PROMPT)
    const withFit = result.explanations.find((e) => e.best_for.length > 0)!
    expect(withFit).toBeDefined() // PDF stack tools carry fit notes

    const html = await renderWorkspace()
    expect(html).toContain('Good fit when:')
    expect(html).toContain('Consider another option if:')
    // the actual curated phrase renders, not a generic label
    expect(html).toContain(htmlEscape(withFit.best_for[0]))
  })

  it('renders URL-backed refinement controls without model-provider scoring controls', async () => {
    const html = await renderWorkspace({ hostingPreference: 'self-hosted' })

    expect(html).toContain('Refine recommendations')
    expect(html).toContain('Skill level')
    expect(html).toContain('Project stage')
    expect(html).toContain('Hosting')
    expect(html).toContain('Ecosystem')
    expect(html).not.toContain('Model preference')
  })

  it('holds the Architecture Brief until an active clarification is answered', async () => {
    const html = await renderGroundingWorkspace('Build an AI chatbot')

    expect(html).toContain('One question')
    expect(html).toContain('Clarifying your architecture')
    expect(html).toContain('One answer will sharpen the recommendation.')
    expect(html).not.toContain('Architecture Brief')
  })

  it('releases the Brief and renders the selected grounding answer inline', async () => {
    const html = await renderGroundingWorkspace('Build an AI chatbot', {
      aiGrounding: 'product-sources',
    })

    expect(html).toContain('Architecture Brief')
    expect(html).toContain('AI grounding')
    expect(html).toContain('Use the product’s own sources')
    expect(html).toContain('Change')
    expect(html).not.toContain('One question')
  })

  it('does not render stale grounding state for an ineligible prompt', async () => {
    const html = await renderGroundingWorkspace('Build a marketplace with payments', {
      aiGrounding: 'product-sources',
    })

    expect(html).toContain('Architecture Brief')
    expect(html).not.toContain('One question')
    expect(html).not.toContain('AI grounding')
    expect(html).not.toContain('Use the product’s own sources')
  })

  it('keeps crawler next-step guidance within its selected capabilities', async () => {
    const { result } = await resolveWorkspaceRecommendation(CRAWLER_PROMPT, {})
    expect(result).not.toBeNull()
    expect(
      result!.architecture.capabilities.map((capability) => capability.capability_id)
    ).toEqual(['llm-api', 'web-scraping', 'retrieval'])
    expect(result!.architecture.selected_tools.map((tool) => tool.tool_id)).toEqual([
      'openai-sdk',
      'firecrawl',
      'llamaindex',
    ])

    const html = await renderGroundingWorkspace(CRAWLER_PROMPT)
    expect(html).toContain(GENERIC_NEXT_STEP)
    expect(html).not.toContain('parse one PDF')
    expect(html).not.toContain('store embeddings')
    expect(html).not.toContain('document-RAG path')
  })

  it.each([
    ['Retrieval only', ['retrieval']],
    ['Vector Storage only', ['vector-storage']],
    ['Document Parsing only', ['document-parsing']],
    ['Retrieval and Vector Storage', ['retrieval', 'vector-storage']],
    ['Document Parsing and Retrieval', ['document-parsing', 'retrieval']],
    ['Document Parsing and Vector Storage', ['document-parsing', 'vector-storage']],
    [
      'Retrieval, Vector Storage, and Document Parsing without LLM API',
      ['retrieval', 'vector-storage', 'document-parsing'],
    ],
    ['LLM API and Retrieval', ['llm-api', 'retrieval']],
  ])('%s uses generic next-step guidance', (_label, capabilityIds) => {
    const html = renderBriefForCapabilities(capabilityIds)

    expect(html).toContain(GENERIC_NEXT_STEP)
    expect(html).not.toContain('parse one PDF')
    expect(html).not.toContain('store embeddings')
    expect(html).not.toContain('document-RAG path')
  })

  it('uses specialized guidance for a complete document-RAG pipeline', async () => {
    const { result } = await resolveWorkspaceRecommendation(PROMPT, {})
    expect(result).not.toBeNull()
    expect(result!.architecture.capabilities.map((capability) => capability.capability_id)).toEqual(
      expect.arrayContaining(['llm-api', 'document-parsing', 'vector-storage', 'retrieval'])
    )

    const html = await renderGroundingWorkspace(PROMPT)
    expect(html).toContain(DOCUMENT_RAG_NEXT_STEP)
    expect(html).not.toContain('parse one PDF')
  })
})

// react-dom escapes text content; match the rendered form, not the raw string.
function htmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}
