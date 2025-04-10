import { Formula } from '@prisma/client'

export const getKpis = async ({
  slug,
  query,
}: { slug: string; query?: string }): Promise<Formula[]> => {
  const res = await fetch(
    `/api/${slug}/kpis${query ? `?query=${query}` : ''}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!res.ok) {
    throw new Error('Falha ao buscar KPIs')
  }

  const { formulas } = await res.json()
  return formulas
}
