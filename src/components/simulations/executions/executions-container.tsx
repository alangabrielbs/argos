'use client'

import { CardList } from '@/components/card-list'
import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { ExecutionsCardSkeleton } from './executions-card-skeleton'

export const ExecutionsContainer = () => {
  return (
    <MaxWidthWrapper>
      <ExecutionsList loading={false} view="compact" />
    </MaxWidthWrapper>
  )
}

const ExecutionsList = ({
  loading,
  view,
}: {
  view: 'compact' | 'loose'
  loading?: boolean
}) => {
  return (
    <CardList variant={view} loading={loading}>
      {Array.from({ length: 12 }).map((_, idx) => (
        <CardList.Card
          key={idx}
          outerClassName="pointer-events-none"
          innerClassName="flex items-center gap-4"
        >
          <ExecutionsCardSkeleton />
        </CardList.Card>
      ))}
    </CardList>
  )
}
