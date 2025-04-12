import { NextResponse } from 'next/server'

import { withWorkspace } from '@/lib/auth/with-workspace'
import { encrypt } from '@/lib/crypto'
import db from '@/lib/db'
import { getSearchParams } from '@/lib/urls'
import { createDatabricksConnectionSchema } from '@/lib/zod/schemas/data-sources/databrickssql'

export const GET = withWorkspace(async ({ workspace, req }) => {
  const searchParams = getSearchParams(req.url)
  const { query } = searchParams

  const dataSources = await db.databricksSQLDataSource.findMany({
    where: {
      workspaceId: workspace.id,
      ...(query && {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      }),
    },
    select: {
      id: true,
      name: true,
      isDefault: true,
      createdAt: true,
    },
  })

  return NextResponse.json({ dataSources })
})

export const POST = withWorkspace(async ({ workspace, req }) => {
  const { hostname, httpPath, name, token, catalog, schema } =
    await createDatabricksConnectionSchema.parseAsync(await req.json())

  const dataSource = await db.databricksSQLDataSource.create({
    data: {
      name,
      hostname,
      httpPath,
      token: encrypt(token, process.env.DATASOURCES_ENCRYPTION_KEY!),
      catalog,
      schema,
      workspaceId: workspace.id,
    },
  })

  return NextResponse.json({ dataSource })
})
