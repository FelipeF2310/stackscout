import { describe, it, expect } from 'vitest'
import { recommendArchitecture } from '../../lib/recommendations/recommendArchitecture'

// Golden-set regression net for StackScout's canonical prompts (PR #26).
//
// This is a TESTS-ONLY safety net captured BEFORE the next medium-risk product
// step (frontend corpus expansion with fit metadata). It asserts must-have /
// must-not-have behavior — required and forbidden capabilities, and stable /
// regression-prone tool selections — without hard-coding full capability arrays
// (capability order is not a product contract). It does not change runtime
// behavior. If a case ever fails, treat it as a signal to review intent, not to
// silently "fix" the test.

interface GoldenCase {
  name: string
  prompt: string
  /** Capabilities that must be detected. */
  requiredCaps: string[]
  /** Capabilities that must NOT be detected (false-positive guards). */
  forbiddenCaps: string[]
  /** Tools whose selection is intentionally stable. */
  expectedTools: string[]
  /** Tools that must NOT be selected (known-regression guards). */
  forbiddenTools: string[]
  /** Optional: the tool filling `database` must not be this (PR #19 guard). */
  databaseToolNot?: string
  notes?: string
}

const GOLDEN: GoldenCase[] = [
  {
    name: 'marketplace',
    prompt: 'Build a marketplace app where users can list items and accept payments',
    requiredCaps: ['auth', 'database', 'payments', 'frontend-framework'],
    forbiddenCaps: [],
    expectedTools: ['clerk', 'supabase', 'stripe', 'nextjs'],
    forbiddenTools: ['supabase-auth'],
    databaseToolNot: 'supabase-auth',
  },
  {
    name: 'web scraper / job postings',
    prompt: 'Build a web scraper that monitors job postings and summarizes new roles',
    requiredCaps: ['web-scraping', 'llm-api'],
    // PR #18 + PR #22 false-positive guards.
    forbiddenCaps: ['auth', 'database', 'scheduling', 'monitoring'],
    expectedTools: ['firecrawl', 'openai-sdk'],
    forbiddenTools: ['sentry'],
  },
  {
    name: 'PDF chatbot (RAG)',
    prompt: 'Build a PDF chatbot for internal company documents',
    requiredCaps: ['document-parsing', 'retrieval', 'vector-storage', 'llm-api'],
    forbiddenCaps: [],
    expectedTools: ['qdrant', 'llamaindex', 'openai-sdk'],
    forbiddenTools: [],
  },
  {
    name: 'internal analytics dashboard',
    prompt: 'Build an internal analytics dashboard for city operations',
    requiredCaps: ['auth', 'database', 'frontend-framework'],
    // PR #18 guard: "analytics" must not imply observability/Monitoring.
    forbiddenCaps: ['monitoring'],
    expectedTools: ['supabase', 'nextjs', 'clerk'],
    forbiddenTools: ['supabase-auth', 'sentry'],
    databaseToolNot: 'supabase-auth',
  },
  {
    name: 'realtime collaborative whiteboard',
    prompt: 'Build a realtime collaborative whiteboard',
    requiredCaps: ['realtime-collaboration', 'frontend-framework'],
    forbiddenCaps: ['web-scraping'],
    expectedTools: ['liveblocks', 'nextjs'],
    forbiddenTools: ['astro'],
  },
  {
    name: 'AI customer support agent (SaaS)',
    prompt: 'Build an AI customer support agent for a SaaS product',
    requiredCaps: ['agent-framework', 'llm-api', 'auth', 'database', 'email'],
    forbiddenCaps: [],
    expectedTools: ['vercel-ai-sdk', 'openai-sdk'],
    forbiddenTools: ['supabase-auth'],
    databaseToolNot: 'supabase-auth',
  },
]

async function recommend(prompt: string) {
  const result = await recommendArchitecture(prompt)
  const capIds = result.architecture.capabilities.map((c) => c.capability_id)
  const selected = result.architecture.selected_tools
  const toolIds = selected.map((t) => t.tool_id)
  const toolForCapability = (capId: string) =>
    selected.find((t) => t.capability_ids.includes(capId))?.tool_id
  return { capIds, toolIds, toolForCapability }
}

describe('golden recommendation set (canonical prompts)', () => {
  for (const g of GOLDEN) {
    describe(g.name, () => {
      it('detects the required capabilities and none of the forbidden ones', async () => {
        const { capIds } = await recommend(g.prompt)
        for (const cap of g.requiredCaps) expect(capIds).toContain(cap)
        for (const cap of g.forbiddenCaps) expect(capIds).not.toContain(cap)
      })

      it('selects the expected tools and none of the forbidden ones', async () => {
        const { toolIds } = await recommend(g.prompt)
        for (const tool of g.expectedTools) expect(toolIds).toContain(tool)
        for (const tool of g.forbiddenTools) expect(toolIds).not.toContain(tool)
      })

      if (g.databaseToolNot) {
        it(`fills the Database slot with a real database tool (not ${g.databaseToolNot})`, async () => {
          const { toolForCapability } = await recommend(g.prompt)
          expect(toolForCapability('database')).toBeDefined()
          expect(toolForCapability('database')).not.toBe(g.databaseToolNot)
        })
      }
    })
  }

  // Cross-prompt invariant: wherever Database is detected, it is never filled by
  // the auth-primary supabase-auth tool (PR #19 corpus-tagging fix).
  it('never fills Database with supabase-auth across the canonical set', async () => {
    for (const g of GOLDEN) {
      const { toolForCapability } = await recommend(g.prompt)
      const dbTool = toolForCapability('database')
      if (dbTool) expect(dbTool).not.toBe('supabase-auth')
    }
  })
})
