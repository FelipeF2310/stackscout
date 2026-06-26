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
})
