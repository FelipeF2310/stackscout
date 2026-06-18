import type { ToolExplanation } from '@/lib/recommendations/explainRecommendation'

interface Props {
  tool: ToolExplanation
}

// Presentational card. Renders the advisor-style explanation for one tool:
// what it does (plain language), why it was picked, how it fits the stack, the
// tradeoff, and when to consider an alternative.
export default function ToolRecommendationCard({ tool }: Props) {
  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{tool.tool_id}</h3>
          <p className="text-xs text-muted-foreground">{tool.capability_name}</p>
        </div>
        <a
          href={tool.github_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground underline shrink-0"
        >
          GitHub ↗
        </a>
      </div>

      <p className="text-sm">{tool.simple}</p>

      <p className="text-sm">
        <span className="font-medium">Why this tool: </span>
        {tool.why}
      </p>

      {tool.fits_with && (
        <p className="text-sm">
          <span className="font-medium">How it fits: </span>
          {tool.fits_with}
        </p>
      )}

      <p className="text-sm text-muted-foreground">
        <span className="font-medium">Tradeoff: </span>
        {tool.tradeoff}
      </p>

      {tool.consider_alternative && (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">Consider an alternative if </span>
          {tool.consider_alternative}
        </p>
      )}
    </div>
  )
}
