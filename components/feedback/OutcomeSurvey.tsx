'use client'

import { useState } from 'react'

type OutcomeStatus =
  | 'using-as-recommended'
  | 'modified-slightly'
  | 'replaced-multiple'
  | 'abandoned'

interface SelectedTool {
  tool_id: string
}

interface Props {
  architectureId: string
  projectDescription: string
  selectedTools: object[]
}

// Phase 1 baseline: this survey does not persist. There is no API route or
// database yet — submitting validates locally and shows a confirmation notice.
// The persistence path will be wired alongside the data layer.

export default function OutcomeSurvey({
  architectureId,
  projectDescription,
  selectedTools,
}: Props) {
  const tools = selectedTools as SelectedTool[]

  const [status, setStatus] = useState<OutcomeStatus | null>(null)
  const [replacedTools, setReplacedTools] = useState<string[]>([])
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const showReplacedTools =
    status === 'modified-slightly' || status === 'replaced-multiple'

  function toggleTool(toolId: string) {
    setReplacedTools((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!status) return
    setSubmitted(true)
  }

  const statusOptions: { value: OutcomeStatus; label: string }[] = [
    { value: 'using-as-recommended', label: 'Using as recommended' },
    { value: 'modified-slightly', label: 'Modified slightly' },
    { value: 'replaced-multiple', label: 'Replaced multiple components' },
    { value: 'abandoned', label: 'Abandoned' },
  ]

  if (submitted) {
    return (
      <p className="text-sm text-muted-foreground">
        Thanks — your response was captured locally for architecture{' '}
        <span className="font-mono">{architectureId}</span>. Outcome persistence
        is not wired in this Phase 1 baseline yet.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-sm text-muted-foreground">{projectDescription}</p>

      <div className="space-y-3">
        <p className="font-medium">Are you still using this architecture?</p>
        <div className="space-y-2">
          {statusOptions.map((opt) => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="status"
                value={opt.value}
                checked={status === opt.value}
                onChange={() => setStatus(opt.value)}
                className="accent-primary"
              />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {showReplacedTools && (
        <div className="space-y-3">
          <p className="font-medium text-sm">Which tools did you replace?</p>
          <div className="space-y-2">
            {tools.map((tool) => (
              <label key={tool.tool_id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={replacedTools.includes(tool.tool_id)}
                  onChange={() => toggleTool(tool.tool_id)}
                  className="accent-primary"
                />
                <span className="text-sm">{tool.tool_id}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="font-medium text-sm">
          What changed?{' '}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="Any context helps..."
          className="w-full rounded border p-3 text-sm resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={!status}
        className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-50"
      >
        Submit feedback
      </button>
    </form>
  )
}
