import type { GeneratedArchitecture } from './generateArchitecture'

export interface ToolExplanation {
  tool_id: string
  simple: string
  technical: string
  tradeoffs: string
  why_not_alternatives: string
}

// Deterministic placeholder explanation generation (Phase 1 baseline).
//
// This intentionally does NOT call an LLM. It returns template explanations
// derived from the selected tools so the shape of the explanation layer is
// exercised. The LLM-backed explainer will replace the body in a later slice.

export function explainRecommendation(
  architecture: GeneratedArchitecture,
  _projectDescription: string
): ToolExplanation[] {
  return architecture.selected_tools.map((tool) => {
    const capabilityLabel = tool.capability_id.replace(/-/g, ' ')
    return {
      tool_id: tool.tool_id,
      simple: `${tool.tool_id} provides the ${capabilityLabel} capability for your project.`,
      technical: `${tool.tool_id} was selected from the curated corpus for ${capabilityLabel}. A full technical explanation will be generated once the explanation layer is wired.`,
      tradeoffs: 'Tradeoff analysis pending — not yet wired in the Phase 1 baseline.',
      why_not_alternatives: 'Alternative comparison pending — not yet wired in the Phase 1 baseline.',
    }
  })
}
