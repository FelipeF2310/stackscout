import { z } from 'zod'

export const selectedToolSchema = z.object({
  tool_id: z.string(),
  capability_ids: z.array(z.string()).min(1),
  rationale: z.string().min(1, 'Rationale is required for every tool recommendation.'),
})

export const generatedArchitectureSchema = z.object({
  project_description: z.string(),
  capabilities: z.array(
    z.object({
      capability_id: z.string(),
      name: z.string(),
      description: z.string(),
      category: z.string(),
    })
  ),
  selected_tools: z.array(selectedToolSchema),
  architecture_rationale: z.string().min(1, 'Architecture rationale is required.'),
  created_at: z.string(),
})

export const outcomeSchema = z.object({
  architecture_id: z.string().uuid('Invalid architecture ID.'),
  status: z.enum([
    'using-as-recommended',
    'modified-slightly',
    'replaced-multiple',
    'abandoned',
  ]),
  modifications: z.string().optional(),
  replaced_tools: z.array(z.string()).optional(),
  feedback: z.string().max(1000).optional(),
})

export type GeneratedArchitectureData = z.infer<typeof generatedArchitectureSchema>
export type OutcomeData = z.infer<typeof outcomeSchema>
