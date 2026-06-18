import { describe, expect, it } from 'vitest'
import { generateArchitecture } from '../../lib/recommendations/generateArchitecture'
import type { Capability } from '../../lib/capabilities/capabilityTypes'

describe('generateArchitecture', () => {
  it('selects a multi-capability tool once and preserves every capability it serves', () => {
    const capabilities: Capability[] = [
      {
        capability_id: 'retrieval',
        name: 'Retrieval',
        description: 'Find relevant source material.',
        category: 'ai',
      },
      {
        capability_id: 'document-parsing',
        name: 'Document Parsing',
        description: 'Extract content from documents.',
        category: 'ai',
      },
    ]

    const architecture = generateArchitecture(
      'Build a PDF chatbot',
      capabilities,
      {
        retrieval: ['llamaindex'],
        'document-parsing': ['llamaindex'],
      }
    )

    expect(architecture.selected_tools).toEqual([
      expect.objectContaining({
        tool_id: 'llamaindex',
        capability_ids: ['retrieval', 'document-parsing'],
      }),
    ])
    expect(architecture.selected_tools[0].rationale).toMatch(/retrieval and document parsing/)
  })
})
