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

  it('returns inferred signals for implication-only phrases (internal)', () => {
    const auth = evidenceFor('an internal tool for the team', 'auth')
    expect(auth).toBeDefined()
    // Every signal is an assumption — none should be presented as direct.
    expect(auth!.signals.length).toBeGreaterThan(0)
    expect(auth!.signals.every((s) => s.type === 'inferred')).toBe(true)
    expect(auth!.signals.map((s) => s.phrase)).toEqual(
      expect.arrayContaining(['internal'])
    )
    // 'team' was removed as an auth trigger (detector hardening) — too soft on
    // its own. 'internal' is retained pending the shape-inference decision.
    expect(auth!.signals.map((s) => s.phrase)).not.toContain('team')
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
