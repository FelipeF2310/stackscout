import { detectCapabilities } from '../capabilities/detectCapabilities'
import { scoreTools } from './scoreTools'
import {
  generateArchitecture,
  type RefinementContext,
  type GeneratedArchitecture,
} from './generateArchitecture'
import {
  explainRecommendation,
  summarizeArchitecture,
  type ToolExplanation,
} from './explainRecommendation'
import { getAlternativesForCapability, type AlternativeTool } from './alternatives'
import { getSeed } from '../seed/loadSeed'

export interface CapabilityAlternatives {
  capability_id: string
  primary_tool_id: string
  alternatives: AlternativeTool[]
}

export interface RecommendationResult {
  architecture: GeneratedArchitecture
  explanations: ToolExplanation[]
  alternatives: CapabilityAlternatives[]
}

// End-to-end deterministic recommendation pipeline (Phase 1 baseline).
//
// Wires the existing pure functions into a single server-side flow against the
// in-memory seed corpus. No LLM, no GitHub, no database, no persistence.
//
//   detectCapabilities -> scoreTools -> generateArchitecture
//                      -> explainRecommendation -> alternatives
//
// Tool selection is capability-first: capabilities are detected first, then a
// tool is chosen per capability by deterministic score. Compatibility is scored
// greedily against the tools already chosen, so neighbouring choices influence
// later ones.

export async function recommendArchitecture(
  projectDescription: string,
  context: RefinementContext = {}
): Promise<RecommendationResult> {
  const { tools } = getSeed() // also ensures the relationship graph is loaded

  // 1. Capabilities first.
  const capabilities = detectCapabilities(projectDescription)

  // 2. Score the corpus per capability. Accumulate the running selection so
  //    compatibility scoring reflects the tools already chosen. Ordered ids
  //    (best first) are handed to the generator, which picks the top per slot.
  const selectedSoFar: string[] = []
  const availableTools: Record<string, string[]> = {}
  for (const capability of capabilities) {
    const scored = scoreTools(tools, capability.capability_id, context, selectedSoFar)
    availableTools[capability.capability_id] = scored.map((s) => s.tool_id)
    if (scored.length > 0) {
      selectedSoFar.push(scored[0].tool_id)
    }
  }

  // 3. Assemble the architecture from the scored selections.
  const architecture = generateArchitecture(
    projectDescription,
    capabilities,
    availableTools,
    context
  )

  // 4. Replace the generic per-architecture rationale with a stack-aware summary
  //    that explains how the chosen tools fit together.
  architecture.architecture_rationale = summarizeArchitecture(architecture, context)

  // 5. Advisor-style explanation for each selected tool.
  const explanations = explainRecommendation(architecture)

  // 6. Alternatives per selected tool — restricted to the same capability.
  const alternatives: CapabilityAlternatives[] = []
  for (const selected of architecture.selected_tools) {
    const alts = getAlternativesForCapability(selected.tool_id, selected.capability_id)
    if (alts.length > 0) {
      alternatives.push({
        capability_id: selected.capability_id,
        primary_tool_id: selected.tool_id,
        alternatives: alts,
      })
    }
  }

  return { architecture, explanations, alternatives }
}
