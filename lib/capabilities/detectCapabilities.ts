import { getCapabilityById } from './capabilityTaxonomy'
import type { Capability } from './capabilityTypes'

// Deterministic capability detection (Phase 1 baseline).
//
// This intentionally does NOT call an LLM. It matches keywords/synonyms from
// the project description against the existing capability taxonomy. The goal is
// recall on realistic builder prompts (dashboards, SaaS apps, doc chatbots,
// support agents, research assistants) without over-firing. The LLM-backed
// detector will replace this later — the signatures here stay stable so the
// swap is isolated to this file.
//
// Matching is plain substring containment over the lower-cased description,
// padded with spaces so tokens like ' ai ' and ' ui ' don't match inside
// words such as "email" or "build".
//
// Detection evidence (PR 1 / feature/detection-evidence-model)
// ------------------------------------------------------------
// Each keyword is tagged with a signal type so the UI can show *why* a
// capability was detected without overclaiming:
//   - 'direct'   — the phrase names or clearly describes the capability.
//   - 'inferred' — the phrase implies the capability but does not ask for it.
// Keywords the audit flagged 'ambiguous' (broad / substring-prone) are tagged
// 'inferred' for now so a shaky match is never presented as confirmed. See
// docs/CAPABILITY_DETECTION_AUDIT.md. This change is behavior-preserving: the
// keyword set, matching logic, and output order are unchanged. No keyword was
// added, removed, reworded, or reordered.

export type SignalType = 'direct' | 'inferred'
export type CapabilityOrigin = 'matched' | 'assumed-floor'

export interface DetectionSignal {
  // The trigger that matched, trimmed of any matching padding for display
  // (e.g. ' ai ' surfaces as 'ai').
  phrase: string
  type: SignalType
}

export interface CapabilityEvidence {
  capability: Capability
  // All keywords that matched for this capability. Empty when the capability
  // came from the fallback floor rather than a real match.
  signals: DetectionSignal[]
  origin: CapabilityOrigin
}

interface TaggedKeyword {
  // `match` is the exact string used for substring matching, including any
  // intentional space padding. Display uses `match.trim()`.
  match: string
  type: SignalType
}

const d = (match: string): TaggedKeyword => ({ match, type: 'direct' })
const i = (match: string): TaggedKeyword => ({ match, type: 'inferred' })

// Keyword map. `direct` = the phrase names the capability; `inferred` =
// implication or an audit-flagged ambiguous keyword.
const KEYWORD_MAP: Record<string, TaggedKeyword[]> = {
  auth: [
    d('auth'), d('login'), d('log in'), d('sign in'), d('sign-in'), d('sign up'),
    d('account'), d('accounts'), i('user'), i('users'), d('session'),
    d('permission'), d('permissions'), d('rbac'), d('role-based access'),
    d('role based access'), d('role-based access control'),
    d('role based access control'), i('user roles'), i('roles and permissions'),
    i('admin'), i('internal'), d('multi-tenant'), d('tenant'), i('members'),
    i('team'), i('saas'),
  ],
  database: [
    d('database'), d('persist'), d('postgres'), d('sql'), i('records'),
    i('record'), d('crud'), d('store data'), i('data'), i('tracking'),
    i('track'), i('requests'), i('request'), i('reports'), i('reporting'),
    i('inventory'), i('tickets'), i('submissions'), i('entries'), i('catalog'),
    i('saas'), i('analytics dashboard'), i('analytics dashboards'),
    i('marketplace'), i('listing'), i('listings'), i('list items'),
    i('audit logs'), i('audit records'),
  ],
  'vector-storage': [
    d('vector'), d('embedding'), d('embeddings'), d('similarity'), d('semantic'),
    d('rag'), i('chatbot'), i('search documents'),
  ],
  'file-storage': [
    d('upload'), d('uploads'), d('file storage'), i('images'), i('assets'),
    d('blob'), d('attachments'),
  ],
  deployment: [d('deploy'), d('deployment'), d('hosting'), i('host'), d('ship it')],
  scheduling: [
    d('schedule'), d('scheduling'), d('cron'), d('background job'), i('jobs'),
    d('queue'), i('worker'), d('recurring'), d('reminders'),
  ],
  'realtime-collaboration': [
    d('realtime collaborative'), d('real-time collaborative'),
    d('realtime collaboration'), d('real-time collaboration'),
    d('collaborative whiteboard'), d('realtime whiteboard'),
    d('multiplayer whiteboard'), d('collaborative editor'),
    d('collaborative editing'), d('multiplayer'), d('shared cursor'),
    d('shared cursors'), d('live collaboration'), d('collaborative presence'),
    d('multiplayer presence'), i('co-edit'), i('coediting'),
    i('shared document'), i('multi-user editing'),
  ],
  monitoring: [
    d('monitoring'), d('observability'), d('error tracking'),
    d('metrics'), d('logging'), i('application logs'), i('error logs'),
    d('telemetry'), d('uptime'),
  ],
  'agent-framework': [
    i('agent'), i('agents'), d('agentic'), i('multi-step'), d('orchestrat'),
    d('tool calling'), d('autonomous'),
  ],
  'llm-api': [
    d('llm'), d(' ai '), d('gpt'), d('claude'), i('chatbot'), i('assistant'),
    i('summar'), d('generate text'), d('nlp'), i('conversational'), d('copilot'),
  ],
  retrieval: [
    d('rag'), d('retrieval'), i('search documents'), d('knowledge base'),
    i('knowledge'), i('documents'), i('chatbot'), d('q&a'),
    d('question answering'), d('ask questions'),
  ],
  'document-parsing': [
    d('pdf'), d(' document '), d(' documents '), d('parse'), i('extract'),
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
    i('api'), d('endpoint'), d('endpoints'), i('rest '), d('graphql'), d('rpc'),
    d('webhooks'),
  ],
  'frontend-framework': [
    d('frontend'), d('front-end'), d('web app'), d('webapp'), d('dashboard'),
    d('dashboards'), d('website'), i('saas'), i('interface'), d(' ui '),
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

// Detection with evidence: per-capability matched signals and origin. Powers
// the detection-transparency UI.
export function detectCapabilitiesWithEvidence(
  projectDescription: string
): CapabilityEvidence[] {
  const text = ` ${projectDescription.toLowerCase()} `
  const evidence: CapabilityEvidence[] = []

  for (const [capabilityId, keywords] of Object.entries(KEYWORD_MAP)) {
    const signals: DetectionSignal[] = []
    for (const kw of keywords) {
      if (text.includes(kw.match)) {
        signals.push({ phrase: kw.match.trim(), type: kw.type })
      }
    }
    if (signals.length > 0) {
      const capability = getCapabilityById(capabilityId)
      if (capability) {
        evidence.push({ capability, signals, origin: 'matched' })
      }
    }
  }

  // Any buildable product needs somewhere to render — provide a sensible floor,
  // surfaced as an explicit assumption rather than a silent default.
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
