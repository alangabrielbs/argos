import useSWR from 'swr'

import { useRouterStuff } from '@/hooks/use-router-stuff'
import { fetcher } from '@/lib/fetcher'
import { Execution, Formula, FormulaExecution, Variable } from '@prisma/client'
import { useParams } from 'next/navigation'

export type ExecutionsResponse = Execution & {
  formulas: (FormulaExecution & {
    formula: Formula & {
      variables: Variable[]
    }
  })[]
}

export function useExecutions() {
  const { getQueryString } = useRouterStuff()
  const { id } = useParams() as { id: string | null }

  const { data, ...rest } = useSWR<{
    executions: ExecutionsResponse[]
  }>(id && `/api/simulations/${id}/executions${getQueryString()}`, fetcher, {
    dedupingInterval: 20000,
    revalidateOnFocus: false,
    keepPreviousData: true,
  })

  return {
    executions: data?.executions,
    ...rest,
  }
}
