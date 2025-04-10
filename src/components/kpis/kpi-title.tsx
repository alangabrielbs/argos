import { KpisResponse } from '@/lib/swr/use-kpis'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { memo } from 'react'

export const KpiTitle = ({
  kpi,
}: {
  kpi: KpisResponse
}) => {
  const { slug } = useParams() as { slug: string | null }

  return (
    <div className="flex h-[32px] items-center gap-3 transition-[height] group-data-[variant=loose]/card-list:h-[60px]">
      <div className="h-[24px] min-w-0 overflow-hidden transition-[height] group-data-[variant=loose]/card-list:h-[46px]">
        <Link href={`/${slug}/kpis/${kpi.id}`}>
          <div className="flex items-center gap-2">
            <div className="min-w-0 shrink grow-0 text-neutral-950">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'min-w-0 truncate font-semibold leading-6 text-neutral-800'
                  )}
                >
                  {kpi.name}
                </span>
              </div>
            </div>

            <Details compact kpi={kpi} />
          </div>
        </Link>

        <Details kpi={kpi} />
      </div>
    </div>
  )
}

const Details = memo(
  ({ compact, kpi }: { kpi: KpisResponse; compact?: boolean }) => {
    return (
      <div
        className={cn(
          'min-w-0 font-mono tracking-tight items-center whitespace-nowrap text-sm transition-[opacity,display] delay-[0s,150ms] duration-[150ms,0s]',
          compact
            ? [
                'hidden gap-2.5 opacity-0 group-data-[variant=compact]/card-list:flex group-data-[variant=compact]/card-list:opacity-100',
                'xs:min-w-[40px] xs:basis-[40px] min-w-0 shrink-0 grow basis-0 sm:min-w-[120px] sm:basis-[120px]',
              ]
            : 'hidden gap-1.5 opacity-0 group-data-[variant=loose]/card-list:flex group-data-[variant=loose]/card-list:opacity-100 md:gap-3'
        )}
      >
        <div className="flex min-w-0 items-center gap-1">
          <span className="truncate text-neutral-500">{kpi.expression}</span>
        </div>
      </div>
    )
  }
)
