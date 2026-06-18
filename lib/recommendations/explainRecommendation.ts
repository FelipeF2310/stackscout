import { getToolById } from '../seed/loadSeed'
import { getRelationshipsBetween } from '../relationships/relationshipGraph'
import {
  capabilityName,
  simpleLine,
  whyThisTool,
  fitsWith,
  tradeoff,
  considerAlternative,
  joinList,
} from './explanationCopy'
import type { GeneratedArchitecture, RefinementContext } from './generateArchitecture'

export interface ToolExplanation {
  tool_id: string
  /** Every detected capability this tool serves in the stack. */
  capability_ids: string[]
  /** Human-readable label for those capabilities, e.g. "Retrieval and Document Parsing". */
  capability_label: string
  github_url: string
  /** Non-technical one-liner. */
  simple: string
  /** Why this tool was chosen. */
  why: string
  /** How it fits with the rest of the stack (null when no known relationship). */
  fits_with: string | null
  /** A concrete tradeoff being accepted. */
  tradeoff: string
  /** When to consider an alternative, naming one (null when none exist). */
  consider_alternative: string | null
}

// Deterministic explanation layer (Phase 1 baseline). Builds advisor-style,
// per-tool explanations from seed metadata + the relationship graph. No LLM.
// One explanation per unique tool; a multi-capability tool lists all of them.

export function explainRecommendation(architecture: GeneratedArchitecture): ToolExplanation[] {
  const selectedIds = architecture.selected_tools.map((t) => t.tool_id)

  return architecture.selected_tools.map((selected) => {
    const tool = getToolById(selected.tool_id)
    const label = joinList(selected.capability_ids.map((id) => capabilityName(id)))
    const labelLower = label.toLowerCase()

    return {
      tool_id: selected.tool_id,
      capability_ids: selected.capability_ids,
      capability_label: label,
      github_url: tool?.github_url ?? `https://github.com/search?q=${selected.tool_id}`,
      simple: tool
        ? simpleLine(tool, label)
        : `${selected.tool_id} handles ${labelLower}.`,
      why: tool ? whyThisTool(tool, label) : `Recommended for ${labelLower}.`,
      fits_with: fitsWith(selected.tool_id, selectedIds),
      tradeoff: tool
        ? tradeoff(tool)
        : 'Review the alternatives for this capability to compare tradeoffs.',
      consider_alternative: firstConsiderAlternative(selected.tool_id, selected.capability_ids),
    }
  })
}

// A tool may serve several capabilities; surface the first capability that has a
// concrete alternative worth calling out.
function firstConsiderAlternative(toolId: string, capabilityIds: string[]): string | null {
  for (const capabilityId of capabilityIds) {
    const hint = considerAlternative(toolId, capabilityId)
    if (hint) return hint
  }
  return null
}

// Architecture-level summary: what the stack is and why the pieces cohere.
export function summarizeArchitecture(
  architecture: GeneratedArchitecture,
  context: RefinementContext = {}
): string {
  const tools = architecture.selected_tools
  if (tools.length === 0) {
    return 'No matching tools were found in the curated corpus for this idea yet.'
  }

  const pieces = tools.map(
    (t) =>
      `${t.tool_id} for ${joinList(t.capability_ids.map((id) => capabilityName(id))).toLowerCase()}`
  )
  const count = tools.length
  let summary = `This architecture brings together ${count} ${count === 1 ? 'tool' : 'tools'}: ${joinList(pieces)}.`

  const pair = strongestPair(tools.map((t) => t.tool_id))
  if (pair) {
    summary += ` ${pair.a} and ${pair.b} are ${pair.kind}, so the core pieces fit together cleanly.`
  }

  const ctx = contextClause(context)
  if (ctx) summary += ` ${ctx}`

  return summary
}

function strongestPair(
  toolIds: string[]
): { a: string; b: string; kind: string } | null {
  let best: { a: string; b: string; kind: string; conf: number } | null = null

  for (let i = 0; i < toolIds.length; i++) {
    for (let j = i + 1; j < toolIds.length; j++) {
      for (const edge of getRelationshipsBetween(toolIds[i], toolIds[j])) {
        let kind: string | null = null
        if (edge.relationship_type === 'commonly-used-with') kind = 'commonly used together'
        else if (edge.relationship_type === 'compatible-with') kind = 'designed to work together'
        if (kind && (!best || edge.confidence_score > best.conf)) {
          best = { a: toolIds[i], b: toolIds[j], kind, conf: edge.confidence_score }
        }
      }
    }
  }

  return best ? { a: best.a, b: best.b, kind: best.kind } : null
}

function contextClause(context: RefinementContext): string | null {
  const parts: string[] = []
  if (context.skillLevel === 'beginner') parts.push('it leans toward approachable, low-setup choices')
  if (context.projectStage === 'production') parts.push('it favors production-ready tools')
  if (context.hostingPreference === 'managed') parts.push('it prefers managed services')
  if (context.hostingPreference === 'self-hosted') parts.push('it prefers self-hosted tools')
  if (context.ecosystem) parts.push(`it targets a ${context.ecosystem} stack`)
  if (parts.length === 0) return null
  return `Based on your preferences, ${joinList(parts)}.`
}
