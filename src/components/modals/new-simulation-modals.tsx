import { AsyncSelect } from '@/components/ui/async-select'
import { Button } from '@/components/ui/button'
import DateRangePicker from '@/components/ui/date-range-picker'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '@/components/ui/multi-selector'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { getSimulations } from '@/lib/actions/get-simulations'
import { getWorkspaces } from '@/lib/actions/get-workspaces'
import { createSimulationFormSchema } from '@/lib/zod/schemas/simulations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Simulation, Workspace } from '@prisma/client'
import { DatabaseBackup, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { mutate } from 'swr'
import { z } from 'zod'
import { DatabricksIcon } from '../icons/databricks'

const NewSimulationModal = ({
  setShowNewSimulationModal,
  showNewSimulationModal,
}: {
  showNewSimulationModal: boolean
  setShowNewSimulationModal: Dispatch<SetStateAction<boolean>>
}) => {
  const router = useRouter()
  const form = useForm<z.infer<typeof createSimulationFormSchema>>({
    resolver: zodResolver(createSimulationFormSchema),
    defaultValues: {
      type: ['Marketplace', 'Entrega'],
      date: {
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(),
      },
    },
  })

  const onSubmit = form.handleSubmit(async data => {
    try {
      const response = await fetch('/api/simulations', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        await mutate('/api/simulations')
        setShowNewSimulationModal(false)

        const data = await response.json()

        router.push(`/simulacoes/${data.simulation.id}`)
      }
    } catch (error) {
      console.error(error)
    }
  })

  const isSimulation = form.watch('dataSource') === 'simulation'
  const isDatabricks = form.watch('dataSource') === 'databricks'
  const workspaceId = form.watch('workspaceId')

  return (
    <Sheet
      open={showNewSimulationModal}
      onOpenChange={setShowNewSimulationModal}
    >
      <SheetContent
        className="m-3 rounded-md h-[initial] w-[650px] !max-w-full px-0 overflow-hidden pb-10"
        hiddenCloseButton
      >
        <SheetHeader className="flex-row items-center justify-between space-y-0 border-b pb-4 px-6">
          <SheetTitle>Nova simulação</SheetTitle>

          <div className="flex items-center gap-x-4">
            <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="px-6">
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da simulação</FormLabel>
                    <FormControl>
                      <Input placeholder="Baseline - Agosto/2025" {...field} />
                    </FormControl>
                    <FormDescription>
                      Nome da simulação, apenas para fins de identificação.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workspaceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace</FormLabel>
                    <FormControl>
                      <AsyncSelect<Workspace>
                        fetcher={getWorkspaces}
                        renderOption={item => <div>{item.name}</div>}
                        getOptionValue={item => item.id}
                        getDisplayValue={item => <div>{item.name}</div>}
                        label="Workspace"
                        placeholder="Selecione um Workspace"
                        width="601px"
                        value={field.value || ''}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Selecione o workspace que deseja usar.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fonte de dados</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione uma fonte de dados" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="databricks">
                          <div className="flex items-center gap-x-2">
                            <DatabricksIcon />
                            Databricks
                          </div>
                        </SelectItem>
                        <SelectItem value="simulation">
                          <div className="flex items-center gap-x-2">
                            <DatabaseBackup />
                            Simulação existente
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Você pode escolher entre uma <b>simulação já existente</b>{' '}
                      ou do <b>Databricks</b>.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isSimulation && (
                <FormField
                  control={form.control}
                  name="simulationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Simulação</FormLabel>
                      <FormControl>
                        <AsyncSelect<
                          Simulation & { workspace: { name: string } }
                        >
                          fetcher={query => getSimulations(query, workspaceId)}
                          renderOption={item => (
                            <div>
                              {item.workspace.name} • {item.name}
                            </div>
                          )}
                          getOptionValue={item => item.id}
                          getDisplayValue={item => (
                            <div>
                              {item.workspace.name} • {item.name}
                            </div>
                          )}
                          label="Simulação"
                          placeholder="Selecione uma simulação"
                          width="601px"
                          value={field.value || ''}
                          onChange={field.onChange}
                          disabled={!workspaceId}
                        />
                      </FormControl>
                      <FormDescription>
                        Selecione uma simulação já existente.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {isDatabricks && (
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <FormControl>
                        <MultiSelector
                          values={field.value}
                          onValuesChange={field.onChange}
                          loop
                          className="w-full"
                        >
                          <MultiSelectorTrigger>
                            <MultiSelectorInput placeholder="Selecione o tipo" />
                          </MultiSelectorTrigger>
                          <MultiSelectorContent>
                            <MultiSelectorList>
                              <MultiSelectorItem value="Marketplace">
                                Marketplace
                              </MultiSelectorItem>
                              <MultiSelectorItem value="Entrega">
                                Entrega
                              </MultiSelectorItem>
                            </MultiSelectorList>
                          </MultiSelectorContent>
                        </MultiSelector>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="baseOperator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operador</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="-10%"
                        {...field}
                        value={
                          typeof field.value === 'object'
                            ? `${field.value.operator}${field.value.number}${field.value.isPercentage ? '%' : ''}`
                            : field.value
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Ex.: -10%, +5%, /2, *3, /2.5, +10%
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Período</FormLabel>
                    <FormControl>
                      <DateRangePicker
                        value={field.value}
                        onChange={value => {
                          field.onChange(value)
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Intevalo de datas para a simulação.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" text="Criar simulação" />
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export const useNewSimulation = () => {
  const [showNewSimulationModal, setShowNewSimulationModal] = useState(false)

  const NewSimulationModalCallback = useCallback(() => {
    return (
      <NewSimulationModal
        setShowNewSimulationModal={setShowNewSimulationModal}
        showNewSimulationModal={showNewSimulationModal}
      />
    )
  }, [showNewSimulationModal])

  return useMemo(
    () => ({
      setShowNewSimulationModal,
      NewSimulationModal: NewSimulationModalCallback,
    }),
    [NewSimulationModalCallback]
  )
}
