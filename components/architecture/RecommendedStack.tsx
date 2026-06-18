import ToolRecommendationCard from './ToolRecommendationCard'
import type { ToolExplanation } from '@/lib/recommendations/explainRecommendation'

interface Props {
  explanations: ToolExplanation[]
}

export default function RecommendedStack({ explanations }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Recommended stack
      </h2>
      <div className="space-y-3">
        {explanations.map((explanation) => (
          <ToolRecommendationCard key={explanation.tool_id} tool={explanation} />
        ))}
      </div>
    </div>
  )
}
