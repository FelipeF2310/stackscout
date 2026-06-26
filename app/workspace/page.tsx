import { redirect } from 'next/navigation'
import ArchitectureWorkspace from '@/components/workspace/ArchitectureWorkspace'
import { recommendArchitecture } from '@/lib/recommendations/recommendArchitecture'
import { detectCapabilitiesWithEvidence } from '@/lib/capabilities/detectCapabilities'

interface Props {
  searchParams: Promise<{ idea?: string }>
}

// The submitted state: a conversational two-pane workspace built from the
// existing deterministic recommendation output. No new data, recommendation
// logic, or persistence — the engine is reused, the shell is canonical.
export default async function WorkspacePage({ searchParams }: Props) {
  const { idea: ideaParam } = await searchParams
  const idea = ideaParam?.trim() ?? ''

  if (idea.length === 0) {
    redirect('/')
  }

  const result = await recommendArchitecture(idea)
  const evidence = detectCapabilitiesWithEvidence(idea)

  return (
    <ArchitectureWorkspace
      idea={result.architecture.project_description}
      capabilities={result.architecture.capabilities}
      explanations={result.explanations}
      alternatives={result.alternatives}
      rationale={result.architecture.architecture_rationale}
      evidence={evidence}
    />
  )
}
