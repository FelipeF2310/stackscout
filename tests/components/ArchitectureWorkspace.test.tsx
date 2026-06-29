import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { recommendArchitecture } from '../../lib/recommendations/recommendArchitecture'
import { detectCapabilitiesWithEvidence } from '../../lib/capabilities/detectCapabilities'

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

import ArchitectureWorkspace from '../../components/workspace/ArchitectureWorkspace'

const PROMPT = 'Build a PDF chatbot for internal company documents'

async function renderWorkspace(): Promise<string> {
  const result = await recommendArchitecture(PROMPT)
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
    expect(html).not.toContain('Architecture for') // old ArchitectureSummary
    expect(html).not.toContain('Recommended stack') // old RecommendedStack
    expect(html).not.toContain('Alternatives to consider') // old AlternativeTools
    // old ProjectPrompt example chips
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
