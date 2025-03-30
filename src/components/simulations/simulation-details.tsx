import {
  CheckCircle,
  CircleDollarSign,
  Clock,
  FileEdit,
  Loader,
  LucideIcon,
  Play,
  ReceiptText,
  RefreshCcw,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'

import { useCardList } from '@/components/card-list/card-list'
import { SimulationsResponse } from '@/components/simulations/simulations-container'
import { cn } from '@/lib/utils'
import { SimulationStatus } from '@prisma/client'
import { Button } from '../ui/button-shadcn'

const StatusLabels: Record<
  SimulationStatus,
  { icon: LucideIcon; color: string; bg: string; border: string; label: string }
> = {
  COMPLETED: {
    label: 'Simulação completa',
    icon: CheckCircle,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-500',
  },
  RUNNING: {
    label: 'Simulação em execução',
    icon: RefreshCcw,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-500',
  },
  PENDING: {
    label: 'Simulação em execução',
    icon: Clock,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-500',
  },
  DRAFT: {
    label: 'Simulação aguardando execução',
    icon: FileEdit,
    color: 'text-neutral-600',
    bg: 'bg-neutral-50',
    border: 'border-neutral-500',
  },
  ERROR: {
    label: 'Erro na execução',
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-500',
  },
}

export const SimulationDetails = ({
  simulation,
}: { simulation: SimulationsResponse }) => {
  const { variant } = useCardList()

  if (simulation.status === 'COMPLETED') {
    return (
      <div className="flex items-center gap-x-2">
        <Link
          href={`/simulacoes/${simulation.id}/`}
          className={cn(
            'group overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 p-0.5 text-sm text-neutral-600 transition-colors',
            variant === 'loose' ? 'hover:bg-neutral-100' : 'hover:bg-white'
          )}
        >
          <div className="items-center flex gap-1.5 font-semibold whitespace-nowrap rounded-md px-1 py-px transition-colors group-hover:text-emerald-500">
            <CircleDollarSign className="text-emerald-500 size-4 shrink-0" />
            {Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              maximumFractionDigits: 2,
            }).format(Number(simulation.totalOrderValue))}
          </div>
        </Link>

        <Link
          href={`/simulacoes/${simulation.id}/`}
          className={cn(
            'group overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 p-0.5 text-sm text-neutral-600 transition-colors',
            variant === 'loose' ? 'hover:bg-neutral-100' : 'hover:bg-white'
          )}
        >
          <div className="items-center flex gap-1.5 font-semibold whitespace-nowrap rounded-md px-1 py-px transition-colors group-hover:text-[#ea1d2c]">
            <ReceiptText className="text-[#ea1d2c] size-4 shrink-0" />
            {Intl.NumberFormat('pt-BR', {
              maximumFractionDigits: 2,
            }).format(Number(simulation.totalOrders))}
          </div>
        </Link>
      </div>
    )
  }

  const {
    icon: Icon,
    color,
    bg,
    border,
    label,
  } = StatusLabels[simulation.status]

  return (
    <div className="flex items-center gap-x-2">
      <div
        className={cn(
          'group overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 p-0.5 text-sm text-neutral-600 transition-colors',
          bg,
          border
        )}
      >
        <div
          className={cn(
            'flex items-center gap-1.5 font-semibold whitespace-nowrap rounded-md px-1 py-px transition-colors',
            color
          )}
        >
          <Icon className={cn(color, 'size-4 shrink-0')} />
          {label}
        </div>
      </div>

      {simulation.status !== 'PENDING' && (
        <Button size="icon" variant="ghost">
          {simulation.status === 'DRAFT' ? <Play /> : <RefreshCcw />}
        </Button>
      )}
    </div>
  )
}
