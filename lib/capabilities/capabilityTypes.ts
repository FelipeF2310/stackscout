export type CapabilityCategory =
  | 'auth'
  | 'data'
  | 'ai'
  | 'infrastructure'
  | 'observability'
  | 'communication'
  | 'payments'
  | 'frontend'

export interface Capability {
  capability_id: string
  name: string
  description: string
  category: CapabilityCategory
}
