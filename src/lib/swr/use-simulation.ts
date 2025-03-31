import { useParams } from 'next/navigation'
import useSWR from 'swr'

import { fetcher } from '@/lib/fetcher'
import { SimulationsResponse } from '@/lib/swr/use-simulations'

export function useSimulation() {
  const { id } = useParams() as { id: string | null }

  const { data, ...rest } = useSWR<{
    simulation: SimulationsResponse
  }>(`/api/simulations/${id}`, fetcher, {
    revalidateOnFocus: false,
  })

  return {
    simulation: data?.simulation,
    ...rest,
  }
}
