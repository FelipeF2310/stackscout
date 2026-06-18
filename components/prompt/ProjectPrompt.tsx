'use client'

import { useState } from 'react'

const EXAMPLES = [
  'AI customer support agent',
  'PDF chatbot for internal documents',
  'SaaS app with subscriptions',
  'Internal analytics dashboard',
  'Research assistant',
]

// Phase 1 baseline: this form does not call any API. Architecture generation
// is not wired yet — the deterministic engine lives in lib/ and will be
// connected in the next slice. Submitting shows a status notice only.

export default function ProjectPrompt() {
  const [description, setDescription] = useState('')
  const [notice, setNotice] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (description.trim().length < 10) {
      setNotice('Please describe your project in at least 10 characters.')
      return
    }
    setNotice(
      'Architecture generation is not wired up in this Phase 1 baseline. The capability and recommendation logic runs deterministically in lib/ and will be connected to this form in the next slice.'
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe what you're building..."
        rows={4}
        maxLength={2000}
        className="w-full rounded-lg border p-4 text-base resize-none focus:outline-none focus:ring-2"
      />
      {notice && <p className="text-sm text-muted-foreground">{notice}</p>}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2 flex-wrap">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setDescription(ex)}
              className="text-xs px-3 py-1 rounded-full border hover:bg-muted transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
        <button
          type="submit"
          disabled={description.trim().length < 10}
          className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-50 transition-opacity whitespace-nowrap"
        >
          Get architecture
        </button>
      </div>
    </form>
  )
}
