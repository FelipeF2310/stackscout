import { describe, it, expect } from 'vitest'
import { detectCapabilities } from '../../lib/capabilities/detectCapabilities'

// Phase 1 baseline test: verifies the deterministic capability detector
// resolves a realistic prompt to relevant capabilities drawn from the current
// seed taxonomy. This asserts behavior that already exists — it does not add or
// change product behavior.

describe('detectCapabilities (deterministic baseline)', () => {
  const PDF_CHATBOT_PROMPT = 'Build a PDF chatbot for internal company documents'

  it('detects document parsing and LLM capabilities for a PDF chatbot prompt', () => {
    const ids = detectCapabilities(PDF_CHATBOT_PROMPT).map((c) => c.capability_id)

    expect(ids).toContain('document-parsing')
    expect(ids).toContain('llm-api')
  })

  it('detects a multi-capability stack for an internal dashboard prompt', () => {
    const ids = detectCapabilities(
      'Build an internal dashboard for tracking city service requests'
    ).map((c) => c.capability_id)

    // Should be more than just a generic web-app suggestion.
    expect(ids).toContain('frontend-framework')
    expect(ids).toContain('database')
    expect(ids).toContain('auth')
    expect(ids.length).toBeGreaterThanOrEqual(3)
  })

  it('detects a RAG-style stack for a document chatbot prompt', () => {
    const ids = detectCapabilities(
      'Build a PDF chatbot for internal company documents'
    ).map((c) => c.capability_id)

    expect(ids).toContain('document-parsing')
    expect(ids).toContain('llm-api')
    expect(ids).toContain('retrieval')
    expect(ids).toContain('vector-storage')
  })

  it('returns valid taxonomy capabilities and does not fall back to the default floor', () => {
    const result = detectCapabilities(PDF_CHATBOT_PROMPT)

    expect(result.length).toBeGreaterThan(0)
    for (const capability of result) {
      expect(capability).toHaveProperty('capability_id')
      expect(capability).toHaveProperty('name')
      expect(capability).toHaveProperty('category')
    }
    // The prompt has real matches, so the empty-input frontend fallback should
    // not be the only thing returned.
    expect(result.map((c) => c.capability_id)).not.toEqual(['frontend-framework'])
  })
})

// Detector keyword cleanup (PR #18): removes the ambiguous Monitoring triggers
// ('monitor', 'analytics') that mis-detected observability/Sentry for analytics
// dashboards and scrapers, and adds precise Database signals for analytics
// dashboards and marketplace/listings. Existing capabilities only.
describe('detectCapabilities (keyword cleanup)', () => {
  const ids = (prompt: string) =>
    detectCapabilities(prompt).map((c) => c.capability_id)

  it('detects an analytics dashboard as a data app, not observability', () => {
    const result = ids('Build an internal analytics dashboard for city operations')
    expect(result).toContain('database')
    expect(result).toContain('frontend-framework')
    expect(result).not.toContain('monitoring')
    // 'internal' already maps to auth in the baseline detector — no new change.
    expect(result).toContain('auth')
  })

  it('does not mis-detect observability for a scraper that "monitors" job postings', () => {
    const result = ids(
      'Build a web scraper that monitors job postings and summarizes new roles'
    )
    expect(result).not.toContain('monitoring')
  })

  it('detects database for a marketplace with listings and payments', () => {
    const result = ids(
      'Build a marketplace app where users can list items and accept payments'
    )
    expect(result).toContain('database')
    expect(result).toContain('payments')
    expect(result).toContain('auth')
  })

  it('still detects monitoring for genuine observability prompts', () => {
    expect(ids('Add error tracking and uptime monitoring')).toContain('monitoring')
  })

  it('detects a frontend for a marketplace app without dropping its other capabilities', () => {
    const result = ids('Build a marketplace app where users can list items and accept payments')
    expect(result).toContain('frontend-framework')
    // PR #18/#19 behavior is preserved alongside the new frontend signal.
    expect(result).toContain('auth')
    expect(result).toContain('database')
    expect(result).toContain('payments')
  })
})
