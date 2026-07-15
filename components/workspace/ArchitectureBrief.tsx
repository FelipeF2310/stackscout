import Link from 'next/link'
import type { Capability } from '@/lib/capabilities/capabilityTypes'
import type { ToolExplanation } from '@/lib/recommendations/explainRecommendation'
import type { CapabilityAlternatives } from '@/lib/recommendations/recommendArchitecture'

interface Props {
  idea: string
  capabilities: Capability[]
  explanations: ToolExplanation[]
  alternatives: CapabilityAlternatives[]
  rationale: string
}

// Right pane: the living (draft) Architecture Brief, populated entirely from the
// existing deterministic recommendation output. No invented product claims — any
// section not derivable from data is a safe default and labeled as such. This is
// a capability-first brief with a simple capabilities → tools map; the richer
// Stack Map is a later enrichment.
export default function ArchitectureBrief({
  idea,
  capabilities,
  explanations,
  alternatives,
  rationale,
}: Props) {
  const explanationFor = (capabilityId: string) =>
    explanations.find((e) => e.capability_ids.includes(capabilityId))
  const alternativesFor = (capabilityId: string) =>
    alternatives.find((a) => a.capability_id === capabilityId)?.alternatives ?? []

  const count = capabilities.length

  // Use specialized guidance only when the complete document-RAG pipeline is
  // selected. Partial pipelines keep the safe generic next step.
  const capabilityIds = new Set(capabilities.map((capability) => capability.capability_id))
  const completeDocumentRag = [
    'llm-api',
    'document-parsing',
    'vector-storage',
    'retrieval',
  ].every((capabilityId) => capabilityIds.has(capabilityId))
  const nextStep = completeDocumentRag
    ? 'Validate the document-RAG path first: parse one representative source, store embeddings, retrieve relevant chunks, and validate a grounded response.'
    : 'Start with the smallest working path through the stack, then refine tools after the first test.'

  // One tradeoff per unique recommended tool (avoid repeating for multi-capability tools).
  const seenTradeoff = new Set<string>()

  // Group capabilities by their recommended tool so a multi-capability tool isn't
  // rendered as duplicate identical rows. Capability-first order is preserved;
  // each row lists the capabilities that tool covers. Capabilities with no tool
  // fall through to a neutral gap row.
  const toolOrder: string[] = []
  const toolGroups = new Map<string, { explanation: ToolExplanation; capNames: string[] }>()
  const gapCapNames: string[] = []
  for (const cap of capabilities) {
    const e = explanationFor(cap.capability_id)
    if (!e) {
      gapCapNames.push(cap.name)
      continue
    }
    if (!toolGroups.has(e.tool_id)) {
      toolGroups.set(e.tool_id, { explanation: e, capNames: [] })
      toolOrder.push(e.tool_id)
    }
    toolGroups.get(e.tool_id)!.capNames.push(cap.name)
  }

  return (
    <section className="overflow-auto bg-background">
      <div className="max-w-[640px] p-6 md:p-8 space-y-7">
        {/* brief header */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">Architecture Brief</h1>
            <span className="text-[11px] rounded-full border px-2 py-0.5 text-muted-foreground">
              Draft · deterministic
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            A living draft from StackScout&apos;s analysis. It updates as the conversation evolves.
          </p>
        </div>

        {/* what you're building */}
        <section className="space-y-2">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            What you&apos;re building
          </h2>
          <p className="text-[15px] leading-relaxed">{idea}</p>
          {rationale && <p className="text-sm text-muted-foreground leading-relaxed">{rationale}</p>}
        </section>

        {/* scope — safe defaults */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              In scope (v1)
            </h2>
            <ul className="text-sm space-y-1 list-disc pl-4">
              <li>
                The {count} {count === 1 ? 'capability' : 'capabilities'} below, each wired with its
                recommended tool.
              </li>
              <li>A working path from idea to a runnable starting architecture.</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Out of scope (deliberately)
            </h2>
            <ul className="text-sm space-y-1 list-disc pl-4 text-muted-foreground">
              <li>Anything your description didn&apos;t imply — added only when you ask.</li>
              <li>Production hardening, scale, and ops beyond a first cut.</li>
            </ul>
          </div>
          <p className="sm:col-span-2 text-xs text-[hsl(var(--faint))]">
            Scope shown as safe defaults — refine them in the conversation.
          </p>
        </section>

        {/* capabilities → recommended tool */}
        <section className="space-y-2">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Capabilities → recommended tool
          </h2>
          <div className="border rounded-lg divide-y">
            {toolOrder.map((toolId) => {
              const group = toolGroups.get(toolId)!
              return (
                <div
                  key={toolId}
                  data-brief-row={toolId}
                  className="grid grid-cols-[150px_1fr] gap-3 p-3 items-baseline"
                >
                  <span className="text-sm text-muted-foreground">{group.capNames.join(', ')}</span>
                  <span className="text-sm">
                    <Link href={`/tools/${toolId}`} className="font-mono font-medium hover:underline">
                      {toolId}
                    </Link>
                    {group.explanation.simple && (
                      <span className="text-muted-foreground"> — {group.explanation.simple}</span>
                    )}
                  </span>
                </div>
              )
            })}
            {gapCapNames.map((name) => (
              <div
                key={name}
                data-brief-row="gap"
                className="grid grid-cols-[150px_1fr] gap-3 p-3 items-baseline"
              >
                <span className="text-sm text-muted-foreground">{name}</span>
                <span className="text-sm text-[hsl(var(--faint))]">No tool in the curated corpus yet.</span>
              </div>
            ))}
          </div>
        </section>

        {/* simple capability-first map */}
        <section className="space-y-2">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Capability-first map
          </h2>
          <div className="flex flex-wrap items-center gap-1.5 text-[13px]">
            {capabilities.map((cap, i) => (
              <span key={cap.capability_id} className="flex items-center gap-1.5">
                <span className="rounded-md border bg-[hsl(var(--accent-soft))] border-[hsl(var(--accent-bd))] text-[hsl(var(--accent))] px-2 py-1">
                  {cap.name}
                </span>
                {i < capabilities.length - 1 && <span className="text-[hsl(var(--faint))]">→</span>}
              </span>
            ))}
          </div>
          <p className="text-xs text-[hsl(var(--faint))]">
            A simple capability-first view. The richer interactive map is a later enrichment.
          </p>
        </section>

        {/* pairings, tradeoffs & alternatives */}
        <section className="space-y-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Pairings, tradeoffs &amp; alternatives
          </h2>
          <div className="space-y-3">
            {explanations.map((e) => {
              if (seenTradeoff.has(e.tool_id)) return null
              seenTradeoff.add(e.tool_id)
              const alts = e.capability_ids.flatMap((cid) => alternativesFor(cid))
              const seenAlt = new Set<string>()
              const uniqueAlts = alts.filter((a) =>
                seenAlt.has(a.tool_id) ? false : (seenAlt.add(a.tool_id), true)
              )
              return (
                <div key={e.tool_id} className="text-sm space-y-1">
                  <div>
                    <span className="font-mono font-medium">{e.tool_id}</span>
                    <span className="text-muted-foreground"> — {e.tradeoff}</span>
                  </div>
                  {e.best_for.length > 0 && (
                    <div className="text-muted-foreground">
                      <span className="font-medium">Good fit when:</span>{' '}
                      {e.best_for.join('; ')}
                    </div>
                  )}
                  {e.avoid_if.length > 0 && (
                    <div className="text-muted-foreground">
                      <span className="font-medium">Consider another option if:</span>{' '}
                      {e.avoid_if.join('; ')}
                    </div>
                  )}
                  {e.fits_with && (
                    <div className="text-muted-foreground">
                      <span aria-hidden className="text-[hsl(var(--accent))]">
                        ↔
                      </span>{' '}
                      {e.fits_with}
                    </div>
                  )}
                  {uniqueAlts.length > 0 && (
                    <div className="text-muted-foreground">
                      <span className="font-medium">Alternatives:</span>{' '}
                      {uniqueAlts.map((a, idx) => (
                        <span key={a.tool_id}>
                          {idx > 0 && '; '}
                          <Link href={`/tools/${a.tool_id}`} className="font-mono hover:underline">
                            {a.tool_id}
                          </Link>
                          {a.reason_not_selected && <span> — {a.reason_not_selected}</span>}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* next step — clearly a draft */}
        <section className="space-y-1.5 border-l-2 pl-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Next step (draft)
          </h2>
          <p className="text-sm">{nextStep}</p>
        </section>
      </div>
    </section>
  )
}
