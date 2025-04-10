import useSWR, { SWRConfiguration } from 'swr'

import { fetcher } from '@/lib/fetcher'
import { Workspace } from '@prisma/client'
import { useParams, useSearchParams } from 'next/navigation'

export function useWorkspace({
  swrOpts,
}: {
  swrOpts?: SWRConfiguration
} = {}) {
  let { slug } = useParams() as { slug: string | null }
  const searchParams = useSearchParams()
  if (!slug) {
    slug = searchParams.get('slug') || searchParams.get('company')
  }

  const { data, error, isLoading } = useSWR<{
    workspace: Workspace
  }>(`/api/workspaces/${slug}`, fetcher, {
    dedupingInterval: 60000,
    ...swrOpts,
  })

  return {
    workspaces: data?.workspace,
    error,
    isLoading,
  }
}
