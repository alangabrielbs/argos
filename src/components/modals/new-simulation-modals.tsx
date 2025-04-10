import { Button } from '@/components/ui/button'
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
import { createSimulationFormSchema } from '@/lib/zod/schemas/simulations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { mutate } from 'swr'
import { z } from 'zod'
import { Modal } from '../modal'

const NewSimulationModal = ({
  setShowNewSimulationModal,
  showNewSimulationModal,
}: {
  showNewSimulationModal: boolean
  setShowNewSimulationModal: Dispatch<SetStateAction<boolean>>
}) => {
  const router = useRouter()
  const { slug } = useParams() as { slug: string | null }

  const form = useForm<z.infer<typeof createSimulationFormSchema>>({
    resolver: zodResolver(createSimulationFormSchema),
  })

  const onSubmit = form.handleSubmit(async data => {
    try {
      const response = await fetch(`/api/${slug}/simulations`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        await mutate(`/api/${slug}/simulations`)
        setShowNewSimulationModal(false)

        const data = await response.json()

        router.push(`/${slug}/simulacoes/${data.simulation.id}`)
      }
    } catch (error) {
      console.error(error)
    }
  })

  return (
    <Modal
      showModal={showNewSimulationModal}
      setShowModal={setShowNewSimulationModal}
    >
      <h3 className="border-b border-neutral-200 px-4 py-4 text-lg font-medium sm:px-6">
        Nova simulação
      </h3>

      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className="flex flex-col space-y-4 bg-neutral-50 px-4 py-8 text-left sm:px-10"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da simulação</FormLabel>
                <FormControl>
                  <Input placeholder="[NPS] - Diário" {...field} />
                </FormControl>
                <FormDescription>
                  Nome da simulação, apenas para fins de identificação.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" text="Criar simulação" />
        </form>
      </Form>
    </Modal>
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
