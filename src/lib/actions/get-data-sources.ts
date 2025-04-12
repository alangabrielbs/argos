import { DatabricksSQLDataSource, Formula } from '@prisma/client'

export const getDataSources = async ({
  slug,
  query,
}: { slug: string; query?: string }): Promise<DatabricksSQLDataSource[]> => {
  const res = await fetch(
    `/api/${slug}/settings/data-sources${query ? `?query=${query}` : ''}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!res.ok) {
    throw new Error('Falha ao buscar Data Sources')
  }

  const { dataSources } = await res.json()
  return dataSources
}
