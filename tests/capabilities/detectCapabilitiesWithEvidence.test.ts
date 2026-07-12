import { describe, it, expect } from 'vitest'
import {
  detectCapabilities,
  detectCapabilitiesWithEvidence,
} from '../../lib/capabilities/detectCapabilities'
import { recommendArchitecture } from '../../lib/recommendations/recommendArchitecture'

// PR 1: detection evidence model. These tests assert the new
// detectCapabilitiesWithEvidence() shape AND that the existing
// detectCapabilities() output / recommendation pipeline are unchanged
// (behavior-preserving). See docs/CAPABILITY_DETECTION_AUDIT.md.

const evidenceFor = (prompt: string, capabilityId: string) =>
  detectCapabilitiesWithEvidence(prompt).find(
    (e) => e.capability.capability_id === capabilityId
  )

describe('detectCapabilitiesWithEvidence', () => {
  it('returns a direct signal when the capability is named (PDF)', () => {
    const dp = evidenceFor('PDF', 'document-parsing')
    expect(dp).toBeDefined()
    expect(dp!.origin).toBe('matched')
    expect(dp!.signals).toContainEqual({ phrase: 'pdf', type: 'direct' })
  })

  it('returns inferred shape signals for implication-only phrases (internal tool)', () => {
    const auth = evidenceFor('an internal tool for the team', 'auth')
    expect(auth).toBeDefined()
    // Every signal is an assumption — none should be presented as direct.
    expect(auth!.signals.length).toBeGreaterThan(0)
    expect(auth!.signals.every((s) => s.type === 'inferred')).toBe(true)
    // auth now comes from the internal-gated-access shape rule: the phrase is
    // the full matched span and carries an authored rationale. 'team' remains
    // excluded (detector hardening), and bare 'internal' is no longer a keyword.
    expect(auth!.signals.map((s) => s.phrase)).toEqual(
      expect.arrayContaining(['internal tool'])
    )
    expect(auth!.signals[0].rationale).toBeTruthy()
    expect(auth!.signals.map((s) => s.phrase)).not.toContain('team')
    expect(auth!.signals.map((s) => s.phrase)).not.toContain('internal')
  })

  it('surfaces audit-flagged ambiguous keywords as inferred, never direct (agent)', () => {
    const af = evidenceFor('agent', 'agent-framework')
    expect(af).toBeDefined()
    const agentSignal = af!.signals.find((s) => s.phrase === 'agent')
    expect(agentSignal).toBeDefined()
    expect(agentSignal!.type).toBe('inferred')
  })

  it('returns a direct signal for realtime collaboration phrases', () => {
    const realtime = evidenceFor(
      'Build a realtime collaborative whiteboard',
      'realtime-collaboration'
    )

    expect(realtime).toBeDefined()
    expect(realtime!.origin).toBe('matched')
    expect(realtime!.signals).toContainEqual({
      phrase: 'realtime collaborative',
      type: 'direct',
    })
    expect(realtime!.signals).toContainEqual({
      phrase: 'collaborative whiteboard',
      type: 'direct',
    })
  })

  it('merges multiple matching keywords under a single capability', () => {
    const ev = detectCapabilitiesWithEvidence('PDF document')
    const dp = ev.filter((e) => e.capability.capability_id === 'document-parsing')
    expect(dp).toHaveLength(1) // one capability entry, not one per keyword
    expect(dp[0].signals.length).toBeGreaterThanOrEqual(2)
    expect(dp[0].signals.map((s) => s.phrase)).toEqual(
      expect.arrayContaining(['pdf', 'document'])
    )
  })

  it('expresses a multi-fire assumption (SaaS) across several capabilities', () => {
    const ev = detectCapabilitiesWithEvidence('a SaaS app')
    const ids = ev.map((e) => e.capability.capability_id)
    expect(ids).toEqual(
      expect.arrayContaining(['auth', 'database', 'frontend-framework'])
    )
    for (const id of ['auth', 'database', 'frontend-framework']) {
      const entry = ev.find((e) => e.capability.capability_id === id)!
      expect(entry.signals).toContainEqual({ phrase: 'saas', type: 'inferred' })
    }
  })

  it('falls back to an explicit assumed-floor when nothing matches', () => {
    const ev = detectCapabilitiesWithEvidence('zzzzz')
    expect(ev).toHaveLength(1)
    expect(ev[0].capability.capability_id).toBe('frontend-framework')
    expect(ev[0].origin).toBe('assumed-floor')
    expect(ev[0].signals).toEqual([])
  })

  it('preserves the matched phrase, trimmed of padding (ai not " ai ")', () => {
    const llm = evidenceFor('an AI tool', 'llm-api')
    expect(llm).toBeDefined()
    const aiSignal = llm!.signals.find((s) => s.phrase === 'ai')
    expect(aiSignal).toBeDefined()
    expect(aiSignal!.type).toBe('direct')
    // Padding must not leak into the display phrase.
    expect(llm!.signals.some((s) => s.phrase === ' ai ')).toBe(false)
  })

  it('reports the actual matched text for stem keywords, not the stem', () => {
    const llm = evidenceFor('summarize weekly reports', 'llm-api')
    expect(llm).toBeDefined()
    // The keyword is the stem 'summar'; the evidence phrase must be the real
    // word that matched so the transparency UI never shows a stump.
    expect(llm!.signals).toContainEqual({ phrase: 'summarize', type: 'inferred' })
    expect(llm!.signals.some((s) => s.phrase === 'summar')).toBe(false)
  })

  it('still matches keywords containing special characters', () => {
    expect(evidenceFor('build a q&a page for the handbook', 'retrieval')).toBeDefined()
    expect(evidenceFor('send an e-mail receipt', 'email')).toBeDefined()
    expect(evidenceFor('a multi-step research workflow', 'agent-framework')).toBeDefined()
    expect(evidenceFor('rebuild the front-end', 'frontend-framework')).toBeDefined()
  })

  it('returns capabilities in keyword-map order', () => {
    const ev = detectCapabilitiesWithEvidence('A SaaS app with payments and email')
    expect(ev.map((e) => e.capability.capability_id)).toEqual([
      'auth',
      'database',
      'email',
      'payments',
      'frontend-framework',
    ])
  })
})

// Project-shape inference evidence (first slice). Shape signals are ordinary
// inferred signals carrying the matched cue and an authored rationale, so the
// existing transparency UI renders them as assumptions with zero changes.
describe('detectCapabilitiesWithEvidence (project-shape inference)', () => {
  it('shape signals carry the cue phrase, inferred type, and a rationale', () => {
    const db = evidenceFor(
      'Build a support inbox that uses AI to summarize customer emails',
      'database'
    )
    expect(db).toBeDefined()
    expect(db!.origin).toBe('matched')
    expect(db!.signals).toHaveLength(1)
    expect(db!.signals[0].phrase).toBe('support inbox')
    expect(db!.signals[0].type).toBe('inferred')
    expect(db!.signals[0].rationale).toBeTruthy()
  })

  it('appends shape-only capabilities after all keyword-detected capabilities', () => {
    const ids = detectCapabilitiesWithEvidence(
      'Build a support inbox that uses AI to summarize customer emails'
    ).map((e) => e.capability.capability_id)
    // Keyword detections (llm-api, email) keep their positions; the two
    // shape-only capabilities follow in rule order.
    expect(ids).toEqual(['llm-api', 'email', 'frontend-framework', 'database'])
  })

  it('merges shape signals into an existing keyword-detected capability in place', () => {
    const ids = detectCapabilitiesWithEvidence(
      'Build a developer documentation site with search and analytics'
    ).map((e) => e.capability.capability_id)
    expect(ids).toEqual(['search', 'frontend-framework'])
  })

  it('a bare documentation site is a matched shape detection, not the assumed floor', () => {
    const ev = detectCapabilitiesWithEvidence('documentation site')
    expect(ev).toHaveLength(1)
    expect(ev[0].capability.capability_id).toBe('frontend-framework')
    expect(ev[0].origin).toBe('matched')
    expect(ev[0].signals).toHaveLength(1)
    expect(ev[0].signals[0].phrase).toBe('documentation site')
    expect(ev[0].signals[0].rationale).toBeTruthy()
  })

  it('internal-gated-access evidence carries the full matched span and rationale', () => {
    const auth = evidenceFor(
      'Build an internal analytics dashboard for city operations',
      'auth'
    )
    expect(auth).toBeDefined()
    expect(auth!.origin).toBe('matched')
    expect(auth!.signals).toHaveLength(1)
    expect(auth!.signals[0].phrase).toBe('internal analytics dashboard')
    expect(auth!.signals[0].type).toBe('inferred')
    expect(auth!.signals[0].rationale).toBeTruthy()
  })

  it('shape-migrated auth appends after keyword-detected capabilities', () => {
    // Documents the deliberate ordering consequence of the migration: auth for
    // internal-software prompts is now shape-appended, so it anchors greedy
    // tool selection LAST. Planning verified selected tools are unchanged.
    const ids = detectCapabilitiesWithEvidence(
      'Build an internal analytics dashboard for city operations'
    ).map((e) => e.capability.capability_id)
    expect(ids).toEqual(['database', 'frontend-framework', 'auth'])
  })

  it('keyword-detected capabilities gain no shape rationale when no rule fires', () => {
    // retrieval fires via the 'chatbot' keyword; the source-grounding rule must
    // not add a signal without source language.
    const retrieval = evidenceFor('a chatbot that answers questions', 'retrieval')
    expect(retrieval).toBeDefined()
    expect(retrieval!.signals.every((s) => s.rationale === undefined)).toBe(true)

    // database fires via the soft 'requests' keyword; the admin-review rule
    // must not add a signal for code-review wording.
    const database = evidenceFor('a code review tool for pull requests', 'database')
    expect(database).toBeDefined()
    expect(database!.signals.every((s) => s.rationale === undefined)).toBe(true)
  })
})

describe('backward compatibility (behavior-preserving)', () => {
  const PROMPTS = [
    'Build a PDF chatbot for internal company documents',
    'Build an internal dashboard for tracking city service requests',
    'a SaaS app with payments and email',
    'zzzzz', // floor case
  ]

  it('detectCapabilities() equals detectCapabilitiesWithEvidence().map(e => e.capability)', () => {
    for (const prompt of PROMPTS) {
      expect(detectCapabilities(prompt)).toEqual(
        detectCapabilitiesWithEvidence(prompt).map((e) => e.capability)
      )
    }
  })

  it('keeps the recommendation pipeline output unchanged', async () => {
    const prompt = 'Build a PDF chatbot for internal company documents'
    const result = await recommendArchitecture(prompt)

    // The pipeline still detects exactly what detectCapabilities() reports.
    expect(result.architecture.capabilities.map((c) => c.capability_id)).toEqual(
      detectCapabilities(prompt).map((c) => c.capability_id)
    )
    // And still selects tools for them (sanity that nothing downstream broke).
    expect(result.architecture.selected_tools.length).toBeGreaterThan(0)
  })
})
