import useSWR from 'swr'

import { fetcher } from '@/lib/fetcher'
import { Formula } from '@prisma/client'
import { useParams, useSearchParams } from 'next/navigation'

export type KpisResponse = Formula & {
  _count: {
    executions: number
  }
}

export function useKpis() {
  let { slug } = useParams() as { slug: string | null }
  const searchParams = useSearchParams()
  if (!slug) {
    slug = searchParams.get('slug') || searchParams.get('workspace')
  }

  const { data, ...rest } = useSWR<{
    formulas: KpisResponse[]
  }>(`/api/${slug}/kpis`, fetcher, {
    dedupingInterval: 20000,
    keepPreviousData: true,
  })

  return {
    kpis: data?.formulas,
    ...rest,
  }
}
