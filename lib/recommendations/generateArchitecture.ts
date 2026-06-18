import type { Capability } from '../capabilities/capabilityTypes'

export interface RefinementContext {
  skillLevel?: 'beginner' | 'intermediate' | 'advanced'
  projectStage?: 'prototype' | 'production' | 'enterprise'
  hostingPreference?: 'managed' | 'self-hosted'
  ecosystem?: 'typescript' | 'python' | 'mixed'
  modelPreference?: 'openai' | 'anthropic' | 'open-source' | 'no-preference'
}

export interface SelectedTool {
  tool_id: string
  capability_id: string
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
// This intentionally does NOT call an LLM. It takes the score-ordered tool
// lists produced upstream (one list per capability, best first) and selects the
// top tool for each capability, with builder-facing rationale. A richer,
// LLM-authored rationale will replace the template later. Keep this a pure
// function — corpus is passed in, never imported, so it stays testable.

export function generateArchitecture(
  projectDescription: string,
  capabilities: Capability[],
  availableTools: Record<string, string[]>,
  context: RefinementContext = {}
): GeneratedArchitecture {
  const selected_tools: SelectedTool[] = capabilities
    .map((capability): SelectedTool | null => {
      const tool_id = (availableTools[capability.capability_id] ?? [])[0]
      if (!tool_id) return null
      return {
        tool_id,
        capability_id: capability.capability_id,
        rationale: `${tool_id} is recommended for ${capability.name} — a strong fit for a project like yours in StackScout's curated corpus.`,
      }
    })
    .filter((t): t is SelectedTool => t !== null)

  const contextNote = Object.entries(context)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}: ${v}`)
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
