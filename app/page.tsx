import ProjectPrompt from '@/components/prompt/ProjectPrompt'
import ArchitectureSummary from '@/components/architecture/ArchitectureSummary'
import DetectionTransparency from '@/components/architecture/DetectionTransparency'
import RecommendedStack from '@/components/architecture/RecommendedStack'
import AlternativeTools from '@/components/architecture/AlternativeTools'
import { recommendArchitecture } from '@/lib/recommendations/recommendArchitecture'
import { detectCapabilitiesWithEvidence } from '@/lib/capabilities/detectCapabilities'

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function HomePage({ searchParams }: Props) {
  const { q } = await searchParams
  const projectDescription = q?.trim() ?? ''
  const hasQuery = projectDescription.length >= 10

  const result = hasQuery ? await recommendArchitecture(projectDescription) : null
  // Detection transparency reads the same description the recommendation used,
  // so what we show as "detected" matches what was recommended.
  const evidence = result ? detectCapabilitiesWithEvidence(projectDescription) : null

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 space-y-12">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">StackScout</h1>
          <p className="text-muted-foreground text-lg">
            Describe what you&apos;re building. Get the architecture you need.
          </p>
        </div>
        <ProjectPrompt initialValue={projectDescription} />
      </div>

      {result && (
        <div className="space-y-10 border-t pt-10">
          <ArchitectureSummary
            projectDescription={result.architecture.project_description}
            rationale={result.architecture.architecture_rationale}
          />
          {evidence && <DetectionTransparency evidence={evidence} />}
          <RecommendedStack explanations={result.explanations} />
          <AlternativeTools alternatives={result.alternatives} />
        </div>
      )}
    </main>
  )
}
