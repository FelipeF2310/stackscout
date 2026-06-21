import {
  getToolById,
  getAllTools,
  getCapabilitiesForTool,
  getCompatibleToolsForTool,
} from '../corpus/corpus'
import { whyThisTool, tradeoff, joinList } from '../recommendations/explanationCopy'
import { getAlternativesForCapability } from '../recommendations/alternatives'

// Seed-based tool detail data (Phase 1).
//
// Builds everything a /tools/[toolId] page needs straight from the curated
// corpus — no database, no GitHub API, no LLM. Reuses the same deterministic
// copy builders the recommendation experience uses, so a tool reads the same
// way on its own page as it does inside an architecture.

export interface ToolPageCapability {
  capability_id: string
  name: string
}

export interface ToolPageAlternative {
  tool_id: string
  reason: string
}

export interface ToolPageData {
  tool_id: string
  repository_name: string
  github_url: string
  capabilities: ToolPageCapability[]
  why: string
  tradeoff: string
  alternatives: ToolPageAlternative[]
  compatible_with: string[]
  scores: {
    maintenance: number
    maturity: number
    documentation: number
  }
  notes: string[]
}

/** Build the tool-page view model, or null when the id is unknown (404-safe). */
export function buildToolPageData(toolId: string): ToolPageData | null {
  const tool = getToolById(toolId)
  if (!tool) return null

  const capabilities: ToolPageCapability[] = getCapabilitiesForTool(toolId).map((c) => ({
    capability_id: c.capability_id,
    name: c.name,
  }))
  const capabilityLabel = joinList(capabilities.map((c) => c.name)) || tool.tool_id

  // Alternatives across every capability the tool serves, de-duplicated.
  const seen = new Set<string>()
  const alternatives: ToolPageAlternative[] = []
  for (const capability of capabilities) {
    for (const alt of getAlternativesForCapability(toolId, capability.capability_id)) {
      if (!seen.has(alt.tool_id)) {
        seen.add(alt.tool_id)
        alternatives.push({ tool_id: alt.tool_id, reason: alt.reason_not_selected })
      }
    }
  }

  const compatible_with = getCompatibleToolsForTool(toolId).map((t) => t.tool_id)

  const notes: string[] = []
  if (tool.beginner_friendly) notes.push('Beginner-friendly')
  if (tool.production_ready) notes.push('Production-ready')
  if (tool.managed === true) notes.push('Managed / hosted')
  if (tool.managed === false) notes.push('Self-hosted')
  if (tool.ecosystems && tool.ecosystems.length > 0) {
    notes.push(`Ecosystems: ${joinList(tool.ecosystems)}`)
  }

  return {
    tool_id: tool.tool_id,
    repository_name: tool.repository_name,
    github_url: tool.github_url,
    capabilities,
    why: whyThisTool(tool, capabilityLabel),
    tradeoff: tradeoff(tool),
    alternatives,
    compatible_with,
    scores: {
      maintenance: tool.maintenance_score,
      maturity: tool.maturity_score,
      documentation: tool.documentation_score,
    },
    notes,
  }
}

/** All tool ids in the corpus — used to pre-render tool pages at build time. */
export function getAllToolIds(): string[] {
  return getAllTools().map((t) => t.tool_id)
}
