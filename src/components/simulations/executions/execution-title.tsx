import { ExecutionsResponse } from '@/lib/swr/use-executions'
import { cn } from '@/lib/utils'
import { ExecutionStatus } from '@prisma/client'

const Status: Record<ExecutionStatus, string> = {
  CALCULATED: 'Calculando',
  COMPLETED: 'Completo',
  ERROR: 'Error',
  DRAFT: 'Rascunho',
  ERROR_WHILE_CALCULATING: 'Erro ao calcular',
  PENDING: 'Pendente',
  RUNNING: 'Executando',
}

export const ExecutionTitle = ({
  execution,
}: {
  execution: ExecutionsResponse
}) => {
  const isCompleted = execution.status === ExecutionStatus.COMPLETED

  return (
    <div className="flex h-[32px] items-center gap-3 transition-[height] group-data-[variant=loose]/card-list:h-[60px]">
      <div className="h-[24px] min-w-0 overflow-hidden transition-[height] group-data-[variant=loose]/card-list:h-[46px]">
        <div className="flex items-center gap-2">
          <div className="min-w-0 shrink grow-0 text-neutral-950">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'min-w-0 truncate font-semibold leading-6 text-neutral-800'
                )}
              >
                {execution.formulas.map(formula => formula.result).join(', ')}
              </span>
            </div>
          </div>

          {/* <Details simulation={simulation} compact /> */}
        </div>
        {isCompleted && (
          <span className={cn('text-muted-foreground')}>
            {Status[execution.status]}
          </span>
        )}

        {/* <Details simulation={simulation} /> */}
      </div>
    </div>
  )
}
