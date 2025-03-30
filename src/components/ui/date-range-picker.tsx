'use client'

import { Button } from '@/components/ui/button-shadcn'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { addDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { type DateRange } from 'react-day-picker'

export default function DateRangePicker({
  className,
  onChange,
  value,
}: React.HTMLAttributes<HTMLDivElement> & {
  onChange: (date: DateRange) => void
  value: DateRange
}) {
  const [date, setDate] = React.useState<DateRange | undefined>(value)

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "dd 'de' MMMM 'de' y", {
                    locale: ptBR,
                  })}{' '}
                  -{' '}
                  {format(value.to, "dd 'de' MMMM 'de' y", {
                    locale: ptBR,
                  })}
                </>
              ) : (
                format(value.from, "dd 'de' MMMM 'de' y", {
                  locale: ptBR,
                })
              )
            ) : (
              <span>Selecione uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            autoFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            required
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
