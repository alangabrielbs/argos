import { CardList } from '@/components/card-list'
import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { SimulationCardSkeleton } from '@/components/simulations/simulation-card-skeleton'
import { Button } from '@/components/ui/button-shadcn'
import { useSimulations } from '@/lib/swr/use-simulations'
import { cn } from '@/lib/utils'
import { Simulation, Workspace } from '@prisma/client'
import { RefreshCcw } from 'lucide-react'
import { useState } from 'react'
import { SimulationCard } from './simulation-card'

export const SimulationsContainer = () => {
  const [view, setView] = useState<'compact' | 'loose'>('compact')
  const { simulations, isLoading, mutate, isValidating } = useSimulations()

  return (
    <MaxWidthWrapper>
      <div className="flex items-center gap-x-4 mb-4">
        <Button variant="outline" onClick={() => mutate()}>
          <RefreshCcw
            className={cn('size-4', {
              'animate-spin': isValidating,
            })}
          />
          {isValidating ? 'Atualizando...' : 'Atualizar'}
        </Button>

        <Button
          onClick={() =>
            setView(oldView => (oldView === 'compact' ? 'loose' : 'compact'))
          }
          variant="outline"
        >
          {view === 'compact' ? 'Ver como: Cards' : 'Ver como: Linhas'}
        </Button>
      </div>

      <SimulationsList
        loading={isLoading || isValidating}
        simulations={simulations}
        view={view}
      />
    </MaxWidthWrapper>
  )
}

export type SimulationsResponse = Simulation & {
  workspace: Workspace
}

const SimulationsList = ({
  loading,
  simulations,
  view,
}: {
  view: 'compact' | 'loose'
  loading?: boolean
  simulations?: SimulationsResponse[]
}) => {
  return (
    <CardList variant={view} loading={loading}>
      {simulations?.length
        ? simulations.map(simulation => (
            <SimulationCard key={simulation.id} simulation={simulation} />
          ))
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
