import Link from 'next/link'
import type { Capability } from '@/lib/capabilities/capabilityTypes'
import type { CapabilityEvidence } from '@/lib/capabilities/detectCapabilities'
import type { ToolExplanation } from '@/lib/recommendations/explainRecommendation'
import type { RefinementContext } from '@/lib/recommendations/generateArchitecture'
import type { CapabilityAlternatives } from '@/lib/recommendations/recommendArchitecture'
import type { AiGroundingQuestion } from '@/lib/capabilities/aiGrounding'
import ConversationPane from './ConversationPane'
import ArchitectureBrief from './ArchitectureBrief'

export interface ArchitectureWorkspaceProps {
  idea: string
  capabilities: Capability[]
  explanations: ToolExplanation[]
  alternatives: CapabilityAlternatives[]
  rationale: string
  evidence: CapabilityEvidence[]
  refinementContext: RefinementContext
  clarification?: AiGroundingQuestion | null
}

// Canonical submitted state: a two-pane conversational workspace.
//  - Left:  guided conversation / Architecture Mode / reflected capabilities.
//  - Right: a living (draft) Architecture Brief built from deterministic output.
// This intentionally does NOT render the old stacked results shell.
export default function ArchitectureWorkspace({
  idea,
  capabilities,
  explanations,
  alternatives,
  rationale,
  evidence,
  refinementContext,
  clarification = null,
}: ArchitectureWorkspaceProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="flex items-center gap-3 h-[52px] px-5 border-b">
        <Link href="/" className="font-extrabold tracking-tight text-[15px]">
          StackScout<span className="text-[hsl(var(--accent))]">.</span>
        </Link>
        <span className="text-xs text-muted-foreground">/ Architecture workspace</span>
        <nav className="ml-auto text-sm text-muted-foreground">
          <Link href="/saved" className="hover:text-foreground">
            Saved
          </Link>
        </nav>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,42fr)_minmax(0,58fr)] min-h-0">
        <ConversationPane
          idea={idea}
          capabilities={capabilities}
          evidence={evidence}
          refinementContext={refinementContext}
          clarification={clarification}
        />
        {clarification ? (
          <section className="flex items-center justify-center bg-background p-6">
            <div className="max-w-md space-y-3 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Clarifying your architecture
              </p>
              <h1 className="text-xl font-bold">One answer will sharpen the recommendation.</h1>
              <p className="text-sm text-muted-foreground">
                Answer the question in the conversation to see the recommended architecture.
              </p>
            </div>
          </section>
        ) : (
          <ArchitectureBrief
            idea={idea}
            capabilities={capabilities}
            explanations={explanations}
            alternatives={alternatives}
            rationale={rationale}
          />
        )}
      </div>
    </div>
  )
}
