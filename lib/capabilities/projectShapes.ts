import { compilePhrase } from './keywordMatcher'
import type { DetectionSignal } from './detectCapabilities'

// Project-shape inference (first slice).
//
// Keyword detection hears what users *say*; this layer hears what they *name*.
// When a prompt names a product artifact — a support inbox, a documentation
// site — the artifact's definition entails supporting capabilities that no
// keyword states: an inbox IS stored threads plus an operator screen.
//
// Rule-admission checklist (every rule must satisfy all of these before it is
// added — a shape without documented non-examples is keyword stuffing):
//   1. Entailment, not correlation: the artifact's definition requires the
//      capability ("an inbox stores threads"), not "apps like this usually
//      have it" ("SaaS apps usually take payments").
//   2. Nouns, not verbs: "support inbox" can infer state; "summarize emails"
//      cannot.
//   3. Compound cues only: bare common words ("inbox", "site", "review")
//      never trigger a rule.
//   4. An authored one-line rationale per inferred capability, carried on the
//      evidence signal.
//   5. Negative tests in tests/capabilities/projectShapes.test.ts proving the
//      lookalike phrasings do not fire.
//   6. A demonstrated miss in a prompt review — no speculative rules.
//
// Categories are internal organization only (surface = user/operator-facing
// interface, state = persisted records/status, source-grounding = answering
// from retrieved material, access = gated/restricted usage). They are never
// user-facing capabilities.

export type ShapeCategory = 'surface' | 'state' | 'source-grounding' | 'access'

export interface ShapeInference {
  capability_id: string
  rationale: string
}

// Windowed proximity: the cue must adjectivally qualify one of the nouns —
// cue first, at most `maxIntervening` words between, then the noun. Chosen
// over loose co-occurrence (which fired on trap prompts like "refactor the
// internal logic of our dashboard app") and strict compounds (which missed
// "internal analytics dashboard"). Cue and nouns must be plain words; the
// compiled pattern is built locally here, not in keywordMatcher.
export interface ShapeProximity {
  cue: string
  nouns: string[]
  maxIntervening: number
}

export interface ShapeRule {
  id: string
  category: ShapeCategory
  // Simple cues: any one firing activates the rule (boundary-safe,
  // plural-tolerant via compilePhrase).
  cues?: string[]
  // Windowed proximity matching (see ShapeProximity). A rule uses cues,
  // proximity, or both; it fires when any of them match.
  proximity?: ShapeProximity
  infers: ShapeInference[]
}

export const SHAPE_RULES: ShapeRule[] = [
  {
    id: 'documentation-site',
    category: 'surface',
    cues: ['documentation site', 'docs site', 'documentation website', 'developer docs'],
    infers: [
      {
        capability_id: 'frontend-framework',
        rationale: 'a documentation site is a rendered, navigable surface',
      },
    ],
  },
  {
    id: 'support-inbox',
    category: 'state',
    cues: ['support inbox', 'shared inbox', 'team inbox', 'customer email inbox', 'support queue'],
    infers: [
      {
        capability_id: 'frontend-framework',
        rationale: 'an inbox is an operator-facing screen',
      },
      {
        capability_id: 'database',
        rationale: 'an inbox stores threads, status, and assignment',
      },
    ],
  },
  {
    id: 'admin-review',
    category: 'state',
    cues: ['admin review', 'review queue', 'approval queue', 'approval workflow', 'submission status'],
    infers: [
      {
        capability_id: 'database',
        rationale: 'review/approval implies persisted status state',
      },
    ],
  },
  {
    id: 'source-grounded-answering',
    category: 'source-grounding',
    cues: [
      'answers questions from',
      'answer questions from',
      'cite sources',
      'cited sources',
      'source-grounded',
      'grounded answers',
    ],
    infers: [
      {
        capability_id: 'retrieval',
        rationale: 'answering from sources requires retrieving them',
      },
    ],
  },
  {
    // Migrated from the bare 'internal' auth keyword (detector hardening
    // deferred this policy decision). Fires only when 'internal' adjectivally
    // qualifies a software/content noun — "internal tool", "internal
    // analytics dashboard", "internal company documents" — never on internal
    // code-talk ("internal API refactor", "internal logic"). 'staff' and
    // 'operator' cues are deliberately deferred until a prompt review
    // demonstrates a miss. 'team' remains excluded from auth entirely.
    id: 'internal-gated-access',
    category: 'access',
    proximity: {
      cue: 'internal',
      nouns: [
        'tool', 'tools', 'dashboard', 'dashboards', 'portal', 'portals',
        'console', 'consoles', 'app', 'apps', 'docs', 'document', 'documents',
      ],
      maxIntervening: 1,
    },
    infers: [
      {
        capability_id: 'auth',
        rationale: 'internal-only software implies gated access',
      },
    ],
  },
]

// --- compiled once at module load, same as the keyword map ---

interface CompiledShapeRule {
  rule: ShapeRule
  cues: RegExp[]
  proximity?: RegExp
}

// Cue word, up to maxIntervening words, then a qualifying noun. The parts are
// authored plain words, so no regex escaping is needed here.
function compileProximity(p: ShapeProximity): RegExp {
  return new RegExp(
    `\\b${p.cue}(?:\\s+\\w+){0,${p.maxIntervening}}\\s+(?:${p.nouns.join('|')})\\b`
  )
}

const COMPILED_RULES: CompiledShapeRule[] = SHAPE_RULES.map((rule) => ({
  rule,
  cues: (rule.cues ?? []).map((cue) => compilePhrase(cue)),
  proximity: rule.proximity ? compileProximity(rule.proximity) : undefined,
}))

/**
 * Evaluate the shape rules against a project description. Pure and
 * corpus-free: no taxonomy lookup, no relationship graph, no seed data.
 * Returns signals grouped by capability id, in rule/inference order. A rule
 * contributes one signal per inferred capability, using the first matching
 * cue's actual matched text as the evidence phrase.
 */
export function evaluateProjectShapes(
  projectDescription: string
): Map<string, DetectionSignal[]> {
  const text = projectDescription.toLowerCase()
  const byCapability = new Map<string, DetectionSignal[]>()

  for (const { rule, cues, proximity } of COMPILED_RULES) {
    let cueText: string | null = null
    for (const cue of cues) {
      const match = cue.exec(text)
      if (match) {
        cueText = match[0]
        break
      }
    }
    if (!cueText && proximity) {
      const match = proximity.exec(text)
      if (match) cueText = match[0]
    }
    if (!cueText) continue

    for (const inference of rule.infers) {
      const signals = byCapability.get(inference.capability_id) ?? []
      signals.push({ phrase: cueText, type: 'inferred', rationale: inference.rationale })
      byCapability.set(inference.capability_id, signals)
    }
  }

  return byCapability
}
