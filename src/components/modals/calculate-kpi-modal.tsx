'use client'

import { ExecutionsResponse } from '@/lib/swr/use-executions'
import { zodResolver } from '@hookform/resolvers/zod'
import { JsonValue } from '@prisma/client/runtime/library'
import { Fragment, useCallback, useMemo, useState } from 'react'
import {
  Controller,
  useFieldArray,
  useForm,
  useFormContext,
} from 'react-hook-form'
import { z } from 'zod'
import { Modal } from '../modal'

import { Button as PrimaryButton } from '@/components/ui/button'
import { getPrimitiveKeys, getValueByPath } from '@/lib/json-extract'
import { cn } from '@/lib/utils'
import { ArrowRight, Check, ChevronDown, VariableIcon } from 'lucide-react'
import { Popover } from '../popover'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Label } from '../ui/label'
import { ScrollArea } from '../ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

const createCalculateKpiFormSchema = z.object({
  formulaId: z
    .string({
      required_error: 'Campo obrigatório',
    })
    .cuid(),
  variables: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      key: z.string({
        required_error: 'Campo obrigatório',
      }),
      value: z.coerce.number().optional(),
    })
  ),
})

const CalculateKpiModal = ({
  showCalculateKpiModal,
  setShowCalculateKpiModal,
  values,
  setValues,
}: {
  showCalculateKpiModal: boolean
  setShowCalculateKpiModal: React.Dispatch<React.SetStateAction<boolean>>
  values?: {
    values: JsonValue
    formulas: ExecutionsResponse['formulas']
  }
  setValues: React.Dispatch<
    React.SetStateAction<
      | {
          values: JsonValue
          formulas: ExecutionsResponse['formulas']
        }
      | undefined
    >
  >
}) => {
  const form = useForm<z.infer<typeof createCalculateKpiFormSchema>>({
    resolver: zodResolver(createCalculateKpiFormSchema),
    defaultValues: {
      variables: [],
    },
  })

  const onSubmit = form.handleSubmit(data => {
    console.log('data', data)
  })

  const formulaId = form.watch('formulaId')
  const variables = form.watch('variables')
  const disabledButton = !formulaId || variables.some(variable => !variable.key)

  return (
    <Modal
      setShowModal={setShowCalculateKpiModal}
      showModal={showCalculateKpiModal}
      onClose={() => setValues(undefined)}
      className="max-w-2xl"
    >
      <h3 className="border-b border-neutral-200 px-4 py-4 text-lg font-medium sm:px-6">
        Calcular KPI
      </h3>

      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className="flex flex-col space-y-6 bg-neutral-50 px-4 py-8 text-left sm:px-10"
        >
          <FormField
            control={form.control}
            name="formulaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>KPI</FormLabel>
                <Select
                  onValueChange={value => {
                    field.onChange(value)

                    const variables =
                      values?.formulas
                        .find(formula => formula.id === value)
                        ?.formula.variables.map(variable => ({
                          id: variable.id,
                          name: variable.name,
                          key: variable.key || '',
                        })) || []

                    form.setValue('variables', variables)
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Selecione uma KPI" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {values?.formulas.map(formula => (
                      <SelectItem key={formula.id} value={formula.id}>
                        <div className="flex items-center gap-x-2">
                          {formula.formula.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {formulaId && (
            <div>
              <Label>Variaveis do KPI</Label>

              <p className="text-sm text-muted-foreground mt-1">
                As variaveis do KPI serão preenchidas automaticamente com os
                valores da execução.
              </p>

              <div className="mt-2 flex flex-col gap-2">
                <div className="grid grid-cols-[1fr_min-content_1fr] gap-x-4 gap-y-2">
                  <FieldRow values={values?.values} />
                </div>
              </div>
            </div>
          )}

          <PrimaryButton text="Calcular" disabled={disabledButton} />
        </form>
      </Form>
    </Modal>
  )
}

const FieldRow = ({
  values,
}: {
  values?: JsonValue
}) => {
  const form = useFormContext<z.infer<typeof createCalculateKpiFormSchema>>()

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'variables' as const,
  })

  const variables = form.watch('variables')

  const keys = values ? getPrimitiveKeys(values) : []

  const exempleValues = variables.map(variable => {
    const value = getValueByPath({
      obj: values,
      path: variable.key,
    })
    return {
      ...variable,
      value,
    }
  })

  return fields.map((field, index) => (
    <Fragment key={field.id}>
      <div className="relative flex min-w-0 items-center gap-2">
        <SelectVariable
          keys={keys}
          field={field}
          index={index}
          values={values}
        />
      </div>

      {exempleValues?.find(example => example.name === field.name) ? (
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center justify-end">
              <ArrowRight className="size-4 text-neutral-500" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="block p-1 text-sm">
              <span className="font-medium ">Valor:</span>

              <ul className="mt-0.5">
                {exempleValues
                  ?.find(example => example.name === field.name)
                  ?.value?.toString()
                  .split(',')
                  .map((example, idx) => (
                    <li
                      key={example + idx}
                      className="block text-xs leading-tight"
                    >
                      {example}
                    </li>
                  )) || (
                  <li className="block text-xs leading-tight">
                    Nenhum valor disponível
                  </li>
                )}
              </ul>
            </div>
          </TooltipContent>
        </Tooltip>
      ) : (
        <div className="flex items-center justify-end">
          <ArrowRight className="size-4 text-neutral-500" />
        </div>
      )}

      <span className="flex h-9 items-center gap-1 rounded-md border border-neutral-200 bg-neutral-100 px-3">
        <span className="grow whitespace-nowrap text-sm font-normal text-neutral-700">
          {field.name}
        </span>
      </span>
    </Fragment>
  ))
}

const SelectVariable = ({
  field,
  index,
  keys,
  values,
}: {
  index: number
  field: {
    id: string
    name: string
    key: string
  }
  keys: string[]
  values?: JsonValue
}) => {
  const form = useFormContext<z.infer<typeof createCalculateKpiFormSchema>>()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Controller
      control={form.control}
      name={`variables.${index}.key` as const}
      render={({ field: { onChange, value } }) => (
        <Popover
          align="end"
          openPopover={isOpen}
          setOpenPopover={setIsOpen}
          content={
            <div className="w-full p-2 md:m-w-[271px]">
              <ScrollArea className="h-[300px] w-full relative" type="always">
                {keys.map(key => {
                  const value = getValueByPath({
                    obj: values,
                    path: key,
                  })

                  const isNumber = !Number.isNaN(Number(value))
                  const disabled =
                    !isNumber || value === undefined || value === null

                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => {
                        form.setValue(
                          `variables.${index}.value`,
                          value !== undefined ? Number(value) : undefined
                        )

                        onChange(key)
                        setIsOpen(false)
                      }}
                      disabled={disabled}
                      className={cn(
                        'flex w-full items-center justify-between space-x-2 rounded-md px-1 py-2 hover:bg-neutral-100 active:bg-neutral-200 disabled:cursor-not-allowed disabled:text-neutral-400'
                      )}
                    >
                      <div className="flex items-center justify-start space-x-2 truncate">
                        <VariableIcon className="size-4 flex-none" />
                        <p className="truncate text-sm">
                          {key}
                          {disabled && (
                            <kbd className="text-slate-400 text-xs ml-1 font-mono">
                              (valor invalido)
                            </kbd>
                          )}
                        </p>
                      </div>
                      {value === key && <Check className="size-4 shrink-0" />}
                    </button>
                  )
                })}
              </ScrollArea>
            </div>
          }
        >
          <PrimaryButton
            variant="secondary"
            className="h-9 min-w-0 px-3"
            textWrapperClassName="grow text-left"
            onClick={() => setIsOpen(o => !o)}
            text={
              <div className="flex w-full grow items-center justify-between gap-1">
                <span className="flex-1 truncate whitespace-nowrap text-left text-neutral-800">
                  {value || (
                    <span className="text-neutral-600">
                      Selecione a propriedade...
                    </span>
                  )}
                </span>

                <ChevronDown className="size-4 shrink-0 text-neutral-400 transition-transform duration-75 group-data-[state=open]:rotate-180" />
              </div>
            }
          />
        </Popover>
      )}
    />
  )
}

export const useCalculateKpi = ({
  values,
  setValues,
}: {
  values?: {
    values: JsonValue
    formulas: ExecutionsResponse['formulas']
  }
  setValues: React.Dispatch<
    React.SetStateAction<
      | {
          values: JsonValue
          formulas: ExecutionsResponse['formulas']
        }
      | undefined
    >
  >
}) => {
  const [showCalculateKpiModal, setShowCalculateKpiModal] = useState(false)

  const CalculateKpiModalCallback = useCallback(() => {
    return (
      <CalculateKpiModal
        showCalculateKpiModal={showCalculateKpiModal}
        setShowCalculateKpiModal={setShowCalculateKpiModal}
        values={values}
        setValues={setValues}
      />
    )
  }, [showCalculateKpiModal, values, setValues])

  return useMemo(
    () => ({
      CalculateKpiModal: CalculateKpiModalCallback,
      setShowCalculateKpiModal,
    }),
    [CalculateKpiModalCallback]
  )
}
