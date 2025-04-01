'use client'

import { Plus, X } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useCallback, useMemo, useState } from 'react'
import { AnimatedSizeContainer } from '../animated-size-container'
import { Filter, OnChangeField } from '../filter/filter'
import { FilterSelect } from '../filter/filter-select'
import { Modal } from '../modal'
import { Button } from '../ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet'

const ExecuteSimulationModal = ({
  setShowExecuteSimulationModal,
  showExecuteSimulationModal,
}: {
  showExecuteSimulationModal: boolean
  setShowExecuteSimulationModal: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [filters, setFilters] = useState<Filter[]>([
    {
      id: nanoid(),
      field: null,
      condition: 'is',
      value: '',
    },
  ])
  const onChangeField = ({ id, field }: OnChangeField) => {
    setFilters(prevFilters =>
      prevFilters.map(filter => {
        if (filter.id === id) {
          return {
            ...filter,
            field,
          }
        }
        return filter
      })
    )
  }

  const onChangeCondition = (
    id: string,
    condition: 'is' | 'notIs' | 'contains' | 'notContains'
  ) => {
    setFilters(prevFilters =>
      prevFilters.map(filter => {
        if (filter.id === id) {
          return {
            ...filter,
            condition,
          }
        }
        return filter
      })
    )
  }

  const onChangeValue = (id: string, value: string) => {
    setFilters(prevFilters =>
      prevFilters.map(filter => {
        if (filter.id === id) {
          return {
            ...filter,
            value,
          }
        }
        return filter
      })
    )
  }

  const onRemoveFilter = (id: string) => {
    setFilters(prevFilters => prevFilters.filter(filter => filter.id !== id))
  }

  return (
    <Sheet
      open={showExecuteSimulationModal}
      onOpenChange={setShowExecuteSimulationModal}
    >
      <SheetContent
        className="m-3 rounded-md h-[initial] w-[650px] !max-w-full px-0 overflow-hidden pb-10"
        hiddenCloseButton
      >
        <SheetHeader className="flex-row items-center justify-between space-y-0 border-b pb-4 px-6">
          <SheetTitle>Executar simulação</SheetTitle>

          <div className="flex items-center gap-x-4">
            <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="px-6">
          <AnimatedSizeContainer
            height
            className="rounded-[inherit]"
            style={{ transform: 'translateZ(0)' }}
          >
            <div className="space-y-3 w-full py-3">
              {filters.map((filter, index) => (
                <FilterSelect
                  key={index}
                  filter={filter}
                  onChangeField={onChangeField}
                  onChangeCondition={onChangeCondition}
                  onChangeValue={onChangeValue}
                  onRemoveFilter={onRemoveFilter}
                />
              ))}

              <div className="flex items-center justify-between">
                <Button
                  className="w-fit"
                  text="Adicionar filtro"
                  icon={<Plus className="size-4" />}
                  variant="outline"
                  onClick={() => {
                    setFilters([
                      ...filters,
                      {
                        field: null,
                        condition: 'is',
                        value: '',
                        id: nanoid(),
                      },
                    ])
                  }}
                />
              </div>
            </div>
          </AnimatedSizeContainer>
        </div>
      </SheetContent>
    </Sheet>
  )
}

const ExecuteSimulationModalButton = ({
  setShowExecuteSimulationModal,
}: {
  setShowExecuteSimulationModal: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <div>
      <Button
        text="Executar simulação"
        variant="success"
        shortcut="E"
        onClick={() => setShowExecuteSimulationModal(true)}
      />
    </div>
  )
}

export const useExecuteSimulation = () => {
  const [showExecuteSimulationModal, setShowExecuteSimulationModal] =
    useState(false)

  const ExecuteSimulationModalCallback = useCallback(() => {
    return (
      <ExecuteSimulationModal
        showExecuteSimulationModal={showExecuteSimulationModal}
        setShowExecuteSimulationModal={setShowExecuteSimulationModal}
      />
    )
  }, [showExecuteSimulationModal])

  const ExecuteSimulationModalButtonCallback = useCallback(() => {
    return (
      <ExecuteSimulationModalButton
        setShowExecuteSimulationModal={setShowExecuteSimulationModal}
      />
    )
  }, [])

  return useMemo(
    () => ({
      ExecuteSimulationModal: ExecuteSimulationModalCallback,
      ExecuteSimulationModalButton: ExecuteSimulationModalButtonCallback,
      setShowExecuteSimulationModal,
    }),
    [ExecuteSimulationModalCallback, ExecuteSimulationModalButtonCallback]
  )
}
