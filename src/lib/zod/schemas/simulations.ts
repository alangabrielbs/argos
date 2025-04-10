import { z } from 'zod'

export const createSimulationFormSchema = z.object({
  name: z
    .string({
      required_error: 'Nome é obrigatório',
    })
    .min(2)
    .max(50),
})

export const createSimulationSchema = z.object({
  name: z
    .string({
      required_error: 'Nome é obrigatório',
    })
    .min(2)
    .max(50),
})
