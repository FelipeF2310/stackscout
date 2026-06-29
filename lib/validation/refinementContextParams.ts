import type { RefinementContext } from '../recommendations/generateArchitecture'
import { refinementContextSchema } from './projectInputSchema'

export type WorkspaceSearchParams = Record<string, string | string[] | undefined>

const refinementParamKeys = [
  'skillLevel',
  'projectStage',
  'hostingPreference',
  'ecosystem',
  'modelPreference',
] as const satisfies readonly (keyof RefinementContext)[]

const refinementFieldSchemas = refinementContextSchema.shape

export function parseRefinementContextFromSearchParams(
  searchParams: WorkspaceSearchParams
): RefinementContext {
  const context: RefinementContext = {}

  for (const key of refinementParamKeys) {
    const value = firstString(searchParams[key])
    if (!value) continue
    assignValidContextValue(context, key, value)
  }

  return context
}

export function applyRefinementContextToSearchParams(
  searchParams: Pick<URLSearchParams, 'toString'>,
  context: RefinementContext
): URLSearchParams {
  const next = new URLSearchParams(searchParams.toString())

  for (const key of refinementParamKeys) {
    const value = context[key]
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
  }

  return next
}

function firstString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0]
  return value
}

function assignValidContextValue(
  context: RefinementContext,
  key: (typeof refinementParamKeys)[number],
  value: string
) {
  switch (key) {
    case 'skillLevel': {
      const parsed = refinementFieldSchemas.skillLevel.safeParse(value)
      if (parsed.success) context.skillLevel = parsed.data
      break
    }
    case 'projectStage': {
      const parsed = refinementFieldSchemas.projectStage.safeParse(value)
      if (parsed.success) context.projectStage = parsed.data
      break
    }
    case 'hostingPreference': {
      const parsed = refinementFieldSchemas.hostingPreference.safeParse(value)
      if (parsed.success) context.hostingPreference = parsed.data
      break
    }
    case 'ecosystem': {
      const parsed = refinementFieldSchemas.ecosystem.safeParse(value)
      if (parsed.success) context.ecosystem = parsed.data
      break
    }
    case 'modelPreference': {
      const parsed = refinementFieldSchemas.modelPreference.safeParse(value)
      if (parsed.success) context.modelPreference = parsed.data
      break
    }
  }
}
