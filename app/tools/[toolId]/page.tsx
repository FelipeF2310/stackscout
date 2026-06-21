import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buildToolPageData, getAllToolIds } from '@/lib/tools/toolPage'

interface Props {
  params: Promise<{ toolId: string }>
}

// Pre-render a static page per tool in the corpus. Unknown ids fall through to
// notFound() (Next renders them on demand and 404s) — build-safe either way.
export function generateStaticParams() {
  return getAllToolIds().map((toolId) => ({ toolId }))
}

function pct(score: number): string {
  return `${Math.round(score * 100)}%`
}

export default async function ToolPage({ params }: Props) {
  const { toolId } = await params
  const data = buildToolPageData(toolId)
  if (!data) notFound()

  return (
    <main className="max-w-2xl mx-auto px-4 py-12 space-y-10">
      <div className="space-y-3">
        <Link href="/" className="text-sm text-muted-foreground underline">
          ← Back
        </Link>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{data.tool_id}</h1>
            <p className="text-sm text-muted-foreground">{data.repository_name}</p>
          </div>
          <a
            href={data.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground underline shrink-0"
          >
            GitHub ↗
          </a>
        </div>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Capabilities
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.capabilities.map((cap) => (
            <span
              key={cap.capability_id}
              className="px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground"
            >
              {cap.name}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Why StackScout recommends it
        </h2>
        <p className="text-sm">{data.why}</p>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">Tradeoff: </span>
          {data.tradeoff}
        </p>
      </section>

      {data.notes.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Notes
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.notes.map((note) => (
              <span key={note} className="px-3 py-1 text-xs rounded-full border">
                {note}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Maintenance signals
        </h2>
        <ul className="text-sm space-y-1">
          <li>Maintenance: {pct(data.scores.maintenance)}</li>
          <li>Maturity: {pct(data.scores.maturity)}</li>
          <li>Documentation: {pct(data.scores.documentation)}</li>
        </ul>
      </section>

      {data.compatible_with.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Commonly used with
          </h2>
          <ul className="flex flex-wrap gap-2">
            {data.compatible_with.map((id) => (
              <li key={id}>
                <Link
                  href={`/tools/${id}`}
                  className="px-3 py-1 text-sm rounded-full border hover:bg-muted transition-colors inline-block"
                >
                  {id}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.alternatives.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Alternatives
          </h2>
          <ul className="space-y-1">
            {data.alternatives.map((alt) => (
              <li key={alt.tool_id} className="text-sm">
                <Link href={`/tools/${alt.tool_id}`} className="font-medium hover:underline">
                  {alt.tool_id}
                </Link>
                <span className="text-muted-foreground"> — {alt.reason}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
