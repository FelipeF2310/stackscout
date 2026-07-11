import { describe, it, expect } from 'vitest'
import { SHAPE_RULES, evaluateProjectShapes } from '../../lib/capabilities/projectShapes'

// Project-shape inference rules (first slice). These tests pin the rule data
// contract (narrow cues, authored rationales, approved capabilities only) and
// the evaluator's behavior in isolation from keyword detection. The evaluator
// is pure — no corpus, no relationship graph, no taxonomy lookup.

const APPROVED_CAPABILITIES = new Set(['frontend-framework', 'database', 'retrieval'])
const APPROVED_CATEGORIES = new Set(['surface', 'state', 'source-grounding'])

const capabilitiesFor = (prompt: string) => [...evaluateProjectShapes(prompt).keys()]

describe('SHAPE_RULES (data contract)', () => {
  it('has exactly the four approved rules', () => {
    expect(SHAPE_RULES.map((r) => r.id).sort()).toEqual([
      'admin-review',
      'documentation-site',
      'source-grounded-answering',
      'support-inbox',
    ])
  })

  it('every rule uses an approved internal category (no workflow category)', () => {
    for (const rule of SHAPE_RULES) {
      expect(APPROVED_CATEGORIES.has(rule.category)).toBe(true)
    }
  })

  it('every inference targets an approved capability with a non-empty rationale', () => {
    for (const rule of SHAPE_RULES) {
      expect(rule.infers.length).toBeGreaterThan(0)
      for (const inference of rule.infers) {
        expect(APPROVED_CAPABILITIES.has(inference.capability_id)).toBe(true)
        expect(inference.rationale.trim().length).toBeGreaterThan(0)
      }
    }
  })

  it('never infers auth or vector-storage', () => {
    for (const rule of SHAPE_RULES) {
      for (const inference of rule.infers) {
        expect(inference.capability_id).not.toBe('auth')
        expect(inference.capability_id).not.toBe('vector-storage')
      }
    }
  })
})

describe('evaluateProjectShapes (cues fire)', () => {
  it('documentation-site cues infer frontend-framework', () => {
    for (const cue of ['documentation site', 'docs site', 'documentation website', 'developer docs']) {
      expect(capabilitiesFor(`build a ${cue} for our SDK`)).toEqual(['frontend-framework'])
    }
  })

  it('support-inbox cues infer frontend-framework and database', () => {
    for (const cue of ['support inbox', 'shared inbox', 'team inbox', 'customer email inbox', 'support queue']) {
      expect(capabilitiesFor(`build a ${cue}`)).toEqual(['frontend-framework', 'database'])
    }
  })

  it('admin-review cues infer database', () => {
    for (const cue of ['admin review', 'review queue', 'approval queue', 'approval workflow', 'submission status']) {
      expect(capabilitiesFor(`a portal with ${cue}`)).toEqual(['database'])
    }
  })

  it('source-grounded cues infer retrieval', () => {
    for (const cue of [
      'answers questions from sources',
      'answer questions from our wiki',
      'cite sources',
      'cited sources',
      'source-grounded',
      'grounded answers',
    ]) {
      expect(capabilitiesFor(`an assistant that ${cue}`)).toEqual(['retrieval'])
    }
  })

  it('attaches the matched cue text and rationale to each signal', () => {
    const signals = evaluateProjectShapes('Build a support inbox for the helpdesk')
    const database = signals.get('database')
    expect(database).toBeDefined()
    expect(database![0].phrase).toBe('support inbox')
    expect(database![0].type).toBe('inferred')
    expect(database![0].rationale).toBeTruthy()
  })
})

describe('evaluateProjectShapes (negatives do not fire)', () => {
  const NEGATIVES = [
    // documentation-site
    'write documentation',
    'parse documentation from PDFs',
    'upload documents',
    // support-inbox
    'summarize an email',
    'send support emails',
    'email notifications',
    'a contact form',
    // admin-review
    'a code review tool',
    'a review of my essay',
    'design review',
    // source-grounded
    'answers questions about the weather',
    'a chatbot that answers questions',
    'a q&a page',
  ]

  it.each(NEGATIVES)('does not fire on %j', (prompt) => {
    expect(evaluateProjectShapes(prompt).size).toBe(0)
  })

  it('is deterministic across calls', () => {
    const a = evaluateProjectShapes('build a support inbox')
    const b = evaluateProjectShapes('build a support inbox')
    expect([...a.entries()]).toEqual([...b.entries()])
  })
})
