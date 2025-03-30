import { Workspace } from '@prisma/client'

export const getWorkspaces = async (query?: string): Promise<Workspace[]> => {
  const res = await fetch(`/api/workspaces${query ? `?query=${query}` : ''}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch Workspaces')
  }

  const { workspaces } = await res.json()
  return workspaces
}
