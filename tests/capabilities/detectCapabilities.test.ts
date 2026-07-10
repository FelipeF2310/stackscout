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

// Web Scraping capability (PR #21). Detection stays independent: a scraper prompt
// detects web-scraping (and llm-api when it summarizes) but must NOT force-fire
// Database, Scheduling, or Monitoring — those come only from their own signals.
// The ecosystem fit (scrape → schedule → store → summarize) lives in relationships.
describe('detectCapabilities (web scraping)', () => {
  const ids = (prompt: string) =>
    detectCapabilities(prompt).map((c) => c.capability_id)

  it('detects web-scraping for a scraper prompt without forcing storage/scheduling/monitoring', () => {
    const result = ids(
      'Build a web scraper that monitors job postings and summarizes new roles'
    )
    expect(result).toContain('web-scraping')
    expect(result).toContain('llm-api') // existing 'summar' keyword
    expect(result).not.toContain('database')
    expect(result).not.toContain('scheduling')
    expect(result).not.toContain('monitoring')
  })

  it('detects web-scraping from a precise scrape keyword', () => {
    expect(ids('scrape product prices from websites')).toContain('web-scraping')
  })

  it('detects web-scraping from crawling websites language', () => {
    const result = ids(
      'Build an AI research assistant that crawls websites and answers questions from sources'
    )
    expect(result).toContain('web-scraping')
    expect(result).toContain('llm-api')
  })

  it('does not over-fire web-scraping for an observability prompt', () => {
    expect(ids('Build an uptime monitoring dashboard')).not.toContain('web-scraping')
  })
})

describe('detectCapabilities (realtime collaboration)', () => {
  const ids = (prompt: string) =>
    detectCapabilities(prompt).map((c) => c.capability_id)

  it('detects realtime collaboration for a collaborative whiteboard', () => {
    const result = ids('Build a realtime collaborative whiteboard')
    expect(result).toContain('realtime-collaboration')
    expect(result).toContain('frontend-framework')
  })

  it('detects collaborative editors and shared cursors', () => {
    expect(ids('Build a collaborative editor for product docs')).toContain(
      'realtime-collaboration'
    )
    expect(ids('Add shared cursors to a design review surface')).toContain(
      'realtime-collaboration'
    )
  })

  it('does not trigger from broad realtime or live wording alone', () => {
    expect(ids('Build a realtime analytics dashboard')).not.toContain(
      'realtime-collaboration'
    )
    expect(ids('Build a dashboard with live updates')).not.toContain(
      'realtime-collaboration'
    )
  })

  it('does not trigger from email notifications or generic team collaboration', () => {
    expect(ids('Send email notifications for product updates')).not.toContain(
      'realtime-collaboration'
    )
    expect(ids('Build a team collaboration dashboard')).not.toContain(
      'realtime-collaboration'
    )
  })
})

// Auth keyword precision (PR #22): bare 'role'/'roles' were ambiguous — job-role
// language ("new roles") wrongly triggered Auth. Replaced with precise RBAC
// phrases so real auth/RBAC still detects while job-role prose does not.
describe('detectCapabilities (auth role keywords)', () => {
  const ids = (prompt: string) =>
    detectCapabilities(prompt).map((c) => c.capability_id)

  it('does not trigger auth from job-role language in a scraper prompt', () => {
    const result = ids(
      'Build a web scraper that monitors job postings and summarizes new roles'
    )
    expect(result).toContain('web-scraping')
    expect(result).toContain('llm-api')
    expect(result).not.toContain('auth')
    expect(result).not.toContain('database')
    expect(result).not.toContain('scheduling')
    expect(result).not.toContain('monitoring')
  })

  it('still detects auth for user roles (independent of permissions)', () => {
    const result = ids('Build an admin dashboard with user roles')
    expect(result).toContain('auth')
    expect(result).toContain('frontend-framework')
  })

  it('still detects auth for role-based access control', () => {
    expect(ids('Add role-based access control to a SaaS app')).toContain('auth')
  })
})

// Boundary-safe matching (detector hardening). The matcher moved from raw
// substring containment to word-boundary regexes with explicit stems and
// optional plurals. These tests pin the false positives that motivated the
// change, the true positives that must survive it, and the inflection matches
// the old substring matcher provided by accident.
describe('detectCapabilities (boundary matching)', () => {
  const ids = (prompt: string) =>
    detectCapabilities(prompt).map((c) => c.capability_id)

  // --- false positives the substring matcher produced ---

  it('does not detect auth from "authors"', () => {
    expect(ids('A blog about famous authors and their books')).not.toContain('auth')
  })

  it('does not detect api-layer from the literal word "rest"', () => {
    const result = ids('parse the rest of my sparse notes')
    expect(result).not.toContain('api-layer')
    // "parse" is genuinely in the prompt — document-parsing stays.
    expect(result).toContain('document-parsing')
  })

  it('does not detect auth from "team" alone', () => {
    expect(ids('a tool to track inventory for our team')).not.toContain('auth')
  })

  it('does not detect api-layer inside "therapist"', () => {
    expect(ids('the therapist app')).not.toContain('api-layer')
  })

  it('does not detect deployment inside "ghost"', () => {
    expect(ids('ghost stories site')).not.toContain('deployment')
  })

  it('does not detect monitoring inside "blogs"', () => {
    expect(ids('our blogs')).not.toContain('monitoring')
  })

  it('does not detect document-parsing for documentation wording', () => {
    expect(ids('write documentation for my API')).not.toContain('document-parsing')
    expect(ids('Build a developer documentation site')).not.toContain('document-parsing')
  })

  it('does not detect realtime-collaboration from broad live/collaboration wording', () => {
    expect(ids('live updates dashboard')).not.toContain('realtime-collaboration')
    expect(ids('collaboration dashboard')).not.toContain('realtime-collaboration')
    expect(ids('email notifications')).not.toContain('realtime-collaboration')
  })

  // --- true positives that must survive boundary matching ---

  it('preserves core auth detection', () => {
    expect(ids('login and user accounts')).toContain('auth')
    expect(ids('role-based access')).toContain('auth')
    expect(ids('authentication')).toContain('auth')
    expect(ids('OAuth login')).toContain('auth')
  })

  it('preserves api-layer detection for real API wording', () => {
    expect(ids('API endpoint')).toContain('api-layer')
    expect(ids('REST API')).toContain('api-layer')
  })

  it('preserves document-parsing detection', () => {
    expect(ids('PDF chatbot')).toContain('document-parsing')
    expect(ids('parse uploaded PDFs')).toContain('document-parsing')
  })

  it('preserves search detection without reviving document-parsing', () => {
    const result = ids('developer documentation site with search')
    expect(result).toContain('search')
    expect(result).not.toContain('document-parsing')
    expect(ids('product search with filters and typo tolerance')).toContain('search')
  })

  it('preserves realtime-collaboration and scheduling detection', () => {
    expect(ids('realtime collaborative whiteboard')).toContain('realtime-collaboration')
    expect(ids('shared cursors')).toContain('realtime-collaboration')
    expect(ids('background jobs with retries')).toContain('scheduling')
  })

  // --- inflection pins: matches the old substring matcher gave for free ---

  it('preserves inflected verb and plural matches via stems and optional plurals', () => {
    expect(ids('deploying my app')).toContain('deployment')
    expect(ids('uploading files')).toContain('file-storage')
    expect(ids('user sessions')).toContain('auth')
    expect(ids('summarize weekly reports')).toContain('llm-api')
    expect(ids('administrator dashboard')).toContain('auth')
    expect(ids('scheduled reminders')).toContain('scheduling')
    expect(ids('a self-hosted app')).toContain('deployment')
  })
})

describe('detectCapabilities (search and audit precision)', () => {
  const ids = (prompt: string) =>
    detectCapabilities(prompt).map((c) => c.capability_id)

  it('detects product search intent without relying on the frontend fallback', () => {
    const result = ids('Build a product search experience with filters and typo tolerance')
    expect(result).toContain('search')
  })

  it('does not treat documentation sites as document parsing', () => {
    const result = ids('Build a developer documentation site with search and analytics')
    expect(result).toContain('search')
    expect(result).not.toContain('document-parsing')
  })

  it('keeps PDF document parsing detection intact', () => {
    const result = ids('Build a PDF chatbot for internal company documents')
    expect(result).toContain('document-parsing')
  })

  it('does not treat audit logs as observability monitoring', () => {
    const result = ids('Build a multi-tenant admin dashboard with role-based access and audit logs')
    expect(result).toContain('auth')
    expect(result).toContain('frontend-framework')
    expect(result).toContain('database')
    expect(result).not.toContain('monitoring')
  })

  it('keeps genuine logging and monitoring prompts mapped to monitoring', () => {
    expect(ids('Add application logging and uptime monitoring')).toContain('monitoring')
  })
})
