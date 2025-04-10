import useSWR from 'swr'

import { useRouterStuff } from '@/hooks/use-router-stuff'
import { fetcher } from '@/lib/fetcher'
import { Simulation, Workspace } from '@prisma/client'
import { useParams, useSearchParams } from 'next/navigation'

export type SimulationsResponse = Simulation & {
  workspace: Workspace
  _count: {
    executions: number
  }
}

export function useSimulations() {
  const { getQueryString } = useRouterStuff()
  let { slug } = useParams() as { slug: string | null }
  const searchParams = useSearchParams()
  if (!slug) {
    slug = searchParams.get('slug') || searchParams.get('workspace')
  }

  const { data, ...rest } = useSWR<{
    simulations: SimulationsResponse[]
  }>(`/api/${slug}/simulations${getQueryString()}`, fetcher, {
    dedupingInterval: 20000,
    revalidateOnFocus: false,
    keepPreviousData: true,
  })

  return {
    simulations: data?.simulations,
    ...rest,
  }
}
