import { redirect } from 'next/navigation'
import ArchitectureWorkspace from '@/components/workspace/ArchitectureWorkspace'
import { resolveWorkspaceRecommendation } from '@/lib/recommendations/resolveWorkspaceRecommendation'
import {
  parseRefinementContextFromSearchParams,
  type WorkspaceSearchParams,
} from '@/lib/validation/refinementContextParams'

interface Props {
  searchParams: Promise<WorkspaceSearchParams>
}

// The submitted state: a conversational two-pane workspace built from the
// existing deterministic recommendation output. No new data, recommendation
// logic, or persistence — the engine is reused, the shell is canonical.
export default async function WorkspacePage({ searchParams }: Props) {
  const params = await searchParams
  const ideaParam = Array.isArray(params.idea) ? params.idea[0] : params.idea
  const idea = ideaParam?.trim() ?? ''

  if (idea.length === 0) {
    redirect('/')
  }

  const requestedRefinementContext = parseRefinementContextFromSearchParams(params)
  const { refinementContext, clarification, evidence, result } =
    await resolveWorkspaceRecommendation(idea, requestedRefinementContext)

  return (
    <ArchitectureWorkspace
      idea={idea}
      capabilities={
        result?.architecture.capabilities ?? evidence.map((entry) => entry.capability)
      }
      explanations={result?.explanations ?? []}
      alternatives={result?.alternatives ?? []}
      rationale={result?.architecture.architecture_rationale ?? ''}
      evidence={evidence}
      refinementContext={refinementContext}
      clarification={clarification}
    />
  )
}
