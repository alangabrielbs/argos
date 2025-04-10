import { useParams, useSearchParams } from 'next/navigation'
import useSWR from 'swr'

import { fetcher } from '@/lib/fetcher'
import { SimulationsResponse } from '@/lib/swr/use-simulations'

export function useSimulation() {
  let { slug, id } = useParams() as { slug: string | null; id: string | null }
  const searchParams = useSearchParams()
  if (!slug) {
    slug = searchParams.get('slug') || searchParams.get('workspace')
  }

  const { data, ...rest } = useSWR<{
    simulation: SimulationsResponse
  }>(id && `/api/${slug}/simulations/${id}`, fetcher, {
    revalidateOnFocus: false,
  })

  return {
    simulation: data?.simulation,
    ...rest,
  }
}
