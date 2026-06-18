import { getToolById, type SeedTool } from '../seed/loadSeed'
import { getAlternatives, getRelationshipsBetween } from '../relationships/relationshipGraph'
import { getCapabilityById } from '../capabilities/capabilityTaxonomy'

// Deterministic copy builders for the recommendation experience (Phase 1).
//
// These compose advisor-style text from seed metadata (managed/self-hosted,
// production-ready, beginner-friendly, docs, ecosystem) and the relationship
// graph (compatible-with / commonly-used-with / better-for-* edges). No LLM.
// The aim is specific, non-generic phrasing that adapts per tool and per stack.

export function capabilityName(capabilityId: string): string {
  return getCapabilityById(capabilityId)?.name ?? capabilityId.replace(/-/g, ' ')
}

/** Non-technical one-liner: what this tool does for you. */
export function simpleLine(tool: SeedTool, capName: string): string {
  return `${tool.tool_id} handles ${capName.toLowerCase()} so you don't have to build it yourself.`
}

/** Why this tool — distinguishing strengths drawn from its attributes. */
export function whyThisTool(tool: SeedTool, capName: string): string {
  const base = tool.managed
    ? 'a managed service, so there is little infrastructure to run yourself'
    : 'self-hosted, so you keep full control of your data and infrastructure'

  const extras: string[] = []
  if (tool.production_ready) extras.push('proven in production')
  if (tool.beginner_friendly) extras.push('approachable if you are newer to this')
  if (tool.documentation_score >= 0.9) extras.push('well-documented')

  const extraText = extras.length ? `, and ${joinList(extras.slice(0, 2))}` : ''
  return `Picked for ${capName.toLowerCase()} because it is ${base}${extraText}.`
}

/** How this tool fits with the rest of the selected stack, via real edges. */
export function fitsWith(toolId: string, otherSelectedIds: string[]): string | null {
  const phrases: { id: string; conf: number; text: string }[] = []

  for (const other of otherSelectedIds) {
    if (other === toolId) continue
    for (const edge of getRelationshipsBetween(toolId, other)) {
      if (edge.relationship_type === 'commonly-used-with') {
        phrases.push({ id: other, conf: edge.confidence_score, text: `commonly used with ${other}` })
      } else if (edge.relationship_type === 'compatible-with') {
        phrases.push({ id: other, conf: edge.confidence_score, text: `compatible with ${other}` })
      }
    }
  }

  if (phrases.length === 0) return null
  phrases.sort((a, b) => b.conf - a.conf)
  const sentence = joinList(phrases.slice(0, 2).map((p) => p.text))
  return capitalize(sentence) + '.'
}

/** A concrete tradeoff the user accepts by choosing this tool. */
export function tradeoff(tool: SeedTool): string {
  if (!tool.production_ready) {
    return 'It is earlier-stage, so validate it on your workload before depending on it in production.'
  }
  if (tool.managed) {
    return 'As a managed service it adds vendor dependency and usage-based cost as you scale.'
  }
  return 'Self-hosting means you operate, secure, and scale it yourself.'
}

/** Alternatives that serve the SAME capability (keeps suggestions capability-first). */
export function sameCapabilityAlternatives(selectedToolId: string, capabilityId: string): string[] {
  return getAlternatives(selectedToolId)
    .filter((id) => id !== selectedToolId)
    .filter((id) => getToolById(id)?.capability_ids.includes(capabilityId))
}

/** One-line "when would I switch?" naming a concrete same-capability alternative. */
export function considerAlternative(selectedToolId: string, capabilityId: string): string | null {
  const alts = sameCapabilityAlternatives(selectedToolId, capabilityId)
  if (alts.length === 0) return null

  for (const altId of alts) {
    for (const edge of getRelationshipsBetween(selectedToolId, altId)) {
      const altIsSource = edge.source_tool_id === altId
      if (edge.relationship_type === 'better-for-beginners' && altIsSource) {
        return `you want an easier on-ramp — try ${altId}.`
      }
      if (edge.relationship_type === 'better-for-production' && altIsSource) {
        return `you need a more production-hardened option — try ${altId}.`
      }
      if (edge.relationship_type === 'managed-alternative' && !altIsSource) {
        return `you would rather self-host — try ${altId}.`
      }
      if (edge.relationship_type === 'self-hosted-alternative' && !altIsSource) {
        return `you would rather use a managed service — try ${altId}.`
      }
    }
  }

  // Fallback: contrast hosting model with the first same-capability alternative.
  const selected = getToolById(selectedToolId)
  const alt = getToolById(alts[0])
  if (selected && alt && selected.managed !== alt.managed) {
    return alt.managed
      ? `you would prefer a managed option — try ${alts[0]}.`
      : `you would prefer to self-host — try ${alts[0]}.`
  }
  return `you want to compare options — ${alts[0]} is a close alternative.`
}

/** Reason an alternative wasn't the primary pick — directional edge or trait contrast. */
export function alternativeReason(
  selectedToolId: string,
  alternativeId: string,
  capabilityId: string
): string {
  for (const edge of getRelationshipsBetween(selectedToolId, alternativeId)) {
    const altIsSource = edge.source_tool_id === alternativeId
    switch (edge.relationship_type) {
      case 'better-for-beginners':
        if (altIsSource) return 'Easier to adopt if you are newer to this.'
        break
      case 'better-for-production':
        if (altIsSource) return 'A more production-hardened option.'
        break
      case 'managed-alternative':
        return altIsSource
          ? 'A managed, hosted option.'
          : 'A self-hosted option if you want more control.'
      case 'self-hosted-alternative':
        return altIsSource
          ? 'A self-hosted option if you want more control.'
          : 'A managed, hosted option.'
    }
  }

  const alt = getToolById(alternativeId)
  const capName = capabilityName(capabilityId).toLowerCase()
  if (alt) {
    const traits: string[] = [alt.managed ? 'managed' : 'self-hosted']
    if (alt.production_ready) traits.push('production-ready')
    else if (alt.beginner_friendly) traits.push('beginner-friendly')
    return `A ${joinList(traits)} option for ${capName}.`
  }
  return `Another option for ${capName}.`
}

// --- small helpers ---

export function joinList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? ''
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
