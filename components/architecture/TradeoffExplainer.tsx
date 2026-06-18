interface Tradeoff {
  tool_id: string
  summary: string
  when_to_reconsider: string
}

interface Props {
  tradeoffs: Tradeoff[]
}

export default function TradeoffExplainer({ tradeoffs }: Props) {
  if (tradeoffs.length === 0) return null

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Key tradeoffs
      </h2>
      <ul className="space-y-3">
        {tradeoffs.map((t) => (
          <li key={t.tool_id} className="text-sm space-y-1">
            <span className="font-medium">{t.tool_id}: </span>
            <span>{t.summary}</span>
            {t.when_to_reconsider && (
              <p className="text-muted-foreground">
                Reconsider if: {t.when_to_reconsider}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
