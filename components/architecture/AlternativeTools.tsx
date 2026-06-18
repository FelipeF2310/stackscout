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
        Alternatives
      </h2>
      <div className="space-y-4">
        {alternatives.map((alt) => (
          <div key={alt.capability_id} className="space-y-2">
            <p className="text-sm font-medium capitalize">
              {alt.capability_id.replace(/-/g, ' ')}
            </p>
            <ul className="space-y-1">
              {alt.alternatives.map((a) => (
                <li key={a.tool_id} className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{a.tool_id}</span>
                  {a.reason_not_selected && (
                    <span> — {a.reason_not_selected}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
