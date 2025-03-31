'use client'

import { ChevronDown, ListFilter, Plus } from 'lucide-react'
import { useState } from 'react'

import { AnimatedSizeContainer } from '@/components/animated-size-container'

import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { nanoid } from 'nanoid'
import { Popover } from '../popover'
import { Button } from '../ui/button'
import { FilterSelect } from './filter-select'
import { FilterOption } from './filters-options'

export type Filter = {
  id: string
  field: FilterOption | null
  condition: 'is' | 'notIs' | 'contains' | 'notContains'
  value: string
}

export type OnChangeField = {
  id: string
  field: FilterOption | null
}

export const Filter = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { isMobile } = useMediaQuery()
  const [filters, setFilters] = useState<Filter[]>([
    {
      id: nanoid(),
      field: null,
      condition: 'is',
      value: '',
    },
  ])

  const [activeFilters, setActiveFilters] = useState(
    filters.filter(filter => filter.field !== null)
  )

  useKeyboardShortcut('f', () => setIsOpen(true), {
    enabled: !isOpen,
  })

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
    <Popover
      openPopover={isOpen}
      setOpenPopover={setIsOpen}
      align="start"
      content={
        <AnimatedSizeContainer
          width={!isMobile}
          height
          className="rounded-[inherit]"
          style={{ transform: 'translateZ(0)' }}
        >
          <div className="space-y-3 min-w-[550px] p-3">
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

              <Button
                className="w-fit"
                text="Aplicar"
                variant="primary"
                onClick={() => {
                  setIsOpen(false)
                  setActiveFilters(
                    filters.filter(filter => filter.field !== null)
                  )
                }}
              />
            </div>
          </div>
        </AnimatedSizeContainer>
      }
    >
      <button
        type="button"
        className={cn(
          'group flex h-10 cursor-pointer appearance-none items-center gap-x-2 truncate rounded-md border px-3 text-sm outline-none transition-all',
          'border-neutral-200 bg-white text-neutral-900 placeholder-neutral-400',
          'focus-visible:border-neutral-500 data-[state=open]:border-neutral-500 data-[state=open]:ring-4 data-[state=open]:ring-neutral-200'
        )}
      >
        <ListFilter className="size-4 shrink-0" />

        <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left text-neutral-900">
          Filtros
        </span>

        {activeFilters?.length ? (
          <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-black text-[0.625rem] text-white">
            {activeFilters.length}
          </div>
        ) : (
          <ChevronDown className="size-4 shrink-0 text-neutral-400 transition-transform duration-75 group-data-[state=open]:rotate-180" />
        )}
      </button>
    </Popover>
  )
}
