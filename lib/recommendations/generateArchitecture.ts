import type { Capability } from '../capabilities/capabilityTypes'
import type { AiGrounding } from '../capabilities/aiGrounding'

export interface RefinementContext {
  skillLevel?: 'beginner' | 'intermediate' | 'advanced'
  projectStage?: 'prototype' | 'production' | 'enterprise'
  hostingPreference?: 'managed' | 'self-hosted'
  ecosystem?: 'typescript' | 'python' | 'mixed'
  modelPreference?: 'openai' | 'anthropic' | 'open-source' | 'no-preference'
  aiGrounding?: AiGrounding
}

export interface SelectedTool {
  tool_id: string
  /** All detected capabilities this single tool was selected to serve. */
  capability_ids: string[]
  rationale: string
}

export interface GeneratedArchitecture {
  project_description: string
  capabilities: Capability[]
  selected_tools: SelectedTool[]
  architecture_rationale: string
  created_at: string
}

// Deterministic architecture assembly (Phase 1 baseline).
//
// Takes the score-ordered tool lists produced upstream (one list per capability,
// best first) and selects the top tool for each capability. A single tool can be
// the best fit for more than one detected capability; when that happens it is
// recorded ONCE with all the capabilities it serves (no duplicate entries), so
// the stack shows one card per tool. No LLM — pure function, corpus passed in.

export function generateArchitecture(
  projectDescription: string,
  capabilities: Capability[],
  availableTools: Record<string, string[]>,
  context: RefinementContext = {}
): GeneratedArchitecture {
  const byTool = new Map<string, SelectedTool>()
  const order: string[] = []

  for (const capability of capabilities) {
    const tool_id = (availableTools[capability.capability_id] ?? [])[0]
    if (!tool_id) continue

    const existing = byTool.get(tool_id)
    if (existing) {
      if (!existing.capability_ids.includes(capability.capability_id)) {
        existing.capability_ids.push(capability.capability_id)
      }
    } else {
      byTool.set(tool_id, { tool_id, capability_ids: [capability.capability_id], rationale: '' })
      order.push(tool_id)
    }
  }

  const nameById = new Map(capabilities.map((c) => [c.capability_id, c.name]))
  const selected_tools: SelectedTool[] = order.map((tool_id) => {
    const tool = byTool.get(tool_id)!
    const label = joinNames(
      tool.capability_ids.map((id) => (nameById.get(id) ?? id).toLowerCase())
    )
    return {
      ...tool,
      rationale: `${tool_id} is recommended for ${label} — a strong fit for a project like yours in StackScout's curated corpus.`,
    }
  })

  const contextNote = Object.entries(context)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => formatContextNote(k, v as string))
    .join(', ')

  const architecture_rationale =
    `This architecture covers the ${capabilities.length} core capabilities your project needs` +
    (contextNote ? ` for your context (${contextNote}).` : '.') +
    ' Each tool was chosen to fit your project and work alongside the others — explore the alternatives under each capability to adjust the stack.'

  return {
    project_description: projectDescription,
    capabilities,
    selected_tools,
    architecture_rationale,
    created_at: new Date().toISOString(),
  }
}

function formatContextNote(key: string, value: string): string {
  if (key !== 'aiGrounding') return `${key}: ${value}`

  const labels: Record<AiGrounding, string> = {
    'product-sources': 'AI grounding: product sources',
    'general-knowledge': 'AI grounding: general knowledge',
    both: 'AI grounding: both',
    default: 'AI grounding: sensible default',
  }
  return labels[value as AiGrounding]
}

function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? ''
  if (names.length === 2) return `${names[0]} and ${names[1]}`
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`
}
