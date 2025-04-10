'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button-shadcn'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useDebounce } from '@/hooks/use-debounce'
import { cn } from '@/lib/utils'
import { Check, ChevronDown, LoaderIcon, SearchIcon, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

type MultiSelectionProps<T> = {
  value?: string[]
  onValueSelected: (selection?: string[]) => void
  isLoading?: boolean
  preload?: boolean
  placeholder?: string
  fetcher: (query?: string) => Promise<T[]>
  renderOption: (option: T) => React.ReactNode
  getOptionValue: (option: T) => string
  getDisplayValue: (option: T) => React.ReactNode
  filterFn?: (option: T, query: string) => boolean
  notFound?: React.ReactNode
  noResultsMessage?: string
  label: string
}

export function MultiSelection<T>({
  onValueSelected,
  value,
  isLoading,
  placeholder,
  fetcher,
  renderOption,
  getOptionValue,
  getDisplayValue,
  preload,
  filterFn,
  notFound,
  noResultsMessage,
  label,
}: MultiSelectionProps<T>) {
  const [options, setOptions] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedValue, setSelectedValue] = useState(value)
  const [mounted, setMounted] = useState(false)
  const [searchValue, setSearchValue] = React.useState('')

  const debouncedSearchTerm = useDebounce(searchValue, preload ? 0 : 300)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<T[] | null>([])
  const [originalOptions, setOriginalOptions] = useState<T[]>([])

  const handleTogglePopover = () => setIsPopoverOpen(prev => !prev)

  const handleUnselect = (item: T) => {
    const newValue = selectedValue?.filter(
      value => value !== getOptionValue(item)
    )
    setSelectedValue(newValue)
    setSelectedOptions(
      options.filter(option => newValue?.includes(getOptionValue(option)))
    )
  }

  const handleSelect = (currentValue: string) => {
    const newValue = selectedValue?.includes(currentValue)
      ? selectedValue.filter(item => item !== currentValue)
      : [...(selectedValue || []), currentValue]

    setSelectedValue(newValue)
    onValueSelected(newValue)

    const selectedOption = options.find(
      option => getOptionValue(option) === currentValue
    )
    if (selectedOption) {
      setSelectedOptions(prev => {
        if (prev?.some(item => getOptionValue(item) === currentValue)) {
          return prev.filter(item => getOptionValue(item) !== currentValue)
        }
        return [...(prev || []), selectedOption]
      })
    }
  }

  useEffect(() => {
    setMounted(true)
    setSelectedValue(value)
  }, [value])

  useEffect(() => {
    const initializeOptions = async () => {
      try {
        setLoading(true)
        // If we have a value, use it for the initial search
        const data = await fetcher(searchValue)
        setOriginalOptions(data)
        setOptions(data)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Falha ao carregar opções'
        )
      } finally {
        setLoading(false)
      }
    }

    if (!mounted) {
      initializeOptions()
    }
  }, [mounted, fetcher, searchValue])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetcher(debouncedSearchTerm)
        setOriginalOptions(data)
        setOptions(data)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Falha ao carregar opções'
        )
      } finally {
        setLoading(false)
      }
    }

    if (!mounted) {
      fetchOptions()
    } else if (!preload) {
      fetchOptions()
    } else if (preload) {
      if (debouncedSearchTerm) {
        setOptions(
          originalOptions.filter(option =>
            filterFn ? filterFn(option, debouncedSearchTerm) : true
          )
        )
      } else {
        setOptions(originalOptions)
      }
    }
  }, [fetcher, debouncedSearchTerm, mounted, preload, filterFn])

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <SelectedProperty<T>
        isLoading={isLoading}
        selected={selectedOptions}
        handleUnselect={handleUnselect}
        handleTogglePopover={handleTogglePopover}
        placeholder={placeholder}
        getDisplayValue={getDisplayValue}
      />
      <PopoverContent className="min-w-[var(--radix-popper-anchor-width)] p-0 max-h-[300px] overflow-hidden shadow-none">
        <div className="flex-grow overflow-auto">
          <Command
            className="overflow-hidden flex flex-col"
            filter={(value, _) => {
              if (value.toLowerCase().includes(searchValue.toLowerCase()))
                return 1
              return 0
            }}
          >
            <div className="flex h-9 items-center gap-2 border-b px-3 flex-1">
              <SearchIcon className="size-4 shrink-0 opacity-50" />
              <input
                className={cn(
                  'placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
                  'h-10 border-0 sticky top-0 z-10 bg-background'
                )}
                value={searchValue}
                onChange={event => setSearchValue(event.target.value)}
                placeholder="Pesquisar..."
              />
            </div>

            <CommandList className="overflow-auto">
              {error && (
                <div className="p-4 text-destructive text-center">{error}</div>
              )}

              {!loading &&
                !error &&
                options.length === 0 &&
                (notFound || (
                  <CommandEmpty>
                    {noResultsMessage ??
                      `Nenhuma ${label.toLowerCase()} encontrada.`}
                  </CommandEmpty>
                ))}

              <CommandGroup>
                {options.map(option => (
                  <CommandItem
                    className="cursor-pointer"
                    key={getOptionValue(option)}
                    value={getOptionValue(option)}
                    onSelect={handleSelect}
                  >
                    {renderOption(option)}
                    <Check
                      className={cn(
                        'ml-auto h-3 w-3',
                        selectedValue?.includes(getOptionValue(option))
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </PopoverContent>
    </Popover>
  )
}

type SelectedPropertyProps<T> = React.ComponentProps<'button'> & {
  selected: T[] | null
  isLoading?: boolean
  placeholder?: string
  handleTogglePopover?: () => void
  handleUnselect?: (value: T) => void
  getDisplayValue: (option: any) => React.ReactNode
}

function SelectedProperty<T>({
  selected = [],
  isLoading,
  handleTogglePopover,
  handleUnselect,
  className,
  placeholder,
  getDisplayValue,
  ...props
}: SelectedPropertyProps<T>) {
  return (
    <TooltipProvider>
      <PopoverTrigger asChild>
        <Button
          onClick={handleTogglePopover}
          disabled={isLoading}
          className={cn(
            'flex h-auto min-h-10 w-full items-center justify-between rounded-md border bg-white p-1 hover:bg-white/80 shadow-sm',
            className
          )}
          {...props}
        >
          {selected && selected.length > 0 ? (
            <Tooltip delayDuration={100}>
              <ScrollArea className="w-full">
                <TooltipTrigger asChild>
                  <div className="flex w-max gap-1">
                    {selected.map(item => (
                      <Badge
                        key={JSON.stringify(item)}
                        variant="secondary"
                        className="flex-shrink rounded-sm text-[13.6px] font-medium capitalize group"
                      >
                        {item ? getDisplayValue(item) : placeholder}
                        <span
                          className="ml-1 rounded-full outline-none ring-offset-background active:ring-2 active:ring-ring active:ring-offset-2 cursor-pointer"
                          onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleUnselect?.(item)
                          }}
                        >
                          <X className="size-3 text-rose-300 transition-colors group-hover:text-rose-500" />
                        </span>
                      </Badge>
                    ))}
                  </div>
                </TooltipTrigger>
                <ScrollBar
                  orientation="horizontal"
                  className="opacity-40"
                  onClick={e => e.stopPropagation()}
                />
              </ScrollArea>
            </Tooltip>
          ) : (
            <>
              {isLoading ? (
                <div className="ml-2 mt-1 flex h-6 flex-1 items-center bg-transparent text-muted-foreground outline-none">
                  <LoaderIcon className="animate-spin" />
                </div>
              ) : (
                <div className="mx-auto flex w-full items-center justify-between">
                  <span className="mx-3 text-sm text-muted-foreground">
                    {placeholder ?? 'Selecione'}
                  </span>
                  <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
                </div>
              )}
            </>
          )}
        </Button>
      </PopoverTrigger>
    </TooltipProvider>
  )
}

type PropertyCommandProps = {
  items: {
    label: string
    value: string
  }[]
  onSelect?: (value: {
    label: string
    value: string
  }) => void
  onClose?: () => void
  searchValue: string
  onChangeSearchValue: (value: string) => void
}
