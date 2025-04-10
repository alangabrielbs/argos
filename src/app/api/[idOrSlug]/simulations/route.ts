import db from '@/lib/db'
import { getSearchParams } from '@/lib/urls'
import { createSimulationSchema } from '@/lib/zod/schemas/simulations'
import { NextResponse } from 'next/server'

export const GET = async (request: Request) => {
  const searchParams = getSearchParams(request.url)
  const { query, workspaceId, kpi } = searchParams

  console.log({ kpi })

  const simulations = await db.simulation.findMany({
    where: {
      deletedAt: null,
      ...(workspaceId && {
        workspaceId,
      }),
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
      ...(kpi && {
        executions: {
          some: {
            formulas: {
              some: {
                formula: {
                  name: {
                    contains: kpi,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
        },
      }),
    },
    include: {
      executions: true,
      workspace: true,
      _count: {
        select: {
          executions: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
    ...(!query && {
      take: 15,
    }),
  })

  return NextResponse.json({ simulations })
}

export const POST = async (request: Request) => {
  const { name } = await createSimulationSchema.parseAsync(await request.json())

  // const simulation = await db.simulation.create({
  //   data: {
  //     name,
  //   },
  // })

  return NextResponse.json({ simulation: 'ok' })
}
