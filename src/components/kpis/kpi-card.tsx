import { KpisResponse } from '@/lib/swr/use-kpis'
import { CardList } from '../card-list'
import { KpiDetails } from './kpi-details'
import { KpiTitle } from './kpi-title'

export const KpiCard = ({
  kpi,
}: {
  kpi: KpisResponse
}) => {
  return (
    <CardList.Card innerClassName="flex items-center gap-5 sm:gap-8 md:gap-12 text-sm">
      <div className="min-w-0 grow">
        <KpiTitle kpi={kpi} />
      </div>

      <KpiDetails kpi={kpi} />
    </CardList.Card>
  )
}
