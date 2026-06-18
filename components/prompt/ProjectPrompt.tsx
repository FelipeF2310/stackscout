'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const EXAMPLES = [
  'AI customer support agent',
  'PDF chatbot for internal documents',
  'SaaS app with subscriptions',
  'Internal analytics dashboard',
  'Research assistant',
]

interface Props {
  initialValue?: string
}

// Phase 1 baseline: submitting navigates to /?q=<description>. The homepage
// (a server component) runs the deterministic recommendation pipeline from the
// query and renders the result. No API route, no client-side fetch.

export default function ProjectPrompt({ initialValue = '' }: Props) {
  const router = useRouter()
  const [description, setDescription] = useState(initialValue)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (description.trim().length < 10) {
      setError('Please describe your project in at least 10 characters.')
      return
    }
    setError(null)
    router.push(`/?q=${encodeURIComponent(description.trim())}`)
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
      {error && <p className="text-sm text-destructive">{error}</p>}
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
