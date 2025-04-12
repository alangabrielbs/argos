import useSWR from 'swr'

import { fetcher } from '@/lib/fetcher'
import { DatabricksSQLDataSource } from '@prisma/client'
import { useParams, useSearchParams } from 'next/navigation'

export type DataSourcesResponse = DatabricksSQLDataSource

export function useDataSources() {
  let { slug } = useParams() as { slug: string | null }
  const searchParams = useSearchParams()
  if (!slug) {
    slug = searchParams.get('slug') || searchParams.get('workspace')
  }

  const { data, ...rest } = useSWR<{
    dataSources: DataSourcesResponse[]
  }>(`/api/${slug}/settings/data-sources`, fetcher, {
    dedupingInterval: 20000,
    revalidateOnFocus: false,
    keepPreviousData: true,
  })

  return {
    dataSources: data?.dataSources,
    ...rest,
  }
}
