import db from '@/lib/db'
import { NextResponse } from 'next/server'

export const GET = async (
  req: Request,
  { params }: { params: Promise<Record<string, string>> }
) => {
  const { id } = await params

  const executions = await db.execution.findMany({
    where: {
      simulationId: id,
    },
    include: {
      formulas: {
        include: {
          formula: {
            include: {
              variables: true,
            },
          },
        },
      },
    },
  })

  return NextResponse.json({
    executions,
  })
}
