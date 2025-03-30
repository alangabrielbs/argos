import db from '@/lib/db'
import { getSearchParams } from '@/lib/urls'
import { NextResponse } from 'next/server'

export const GET = async (request: Request) => {
  const searchParams = getSearchParams(request.url)
  const { query } = searchParams

  const workspaces = await db.workspace.findMany({
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
  })

  return NextResponse.json({ workspaces })
}
