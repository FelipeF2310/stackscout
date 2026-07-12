import { getCapabilityById } from './capabilityTaxonomy'
import type { Capability } from './capabilityTypes'
import { compilePhrase } from './keywordMatcher'
import { evaluateProjectShapes } from './projectShapes'

// Deterministic capability detection (Phase 1 baseline).
//
// This intentionally does NOT call an LLM. It matches keywords/synonyms from
// the project description against the existing capability taxonomy. The goal is
// recall on realistic builder prompts (dashboards, SaaS apps, doc chatbots,
// support agents, research assistants) without over-firing. The LLM-backed
// detector will replace this later — the signatures here stay stable so the
// swap is isolated to this file.
//
// Matching (detector hardening)
// -----------------------------
// Each keyword is compiled once at module load into a word-boundary regex:
//   - multi-word phrases match across any whitespace,
//   - normal keywords also match a trailing plural 's',
//   - keywords flagged `stem: true` match any word continuation
//     (e.g. 'summar' → "summarize", "summary"; 'deploy' → "deploying").
// This replaces the earlier raw substring containment, which produced false
// positives like "authors" → auth and required fragile hand-padded entries
// (' ai ', ' document ') to dodge collisions. See
// docs/CAPABILITY_DETECTION_AUDIT.md (addendum) for the before/after audit.
// The compiler lives in keywordMatcher.ts, shared with project-shape inference.
//
// Project-shape inference (projectShapes.ts) runs after keyword matching:
// product artifacts like "support inbox" entail supporting capabilities
// (database, frontend) that no keyword states. Shape signals merge into
// existing entries; shape-only capabilities append after keyword detections
// so explicit signals always anchor downstream tool selection.
//
// Detection evidence (PR 1 / feature/detection-evidence-model)
// ------------------------------------------------------------
// Each keyword is tagged with a signal type so the UI can show *why* a
// capability was detected without overclaiming:
//   - 'direct'   — the phrase names or clearly describes the capability.
//   - 'inferred' — the phrase implies the capability but does not ask for it.
// Keywords the audit flagged 'ambiguous' (broad / substring-prone) are tagged
// 'inferred' so a shaky match is never presented as confirmed. See
// docs/CAPABILITY_DETECTION_AUDIT.md.

export type SignalType = 'direct' | 'inferred'
export type CapabilityOrigin = 'matched' | 'assumed-floor'

export interface DetectionSignal {
  // The actual text that matched in the (lower-cased) description — for stem
  // keywords this is the full matched word (e.g. 'summarize', never 'summar').
  phrase: string
  type: SignalType
  // Authored explanation, present only on project-shape inference signals
  // (e.g. 'an inbox stores threads, status, and assignment'). Not rendered in
  // the UI yet; carried so shape assumptions are reviewable from day one.
  rationale?: string
}

export interface CapabilityEvidence {
  capability: Capability
  // All keywords that matched for this capability. Empty when the capability
  // came from the fallback floor rather than a real match.
  signals: DetectionSignal[]
  origin: CapabilityOrigin
}

interface TaggedKeyword {
  // The keyword or phrase to match at word boundaries. With `stem: true` the
  // keyword matches any continuation ('deploy' → deploying/deployed/deployment).
  match: string
  type: SignalType
  stem?: boolean
}

const d = (match: string, opts?: { stem: true }): TaggedKeyword => ({
  match,
  type: 'direct',
  stem: opts?.stem,
})
const i = (match: string, opts?: { stem: true }): TaggedKeyword => ({
  match,
  type: 'inferred',
  stem: opts?.stem,
})

// Keyword map. `direct` = the phrase names the capability; `inferred` =
// implication or an audit-flagged ambiguous keyword.
//
// Note on 'internal' (auth): migrated to the internal-gated-access shape rule
// in projectShapes.ts — auth fires only when 'internal' adjectivally
// qualifies a software/content noun, never on bare internal code-talk.
// 'team' was removed earlier (detector hardening): too soft on its own.
const KEYWORD_MAP: Record<string, TaggedKeyword[]> = {
  auth: [
    d('auth'), d('authentication'), d('authenticate'), d('authenticated'),
    d('authorization'), d('oauth'), d('login'), d('log in'), d('sign in'),
    d('sign-in'), d('sign up'), d('account'), d('accounts'), i('user'),
    i('users'), d('session'), d('permission'), d('permissions'), d('rbac'),
    d('role-based access'), d('role based access'),
    d('role-based access control'), d('role based access control'),
    i('user roles'), i('roles and permissions'), i('admin', { stem: true }),
    d('multi-tenant'), d('tenant'), i('members'), i('saas'),
  ],
  database: [
    d('database'), d('persist', { stem: true }), d('postgres'), d('sql'),
    i('records'), i('record'), d('crud'), d('store data'), i('data'),
    i('tracking'), i('track'), i('requests'), i('request'), i('reports'),
    i('reporting'), i('inventory'), i('tickets'), i('submissions'),
    i('entries'), i('catalog'), i('saas'), i('analytics dashboard'),
    i('analytics dashboards'), i('marketplace'), i('listing'), i('listings'),
    i('list items'), i('audit logs'), i('audit records'),
  ],
  'vector-storage': [
    d('vector'), d('embedding'), d('embeddings'), d('similarity'), d('semantic'),
    d('rag'), i('chatbot'), i('search documents'),
  ],
  'file-storage': [
    d('upload', { stem: true }), d('file storage'), i('images'), i('assets'),
    d('blob'), d('attachments'),
  ],
  deployment: [
    d('deploy', { stem: true }), d('hosting'), i('host'), i('hosted'),
    d('ship it'),
  ],
  scheduling: [
    d('schedul', { stem: true }), d('cron'), d('background job'), i('jobs'),
    d('queue'), i('worker'), d('recurring'), d('reminders'),
  ],
  'realtime-collaboration': [
    d('realtime collaborative'), d('real-time collaborative'),
    d('realtime collaboration'), d('real-time collaboration'),
    d('collaborative whiteboard'), d('realtime whiteboard'),
    d('multiplayer whiteboard'), d('collaborative editor'),
    d('collaborative editing'), d('multiplayer'), d('shared cursor'),
    d('shared cursors'), d('live collaboration'), d('collaborative presence'),
    d('multiplayer presence'), i('co-edit', { stem: true }), i('coediting'),
    i('shared document'), i('multi-user editing'),
  ],
  monitoring: [
    d('monitoring'), d('observability'), d('error tracking'),
    d('metrics'), d('logging'), i('application logs'), i('error logs'),
    d('telemetry'), d('uptime'),
  ],
  'agent-framework': [
    i('agent'), i('agents'), d('agentic'), i('multi-step'),
    d('orchestrat', { stem: true }), d('tool calling'), d('autonomous'),
  ],
  'llm-api': [
    d('llm'), d('ai'), d('gpt'), d('claude'), i('chatbot'), i('assistant'),
    i('summar', { stem: true }), d('generate text'), d('nlp'),
    i('conversational'), d('copilot'),
  ],
  retrieval: [
    d('rag'), d('retrieval'), i('search documents'), d('knowledge base'),
    i('knowledge'), i('documents'), i('chatbot'), d('q&a'),
    d('question answering'), d('ask questions'),
  ],
  'document-parsing': [
    d('pdf'), d('document'), d('documents'), d('parse'), i('extract', { stem: true }),
    d('docx'), d('ocr'), d('word file'), d('spreadsheet'),
  ],
  email: [
    d('email'), d('e-mail'), i('mail'), i('notification'), i('notifications'),
    d('transactional'), d('newsletter'), i('support'),
  ],
  payments: [
    d('payment'), d('payments'), d('subscription'), d('subscriptions'),
    d('billing'), d('checkout'), d('stripe'), d('invoice'), i('pricing'),
    d('paywall'),
  ],
  'api-layer': [
    i('api'), d('endpoint'), d('endpoints'), d('rest api'), d('restful'),
    d('rest endpoint'), d('graphql'), d('rpc'), d('webhooks'),
  ],
  'frontend-framework': [
    d('frontend'), d('front-end'), d('web app'), d('webapp'), d('dashboard'),
    d('dashboards'), d('website'), i('saas'), i('interface'), d('ui'),
    d('portal'), d('admin panel'), d('landing page'), i('marketplace app'),
    i('marketplace platform'), i('whiteboard'),
  ],
  search: [
    d('full-text search'), d('product search'), d('search experience'),
    d('site with search'), d('search bar'), d('typo tolerance'),
    d('faceted'), i('filtering'),
  ],
  'web-scraping': [
    d('web scraping'), d('web scraper'), d('scraper'), d('scrape'),
    d('crawler'), d('crawling'), d('crawl websites'), d('crawls websites'),
    d('crawling websites'), d('crawls web pages'), d('extract data from websites'),
    i('scrape job postings'),
  ],
}

// --- keyword compilation (once, at module load) ---

interface CompiledKeyword {
  regex: RegExp
  type: SignalType
}

const COMPILED_KEYWORD_MAP: [string, CompiledKeyword[]][] = Object.entries(
  KEYWORD_MAP
).map(([capabilityId, keywords]) => [
  capabilityId,
  keywords.map((kw) => ({
    regex: compilePhrase(kw.match, { stem: kw.stem }),
    type: kw.type,
  })),
])

// Detection with evidence: per-capability matched signals and origin. Powers
// the detection-transparency UI.
export function detectCapabilitiesWithEvidence(
  projectDescription: string
): CapabilityEvidence[] {
  const text = projectDescription.toLowerCase()
  const evidence: CapabilityEvidence[] = []

  for (const [capabilityId, keywords] of COMPILED_KEYWORD_MAP) {
    const signals: DetectionSignal[] = []
    for (const kw of keywords) {
      const match = kw.regex.exec(text)
      if (match) {
        signals.push({ phrase: match[0], type: kw.type })
      }
    }
    if (signals.length > 0) {
      const capability = getCapabilityById(capabilityId)
      if (capability) {
        evidence.push({ capability, signals, origin: 'matched' })
      }
    }
  }

  // Merge project-shape inferences: shape signals join an already-detected
  // capability in place (position unchanged); shape-only capabilities append
  // after all keyword detections so inferences never displace explicit
  // signals in the greedy tool-selection order.
  const shapeSignals = evaluateProjectShapes(projectDescription)
  for (const [capabilityId, signals] of shapeSignals) {
    const existing = evidence.find((e) => e.capability.capability_id === capabilityId)
    if (existing) {
      existing.signals.push(...signals)
    } else {
      const capability = getCapabilityById(capabilityId)
      if (capability) {
        evidence.push({ capability, signals, origin: 'matched' })
      }
    }
  }

  // Any buildable product needs somewhere to render — provide a sensible floor,
  // surfaced as an explicit assumption rather than a silent default. Fires only
  // when both keyword and shape evidence are empty.
  if (evidence.length === 0) {
    const floor = getCapabilityById('frontend-framework')
    if (floor) {
      evidence.push({ capability: floor, signals: [], origin: 'assumed-floor' })
    }
  }

  return evidence
}

// Compatibility wrapper. Keeps the public output shape stable for the
// recommendation pipeline.
export function detectCapabilities(projectDescription: string): Capability[] {
  return detectCapabilitiesWithEvidence(projectDescription).map((e) => e.capability)
}
