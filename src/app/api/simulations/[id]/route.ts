import db from '@/lib/db'
import { getSearchParams } from '@/lib/urls'
import { NextResponse } from 'next/server'

export const GET = async (
  req: Request,
  { params }: { params: Promise<Record<string, string>> }
) => {
  const { id } = await params

  const simulation = await db.simulation.findUnique({
    where: {
      id,
    },
    include: {
      workspace: true,
    },
  })

  return NextResponse.json({
    simulation,
  })
}
