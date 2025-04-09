import { z } from 'zod'

export const createFormulaSchema = z.object({
  name: z
    .string({
      required_error: 'Nome é obrigatório',
    })
    .min(2)
    .max(50),
  description: z.string().optional(),
  expression: z.string(),
  variables: z.array(
    z.object({
      name: z.string(),
      value: z.number(),
    })
  ),
})
