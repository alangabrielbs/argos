'use client'

import { CardList } from '@/components/card-list'
import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { ExecutionsResponse, useExecutions } from '@/lib/swr/use-executions'
import { ExecutionsCardSkeleton } from './executions-card-skeleton'

export const ExecutionsContainer = () => {
  const { executions, isLoading, isValidating } = useExecutions()

  return (
    <MaxWidthWrapper>
      <ExecutionsList
        loading={isLoading || isValidating}
        view="compact"
        executions={executions}
      />
    </MaxWidthWrapper>
  )
}

const ExecutionsList = ({
  loading,
  view,
  executions,
}: {
  view: 'compact' | 'loose'
  loading?: boolean
  executions?: ExecutionsResponse[]
}) => {
  return (
    <CardList variant={view} loading={loading}>
      {/* {Array.from({ length: 12 }).map((_, idx) => (
        <CardList.Card
          key={idx}
          outerClassName="pointer-events-none"
          innerClassName="flex items-center gap-4"
        >
          <ExecutionsCardSkeleton />
        </CardList.Card>
      ))} */}
      {executions?.length
        ? executions.map(execution => (
            <CardList.Card
              innerClassName="flex items-center gap-5 sm:gap-8 md:gap-12 text-sm"
              key={execution.id}
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold">{execution.status}</h3>
                <p className="text-xs text-muted-foreground">
                  {new Date(execution.createdAt).toString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  {execution.status}
                </span>
              </div>
            </CardList.Card>
          ))
        : Array.from({ length: 12 }).map((_, idx) => (
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
