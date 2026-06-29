import {
  getRelationshipsBetween,
  getToolsForCapability,
  type CorpusTool,
} from '../corpus/corpus'
import type { Relationship, RelationshipType } from '../relationships/relationshipTypes'

export type AlternativeCandidateSource =
  | 'explicit-relationship'
  | 'fit-comparison'
  | 'capability-peer'

export interface AlternativeCandidate {
  tool: CorpusTool
  source: AlternativeCandidateSource
}

const EXPLICIT_ALTERNATIVE_TYPES = new Set<RelationshipType>([
  'alternative-to',
  'managed-alternative',
  'self-hosted-alternative',
])

const FIT_COMPARISON_TYPES = new Set<RelationshipType>([
  'better-for-beginners',
  'better-for-production',
])

// Recommendation-layer candidate selection. Relationship-backed alternatives
// are preferred, then fit-comparison peers, then generic same-capability peers.
// Compatibility/common-use edges are intentionally not treated as alternatives.
export function getAlternativeCandidatesForCapability(
  selectedToolId: string,
  capabilityId: string,
  limit = 3
): AlternativeCandidate[] {
  const peers = getToolsForCapability(capabilityId)
    .map((tool, index) => ({ tool, index }))
    .filter(({ tool }) => tool.tool_id !== selectedToolId)

  const explicit: RankedCandidate[] = []
  const fitComparison: RankedCandidate[] = []
  const generic: RankedCandidate[] = []

  for (const peer of peers) {
    const relationships = getRelationshipsBetween(selectedToolId, peer.tool.tool_id)
    const explicitRank = bestConfidenceFor(relationships, EXPLICIT_ALTERNATIVE_TYPES)
    if (explicitRank !== null) {
      explicit.push({
        ...peer,
        confidence: explicitRank,
        source: 'explicit-relationship',
      })
      continue
    }

    const fitRank = bestConfidenceFor(relationships, FIT_COMPARISON_TYPES)
    if (fitRank !== null) {
      fitComparison.push({
        ...peer,
        confidence: fitRank,
        source: 'fit-comparison',
      })
      continue
    }

    generic.push({
      ...peer,
      confidence: 0,
      source: 'capability-peer',
    })
  }

  return [
    ...sortRelationshipCandidates(explicit),
    ...sortRelationshipCandidates(fitComparison),
    ...generic,
  ]
    .filter(uniqueByToolId())
    .slice(0, limit)
    .map(({ tool, source }) => ({ tool, source }))
}

interface RankedCandidate {
  tool: CorpusTool
  index: number
  confidence: number
  source: AlternativeCandidateSource
}

function bestConfidenceFor(
  relationships: Relationship[],
  relationshipTypes: Set<RelationshipType>
): number | null {
  const matches = relationships.filter((relationship) =>
    relationshipTypes.has(relationship.relationship_type)
  )
  if (matches.length === 0) return null
  return Math.max(...matches.map((relationship) => relationship.confidence_score))
}

function sortRelationshipCandidates(candidates: RankedCandidate[]): RankedCandidate[] {
  return [...candidates].sort((a, b) => b.confidence - a.confidence || a.index - b.index)
}

function uniqueByToolId() {
  const seen = new Set<string>()
  return (candidate: RankedCandidate) => {
    if (seen.has(candidate.tool.tool_id)) return false
    seen.add(candidate.tool.tool_id)
    return true
  }
}
