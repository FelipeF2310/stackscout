import { getCapabilityById } from './capabilityTaxonomy'
import type { Capability } from './capabilityTypes'

// Deterministic placeholder capability detection (Phase 1 baseline).
//
// This intentionally does NOT call an LLM. It matches keywords from the
// project description against the capability taxonomy. The LLM-backed
// detector will replace this in a later slice — keep the signature stable
// (string in, Capability[] out) so the swap is isolated to this file.

const KEYWORD_MAP: Record<string, string[]> = {
  auth: ['auth', 'login', 'sign in', 'sign up', 'account', 'user', 'session', 'permission', 'rbac'],
  database: ['database', 'persist', 'postgres', 'sql', 'records', 'crud', 'store data'],
  'vector-storage': ['vector', 'embedding', 'embeddings', 'similarity', 'semantic'],
  'file-storage': ['upload', 'file storage', 'images', 'assets', 'blob'],
  deployment: ['deploy', 'hosting', 'host', 'ship it'],
  scheduling: ['schedule', 'cron', 'background job', 'queue', 'worker', 'recurring'],
  monitoring: ['monitor', 'observability', 'error tracking', 'metrics', 'logging', 'analytics'],
  'agent-framework': ['agent', 'agents', 'multi-step', 'orchestrat', 'tool calling'],
  'llm-api': ['llm', ' ai ', 'gpt', 'claude', 'chatbot', 'assistant', 'summar', 'generate text'],
  retrieval: ['rag', 'retrieval', 'search documents', 'knowledge base'],
  'document-parsing': ['pdf', 'document', 'parse', 'extract', 'docx', 'ocr'],
  email: ['email', 'mail', 'notification', 'transactional'],
  payments: ['payment', 'subscription', 'billing', 'checkout', 'stripe', 'invoice'],
  'api-layer': ['api', 'endpoint', 'rest ', 'rpc', 'backend'],
  'frontend-framework': ['frontend', 'web app', 'dashboard', 'website', 'saas', 'interface', ' ui '],
  search: ['full-text search', 'faceted', 'search bar'],
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
