import type { GeneratedArchitecture } from './generateArchitecture'

export interface ToolExplanation {
  tool_id: string
  simple: string
  technical: string
  tradeoffs: string
  why_not_alternatives: string
}

// Deterministic explanation generation (Phase 1 baseline).
//
// This intentionally does NOT call an LLM. It returns builder-facing template
// explanations derived from the selected tools and their capabilities. A
// richer, LLM-authored explanation will replace the body later; the copy here
// is written to read as finished guidance, not as a stub.

export function explainRecommendation(
  architecture: GeneratedArchitecture,
  _projectDescription: string
): ToolExplanation[] {
  return architecture.selected_tools.map((tool) => {
    const capabilityLabel = tool.capability_id.replace(/-/g, ' ')
    return {
      tool_id: tool.tool_id,
      simple: `${tool.tool_id} handles ${capabilityLabel} so you don't have to build it from scratch.`,
      technical: `${tool.tool_id} covers ${capabilityLabel} in this stack. Compare it with the alternatives for this capability to weigh the tradeoffs for your context.`,
      tradeoffs: 'Every tool involves tradeoffs — review the alternatives for this capability to see when a different choice would fit better.',
      why_not_alternatives: 'See the alternatives listed for this capability for other options worth considering.',
    }
  })
}
