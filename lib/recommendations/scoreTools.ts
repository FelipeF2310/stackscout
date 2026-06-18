import { scoreCompatibilityForStack } from '../relationships/compatibility'
import type { RefinementContext } from './generateArchitecture'

export interface ScoredTool {
  tool_id: string
  score: number
  breakdown: {
    capability_fit: number
    context_fit: number
    compatibility_fit: number
    maintenance_fit: number
  }
}

export interface ToolRecord {
  tool_id: string
  capability_ids: string[]
  maintenance_score: number
  maturity_score: number
  documentation_score: number
  beginner_friendly?: boolean
  production_ready?: boolean
  managed?: boolean
  ecosystems?: string[]
}

export function scoreTools(
  tools: ToolRecord[],
  requiredCapabilityId: string,
  context: RefinementContext,
  selectedToolIds: string[]
): ScoredTool[] {
  return tools
    .filter((t) => t.capability_ids.includes(requiredCapabilityId))
    .map((tool) => {
      const capabilityFit = 1

      const contextFit = scoreContextFit(tool, context)

      const compatibilityFit = scoreCompatibilityForStack([...selectedToolIds, tool.tool_id])

      const maintenanceFit =
        (tool.maintenance_score + tool.maturity_score + tool.documentation_score) / 3

      const score =
        capabilityFit * 0.3 +
        contextFit * 0.3 +
        compatibilityFit * 0.25 +
        maintenanceFit * 0.15

      return {
        tool_id: tool.tool_id,
        score,
        breakdown: {
          capability_fit: capabilityFit,
          context_fit: contextFit,
          compatibility_fit: compatibilityFit,
          maintenance_fit: maintenanceFit,
        },
      }
    })
    .sort((a, b) => b.score - a.score)
}

function scoreContextFit(tool: ToolRecord, context: RefinementContext): number {
  let score = 0.5

  if (context.skillLevel === 'beginner' && tool.beginner_friendly) score += 0.25
  if (context.skillLevel === 'advanced' && tool.production_ready) score += 0.25
  if (context.projectStage === 'production' && tool.production_ready) score += 0.25
  if (context.hostingPreference === 'managed' && tool.managed) score += 0.25
  if (context.hostingPreference === 'self-hosted' && !tool.managed) score += 0.25
  if (context.ecosystem && tool.ecosystems?.includes(context.ecosystem)) score += 0.25

  return Math.min(score, 1)
}
