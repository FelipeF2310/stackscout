interface Alternative {
  capability_id: string
  primary_tool_id: string
  alternatives: Array<{
    tool_id: string
    reason_not_selected: string
  }>
}

interface Props {
  alternatives: Alternative[]
}

export default function AlternativeTools({ alternatives }: Props) {
  if (alternatives.length === 0) return null

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Alternatives to consider
      </h2>
      <div className="space-y-4">
        {alternatives.map((alt) => (
          <div key={alt.capability_id} className="space-y-1">
            <p className="text-sm font-medium capitalize">
              {alt.capability_id.replace(/-/g, ' ')}
            </p>
            <p className="text-xs text-muted-foreground">
              Instead of <span className="font-medium">{alt.primary_tool_id}</span>, you could
              use:
            </p>
            <ul className="space-y-1 pt-1">
              {alt.alternatives.map((a) => (
                <li key={a.tool_id} className="text-sm">
                  <span className="font-medium">{a.tool_id}</span>
                  <span className="text-muted-foreground"> — {a.reason_not_selected}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
