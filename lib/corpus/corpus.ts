import { z } from 'zod'

import toolsData from '../../data/seed/tools.json'
import relationshipsData from '../../data/seed/relationships.json'

import { CAPABILITY_TAXONOMY } from '../capabilities/capabilityTaxonomy'
import type { Capability } from '../capabilities/capabilityTypes'
import type { Relationship } from '../relationships/relationshipTypes'
import {
  loadRelationshipGraph,
  getRelationshipsForTool as graphRelationshipsForTool,
  getRelationshipsBetween as graphRelationshipsBetween,
  getAlternatives as graphAlternatives,
} from '../relationships/relationshipGraph'

// Curated corpus module (Phase 1).
//
// The single interface for reading StackScout's curated data: Capabilities,
// Tools, and Relationships. It owns loading, validation, and typed query
// helpers. There is no database, no network, and no persistence — the corpus is
// loaded once, validated, indexed in memory, and reused.
//
// Capabilities are sourced from the canonical taxonomy (CAPABILITY_TAXONOMY in
// lib/capabilities/capabilityTaxonomy.ts) — the single source of truth for the
// primary product object. Tools and relationships are read from data/seed/*.json.
//
// Relationship lookups delegate to the in-memory relationship graph, which this
// module populates on load (so compatibility scoring keeps working unchanged).

// --- validation schemas (reuses the existing zod dependency) ---

const RELATIONSHIP_TYPES = [
  'compatible-with',
  'alternative-to',
  'commonly-used-with',
  'better-for-beginners',
  'better-for-production',
  'managed-alternative',
  'self-hosted-alternative',
] as const

const capabilitySchema = z.object({
  capability_id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
})

const toolSchema = z.object({
  tool_id: z.string().min(1),
  repository_name: z.string().min(1),
  github_url: z.string().url(),
  capability_ids: z.array(z.string().min(1)).min(1),
  maintenance_score: z.number().min(0).max(1),
  maturity_score: z.number().min(0).max(1),
  documentation_score: z.number().min(0).max(1),
  beginner_friendly: z.boolean().optional(),
  production_ready: z.boolean().optional(),
  managed: z.boolean().optional(),
  ecosystems: z.array(z.string()).optional(),
})

const relationshipSchema = z.object({
  relationship_id: z.string().min(1),
  source_tool_id: z.string().min(1),
  target_tool_id: z.string().min(1),
  relationship_type: z.enum(RELATIONSHIP_TYPES),
  confidence_score: z.number().min(0).max(1),
  source_of_truth: z.literal('manual'),
})

export type CorpusTool = z.infer<typeof toolSchema>

export interface Corpus {
  capabilities: Capability[]
  tools: CorpusTool[]
  relationships: Relationship[]
}

// --- lazy, validated, indexed load ---

let _corpus: Corpus | null = null
let _toolById: Map<string, CorpusTool> = new Map()
let _capabilityById: Map<string, Capability> = new Map()

function load(): Corpus {
  if (_corpus) return _corpus

  // Canonical capabilities come from the taxonomy; still validated here so the
  // corpus keeps its "loaded + validated" contract.
  const capabilities = capabilitySchema.array().parse(CAPABILITY_TAXONOMY) as Capability[]
  const tools = toolSchema.array().parse(toolsData)
  const relationships = relationshipSchema.array().parse(relationshipsData)

  // Populate the relationship graph that compatibility scoring reads from.
  loadRelationshipGraph(relationships)

  _toolById = new Map(tools.map((t) => [t.tool_id, t]))
  _capabilityById = new Map(capabilities.map((c) => [c.capability_id, c]))
  _corpus = { capabilities, tools, relationships }
  return _corpus
}

/** The full validated corpus, loaded on first access (idempotent). */
export function getCorpus(): Corpus {
  return load()
}

// --- capability queries ---

export function getAllCapabilities(): Capability[] {
  return load().capabilities
}

export function getCapabilityById(capabilityId: string): Capability | undefined {
  load()
  return _capabilityById.get(capabilityId)
}

// --- tool queries ---

export function getAllTools(): CorpusTool[] {
  return load().tools
}

export function getToolById(toolId: string): CorpusTool | undefined {
  load()
  return _toolById.get(toolId)
}

/** Tools that fulfill a given capability (capability-first lookup). */
export function getToolsForCapability(capabilityId: string): CorpusTool[] {
  return load().tools.filter((t) => t.capability_ids.includes(capabilityId))
}

/** The capabilities a given tool implements, resolved to capability records. */
export function getCapabilitiesForTool(toolId: string): Capability[] {
  const tool = getToolById(toolId)
  if (!tool) return []
  return tool.capability_ids
    .map((id) => _capabilityById.get(id))
    .filter((c): c is Capability => c !== undefined)
}

// --- relationship queries (delegate to the in-memory graph) ---

export function getRelationshipsForTool(toolId: string): Relationship[] {
  load()
  return graphRelationshipsForTool(toolId)
}

export function getRelationshipsBetween(toolIdA: string, toolIdB: string): Relationship[] {
  load()
  return graphRelationshipsBetween(toolIdA, toolIdB)
}

/** Alternative tools (alternative-to edges), resolved to tool records. */
export function getAlternativesForTool(toolId: string): CorpusTool[] {
  load()
  return graphAlternatives(toolId)
    .map((id) => _toolById.get(id))
    .filter((t): t is CorpusTool => t !== undefined)
}

/**
 * Tools that work well with the given tool — compatible-with and
 * commonly-used-with edges — resolved to tool records and de-duplicated.
 */
export function getCompatibleToolsForTool(toolId: string): CorpusTool[] {
  load()
  const ids = new Set<string>()
  for (const rel of graphRelationshipsForTool(toolId)) {
    if (rel.relationship_type === 'compatible-with' || rel.relationship_type === 'commonly-used-with') {
      ids.add(rel.source_tool_id === toolId ? rel.target_tool_id : rel.source_tool_id)
    }
  }
  return [...ids]
    .map((id) => _toolById.get(id))
    .filter((t): t is CorpusTool => t !== undefined)
}
