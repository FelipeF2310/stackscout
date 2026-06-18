import { getCapabilityById } from './capabilityTaxonomy'
import type { Capability } from './capabilityTypes'

// Deterministic capability detection (Phase 1 baseline).
//
// This intentionally does NOT call an LLM. It matches keywords/synonyms from
// the project description against the existing capability taxonomy. The goal is
// recall on realistic builder prompts (dashboards, SaaS apps, doc chatbots,
// support agents, research assistants) without over-firing. The LLM-backed
// detector will replace this later — the signature (string -> Capability[])
// stays stable so the swap is isolated to this file.
//
// Matching is plain substring containment over the lower-cased description,
// padded with spaces so tokens like ' ai ' and ' ui ' don't match inside
// words such as "email" or "build".

const KEYWORD_MAP: Record<string, string[]> = {
  auth: [
    'auth', 'login', 'log in', 'sign in', 'sign-in', 'sign up', 'account', 'accounts',
    'user', 'users', 'session', 'permission', 'permissions', 'role', 'roles', 'rbac',
    'admin', 'internal', 'multi-tenant', 'tenant', 'members', 'team', 'saas',
  ],
  database: [
    'database', 'persist', 'postgres', 'sql', 'records', 'record', 'crud', 'store data',
    'data', 'tracking', 'track', 'requests', 'request', 'reports', 'reporting',
    'inventory', 'tickets', 'submissions', 'entries', 'catalog', 'saas',
  ],
  'vector-storage': [
    'vector', 'embedding', 'embeddings', 'similarity', 'semantic', 'rag', 'chatbot',
    'search documents',
  ],
  'file-storage': ['upload', 'uploads', 'file storage', 'images', 'assets', 'blob', 'attachments'],
  deployment: ['deploy', 'deployment', 'hosting', 'host', 'ship it'],
  scheduling: [
    'schedule', 'scheduling', 'cron', 'background job', 'jobs', 'queue', 'worker',
    'recurring', 'reminders',
  ],
  monitoring: [
    'monitor', 'monitoring', 'observability', 'error tracking', 'metrics', 'logging',
    'logs', 'telemetry', 'uptime', 'analytics',
  ],
  'agent-framework': [
    'agent', 'agents', 'agentic', 'multi-step', 'orchestrat', 'tool calling', 'autonomous',
  ],
  'llm-api': [
    'llm', ' ai ', 'gpt', 'claude', 'chatbot', 'assistant', 'summar', 'generate text',
    'nlp', 'conversational', 'copilot',
  ],
  retrieval: [
    'rag', 'retrieval', 'search documents', 'knowledge base', 'knowledge', 'documents',
    'chatbot', 'q&a', 'question answering', 'ask questions',
  ],
  'document-parsing': [
    'pdf', 'document', 'documents', 'parse', 'extract', 'docx', 'ocr', 'word file',
    'spreadsheet',
  ],
  email: [
    'email', 'e-mail', 'mail', 'notification', 'notifications', 'transactional',
    'newsletter', 'support',
  ],
  payments: [
    'payment', 'payments', 'subscription', 'subscriptions', 'billing', 'checkout',
    'stripe', 'invoice', 'pricing', 'paywall',
  ],
  'api-layer': ['api', 'endpoint', 'endpoints', 'rest ', 'graphql', 'rpc', 'webhooks'],
  'frontend-framework': [
    'frontend', 'front-end', 'web app', 'webapp', 'dashboard', 'dashboards', 'website',
    'saas', 'interface', ' ui ', 'portal', 'admin panel', 'landing page',
  ],
  search: ['full-text search', 'faceted', 'search bar', 'filtering'],
}

export function detectCapabilities(projectDescription: string): Capability[] {
  const text = ` ${projectDescription.toLowerCase()} `
  const matched = new Set<string>()

  for (const [capabilityId, keywords] of Object.entries(KEYWORD_MAP)) {
    if (keywords.some((kw) => text.includes(kw))) {
      matched.add(capabilityId)
    }
  }

  // Any buildable product needs somewhere to render — provide a sensible floor.
  if (matched.size === 0) {
    matched.add('frontend-framework')
  }

  return Array.from(matched)
    .map((id) => getCapabilityById(id))
    .filter((c): c is Capability => c !== undefined)
}
