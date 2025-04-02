'use client'

import { useExecuteSimulation } from '@/components/modals/execute-simulation-modal'
import { TabSelect } from '@/components/tab-select'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'
import { useSimulation } from '@/lib/swr/use-simulation'
import { redirect, useRouter, useSelectedLayoutSegment } from 'next/navigation'
import { HeaderSkeleton } from './header-skeleton'

export const SimularionHeader = () => {
  const { isLoading, simulation } = useSimulation()
  const router = useRouter()

  const {
    ExecuteSimulationModal,
    ExecuteSimulationModalButton,
    setShowExecuteSimulationModal,
  } = useExecuteSimulation()
  useKeyboardShortcut('e', () => setShowExecuteSimulationModal(true))

  const selectedLayoutSegment = useSelectedLayoutSegment()
  const page = selectedLayoutSegment === null ? '' : selectedLayoutSegment

  if (isLoading) {
    return <HeaderSkeleton />
  }

  if (!simulation) {
    redirect('/simulacoes')
  }

  if (selectedLayoutSegment === null) {
    redirect(`/simulacoes/${simulation?.id}/execucoes`)
  }

  return (
    <>
      <div className="border-b border-neutral-200">
        <ExecuteSimulationModal />

        <div className="flex items-center justify-between">
          <div className="w-full">
            <h1 className="text-2xl font-semibold tracking-tight text-black">
              <span className="text-slate-600">
                {simulation.workspace.name}
              </span>{' '}
              • {simulation.name}
            </h1>
            <p className="mb-2 mt-2 text-base text-neutral-600">
              {simulation.description}
            </p>
          </div>

          <ExecuteSimulationModalButton />
        </div>

        <TabSelect
          variant="accent"
          options={[
            { id: 'execucoes', label: 'Execuções' },
            { id: 'logs', label: 'Logs' },
          ]}
          selected={page}
          onSelect={(url: string) => {
            router.push(`/simulacoes/${simulation?.id}/${url}`)
          }}
        />
      </div>
    </>
  )
}
