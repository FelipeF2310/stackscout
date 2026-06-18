import { getAlternatives } from '../relationships/relationshipGraph'
import { getToolById } from '../seed/loadSeed'
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
  return getAlternatives(selectedToolId)
    .filter((id) => id !== selectedToolId)
    .filter((id) => getToolById(id)?.capability_ids.includes(capabilityId))
    .slice(0, 3)
    .map((id) => ({
      tool_id: id,
      reason_not_selected: alternativeReason(selectedToolId, id, capabilityId),
    }))
}
