import { getAlternatives, getRelationshipsBetween } from '../relationships/relationshipGraph'

export interface AlternativeTool {
  tool_id: string
  reason_not_selected: string
}

// Deterministic, one-line reason for why an alternative wasn't the primary pick,
// derived from the relationship graph (no LLM). Prefers a directional edge that
// describes when you'd choose the alternative instead; falls back to a generic
// comparable note. Every alternative gets a reason — bare tool names are not
// acceptable per the alternatives-display rule.
function reasonNotSelected(selectedToolId: string, alternativeId: string): string {
  const edges = getRelationshipsBetween(selectedToolId, alternativeId)

  for (const edge of edges) {
    const alternativeIsSource = edge.source_tool_id === alternativeId
    switch (edge.relationship_type) {
      case 'better-for-beginners':
        if (alternativeIsSource) return 'Easier to adopt if you are newer to this.'
        break
      case 'better-for-production':
        if (alternativeIsSource) return 'Better suited to production workloads.'
        break
      case 'managed-alternative':
        // managed-alternative: the source tool is the managed/hosted option.
        return alternativeIsSource
          ? 'Choose if you prefer a managed, hosted option.'
          : 'Choose if you prefer to self-host.'
      case 'self-hosted-alternative':
        // self-hosted-alternative: the source tool is the self-hosted option.
        return alternativeIsSource
          ? 'Choose if you prefer to self-host.'
          : 'Choose if you prefer a managed, hosted option.'
    }
  }

  return 'Comparable option that fulfills the same capability.'
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
      reason_not_selected: reasonNotSelected(selectedToolId, id),
    }))
}
