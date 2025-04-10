import { Workspace } from '@prisma/client'
import { ArgosApiError, handleAndReturnErrorResponse } from '../api/errors'
import db from '../db'
import { getSearchParams } from '../urls'

type WithWorkspaceHandlerParams = {
  req: Request
  params: Record<string, string>
  searchParams: Record<string, string>
  headers?: Record<string, string>
  // session: Session;
  workspace: Omit<Workspace, 'deletedAt'>
}

type WithWorkspaceHandler = (
  params: WithWorkspaceHandlerParams
) => Promise<Response>

export const withWorkspace = (handler: WithWorkspaceHandler) => {
  return async (
    req: Request,
    { params }: { params: Promise<Record<string, string>> }
  ) => {
    const searchParams = getSearchParams(req.url)
    const headers = {}
    const resolvedParams = await params

    try {
      // let session: Session | undefined;
      let workspaceId: string | undefined
      let workspaceSlug: string | undefined

      const idOrSlug =
        resolvedParams?.idOrSlug ||
        searchParams.workspaceId ||
        resolvedParams?.slug ||
        searchParams.projectSlug

      if (idOrSlug) {
        if (idOrSlug.startsWith('ws_')) {
          workspaceId = idOrSlug.replace('ws_', '')
        } else {
          workspaceSlug = idOrSlug
        }
      }

      const workspace = await db.workspace.findUnique({
        where: {
          id: workspaceId || undefined,
          slug: workspaceSlug || undefined,
          deletedAt: null,
        },
        omit: {
          deletedAt: true,
        },
      })

      if (!workspace) {
        throw new ArgosApiError({
          code: 'not_found',
          message: 'Workspace not found.',
        })
      }

      return await handler({
        req,
        params: resolvedParams,
        searchParams,
        headers,
        // session,
        workspace,
      })
    } catch (error) {
      return handleAndReturnErrorResponse(error, headers)
    }
  }
}
