'use client'

import type { RefinementContext } from '@/lib/recommendations/generateArchitecture'

interface Props {
  value: RefinementContext
  onChange: (next: RefinementContext) => void
  disabled?: boolean
}

export default function RefinementPanel({ value, onChange, disabled }: Props) {
  function update(patch: Partial<RefinementContext>) {
    onChange({ ...value, ...patch })
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold text-sm">Refine recommendations</h3>
      <div className="grid grid-cols-2 gap-4">
        <label className="space-y-1">
          <span className="text-xs text-muted-foreground">Skill level</span>
          <select
            value={value.skillLevel ?? ''}
            onChange={(e) =>
              update({ skillLevel: e.target.value as RefinementContext['skillLevel'] || undefined })
            }
            disabled={disabled}
            className="w-full rounded border p-2 text-sm"
          >
            <option value="">Any</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs text-muted-foreground">Project stage</span>
          <select
            value={value.projectStage ?? ''}
            onChange={(e) =>
              update({ projectStage: e.target.value as RefinementContext['projectStage'] || undefined })
            }
            disabled={disabled}
            className="w-full rounded border p-2 text-sm"
          >
            <option value="">Any</option>
            <option value="prototype">Prototype</option>
            <option value="production">Production</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs text-muted-foreground">Hosting</span>
          <select
            value={value.hostingPreference ?? ''}
            onChange={(e) =>
              update({ hostingPreference: e.target.value as RefinementContext['hostingPreference'] || undefined })
            }
            disabled={disabled}
            className="w-full rounded border p-2 text-sm"
          >
            <option value="">Any</option>
            <option value="managed">Managed</option>
            <option value="self-hosted">Self-hosted</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs text-muted-foreground">Ecosystem</span>
          <select
            value={value.ecosystem ?? ''}
            onChange={(e) =>
              update({ ecosystem: e.target.value as RefinementContext['ecosystem'] || undefined })
            }
            disabled={disabled}
            className="w-full rounded border p-2 text-sm"
          >
            <option value="">Any</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="mixed">Mixed</option>
          </select>
        </label>

        <label className="space-y-1 col-span-2">
          <span className="text-xs text-muted-foreground">Model preference</span>
          <select
            value={value.modelPreference ?? ''}
            onChange={(e) =>
              update({ modelPreference: e.target.value as RefinementContext['modelPreference'] || undefined })
            }
            disabled={disabled}
            className="w-full rounded border p-2 text-sm"
          >
            <option value="">No preference</option>
            <option value="anthropic">Anthropic</option>
            <option value="openai">OpenAI</option>
            <option value="open-source">Open Source</option>
          </select>
        </label>
      </div>
    </div>
  )
}
