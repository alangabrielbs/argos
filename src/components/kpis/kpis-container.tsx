'use client'

import { KpisResponse, useKpis } from '@/lib/swr/use-kpis'
import { useSimulations } from '@/lib/swr/use-simulations'
import { useState } from 'react'
import { CardList } from '../card-list'
import { MaxWidthWrapper } from '../max-width-wrapper'
import { SimulationCardSkeleton } from '../simulations/simulation-card-skeleton'
import { Button as PrimaryButton } from '../ui/button'
import { Button } from '../ui/button-shadcn'
import { KpiCard } from './kpi-card'

export const KpisContainer = () => {
  const [view, setView] = useState<'compact' | 'loose'>('compact')
  const { kpis, isLoading, isValidating } = useKpis()

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
          <PrimaryButton text="Novo KPI" variant="success" shortcut="E" />
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
  return (
    <CardList variant={view} loading={loading}>
      {kpis?.length
        ? kpis.map(kpi => <KpiCard key={kpi.id} kpi={kpi} />)
        : Array.from({ length: 12 }).map((_, idx) => (
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
