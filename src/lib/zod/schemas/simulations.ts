import { z } from 'zod'

export const createSimulationFormSchema = z.object({
  name: z
    .string({
      required_error: 'Nome é obrigatório',
    })
    .min(2)
    .max(50),
  workspaceId: z
    .string({
      required_error: 'Workspace é obrigatório',
    })
    .cuid(),
  dataSource: z.enum(['databricks', 'simulation'], {
    required_error: 'Fonte de dados é obrigatória',
  }),
  simulationId: z.string().optional(),
  // type: z.array(
  //   z.enum(['Marketplace', 'Entrega'], {
  //     required_error: 'Tipo é obrigatório',
  //   })
  // ),
  // baseOperator: z
  //   .string({
  //     required_error: 'Operador base é obrigatório',
  //   })
  //   .regex(/^([*\/+-]\d+(\.\d+)?%?|0)$/, {
  //     message: 'Operador base inválido',
  //   })
  //   .transform(value => {
  //     const operator = value[0]
  //     const number = value.slice(1)
  //     const isPercentage = value.endsWith('%')
  //     const parsedNumber = Number.parseFloat(number)

  //     return {
  //       operator,
  //       number: number ? parsedNumber : '0',
  //       isPercentage,
  //     }
  //   }),
  date: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .refine(data => data.from <= data.to, {
      message: 'A data de início deve ser menor ou igual à data de término',
    }),
})

export const createSimulationSchema = z.object({
  name: z
    .string({
      required_error: 'Nome é obrigatório',
    })
    .min(2)
    .max(50),
  workspaceId: z
    .string({
      required_error: 'Workspace é obrigatório',
    })
    .cuid(),
  dataSource: z.enum(['databricks', 'simulation'], {
    required_error: 'Fonte de dados é obrigatória',
  }),
  simulationId: z.string().optional(),
  // type: z.array(
  //   z.enum(['Marketplace', 'Entrega'], {
  //     required_error: 'Tipo é obrigatório',
  //   })
  // ),
  // baseOperator: z.object({
  //   operator: z.enum(['+', '-', '*', '/', '0']),
  //   number: z
  //     .string()
  //     .regex(/^\d+(\.\d+)?$/, {
  //       message: 'Número inválido',
  //     })
  //     .transform(value => (value ? Number.parseFloat(value) : 0)),
  //   isPercentage: z.boolean(),
  // }),
  date: z
    .object({
      from: z.string(),
      to: z.string(),
    })
    .refine(data => data.from <= data.to, {
      message: 'A data de início deve ser menor ou igual à data de término',
    }),
})
