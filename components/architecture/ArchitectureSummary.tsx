interface Props {
  projectDescription: string
  rationale: string
}

export default function ArchitectureSummary({ projectDescription, rationale }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Architecture for</p>
      <h1 className="text-xl font-semibold">{projectDescription}</h1>
      {rationale && (
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm leading-relaxed">{rationale}</p>
        </div>
      )}
    </div>
  )
}
