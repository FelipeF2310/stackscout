'use client'

import { useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type {
  AiGrounding,
  AiGroundingQuestion as AiGroundingQuestionData,
} from '../../lib/capabilities/aiGrounding'
import type { RefinementContext } from '../../lib/recommendations/generateArchitecture'
import { replaceAiGroundingInUrl } from '../../lib/validation/aiGroundingNavigation'

interface Props {
  question: AiGroundingQuestionData | null
  value: RefinementContext
}

const ANSWER_LABELS: Record<AiGrounding, string> = {
  'product-sources': 'Use the product’s own sources',
  'general-knowledge': 'Use general model knowledge',
  both: 'Use both',
  default: 'Use a sensible default',
}

export default function AiGroundingQuestion({ question, value }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  function update(aiGrounding: AiGrounding | undefined) {
    startTransition(() => {
      replaceAiGroundingInUrl({
        pathname,
        searchParams,
        context: value,
        grounding: aiGrounding,
        replace: router.replace,
      })
    })
  }

  if (question) {
    return (
      <section className="rounded-xl border border-[hsl(var(--accent-bd))] bg-[hsl(var(--accent-soft))] p-4 space-y-3">
        <div>
          <div className="font-mono text-[10px] tracking-widest uppercase text-[hsl(var(--accent))]">
            One question
          </div>
          <h2 className="mt-1 text-sm font-semibold">{question.prompt}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            This answer changes whether StackScout includes a source-grounded retrieval path.
          </p>
        </div>
        <div className="grid gap-2">
          {question.choices.map((choice) => (
            <button
              key={choice.value}
              type="button"
              onClick={() => update(choice.value)}
              disabled={isPending}
              className="rounded-lg border bg-background px-3 py-2 text-left text-sm transition-colors hover:bg-muted disabled:opacity-50"
            >
              {choice.label}
            </button>
          ))}
        </div>
      </section>
    )
  }

  if (!value.aiGrounding) return null

  return (
    <section className="rounded-xl border p-4 flex items-center justify-between gap-3">
      <div>
        <div className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
          AI grounding
        </div>
        <p className="mt-1 text-sm">{ANSWER_LABELS[value.aiGrounding]}</p>
      </div>
      <button
        type="button"
        onClick={() => update(undefined)}
        disabled={isPending}
        className="text-sm underline text-muted-foreground hover:text-foreground disabled:opacity-50"
      >
        Change
      </button>
    </section>
  )
}
