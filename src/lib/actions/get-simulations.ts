import { Simulation } from '@prisma/client'

export const getSimulations = async (
  query?: string,
  workspaceId?: string
): Promise<(Simulation & { workspace: { name: string } })[]> => {
  const searchParams = new URLSearchParams()
  if (query) {
    searchParams.append('query', query)
  }
  if (workspaceId) {
    searchParams.append('workspaceId', workspaceId)
  }

  searchParams.append('status', 'COMPLETED')

  const queryString = searchParams.toString()

  const res = await fetch(`/api/simulations?${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch simulations')
  }

  const { simulations } = await res.json()
  return simulations
}
