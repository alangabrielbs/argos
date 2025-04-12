import { z } from 'zod'

export const createSnippetFormSchema = z.object({
  name: z
    .string({
      required_error: 'Nome é obrigatório',
    })
    .regex(/^[a-zA-Z0-9\s]+$/, {
      message: 'Apenas letras, números e espaços são permitidos',
    }),
  description: z
    .string({
      required_error: 'Descrição é obrigatória',
    })
    .min(1, { message: 'Descrição é obrigatória' })
    .max(50, {
      message: 'Máximo de 50 caracteres',
    }),
  documentation: z.string().optional(),
  code: z
    .string({
      required_error: 'Código SQL é obrigatório',
    })
    .min(1, { message: 'Campo obrigatório' }),
  isPublic: z.boolean().default(false),
})
