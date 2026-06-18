import Link from 'next/link'

// Phase 1 baseline: persistence is parked, so there are no saved architectures
// to list yet. This is a static placeholder. When the data layer lands, this
// page will query and list saved architectures.
export default function SavedPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 space-y-4">
      <h1 className="text-2xl font-bold">Saved Architectures</h1>
      <p className="text-sm text-muted-foreground">
        Saving is not available in this Phase 1 baseline yet — persistence is
        parked until the data layer is decided.
      </p>
      <Link href="/" className="text-sm underline">
        Generate one
      </Link>
    </main>
  )
}
