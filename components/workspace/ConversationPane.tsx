import type { Capability } from '@/lib/capabilities/capabilityTypes'
import type { CapabilityEvidence } from '@/lib/capabilities/detectCapabilities'
import DetectionTransparency from '../architecture/DetectionTransparency'

interface Props {
  idea: string
  capabilities: Capability[]
  evidence: CapabilityEvidence[]
}

// Left pane: the guided conversation. Foundation = non-interactive — it reflects
// what was understood (echoed idea, Architecture Mode, detected capabilities) and
// shows a review/understanding card. Interactive clarifying questions and real
// refinement are deferred (no RefinementContext changes here).
export default function ConversationPane({ idea, capabilities, evidence }: Props) {
  const count = capabilities.length

  return (
    <section className="border-b lg:border-b-0 lg:border-r bg-[hsl(var(--surface-2))] overflow-auto">
      <div className="p-6 space-y-5 max-w-[560px]">
        {/* echoed idea */}
        <div className="space-y-1.5">
          <div className="font-mono text-[10px] tracking-widest uppercase text-[hsl(var(--clay))]">
            You
          </div>
          <div className="rounded-xl border border-[hsl(var(--clay-bd))] bg-[hsl(var(--clay-soft))] px-4 py-3 text-[15px] text-[hsl(20_45%_24%)]">
            {idea}
          </div>
        </div>

        {/* Architecture Mode marker + capability-first reasoning */}
        <div className="rounded-xl border border-[hsl(var(--accent-bd))] bg-[hsl(var(--accent-soft))] px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[hsl(var(--accent))]">
            <span aria-hidden>⇄</span> Architecture Mode
          </div>
          <p className="mt-1.5 text-[13.5px] text-muted-foreground">
            Before tools, your idea breaks down into{' '}
            <span className="font-medium text-foreground">
              {count} {count === 1 ? 'capability' : 'capabilities'}
            </span>
            . Tools are how each one gets filled — so you compare like-for-like, not repo-against-repo.
          </p>
        </div>

        {/* reflected capabilities */}
        <DetectionTransparency evidence={evidence} />

        {/* non-interactive review / understanding card */}
        <div className="rounded-xl border p-4 space-y-2">
          <div className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
            Review
          </div>
          <p className="text-sm">
            Reviewed your idea and detected {count}{' '}
            {count === 1 ? 'capability' : 'capabilities'}. A draft Architecture Brief is on the right.
          </p>
          <p className="text-xs text-[hsl(var(--faint))]">
            Clarifying questions &amp; refinement are coming next — this draft uses StackScout&apos;s
            deterministic analysis as a starting point.
          </p>
        </div>
      </div>
    </section>
  )
}
