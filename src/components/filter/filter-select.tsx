'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trash } from 'lucide-react'
import { Button } from '../ui/button'
import { Filter, OnChangeField } from './filter'
import { FILTER_OPTIONS } from './filters-options'

export const FilterSelect = ({
  filter,
  onChangeField,
  onChangeCondition,
  onChangeValue,
  onRemoveFilter,
}: {
  filter: Filter
  onChangeField: (props: OnChangeField) => void
  onChangeCondition: (
    id: string,
    condition: 'is' | 'notIs' | 'contains' | 'notContains'
  ) => void
  onChangeValue: (id: string, value: string) => void
  onRemoveFilter: (id: string) => void
}) => {
  return (
    <div className="flex items-center justify-between gap-x-2">
      <div>
        <Select
          defaultValue={filter.field?.field.id}
          onValueChange={value => {
            const selectedOption = FILTER_OPTIONS.find(
              option => option.field.id === value
            )

            onChangeField({
              id: filter.id,
              field: selectedOption ?? null,
            })
          }}
        >
          <SelectTrigger className="w-[175px]">
            <SelectValue placeholder="Item" />
          </SelectTrigger>
          <SelectContent>
            {FILTER_OPTIONS.map(({ field: { id, name, icon: Icon } }) => (
              <SelectItem key={id} value={id}>
                {Icon && <Icon />} {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Select
          defaultValue={filter.condition}
          onValueChange={value => {
            onChangeCondition(
              filter.id,
              value as 'is' | 'notIs' | 'contains' | 'notContains'
            )
          }}
        >
          <SelectTrigger className="w-[175px]">
            <SelectValue placeholder="Condição" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="is">É</SelectItem>
            <SelectItem value="notIs">Não é</SelectItem>
            <SelectItem value="contains">Contém</SelectItem>
            <SelectItem value="notContains">Não contém</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Select
          disabled={!filter.field}
          defaultValue={filter.value}
          onValueChange={value => {
            onChangeValue(filter.id, value)
          }}
        >
          <SelectTrigger className="w-[175px]">
            <SelectValue placeholder="Valor" />
          </SelectTrigger>
          <SelectContent>
            {filter?.field?.field.options?.map(({ id, label, icon: Icon }) => (
              <SelectItem key={id} value={id}>
                {Icon && <Icon />} {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        icon={<Trash className="size-4" />}
        variant="danger-outline"
        onClick={() => onRemoveFilter(filter.id)}
      />
    </div>
  )
}
