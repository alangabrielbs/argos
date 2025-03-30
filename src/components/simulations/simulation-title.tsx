import { cn } from '@/lib/utils'
import { DataSource, SimulationStatus } from '@prisma/client'
import { addHours, format, subHours } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Check,
  CheckCircle,
  CheckCircle2,
  Clock,
  DatabaseBackup,
  FileEdit,
  Icon,
  Loader,
  LucideProps,
  XCircle,
} from 'lucide-react'
import { JSX, memo, ReactNode } from 'react'
import { DatabricksIcon } from '../icons/databricks'
import { SimulationsResponse } from './simulations-container'

const LOGO_SIZE_CLASS_NAME =
  'size-3 sm:size-5 group-data-[variant=loose]/card-list:sm:size-5'

export const SimulationTitle = ({
  simulation,
}: {
  simulation: SimulationsResponse
}) => {
  return (
    <div className="flex h-[32px] items-center gap-3 transition-[height] group-data-[variant=loose]/card-list:h-[60px]">
      <SimulationIcon simulation={simulation} />

      <div className="h-[24px] min-w-0 overflow-hidden transition-[height] group-data-[variant=loose]/card-list:h-[46px]">
        <div className="flex items-center gap-2">
          <div className="min-w-0 shrink grow-0 text-neutral-950">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'min-w-0 truncate font-semibold leading-6 text-neutral-800'
                )}
              >
                <span className="text-muted-foreground">
                  {simulation.workspace.name}
                </span>{' '}
                • {simulation.name}
              </span>
            </div>
          </div>

          <Details simulation={simulation} compact />
        </div>

        <Details simulation={simulation} />
      </div>
    </div>
  )
}

const Icons: Record<DataSource, () => JSX.Element> = {
  DATABRICKS: () => <DatabricksIcon className={LOGO_SIZE_CLASS_NAME} />,
  SIMULATION: () => (
    <DatabaseBackup
      className={cn('text-muted-foreground', LOGO_SIZE_CLASS_NAME)}
    />
  ),
}

const SimulationIcon = memo(
  ({ simulation }: { simulation: SimulationsResponse }) => {
    const Icon = Icons[simulation.dataSource]

    return (
      <button
        type="button"
        className={cn(
          'group relative hidden shrink-0 items-center justify-center outline-none sm:flex'
        )}
      >
        <div className="absolute inset-0 shrink-0 rounded-full border border-neutral-200 opacity-0 transition-opacity group-data-[variant=loose]/card-list:sm:opacity-100">
          <div className="h-full w-full rounded-full border border-white bg-gradient-to-t from-neutral-100" />
        </div>
        <div className="relative transition-[padding,transform] group-hover:scale-90 group-data-[variant=loose]/card-list:sm:p-2">
          <div className="hidden sm:block">
            <Icon />
          </div>
          <div className="size-5 group-data-[variant=loose]/card-list:size-6 sm:hidden" />
        </div>

        {/* Checkbox */}
        <div
          className={cn(
            'pointer-events-none absolute inset-0 flex items-center justify-center rounded-full border border-neutral-400 bg-white ring-0 ring-black/5',
            'opacity-100 max-sm:ring sm:opacity-0',
            'transition-all duration-150 group-hover:opacity-100 group-hover:ring group-focus-visible:opacity-100 group-focus-visible:ring',
            'group-data-[checked=true]:opacity-100'
          )}
        >
          <div
            className={cn(
              'rounded-full bg-neutral-800 p-[1px] group-data-[variant=loose]/card-list:p-1.5',
              'scale-90 opacity-0 transition-[transform,opacity] duration-100 group-data-[checked=true]:scale-100 group-data-[checked=true]:opacity-100'
            )}
          >
            <Check className="size-3 text-white" />
          </div>
        </div>
      </button>
    )
  }
)

const Details = memo(
  ({
    simulation,
    compact,
  }: { simulation: SimulationsResponse; compact?: boolean }) => {
    return (
      <div
        className={cn(
          'min-w-0 items-center whitespace-nowrap text-sm transition-[opacity,display] delay-[0s,150ms] duration-[150ms,0s]',
          compact
            ? [
                'hidden gap-2.5 opacity-0 group-data-[variant=compact]/card-list:flex group-data-[variant=compact]/card-list:opacity-100',
                'xs:min-w-[40px] xs:basis-[40px] min-w-0 shrink-0 grow basis-0 sm:min-w-[120px] sm:basis-[120px]',
              ]
            : 'hidden gap-1.5 opacity-0 group-data-[variant=loose]/card-list:flex group-data-[variant=loose]/card-list:opacity-100 md:gap-3'
        )}
      >
        <div className="flex min-w-0 items-center gap-1">
          <span className="truncate text-neutral-500">
            {format(addHours(simulation.startDate, 3), "dd 'de' MMM 'de' y", {
              locale: ptBR,
            })}{' '}
            -{' '}
            {format(addHours(simulation.endDate, 3), "dd 'de' MMM 'de' y", {
              locale: ptBR,
            })}
          </span>
        </div>
      </div>
    )
  }
)
