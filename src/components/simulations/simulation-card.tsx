import { ArrowRight } from 'lucide-react'
import { CardList } from '../card-list'
import { SimulationDetails } from './simulation-details'
import { SimulationTitle } from './simulation-title'
import { SimulationsResponse } from './simulations-container'

export const SimulationCard = ({
  simulation,
}: {
  simulation: SimulationsResponse
}) => {
  return (
    <CardList.Card innerClassName="flex items-center gap-5 sm:gap-8 md:gap-12 text-sm">
      <div className="min-w-0 grow">
        <SimulationTitle simulation={simulation} />
      </div>

      <SimulationDetails simulation={simulation} />
    </CardList.Card>
  )
}
