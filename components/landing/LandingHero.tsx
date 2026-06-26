'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Canonical landing page (phase 1 of the canonical UX). Implements
// docs/ux-references/canonical/01-landing.html: one calm, centered prompt-entry
// surface. Submitting routes to the existing /?q=<idea> results path — a
// documented bridge until the guided two-pane workspace exists.
//
// Decisions baked in: send disabled ONLY when empty (10-char minimum is soft
// inline validation on submit); "Guide me" is a non-interactive deferred marker
// (no working mode toggle, no mode param); only the real /saved nav link.

const MIN_CHARS = 10

// Submitting the Start screen enters the canonical conversational workspace —
// NOT the old /?q= stacked-results path.
export function workspaceUrl(idea: string): string {
  return `/workspace?idea=${encodeURIComponent(idea)}`
}

type StarterIconName = 'docs' | 'marketplace' | 'realtime'

interface Starter {
  title: string
  description: string
  text: string
  icon: StarterIconName
}

const STARTERS: Starter[] = [
  {
    title: 'Chat over your documents',
    description: 'Answer questions from internal PDFs — parsing, vector search, an LLM',
    text: 'A chatbot that answers questions over our internal PDFs',
    icon: 'docs',
  },
  {
    title: 'Marketplace with payments',
    description: 'Accounts, listings, payments — auth, database, transactions',
    text: 'A marketplace app where users sign up, list items, and pay each other',
    icon: 'marketplace',
  },
  {
    title: 'Realtime collaboration',
    description: 'Many people editing live — sync engine, presence, persistence',
    text: 'A realtime collaborative whiteboard that multiple people can edit at once',
    icon: 'realtime',
  },
]

function StarterIcon({ name }: { name: StarterIconName }) {
  const common = { viewBox: '0 0 24 24', width: 15, height: 15, fill: 'none', stroke: 'currentColor', strokeWidth: 1.8 }
  if (name === 'docs') {
    return (
      <svg {...common}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    )
  }
  if (name === 'marketplace') {
    return (
      <svg {...common}>
        <path d="M3 3h18v4H3z" />
        <path d="M5 7v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7" />
        <path d="M9 11h6" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="3" />
      <path d="M5 12a7 7 0 0 1 14 0M2 12a10 10 0 0 1 20 0" />
    </svg>
  )
}

interface Props {
  initialValue?: string
}

export default function LandingHero({ initialValue = '' }: Props) {
  const router = useRouter()
  const [idea, setIdea] = useState(initialValue)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const trimmed = idea.trim()
  const isEmpty = trimmed.length === 0

  function submit() {
    if (isEmpty) return
    if (trimmed.length < MIN_CHARS) {
      setError(`Add a little more detail — at least ${MIN_CHARS} characters.`)
      return
    }
    setError(null)
    router.push(workspaceUrl(trimmed))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    submit()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      submit()
    }
  }

  function useStarter(text: string) {
    setIdea(text)
    setError(null)
    textareaRef.current?.focus()
  }

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      {/* sparse top bar */}
      <header className="flex items-center gap-3 h-[52px] px-5">
        <span className="font-extrabold tracking-tight text-[15px]">
          StackScout<span className="text-[hsl(var(--accent))]">.</span>
        </span>
        <nav className="ml-auto text-sm text-muted-foreground">
          <Link href="/saved" className="hover:text-foreground">
            Saved
          </Link>
        </nav>
      </header>

      {/* centered stage */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 w-full max-w-[720px] mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-[27px] font-extrabold tracking-tight leading-tight">
            What are you building?
          </h1>
          <p className="text-muted-foreground mt-2 text-[15.5px]">
            Describe it in plain language. StackScout figures out the capabilities, then the stack.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="w-full rounded-2xl border bg-[hsl(var(--surface))] p-4 shadow-sm transition-colors focus-within:border-[hsl(var(--accent-bd))] focus-within:ring-4 focus-within:ring-[hsl(var(--accent-soft))]">
            <textarea
              ref={textareaRef}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={2000}
              placeholder="e.g. A chatbot that answers questions over our internal PDFs"
              className="w-full resize-none bg-transparent outline-none text-base min-h-[52px] placeholder:text-[hsl(var(--faint))]"
            />
            <div className="flex items-center gap-2.5 mt-2">
              {/* non-interactive mode marker — submit enters the guided workspace */}
              <span className="text-[11px] text-[hsl(var(--accent))] bg-[hsl(var(--accent-soft))] border border-[hsl(var(--accent-bd))] rounded-full px-2.5 py-1">
                Architecture Mode
              </span>
              <span className="flex-1" />
              <span className="text-[11px] text-[hsl(var(--faint))]">⌘↵</span>
              <button
                type="submit"
                disabled={isEmpty}
                aria-label="Start"
                className="w-[34px] h-[34px] grid place-items-center rounded-lg bg-primary text-primary-foreground transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </form>

        {/* starter cards — examples, not recommendations */}
        <div className="w-full mt-3.5 flex flex-col">
          <div className="px-3 pb-1 text-[11px] font-medium uppercase tracking-wider text-[hsl(var(--faint))]">
            Start with an example
          </div>
          {STARTERS.map((s) => (
            <button
              key={s.title}
              type="button"
              onClick={() => useStarter(s.text)}
              className="flex items-center gap-3.5 text-left rounded-xl p-3 hover:bg-[hsl(var(--surface))]"
            >
              <span className="w-[30px] h-[30px] shrink-0 grid place-items-center rounded-lg bg-[hsl(var(--accent-soft))] border border-[hsl(var(--accent-bd))] text-[hsl(var(--accent))]">
                <StarterIcon name={s.icon} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{s.title}</span>
                <span className="block text-[13px] text-muted-foreground truncate">{s.description}</span>
              </span>
              <span className="ml-auto text-[hsl(var(--faint))] text-base">›</span>
            </button>
          ))}
        </div>
      </div>

      {/* footer hint */}
      <footer className="text-center p-[18px] text-xs text-[hsl(var(--faint))]">
        Capability-first · every pick comes with why, tradeoffs, and alternatives — never just{' '}
        <span className="font-mono text-muted-foreground">&ldquo;the best&rdquo;</span>.
      </footer>
    </main>
  )
}
