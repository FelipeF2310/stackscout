import { redirect } from 'next/navigation'
import LandingHero from '@/components/landing/LandingHero'

interface Props {
  searchParams: Promise<{ q?: string }>
}

// `/` is the canonical Start screen. Submitting enters the conversational
// workspace at /workspace?idea=... — the old stacked-results shell is gone.
// Any legacy /?q=<idea> link is redirected into the workspace so that path can
// never render the old shell.
export default async function HomePage({ searchParams }: Props) {
  const { q } = await searchParams
  const idea = q?.trim() ?? ''

  if (idea.length > 0) {
    redirect(`/workspace?idea=${encodeURIComponent(idea)}`)
  }

  return <LandingHero />
}
