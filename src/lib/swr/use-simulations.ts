import useSWR from 'swr'

import { useRouterStuff } from '@/hooks/use-router-stuff'
import { fetcher } from '@/lib/fetcher'
import { Simulation, Workspace } from '@prisma/client'

export type SimulationsResponse = Simulation & {
  workspace: Workspace
  _count: {
    executions: number
  }
}

export function useSimulations() {
  const { getQueryString } = useRouterStuff()

  const { data, ...rest } = useSWR<{
    simulations: SimulationsResponse[]
  }>(`/api/simulations${getQueryString()}`, fetcher, {
    dedupingInterval: 20000,
    revalidateOnFocus: false,
    keepPreviousData: true,
  })

  return {
    simulations: data?.simulations,
    ...rest,
  }
}
