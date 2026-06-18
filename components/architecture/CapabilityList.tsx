import { getCapabilityById } from '@/lib/capabilities/capabilityTaxonomy'

interface Props {
  capabilityIds: string[]
}

export default function CapabilityList({ capabilityIds }: Props) {
  const capabilities = capabilityIds
    .map((id) => getCapabilityById(id))
    .filter(Boolean)

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Detected capabilities
      </h2>
      <div className="flex flex-wrap gap-2">
        {capabilities.map((cap) => (
          <span
            key={cap!.capability_id}
            className="px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground"
          >
            {cap!.name}
          </span>
        ))}
      </div>
    </div>
  )
}
