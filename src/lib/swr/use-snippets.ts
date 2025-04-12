import useSWR from 'swr'

import { fetcher } from '@/lib/fetcher'
import { SqlSnippet } from '@prisma/client'
import { useParams, useSearchParams } from 'next/navigation'

export type SnippetsResponse = SqlSnippet

export function useSnippets() {
  let { slug } = useParams() as { slug: string | null }
  const searchParams = useSearchParams()
  if (!slug) {
    slug = searchParams.get('slug') || searchParams.get('workspace')
  }

  const { data, ...rest } = useSWR<{
    snippets: SnippetsResponse[]
  }>(`/api/${slug}/settings/snippets`, fetcher, {
    dedupingInterval: 20000,
    revalidateOnFocus: false,
    keepPreviousData: true,
  })

  return {
    snippets: data?.snippets,
    ...rest,
  }
}
