// The recurring 14-prompt recommendation quality review set, captured as a
// repo artifact so detector/recommendation diff audits are reproducible
// across sessions (previously this set lived only in planning notes).
//
// Division of labor: this fixture is the audit CORPUS, not an enforcement
// net. Exact must-have/must-not-have expectations live in
// tests/recommendations/goldenRecommendationSet.test.ts (which sources its
// prompt strings from here — one source of truth). Do not add exact
// capability/tool assertions to this fixture: freezing all 14 outputs would
// turn every deliberate detector cleanup into test-update noise.
//
// Usage in a before/after diff audit: run detectCapabilitiesWithEvidence and
// recommendArchitecture over every prompt on both revisions and diff the
// capability sets, evidence signals, and selected tools.

export interface ReviewPrompt {
  id: string
  prompt: string
  purpose: string
}

export const recommendationReviewPrompts = [
  {
    id: 'marketplace-payments',
    prompt: 'Build a marketplace app where users can list items and accept payments',
    purpose: 'marketplace baseline: auth, database, payments, frontend',
  },
  {
    id: 'scraper-job-postings',
    prompt: 'Build a web scraper that monitors job postings and summarizes new roles',
    purpose: 'scraping + summarization without forced storage/scheduling/monitoring',
  },
  {
    id: 'pdf-chatbot-internal',
    prompt: 'Build a PDF chatbot for internal company documents',
    purpose: 'RAG stack plus internal-gated-access auth',
  },
  {
    id: 'internal-analytics-dashboard',
    prompt: 'Build an internal analytics dashboard for city operations',
    purpose: 'data app (not observability) with shape-migrated auth',
  },
  {
    id: 'realtime-whiteboard',
    prompt: 'Build a realtime collaborative whiteboard',
    purpose: 'realtime-collaboration slice baseline',
  },
  {
    id: 'support-agent-saas',
    prompt: 'Build an AI customer support agent for a SaaS product',
    purpose: "agent + saas multi-fire; email rides the soft 'support' trigger",
  },
  {
    id: 'saas-login-billing',
    prompt: 'Build a SaaS app with login, billing, email notifications, and a dashboard',
    purpose: 'explicitly-stated multi-capability SaaS: auth, payments, email, frontend',
  },
  {
    id: 'background-jobs-reminders',
    prompt: 'Build a background job system that sends reminders and retries failed tasks',
    purpose: 'scheduling baseline',
  },
  {
    id: 'docs-site-search',
    prompt: 'Build a developer documentation site with search and analytics',
    purpose: 'documentation-site shape rule; search without document-parsing',
  },
  {
    id: 'support-inbox-ai',
    prompt: 'Build a support inbox that uses AI to summarize customer emails',
    purpose: 'support-inbox shape rule: operator surface + stored state + llm + email',
  },
  {
    id: 'file-upload-portal',
    prompt: 'Build a file upload portal for clients with authentication and admin review',
    purpose: 'file-storage + auth + admin-review shape rule',
  },
  {
    id: 'product-search',
    prompt: 'Build a product search experience with filters and typo tolerance',
    purpose: 'search-only prompt; no shape-added frontend',
  },
  {
    id: 'research-assistant-crawler',
    prompt:
      'Build an AI research assistant that crawls websites and answers questions from sources',
    purpose: "web-scraping + source-grounded retrieval; frontend rides 'websites'",
  },
  {
    id: 'multitenant-admin-audit',
    prompt: 'Build a multi-tenant admin dashboard with role-based access and audit logs',
    purpose: 'auth/RBAC + database via audit logs, not monitoring',
  },
] as const satisfies readonly ReviewPrompt[]

export type ReviewPromptId = (typeof recommendationReviewPrompts)[number]['id']

// Typed lookup for tests that pin expectations to a specific review prompt
// (the golden set) — a typo in the id fails at compile time.
export function getReviewPrompt(id: ReviewPromptId): string {
  const entry = recommendationReviewPrompts.find((p) => p.id === id)
  if (!entry) throw new Error(`Unknown review prompt id: ${id}`)
  return entry.prompt
}
