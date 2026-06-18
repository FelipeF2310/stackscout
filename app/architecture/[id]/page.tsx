import Link from 'next/link'

interface Props {
  params: Promise<{ id: string }>
}

// Phase 1 baseline: persistence is parked, so there is no architecture to load
// by id yet. This is a static placeholder. When the data layer lands, this page
// will fetch the saved architecture and render the architecture/* components.
export default async function ArchitecturePage({ params }: Props) {
  const { id } = await params

  return (
    <main className="max-w-2xl mx-auto px-4 py-12 space-y-4">
      <h1 className="text-xl font-semibold">Architecture</h1>
      <p className="text-sm text-muted-foreground">
        Saved architectures are not available in this Phase 1 baseline yet —
        persistence is parked until the data layer is decided. Requested id:{' '}
        <span className="font-mono">{id}</span>.
      </p>
      <Link href="/" className="text-sm underline">
        Back to start
      </Link>
    </main>
  )
}
