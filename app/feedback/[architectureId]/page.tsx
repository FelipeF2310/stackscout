import Link from 'next/link'

interface Props {
  params: Promise<{ architectureId: string }>
}

// Phase 1 baseline: persistence is parked, so there is no architecture to load
// for the outcome survey yet. This is a static placeholder. When the data layer
// lands, this page will load the architecture and render OutcomeSurvey.
export default async function FeedbackPage({ params }: Props) {
  const { architectureId } = await params

  return (
    <main className="max-w-2xl mx-auto px-4 py-12 space-y-4">
      <h1 className="text-2xl font-bold">Outcome survey</h1>
      <p className="text-sm text-muted-foreground">
        The 14-day outcome survey is not available in this Phase 1 baseline yet —
        persistence is parked until the data layer is decided. Requested
        architecture: <span className="font-mono">{architectureId}</span>.
      </p>
      <Link href="/" className="text-sm underline">
        Back to start
      </Link>
    </main>
  )
}
