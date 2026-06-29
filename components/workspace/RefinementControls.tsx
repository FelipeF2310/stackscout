'use client'

import { useEffect, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { RefinementContext } from '../../lib/recommendations/generateArchitecture'
import { applyRefinementContextToSearchParams } from '../../lib/validation/refinementContextParams'
import RefinementPanel from '../prompt/RefinementPanel'

interface Props {
  value: RefinementContext
}

export default function RefinementControls({ value }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    setDraft(value)
  }, [value])

  function handleChange(nextContext: RefinementContext) {
    setDraft(nextContext)
    const nextParams = applyRefinementContextToSearchParams(searchParams, nextContext)
    const query = nextParams.toString()

    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    })
  }

  return (
    <RefinementPanel
      value={draft}
      onChange={handleChange}
      disabled={isPending}
      showModelPreference={false}
    />
  )
}
