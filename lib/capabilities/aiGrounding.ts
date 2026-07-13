import { getCapabilityById } from './capabilityTaxonomy'
import type { CapabilityEvidence, DetectionSignal } from './detectCapabilities'

export type AiGrounding =
  | 'product-sources'
  | 'general-knowledge'
  | 'both'
  | 'default'

export interface AiGroundingQuestion {
  id: 'ai-grounding'
  prompt: string
  choices: readonly {
    value: AiGrounding
    label: string
  }[]
}

export interface AiGroundingResolution {
  effectiveGrounding: AiGrounding | undefined
  question: AiGroundingQuestion | null
  evidence: CapabilityEvidence[]
}

export const AI_GROUNDING_QUESTION: AiGroundingQuestion = {
  id: 'ai-grounding',
  prompt:
    'Will the product you’re building answer from its own documents or sources, general model knowledge, or both?',
  choices: [
    { value: 'product-sources', label: 'Use the product’s own sources' },
    { value: 'general-knowledge', label: 'Use general model knowledge' },
    { value: 'both', label: 'Use both' },
    { value: 'default', label: 'Not sure — use a sensible default' },
  ],
}

const SOURCE_DOCUMENT_SIGNALS = new Set([
  'pdf',
  'document',
  'documents',
  'docx',
  'word file',
  'spreadsheet',
])

/**
 * Select the one approved v1 clarification. The answer is intentionally
 * deterministic: the question appears only for an AI product whose grounding
 * is unresolved by direct source language or a strong source-grounding shape.
 */
export function getAiGroundingQuestion(
  evidence: CapabilityEvidence[],
  grounding: AiGrounding | undefined
): AiGroundingQuestion | null {
  if (!isAiGroundingEligible(evidence)) return null
  if (grounding !== undefined) return null
  return AI_GROUNDING_QUESTION
}

/**
 * A grounding answer is meaningful only for an AI prompt whose source policy
 * has not already been settled by authoritative detector or shape evidence.
 */
export function isAiGroundingEligible(evidence: CapabilityEvidence[]): boolean {
  const hasAiIntent = evidence.some(
    (entry) => entry.capability.capability_id === 'llm-api'
  )
  return hasAiIntent && !hasAuthoritativeSourceGrounding(evidence)
}

/** Resolve raw URL state into the only grounding state allowed to affect UI or recommendations. */
export function resolveAiGrounding(
  evidence: CapabilityEvidence[],
  grounding: AiGrounding | undefined
): AiGroundingResolution {
  const effectiveGrounding = isAiGroundingEligible(evidence) ? grounding : undefined
  return {
    effectiveGrounding,
    question: getAiGroundingQuestion(evidence, effectiveGrounding),
    evidence: applyAiGrounding(evidence, effectiveGrounding),
  }
}

/**
 * Apply a user-confirmed grounding answer to detector evidence before the
 * recommendation pipeline consumes it. This keeps the rendered evidence and
 * selected architecture on one capability-resolution path.
 */
export function applyAiGrounding(
  evidence: CapabilityEvidence[],
  grounding: AiGrounding | undefined
): CapabilityEvidence[] {
  if (grounding === undefined || !isAiGroundingEligible(evidence)) return evidence

  const next = evidence.map((entry) => ({ ...entry, signals: [...entry.signals] }))

  if (grounding === 'product-sources' || grounding === 'both') {
    removeInferredOnlyVectorStorage(next)
    addClarifiedRetrieval(next, grounding)
    return next
  }

  // A general/default answer must not leave half of a chatbot-derived RAG
  // stack behind. Preserve direct or shape-backed source requirements.
  return next.filter((entry) => {
    if (!['retrieval', 'vector-storage'].includes(entry.capability.capability_id)) return true
    return !isInferredOnlySourceCapability(entry)
  })
}

function removeInferredOnlyVectorStorage(evidence: CapabilityEvidence[]): void {
  const index = evidence.findIndex(
    (entry) =>
      entry.capability.capability_id === 'vector-storage' &&
      isInferredOnlySourceCapability(entry)
  )
  if (index >= 0) evidence.splice(index, 1)
}

function hasAuthoritativeSourceGrounding(evidence: CapabilityEvidence[]): boolean {
  const retrieval = findEvidence(evidence, 'retrieval')
  if (retrieval?.signals.some(isDirectOrShapeSignal)) return true

  const vectorStorage = findEvidence(evidence, 'vector-storage')
  if (vectorStorage?.signals.some(isDirectOrShapeSignal)) return true

  const documentParsing = findEvidence(evidence, 'document-parsing')
  return Boolean(
    documentParsing?.signals.some(
      (signal) => signal.type === 'direct' && SOURCE_DOCUMENT_SIGNALS.has(signal.phrase)
    )
  )
}

function addClarifiedRetrieval(
  evidence: CapabilityEvidence[],
  grounding: Extract<AiGrounding, 'product-sources' | 'both'>
) {
  const signal = clarifiedSignal(grounding)
  const existing = findEvidence(evidence, 'retrieval')
  if (existing) {
    if (!existing.signals.some((item) => item.type === 'clarified')) {
      existing.signals.push(signal)
    }
    return
  }

  const capability = getCapabilityById('retrieval')
  if (capability) {
    evidence.push({ capability, signals: [signal], origin: 'clarified' })
  }
}

function clarifiedSignal(
  grounding: Extract<AiGrounding, 'product-sources' | 'both'>
): DetectionSignal {
  const phrase = grounding === 'both' ? 'use both' : 'use the product’s own sources'
  return {
    phrase,
    type: 'clarified',
    rationale: 'you confirmed that the product should answer from its own sources',
  }
}

function isInferredOnlySourceCapability(entry: CapabilityEvidence): boolean {
  return entry.signals.length > 0 && entry.signals.every((signal) => !isDirectOrShapeSignal(signal))
}

function isDirectOrShapeSignal(signal: DetectionSignal): boolean {
  return (
    signal.type === 'direct' ||
    (signal.type === 'inferred' && signal.rationale !== undefined)
  )
}

function findEvidence(
  evidence: CapabilityEvidence[],
  capabilityId: string
): CapabilityEvidence | undefined {
  return evidence.find((entry) => entry.capability.capability_id === capabilityId)
}
