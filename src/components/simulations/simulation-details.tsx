import { CircleDollarSign, ReceiptText, RefreshCw } from 'lucide-react'
import Link from 'next/link'

import { useCardList } from '@/components/card-list/card-list'
import { SimulationsResponse } from '@/components/simulations/simulations-container'
import { pluralize } from '@/lib/pluralize'
import { cn } from '@/lib/utils'
import { useParams } from 'next/navigation'

export const SimulationDetails = ({
  simulation,
}: { simulation: SimulationsResponse }) => {
  const { variant } = useCardList()
  const { slug } = useParams() as { slug?: string }

  return (
    <div className="flex items-center gap-x-2">
      <Link
        href={`/${slug}/simulacoes/${simulation.id}/execucoes`}
        className={cn(
          'group overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 p-0.5 text-sm text-neutral-600 transition-colors',
          variant === 'loose' ? 'hover:bg-neutral-100' : 'hover:bg-white'
        )}
      >
        <div className="items-center flex gap-1.5 font-semibold whitespace-nowrap rounded-md px-1 py-px transition-colors group-hover:text-sky-500">
          <RefreshCw className="text-sky-600 size-4 shrink-0" strokeWidth={2} />
          {simulation._count.executions}
          {pluralize(' execução', simulation._count.executions, {
            plural: ' exeuções',
          })}
        </div>
      </Link>
    </div>
  )
}
