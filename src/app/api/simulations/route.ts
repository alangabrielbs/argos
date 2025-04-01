import db from '@/lib/db'
import { getSearchParams } from '@/lib/urls'
import { createSimulationSchema } from '@/lib/zod/schemas/simulations'
import { DataSource, SimulationStatus } from '@prisma/client'
import { NextResponse } from 'next/server'

export const GET = async (request: Request) => {
  const searchParams = getSearchParams(request.url)
  const { query, workspaceId, status } = searchParams

  const simulations = await db.simulation.findMany({
    where: {
      deletedAt: null,
      ...(status && { status: status as SimulationStatus }),
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
    },
    include: {
      workspace: true,
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

const DATASOURCES = {
  databricks: DataSource.DATABRICKS,
  simulation: DataSource.SIMULATION,
}

export const POST = async (request: Request) => {
  const { dataSource, date, name, workspaceId, simulationId } =
    await createSimulationSchema.parseAsync(await request.json())

  const simulation = await db.simulation.create({
    data: {
      name,
      workspaceId,
      endDate: new Date(date.to),
      startDate: new Date(date.from),
      dataSource: DATASOURCES[dataSource],
    },
  })

  return NextResponse.json({ simulation })
}
