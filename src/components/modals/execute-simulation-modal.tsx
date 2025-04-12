'use client'

import { getDataSources } from '@/lib/actions/get-data-sources'
import { getKpis } from '@/lib/actions/get-kpis'
import { skipRequestWithDeduplication } from '@/lib/skip-duplicated-requests'
import { zodResolver } from '@hookform/resolvers/zod'
import { DatabricksSQLDataSource, Formula } from '@prisma/client'
import { X } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AnimatedSizeContainer } from '../animated-size-container'
import { SqlEditor } from '../sql-editor'
import { AsyncSelect } from '../ui/async-select'
import { Button } from '../ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { MultiSelection } from '../ui/multi-selection'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet'
import { useSqlSnippetsModal } from './sql-snippets-modal'

const queryDefaultValue = '\n\n\n-- Escreva seu SQL aqui'

const createExecuteSimulationFormSchema = z.object({
  dataSourceId: z.string({
    required_error: 'Campo obrigatório',
  }),
  formulasId: z
    .array(
      z
        .string({
          required_error: 'Campo obrigatório',
        })
        .cuid()
    )
    .min(1, {
      message: 'Selecione pelo menos um KPI',
    }),
  query: z
    .string({
      required_error: 'Campo obrigatório',
    })
    .refine(value => value !== queryDefaultValue, {
      message: 'Campo obrigatório',
    }),
})

const ExecuteSimulationModal = ({
  setShowExecuteSimulationModal,
  showExecuteSimulationModal,
}: {
  showExecuteSimulationModal: boolean
  setShowExecuteSimulationModal: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const { slug } = useParams() as { slug: string | null }
  const form = useForm<z.infer<typeof createExecuteSimulationFormSchema>>({
    resolver: zodResolver(createExecuteSimulationFormSchema),
    defaultValues: {
      formulasId: [],
      query: queryDefaultValue,
    },
  })
  const { SqlSnippetsModal, SqlSnippetsButton } = useSqlSnippetsModal()

  const onSubmit = form.handleSubmit(data => {
    console.log({ data })
  })

  return (
    <>
      <Sheet
        open={showExecuteSimulationModal}
        onOpenChange={setShowExecuteSimulationModal}
      >
        <SheetContent
          className="m-3 rounded-md h-[initial] w-[650px] !max-w-full px-0 overflow-hidden pb-10"
          hiddenCloseButton
        >
          <SheetHeader className="flex-row items-center justify-between px-6 pb-4 space-y-0 border-b">
            <SheetTitle>Executar simulação</SheetTitle>

            <div className="flex items-center gap-x-4">
              <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                <X className="w-4 h-4" />
                <span className="sr-only">Fechar</span>
              </SheetClose>
            </div>
          </SheetHeader>

          <div className="">
            <AnimatedSizeContainer
              height
              className="rounded-[inherit] px-6"
              style={{ transform: 'translateZ(0)' }}
            >
              <Form {...form}>
                <form onSubmit={onSubmit} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="dataSourceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fonte de dados</FormLabel>
                        <FormControl>
                          <AsyncSelect<DatabricksSQLDataSource>
                            fetcher={value =>
                              skipRequestWithDeduplication(
                                `data-source-${value}`,
                                () =>
                                  getDataSources({
                                    slug: slug as string,
                                    query: value,
                                  })
                              )
                            }
                            label="Fonte de dados"
                            width={601}
                            getDisplayValue={item => item.name}
                            getOptionValue={item => item.id}
                            onChange={field.onChange}
                            renderOption={item => (
                              <div className="flex items-center gap-x-2">
                                <div className="text-sm font-medium">
                                  {item.name}
                                </div>
                              </div>
                            )}
                            value={field.value}
                            placeholder="Selecione uma fonte de dados"
                          />
                        </FormControl>
                        <FormDescription>
                          A fonte de dados é de onde os dados serão extraídos.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="formulasId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>KPI</FormLabel>
                        <FormControl>
                          <MultiSelection<Formula>
                            fetcher={value =>
                              skipRequestWithDeduplication(
                                `kpis-${value}`,
                                () =>
                                  getKpis({
                                    slug: slug as string,
                                    query: value,
                                  })
                              )
                            }
                            label="KPI"
                            noResultsMessage="Nenhum KPI encontrado."
                            renderOption={item => <div>{item.name}</div>}
                            getOptionValue={item => item.id}
                            getDisplayValue={item => <div>{item.name}</div>}
                            value={field.value}
                            onValueSelected={field.onChange}
                            placeholder="Selecione um ou mais KPIs"
                          />
                        </FormControl>
                        <FormDescription>
                          Selecione o KPI que deseja calcular.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Query</FormLabel>
                        <FormControl>
                          <div>
                            <SqlSnippetsButton />
                            <SqlEditor
                              setValue={field.onChange}
                              value={field.value}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* <div>
                  <Label className="data-[error=true]:text-destructive">
                    Filtros
                  </Label>
                  <div className="w-full py-3 space-y-3">
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
                        type="button"
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
                </div> */}
                  <Button type="submit" text="Criar execução" />
                </form>
              </Form>
            </AnimatedSizeContainer>
          </div>
        </SheetContent>
      </Sheet>

      <SqlSnippetsModal />
    </>
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
