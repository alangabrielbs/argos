import { withWorkspace } from '@/lib/auth/with-workspace'
import db from '@/lib/db'
import { createSnippetFormSchema } from '@/lib/zod/schemas/snippets'
import { SnippetFolder } from '@prisma/client'
import { NextResponse } from 'next/server'

export const GET = withWorkspace(async ({ workspace }) => {
  const snippets = await db.sqlSnippet.findMany({
    where: {
      folder: {
        workspaceId: workspace.id,
      },
    },
  })

  return NextResponse.json({ snippets })
})

export const POST = withWorkspace(async ({ req, workspace }) => {
  const { code, description, isPublic, name, documentation } =
    await createSnippetFormSchema.parseAsync(await req.json())

  let rootFolder: SnippetFolder | null
  rootFolder = await db.snippetFolder.findFirst({
    where: {
      name: 'ROOT',
    },
  })

  if (!rootFolder) {
    rootFolder = await db.snippetFolder.create({
      data: {
        name: 'ROOT',
        workspaceId: workspace.id,
      },
    })
  }

  const snippet = await db.sqlSnippet.create({
    data: {
      code,
      description,
      isPublic,
      name,
      documentation,
      folderId: rootFolder.id,
    },
  })

  return NextResponse.json({
    snippet,
  })
})
