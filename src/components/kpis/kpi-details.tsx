'use client'

import { pluralize } from '@/lib/pluralize'
import { KpisResponse } from '@/lib/swr/use-kpis'
import { cn } from '@/lib/utils'
import { FlaskConical } from 'lucide-react'
import Link from 'next/link'
import { useCardList } from '../card-list/card-list'

export const KpiDetails = ({
  kpi,
}: {
  kpi: KpisResponse
}) => {
  const { variant } = useCardList()

  return (
    <div className="flex items-center gap-x-2">
      <Link
        href={`/simulacoes?kpi=${kpi.name}`}
        className={cn(
          'group overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 p-0.5 text-sm text-neutral-600 transition-colors',
          variant === 'loose' ? 'hover:bg-neutral-100' : 'hover:bg-white'
        )}
      >
        <div className="items-center flex gap-1.5 font-semibold whitespace-nowrap rounded-md px-1 py-px transition-colors group-hover:text-emerald-900">
          <FlaskConical className="text-muted-foreground size-4 shrink-0" />
          {kpi._count.executions}{' '}
          {pluralize('execução', kpi._count.executions, {
            plural: 'execuções',
          })}
        </div>
      </Link>
    </div>
  )
}
