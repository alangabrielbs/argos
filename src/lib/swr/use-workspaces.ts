import useSWR from 'swr'

import { fetcher } from '@/lib/fetcher'
import { Workspace } from '@prisma/client'

export function useWorkspaces() {
  const { data, error, isLoading } = useSWR<{
    workspaces: Workspace[]
  }>('/api/workspaces', fetcher, {
    dedupingInterval: 60000,
  })

  return {
    workspaces: data?.workspaces,
    error,
    isLoading,
  }
}
