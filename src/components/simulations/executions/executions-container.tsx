'use client'

import { CardList } from '@/components/card-list'
import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { useCalculateKpi } from '@/components/modals/calculate-kpi-modal'
import { Button } from '@/components/ui/button'
import { ExecutionsResponse, useExecutions } from '@/lib/swr/use-executions'
import { JsonValue } from '@prisma/client/runtime/library'
import { useState } from 'react'
import { ExecutionTitle } from './execution-title'
import { ExecutionsCardSkeleton } from './executions-card-skeleton'

export const ExecutionsContainer = () => {
  const { executions, isLoading, isValidating } = useExecutions()

  return (
    <MaxWidthWrapper>
      <ExecutionsList
        loading={isLoading || isValidating}
        view="loose"
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
  const [values, setValues] = useState<
    | {
        values: JsonValue
        formulas: ExecutionsResponse['formulas']
      }
    | undefined
  >(undefined)

  const { CalculateKpiModal, setShowCalculateKpiModal } = useCalculateKpi({
    values,
    setValues,
  })

  if (loading) {
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

  if (!executions?.length) {
    return (
      <div className="text-center text-gray-500">
        Não há execuções disponíveis no momento.
      </div>
    )
  }

  return (
    <>
      <CalculateKpiModal />

      <CardList variant={view} loading={loading}>
        {executions.map(execution => (
          <CardList.Card
            innerClassName="flex items-center gap-5 sm:gap-8 md:gap-12 text-sm"
            key={execution.id}
          >
            <div className="min-w-0 grow">
              <ExecutionTitle execution={execution} />
            </div>

            {execution.formulas
              .filter(formula => formula.readyAt)
              .map(formula => (
                <div key={formula.id}>{formula.result}</div>
              ))}

            <div className="ml-auto flex items-center gap-2">
              <div>
                <Button
                  text="Calcular KPI"
                  variant="success"
                  onClick={() => {
                    setValues({
                      values: execution.values,
                      formulas: execution.formulas,
                    })
                    setShowCalculateKpiModal(true)
                  }}
                />
              </div>
            </div>
          </CardList.Card>
        ))}
      </CardList>
    </>
  )
}
