import db from '@/lib/db'
import { getValueByPath } from '@/lib/json-extract'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const saveVariablesSchema = z.object({
  variables: z.array(
    z.object({
      id: z.string().cuid(),
      name: z.string(),
      key: z.string({
        required_error: 'Campo obrigatório',
      }),
    })
  ),
})

export const POST = async (
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string
    }>
  }
) => {
  const { id } = await params

  const { variables } = await saveVariablesSchema.parseAsync(
    await request.json()
  )

  const formula = await db.formulaExecution.findUnique({
    where: {
      id,
    },
    include: {
      formula: {
        select: {
          expression: true,
        },
      },
      execution: {
        select: {
          values: true,
        },
      },
    },
  })

  if (!formula) {
    return NextResponse.json(
      {
        message: 'Fórmula não encontrada',
      },
      { status: 404 }
    )
  }
  try {
    let evalFormula = formula.formula.expression

    variables.forEach(variable => {
      const regex = new RegExp(`\\b${variable.name}\\b`, 'g')

      const value = getValueByPath({
        path: variable.key,
        obj: formula.execution.values,
      })

      evalFormula = evalFormula.replace(regex, value as string)
    })

    evalFormula = evalFormula
      .replace(/round\(/g, 'Math.round(')
      .replace(/floor\(/g, 'Math.floor(')
      .replace(/ceil\(/g, 'Math.ceil(')
      .replace(/abs\(/g, 'Math.abs(')
      .replace(/max\(/g, 'Math.max(')
      .replace(/min\(/g, 'Math.min(')
      .replace(/,/g, '.')

    // biome-ignore lint/security/noGlobalEval: <explanation>
    const result = eval(evalFormula)

    await db.formulaExecution.update({
      where: {
        id,
      },
      data: {
        result,
        readyAt: new Date(),
      },
    })

    return NextResponse.json({
      formula: evalFormula,
      result,
    })
  } catch (error) {
    console.error('Error evaluating formula:', error)
    return NextResponse.json(
      {
        message: 'Erro ao avaliar a fórmula',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
