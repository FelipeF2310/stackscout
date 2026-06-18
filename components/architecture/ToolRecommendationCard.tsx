'use client'

import { useState } from 'react'

export interface ToolRecommendation {
  tool_id: string
  capability_id: string
  rationale: string
  simple_explanation?: string
  technical_explanation?: string
  tradeoffs?: string
}

interface Props {
  tool: ToolRecommendation
}

export default function ToolRecommendationCard({ tool }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{tool.tool_id}</h3>
          <p className="text-sm text-muted-foreground capitalize">{tool.capability_id.replace(/-/g, ' ')}</p>
        </div>
        <a
          href={`https://github.com/search?q=${tool.tool_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground underline"
        >
          GitHub
        </a>
      </div>

      <p className="text-sm">
        {expanded && tool.simple_explanation ? tool.simple_explanation : tool.rationale}
      </p>

      {tool.tradeoffs && (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">Tradeoff: </span>
          {tool.tradeoffs}
        </p>
      )}

      {tool.technical_explanation && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs underline text-muted-foreground"
        >
          {expanded ? 'Less detail' : 'Technical details'}
        </button>
      )}

      {expanded && tool.technical_explanation && (
        <p className="text-sm text-muted-foreground border-t pt-3">{tool.technical_explanation}</p>
      )}
    </div>
  )
}
