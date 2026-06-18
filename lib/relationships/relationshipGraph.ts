import type { Relationship, RelationshipType } from './relationshipTypes'

let _graph: Relationship[] | null = null

export function loadRelationshipGraph(relationships: Relationship[]): void {
  _graph = relationships
}

function getGraph(): Relationship[] {
  if (!_graph) throw new Error('Relationship graph not loaded. Call loadRelationshipGraph first.')
  return _graph
}

export function getRelationshipsForTool(toolId: string): Relationship[] {
  return getGraph().filter(
    (r) => r.source_tool_id === toolId || r.target_tool_id === toolId
  )
}

export function getRelationshipsBetween(
  toolIdA: string,
  toolIdB: string
): Relationship[] {
  return getGraph().filter(
    (r) =>
      (r.source_tool_id === toolIdA && r.target_tool_id === toolIdB) ||
      (r.source_tool_id === toolIdB && r.target_tool_id === toolIdA)
  )
}

export function getAlternatives(toolId: string): string[] {
  return getGraph()
    .filter(
      (r) =>
        r.relationship_type === 'alternative-to' &&
        (r.source_tool_id === toolId || r.target_tool_id === toolId)
    )
    .map((r) => (r.source_tool_id === toolId ? r.target_tool_id : r.source_tool_id))
}

export function getCommonPairings(toolId: string): string[] {
  return getGraph()
    .filter(
      (r) =>
        r.relationship_type === 'commonly-used-with' &&
        (r.source_tool_id === toolId || r.target_tool_id === toolId)
    )
    .map((r) => (r.source_tool_id === toolId ? r.target_tool_id : r.source_tool_id))
}

export function getRelationshipsByType(type: RelationshipType): Relationship[] {
  return getGraph().filter((r) => r.relationship_type === type)
}
