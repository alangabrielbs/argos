import useSWR from 'swr'

import { fetcher } from '@/lib/fetcher'
import { Formula } from '@prisma/client'

export type KpisResponse = Formula & {
  _count: {
    simulations: number
  }
}

export function useKpis() {
  const { data, ...rest } = useSWR<{
    formulas: KpisResponse[]
  }>('/api/kpis', fetcher, {
    dedupingInterval: 20000,
    keepPreviousData: true,
  })

  return {
    kpis: data?.formulas,
    ...rest,
  }
}
