import { z } from 'zod'

export const refinementContextSchema = z.object({
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  projectStage: z.enum(['prototype', 'production', 'enterprise']).optional(),
  hostingPreference: z.enum(['managed', 'self-hosted']).optional(),
  ecosystem: z.enum(['typescript', 'python', 'mixed']).optional(),
  modelPreference: z.enum(['openai', 'anthropic', 'open-source', 'no-preference']).optional(),
})

export const projectInputSchema = z.object({
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters.')
    .max(2000, 'Description must be 2000 characters or fewer.'),
  refinement: refinementContextSchema.optional(),
})

export type ProjectInput = z.infer<typeof projectInputSchema>
