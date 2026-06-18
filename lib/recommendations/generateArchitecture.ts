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

// Deterministic placeholder architecture generation (Phase 1 baseline).
//
// This intentionally does NOT call an LLM. For each detected capability it
// picks the first tool offered by the supplied corpus and emits a template
// rationale. The scoring engine (scoreTools.ts) and the LLM-backed generator
// will replace the selection + rationale in a later slice. Keep this a pure
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
        rationale: `${tool_id} is selected for ${capability.name} from the curated corpus. (Deterministic baseline rationale — the scoring engine and explanation layer are not yet wired.)`,
      }
    })
    .filter((t): t is SelectedTool => t !== null)

  const contextNote = Object.entries(context)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ')

  const architecture_rationale =
    `Deterministic baseline architecture covering ${capabilities.length} capabilities` +
    (contextNote ? ` for context (${contextNote}).` : '.') +
    ' Tool selection and rationale will be produced by the scoring engine and explanation layer in a later slice.'

  return {
    project_description: projectDescription,
    capabilities,
    selected_tools,
    architecture_rationale,
    created_at: new Date().toISOString(),
  }
}
