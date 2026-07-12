import { describe, it, expect } from 'vitest'
import { SHAPE_RULES, evaluateProjectShapes } from '../../lib/capabilities/projectShapes'

// Project-shape inference rules (first slice). These tests pin the rule data
// contract (narrow cues, authored rationales, approved capabilities only) and
// the evaluator's behavior in isolation from keyword detection. The evaluator
// is pure — no corpus, no relationship graph, no taxonomy lookup.

const APPROVED_CAPABILITIES = new Set(['frontend-framework', 'database', 'retrieval'])
const APPROVED_CATEGORIES = new Set(['surface', 'state', 'source-grounding', 'access'])

const capabilitiesFor = (prompt: string) => [...evaluateProjectShapes(prompt).keys()]

describe('SHAPE_RULES (data contract)', () => {
  it('has exactly the five approved rules', () => {
    expect(SHAPE_RULES.map((r) => r.id).sort()).toEqual([
      'admin-review',
      'documentation-site',
      'internal-gated-access',
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
        // auth is approved ONLY through the internal-gated-access rule.
        const approved =
          rule.id === 'internal-gated-access'
            ? new Set(['auth'])
            : APPROVED_CAPABILITIES
        expect(approved.has(inference.capability_id)).toBe(true)
        expect(inference.rationale.trim().length).toBeGreaterThan(0)
      }
    }
  })

  it('never infers vector-storage, and only internal-gated-access infers auth', () => {
    for (const rule of SHAPE_RULES) {
      for (const inference of rule.infers) {
        expect(inference.capability_id).not.toBe('vector-storage')
        if (rule.id !== 'internal-gated-access') {
          expect(inference.capability_id).not.toBe('auth')
        }
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

  it('internal-gated-access fires when internal qualifies a software/content noun', () => {
    for (const prompt of [
      'internal tool',
      'an internal dashboard',
      'Build an internal analytics dashboard for city operations',
      'Build a PDF chatbot for internal company documents',
      'internal docs',
    ]) {
      expect(capabilitiesFor(prompt)).toEqual(['auth'])
    }
  })

  it('internal-gated-access reports the full matched span as the phrase', () => {
    const signals = evaluateProjectShapes(
      'Build an internal analytics dashboard for city operations'
    )
    const auth = signals.get('auth')
    expect(auth).toBeDefined()
    expect(auth![0].phrase).toBe('internal analytics dashboard')
    expect(auth![0].type).toBe('inferred')
    expect(auth![0].rationale).toBeTruthy()
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
    // internal-gated-access
    'internal API refactor',
    'internal logic',
    'internal helper function',
    'a tool to track inventory for our team',
    'team dashboard',
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

// Windowed proximity semantics (first mechanism of its kind in the shape
// layer — replaces the never-used loose `requires` co-occurrence, which fired
// on trap prompts like "refactor the internal logic of our dashboard app").
describe('evaluateProjectShapes (proximity mechanism)', () => {
  it('does not fire on the cue without a qualifying noun', () => {
    expect(evaluateProjectShapes('internal logic').size).toBe(0)
    expect(evaluateProjectShapes('internal API refactor').size).toBe(0)
  })

  it('does not fire on a noun without the cue', () => {
    expect(evaluateProjectShapes('team dashboard').size).toBe(0)
    expect(evaluateProjectShapes('a dashboard tool').size).toBe(0)
  })

  it('does not fire when cue and noun are outside the one-word window', () => {
    expect(
      evaluateProjectShapes('refactor the internal logic of our dashboard app').size
    ).toBe(0)
    expect(evaluateProjectShapes('an internal review of our app').size).toBe(0)
  })

  it('fires when the noun is within one intervening word of the cue', () => {
    expect(capabilitiesFor('internal dashboard')).toEqual(['auth'])
    expect(capabilitiesFor('internal analytics dashboard')).toEqual(['auth'])
  })

  it('does not fire when the noun precedes the cue', () => {
    expect(evaluateProjectShapes('documents for internal review').size).toBe(0)
  })
})
