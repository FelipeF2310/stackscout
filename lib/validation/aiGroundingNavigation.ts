import type { AiGrounding } from '../capabilities/aiGrounding'
import type { RefinementContext } from '../recommendations/generateArchitecture'
import { applyRefinementContextToSearchParams } from './refinementContextParams'

export interface GroundingNavigationOptions {
  scroll: false
}

export type GroundingReplace = (
  href: string,
  options: GroundingNavigationOptions
) => void

interface ReplaceAiGroundingInput {
  pathname: string
  searchParams: Pick<URLSearchParams, 'toString'>
  context: RefinementContext
  grounding: AiGrounding | undefined
  replace: GroundingReplace
}

/** Update only grounding state while preserving the rest of the workspace URL. */
export function replaceAiGroundingInUrl({
  pathname,
  searchParams,
  context,
  grounding,
  replace,
}: ReplaceAiGroundingInput): string {
  const nextContext = { ...context }
  if (grounding) nextContext.aiGrounding = grounding
  else delete nextContext.aiGrounding

  const nextParams = applyRefinementContextToSearchParams(searchParams, nextContext)
  const query = nextParams.toString()
  const href = query ? `${pathname}?${query}` : pathname
  replace(href, { scroll: false })
  return href
}
