export type RelationshipType =
  | 'compatible-with'
  | 'alternative-to'
  | 'commonly-used-with'
  | 'better-for-beginners'
  | 'better-for-production'
  | 'managed-alternative'
  | 'self-hosted-alternative'

export const RELATIONSHIP_DESCRIPTIONS: Record<RelationshipType, string> = {
  'compatible-with': 'These tools work well together without configuration friction.',
  'alternative-to': 'These tools serve the same capability and can replace each other.',
  'commonly-used-with': 'These tools are frequently chosen together in practice.',
  'better-for-beginners': 'Source tool is easier to adopt than target for new builders.',
  'better-for-production': 'Source tool is more suitable for production workloads than target.',
  'managed-alternative': 'Source tool is a managed (hosted) version of what target offers self-hosted.',
  'self-hosted-alternative': 'Source tool is a self-hosted version of what target offers managed.',
}

export interface Relationship {
  relationship_id: string
  source_tool_id: string
  target_tool_id: string
  relationship_type: RelationshipType
  confidence_score: number
  source_of_truth: 'manual'
}
