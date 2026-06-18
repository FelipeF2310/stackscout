import ToolRecommendationCard from './ToolRecommendationCard'
import type { ToolRecommendation } from './ToolRecommendationCard'

interface Props {
  selectedTools: object[]
  rationale: Record<string, string>
  architectureId: string
}

export default function RecommendedStack({ selectedTools, rationale }: Props) {
  const tools = selectedTools as ToolRecommendation[]

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Recommended stack
      </h2>
      <div className="space-y-3">
        {tools.map((tool) => (
          <ToolRecommendationCard
            key={tool.tool_id}
            tool={{
              ...tool,
              tradeoffs: rationale[`${tool.tool_id}:tradeoffs`],
              simple_explanation: rationale[`${tool.tool_id}:simple`],
              technical_explanation: rationale[`${tool.tool_id}:technical`],
            }}
          />
        ))}
      </div>
    </div>
  )
}
