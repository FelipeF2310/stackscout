import { outcomeSchema } from '../validation/recommendationSchema'
import type { OutcomeData } from '../validation/recommendationSchema'

// Phase 1 baseline: validates an outcome submission and returns the parsed
// value. Persistence is intentionally parked until the data layer (database)
// is decided — see docs/DECISIONS/004-outcome-tracking.md. When persistence
// lands, this is the single place to write the validated outcome.

export function recordOutcome(data: OutcomeData): OutcomeData {
  return outcomeSchema.parse(data)
}
