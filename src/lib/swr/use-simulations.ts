import useSWR from 'swr'

import { fetcher } from '@/lib/fetcher'
import { Simulation, Workspace } from '@prisma/client'

export type SimulationsResponse = Simulation & {
  workspace: Workspace
}

export function useSimulations() {
  const { data, ...rest } = useSWR<{
    simulations: SimulationsResponse[]
  }>('/api/simulations', fetcher, {
    dedupingInterval: 20000,
    revalidateOnFocus: false,
    keepPreviousData: true,
  })

  return {
    simulations: data?.simulations,
    ...rest,
  }
}
