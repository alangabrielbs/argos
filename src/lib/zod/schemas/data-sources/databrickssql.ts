import { z } from 'zod'

export const createDatabricksConnectionSchema = z.object({
  name: z.string({
    required_error: 'Nome é obrigatório',
  }),
  hostname: z.string({
    required_error: 'Host é obrigatório',
  }),
  httpPath: z.string({
    required_error: 'Http Path é obrigatório',
  }),
  token: z.string({
    required_error: 'Token é obrigatório',
  }),
  catalog: z.string().optional(),
  schema: z.string().optional(),
})
