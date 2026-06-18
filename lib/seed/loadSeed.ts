import capabilitiesData from '../../data/seed/capabilities.json'
import toolsData from '../../data/seed/tools.json'
import relationshipsData from '../../data/seed/relationships.json'

import type { Capability } from '../capabilities/capabilityTypes'
import type { ToolRecord } from '../recommendations/scoreTools'
import type { Relationship, RelationshipType } from '../relationships/relationshipTypes'
import { loadRelationshipGraph } from '../relationships/relationshipGraph'

// In-memory seed loader (Phase 1 baseline).
//
// Loads the curated corpus from data/seed/*.json into typed, in-memory
// structures and ensures the relationship graph singleton is populated. There
// is no database and no persistence — this is the single source of truth for
// the deterministic recommendation pipeline.

export interface SeedTool extends ToolRecord {
  repository_name: string
  github_url: string
}

export interface Seed {
  capabilities: Capability[]
  tools: SeedTool[]
  relationships: Relationship[]
}

let _seed: Seed | null = null

function buildSeed(): Seed {
  const capabilities = capabilitiesData as Capability[]
  const tools = toolsData as SeedTool[]

  const relationships: Relationship[] = relationshipsData.map((r) => ({
    relationship_id: r.relationship_id,
    source_tool_id: r.source_tool_id,
    target_tool_id: r.target_tool_id,
    relationship_type: r.relationship_type as RelationshipType,
    confidence_score: r.confidence_score,
    source_of_truth: 'manual',
  }))

  return { capabilities, tools, relationships }
}

/**
 * Returns the in-memory seed, loading it (and the relationship graph) on first
 * call. Idempotent — safe to call from any point in the pipeline.
 */
export function getSeed(): Seed {
  if (!_seed) {
    _seed = buildSeed()
    loadRelationshipGraph(_seed.relationships)
  }
  return _seed
}

/**
 * Map of capability_id -> tool_ids that fulfill it, drawn from the corpus.
 * Capability-first: tools are grouped under the capabilities they implement.
 */
export function toolsByCapability(): Record<string, string[]> {
  const { tools } = getSeed()
  const map: Record<string, string[]> = {}
  for (const tool of tools) {
    for (const capabilityId of tool.capability_ids) {
      ;(map[capabilityId] ??= []).push(tool.tool_id)
    }
  }
  return map
}

/** Look up a single tool record by id. */
export function getToolById(toolId: string): SeedTool | undefined {
  return getSeed().tools.find((t) => t.tool_id === toolId)
}
