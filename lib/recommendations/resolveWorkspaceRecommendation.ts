import { resolveAiGrounding } from '../capabilities/aiGrounding'
import { detectCapabilitiesWithEvidence } from '../capabilities/detectCapabilities'
import {
  recommendArchitecture,
  type RecommendationResult,
} from './recommendArchitecture'
import type { RefinementContext } from './generateArchitecture'

export interface WorkspaceRecommendationResolution {
  refinementContext: RefinementContext
  evidence: ReturnType<typeof detectCapabilitiesWithEvidence>
  clarification: ReturnType<typeof resolveAiGrounding>['question']
  result: RecommendationResult | null
}

/**
 * Resolve URL-backed grounding state before the workspace renders or recommends.
 * Ineligible stale answers are deliberately omitted from the effective context.
 */
export async function resolveWorkspaceRecommendation(
  idea: string,
  requestedRefinementContext: RefinementContext
): Promise<WorkspaceRecommendationResolution> {
  const detectedEvidence = detectCapabilitiesWithEvidence(idea)
  const groundingResolution = resolveAiGrounding(
    detectedEvidence,
    requestedRefinementContext.aiGrounding
  )
  const refinementContext = { ...requestedRefinementContext }

  if (groundingResolution.effectiveGrounding) {
    refinementContext.aiGrounding = groundingResolution.effectiveGrounding
  } else {
    delete refinementContext.aiGrounding
  }

  const clarification = groundingResolution.question
  const result = clarification
    ? null
    : await recommendArchitecture(idea, refinementContext)

  return {
    refinementContext,
    evidence: groundingResolution.evidence,
    clarification,
    result,
  }
}
