import type {
  CapabilityEvidence,
  DetectionSignal,
} from '@/lib/capabilities/detectCapabilities'

interface Props {
  evidence: CapabilityEvidence[]
}

// Detection transparency (PR 2). Shows what StackScout *detected* from the
// project description — direct matches read as confirmed, inferred matches read
// as assumptions, and the fallback floor reads as an explicit default guess.
// This is deliberately NOT an intent paraphrase: it never claims to fully
// understand the project. Pure presentation over the resolved capability
// evidence; recommendation selection and scoring remain elsewhere.

type Status = 'detected' | 'assumption' | 'confirmed' | 'default'

const STATUS_LABEL: Record<Status, string> = {
  detected: 'Detected',
  assumption: 'Assumption',
  confirmed: 'Confirmed by you',
  default: 'Default guess',
}

function statusOf(e: CapabilityEvidence): Status {
  if (e.origin === 'assumed-floor') return 'default'
  if (e.origin === 'clarified') return 'confirmed'
  if (e.signals.some((s) => s.type === 'clarified')) return 'confirmed'
  return e.signals.some((s) => s.type === 'direct') ? 'detected' : 'assumption'
}

// De-dupe display phrases within a capability — UI only, the evidence model is
// untouched. A phrase confirmed by a direct signal wins over the same phrase
// seen only as an inferred one (case-insensitive).
function dedupeSignals(signals: DetectionSignal[]): DetectionSignal[] {
  const seen = new Map<string, DetectionSignal>()
  for (const s of signals) {
    const key = s.phrase.toLowerCase()
    const prev = seen.get(key)
    if (!prev || (prev.type === 'inferred' && s.type === 'direct')) {
      seen.set(key, s)
    }
  }
  return Array.from(seen.values())
}

export default function DetectionTransparency({ evidence }: Props) {
  if (evidence.length === 0) return null

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          How StackScout read your description
        </h2>
        <p className="text-xs text-muted-foreground">
          The capabilities found in your description. Direct matches come straight from your
          words; the rest are assumptions you can adjust — StackScout doesn&apos;t claim to fully
          understand your project.
        </p>
      </div>

      <ul className="space-y-3">
        {evidence.map((e) => {
          const status = statusOf(e)
          const signals = dedupeSignals(e.signals)

          return (
            <li
              key={e.capability.capability_id}
              className="rounded-lg border p-3 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{e.capability.name}</span>
                <span
                  className={
                    status === 'detected'
                      ? 'text-[11px] uppercase tracking-wider rounded-full px-2 py-0.5 bg-secondary text-secondary-foreground'
                      : 'text-[11px] uppercase tracking-wider rounded-full px-2 py-0.5 border border-dashed text-muted-foreground'
                  }
                >
                  {STATUS_LABEL[status]}
                </span>
              </div>

              {status === 'default' ? (
                <p className="text-xs text-muted-foreground">
                  No specific capability matched your description, so StackScout assumed you at
                  least need {e.capability.name} to render the app. Add more detail to refine this.
                </p>
              ) : (
                <ul className="space-y-1">
                  {signals.map((s) => (
                    <li key={`${s.type}:${s.phrase}`} className="text-sm">
                      {s.type === 'direct' ? (
                        <span className="text-foreground">
                          <span className="font-mono text-xs px-1 py-0.5 rounded bg-secondary text-secondary-foreground">
                            &ldquo;{s.phrase}&rdquo;
                          </span>{' '}
                          &rarr; <span className="font-medium">{e.capability.name}</span>
                        </span>
                      ) : s.type === 'clarified' ? (
                        <span className="text-muted-foreground">
                          <span className="font-mono text-xs px-1 py-0.5 rounded border border-dashed">
                            &ldquo;{s.phrase}&rdquo;
                          </span>{' '}
                          confirms <span className="font-medium">{e.capability.name}</span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          <span className="font-mono text-xs px-1 py-0.5 rounded border border-dashed">
                            &ldquo;{s.phrase}&rdquo;
                          </span>{' '}
                          suggests <span className="font-medium">{e.capability.name}</span>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
