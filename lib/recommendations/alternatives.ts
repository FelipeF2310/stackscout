import { getAlternatives } from '../relationships/relationshipGraph'

export interface AlternativeTool {
  tool_id: string
  reason_not_selected: string
}

export async function getAlternativesForTool(
  primaryToolId: string,
  selectedToolId: string
): Promise<AlternativeTool[]> {
  const alternativeIds = getAlternatives(selectedToolId)

  return alternativeIds
    .filter((id) => id !== primaryToolId)
    .slice(0, 3)
    .map((id) => ({
      tool_id: id,
      reason_not_selected: '',
    }))
}
