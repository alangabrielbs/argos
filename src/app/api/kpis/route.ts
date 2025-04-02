import { NextResponse } from 'next/server'

import db from '@/lib/db'

export const GET = async (request: Request) => {
  const formulas = await db.formula.findMany({
    orderBy: {
      updatedAt: 'desc',
    },
    include: {
      _count: {
        select: {
          simulations: true,
        },
      },
    },
  })

  return NextResponse.json({ formulas })
}
