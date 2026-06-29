import { getAlternativeCandidatesForCapability } from './alternativeCandidates'
import { alternativeReason } from './explanationCopy'

export interface AlternativeTool {
  tool_id: string
  reason_not_selected: string
}

// Alternatives for a selected tool, restricted to those that fulfill the SAME
// capability (keeps the suggestion capability-first — no auth tool shown as a
// database alternative). Each carries a deterministic, specific reason. No LLM.
export function getAlternativesForCapability(
  selectedToolId: string,
  capabilityId: string
): AlternativeTool[] {
  return getAlternativeCandidatesForCapability(selectedToolId, capabilityId).map(
    ({ tool }) => ({
      tool_id: tool.tool_id,
      reason_not_selected: alternativeReason(selectedToolId, tool.tool_id, capabilityId),
    })
  )
}
