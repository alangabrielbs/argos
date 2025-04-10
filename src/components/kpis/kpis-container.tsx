'use client'

import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'
import { KpisResponse, useKpis } from '@/lib/swr/use-kpis'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { CardList } from '../card-list'
import { MaxWidthWrapper } from '../max-width-wrapper'
import { SimulationCardSkeleton } from '../simulations/simulation-card-skeleton'
import { buttonVariants } from '../ui/button'
import { Button } from '../ui/button-shadcn'
import { KpiCard } from './kpi-card'

export const KpisContainer = () => {
  const router = useRouter()
  const { slug } = useParams() as { slug?: string }

  const [view, setView] = useState<'compact' | 'loose'>('compact')
  const { kpis, isLoading, isValidating } = useKpis()

  useKeyboardShortcut('e', () => router.push(`/${slug}/kpis/novo`))

  return (
    <MaxWidthWrapper>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-x-4 ">
          <Button
            onClick={() =>
              setView(oldView => (oldView === 'compact' ? 'loose' : 'compact'))
            }
            variant="outline"
          >
            {view === 'compact' ? 'Ver como: Cards' : 'Ver como: Linhas'}
          </Button>
        </div>

        <div>
          <Link
            className={cn(
              'group cursor-pointer flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md border px-4 text-sm',
              buttonVariants({ variant: 'success', size: 'default' })
            )}
            href={`/${slug}/kpis/novo`}
          >
            Novo KPI
            <kbd
              className={cn(
                'hidden rounded px-2 py-0.5 text-xs font-light transition-all duration-75 md:inline-block',

                'bg-blue-400 text-blue-100 group-hover:bg-blue-500 group-hover:text-white'
              )}
            >
              E
            </kbd>
          </Link>
        </div>
      </div>

      <KpisList loading={isLoading || isValidating} kpis={kpis} view={view} />
    </MaxWidthWrapper>
  )
}

const KpisList = ({
  loading,
  kpis,
  view,
}: {
  view: 'compact' | 'loose'
  loading?: boolean
  kpis?: KpisResponse[]
}) => {
  if (loading) {
    return (
      <CardList variant={view} loading={loading}>
        {Array.from({ length: 12 }).map((_, idx) => (
          <CardList.Card
            key={idx}
            outerClassName="pointer-events-none"
            innerClassName="flex items-center gap-4"
          >
            <SimulationCardSkeleton />
          </CardList.Card>
        ))}
      </CardList>
    )
  }

  if (!kpis?.length) {
    return (
      <div className="text-center text-gray-500">
        Não há KPIs disponíveis no momento.
      </div>
    )
  }

  return (
    <CardList variant={view} loading={loading}>
      {kpis.map(kpi => (
        <KpiCard key={kpi.id} kpi={kpi} />
      ))}
    </CardList>
  )
}
