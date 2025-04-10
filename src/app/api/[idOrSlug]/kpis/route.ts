import { NextResponse } from 'next/server'

import db from '@/lib/db'
import { getSearchParams } from '@/lib/urls'
import { createFormulaSchema } from '@/lib/zod/schemas/formulas'

export const GET = async (request: Request) => {
  const searchParams = getSearchParams(request.url)
  const { query } = searchParams

  const formulas = await db.formula.findMany({
    where: {
      ...(query && {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      }),
    },
    orderBy: {
      updatedAt: 'desc',
    },
    include: {
      variables: true,
      _count: {
        select: {
          executions: true,
        },
      },
    },
  })

  return NextResponse.json({ formulas })
}

export const POST = async (request: Request) => {
  const { expression, name, variables, description } =
    await createFormulaSchema.parseAsync(await request.json())

  const formula = await db.formula.create({
    data: {
      expression,
      name,
      description,
      variables: {
        createMany: {
          data: variables.map(variable => ({
            name: variable.name,
            exampleValue: variable.value,
          })),
        },
      },
    },
  })

  return NextResponse.json({ formula })
}
