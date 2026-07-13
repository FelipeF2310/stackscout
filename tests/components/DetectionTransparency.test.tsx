import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import DetectionTransparency from '../../components/architecture/DetectionTransparency'
import {
  detectCapabilitiesWithEvidence,
  type CapabilityEvidence,
} from '../../lib/capabilities/detectCapabilities'
import { detectCapabilities } from '../../lib/capabilities/detectCapabilities'
import { getCapabilityById } from '../../lib/capabilities/capabilityTaxonomy'
import { recommendArchitecture } from '../../lib/recommendations/recommendArchitecture'

// PR 2: detection-transparency UI. Renders the component to static markup and
// asserts that direct evidence reads as confirmed, inferred reads as an
// assumption, the floor reads as a default guess, and display phrases de-dupe.
// Also confirms the recommendation output is unchanged.

function render(evidence: CapabilityEvidence[]): string {
  vi.stubGlobal('React', React)
  try {
    return renderToStaticMarkup(<DetectionTransparency evidence={evidence} />)
  } finally {
    vi.unstubAllGlobals()
  }
}

describe('DetectionTransparency', () => {
  it('renders direct evidence as a confirmed detection', () => {
    const evidence = detectCapabilitiesWithEvidence(
      'Build a PDF chatbot for internal company documents'
    )
    const html = render(evidence)

    // Direct "pdf" -> Document Parsing, marked Detected with an arrow.
    expect(html).toContain('Document Parsing')
    expect(html).toContain('pdf')
    expect(html).toContain('Detected')
    expect(html).toContain('→') // direct signals use "phrase → Capability"
  })

  it('renders inferred signals as assumptions, not confirmed detections', () => {
    const evidence = detectCapabilitiesWithEvidence('an internal tool for the team')
    const auth = evidence.find((e) => e.capability.capability_id === 'auth')
    expect(auth).toBeDefined()
    expect(auth!.signals.every((s) => s.type === 'inferred')).toBe(true)

    const html = render(evidence)
    expect(html).toContain('Authentication')
    expect(html).toContain('suggests') // inferred phrasing: "phrase suggests Capability"
    expect(html).toContain('Assumption')
  })

  it('renders the assumed-floor as an explicit default guess', () => {
    const evidence = detectCapabilitiesWithEvidence('zzzzz')
    expect(evidence).toHaveLength(1)
    expect(evidence[0].origin).toBe('assumed-floor')

    const html = render(evidence)
    expect(html).toContain('Default guess')
    expect(html).toContain('assumed you at least need')
    expect(html).toContain('Frontend Framework')
    // A floor is a guess, not a confirmed detection.
    expect(html).not.toContain('Detected')
  })

  it('renders a user-confirmed capability distinctly from detector evidence', () => {
    const evidence: CapabilityEvidence[] = [
      {
        capability: getCapabilityById('retrieval')!,
        signals: [
          {
            phrase: 'use the product’s own sources',
            type: 'clarified',
            rationale: 'you confirmed the product needs source grounding',
          },
        ],
        origin: 'clarified',
      },
    ]

    const html = render(evidence)
    expect(html).toContain('Confirmed by you')
    expect(html).toContain('confirms')
    expect(html).toContain('Retrieval')
  })

  it('de-dupes duplicate display phrases (UI only)', () => {
    const evidence: CapabilityEvidence[] = [
      {
        capability: getCapabilityById('document-parsing')!,
        signals: [
          { phrase: 'pdf', type: 'direct' },
          { phrase: 'pdf', type: 'direct' }, // exact duplicate
          { phrase: 'PDF', type: 'inferred' }, // case-variant duplicate
        ],
        origin: 'matched',
      },
    ]
    const html = render(evidence)

    // The phrase chip should appear exactly once despite three raw signals.
    // renderToStaticMarkup emits curly quotes (“ ”) as real characters.
    const occurrences = (html.match(/“pdf”/gi) ?? []).length
    expect(occurrences).toBe(1)
  })

  it('renders nothing when there is no evidence', () => {
    expect(render([])).toBe('')
  })
})

describe('recommendation output is unchanged by the transparency UI', () => {
  it('shows exactly the capabilities the recommendation uses', async () => {
    const prompt = 'Build a PDF chatbot for internal company documents'
    const result = await recommendArchitecture(prompt)

    const shownIds = detectCapabilitiesWithEvidence(prompt).map((e) => e.capability.capability_id)
    const recommendedIds = result.architecture.capabilities.map((c) => c.capability_id)

    expect(shownIds).toEqual(recommendedIds)
    // And the recommendation still detects via the unchanged wrapper.
    expect(recommendedIds).toEqual(detectCapabilities(prompt).map((c) => c.capability_id))
    expect(result.architecture.selected_tools.length).toBeGreaterThan(0)
  })
})
