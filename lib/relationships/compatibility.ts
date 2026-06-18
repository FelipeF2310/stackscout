import { getRelationshipsBetween } from './relationshipGraph'

export interface CompatibilityResult {
  compatible: boolean
  confidence: number
  reason: string | null
}

export function checkCompatibility(toolIdA: string, toolIdB: string): CompatibilityResult {
  const relationships = getRelationshipsBetween(toolIdA, toolIdB)

  const compatibleRelationship = relationships.find(
    (r) => r.relationship_type === 'compatible-with' || r.relationship_type === 'commonly-used-with'
  )

  if (compatibleRelationship) {
    return {
      compatible: true,
      confidence: compatibleRelationship.confidence_score,
      reason: null,
    }
  }

  return {
    compatible: true,
    confidence: 0.5,
    reason: null,
  }
}

export function scoreCompatibilityForStack(selectedToolIds: string[]): number {
  if (selectedToolIds.length < 2) return 1

  let totalScore = 0
  let pairCount = 0

  for (let i = 0; i < selectedToolIds.length; i++) {
    for (let j = i + 1; j < selectedToolIds.length; j++) {
      const result = checkCompatibility(selectedToolIds[i], selectedToolIds[j])
      totalScore += result.confidence
      pairCount++
    }
  }

  return pairCount > 0 ? totalScore / pairCount : 1
}
