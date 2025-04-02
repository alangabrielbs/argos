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
  })

  return NextResponse.json({
    executions,
  })
}
