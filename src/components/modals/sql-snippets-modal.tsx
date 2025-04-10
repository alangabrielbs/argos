import { zodResolver } from '@hookform/resolvers/zod'
import { Braces } from 'lucide-react'
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Modal } from '../modal'
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
import { Input } from '../ui/input'
import { Switch } from '../ui/switch'
import { Textarea } from '../ui/textarea'

const createSnippetFormSchema = z.object({
  name: z
    .string({
      required_error: 'Nome é obrigatório',
    })
    .min(1, { message: 'Nome é obrigatório' }),
  description: z
    .string({
      required_error: 'Descrição é obrigatória',
    })
    .min(1, { message: 'Descrição é obrigatória' })
    .max(50, {
      message: 'Máximo de 50 caracteres',
    }),
  documentation: z.string().optional(),
  code: z
    .string({
      required_error: 'Código SQL é obrigatório',
    })
    .min(1, { message: 'Campo obrigatório' }),
  isPublic: z.boolean().default(false),
})

const SqlSnippetsModal = ({
  setShowSqlSnippetsModal,
  showSqlSnippetsModal,
}: {
  setShowSqlSnippetsModal: Dispatch<SetStateAction<boolean>>
  showSqlSnippetsModal: boolean
}) => {
  const form = useForm<z.infer<typeof createSnippetFormSchema>>({
    resolver: zodResolver(createSnippetFormSchema),
  })

  const onSubmit = form.handleSubmit(async data => {
    console.log('Snippet criado:', data)

    setShowSqlSnippetsModal(false)
  })

  return (
    <Modal
      setShowModal={setShowSqlSnippetsModal}
      showModal={showSqlSnippetsModal}
      className="max-w-2xl"
    >
      <h3 className="border-b border-neutral-200 px-4 py-4 text-lg font-medium sm:px-6">
        Novo snippet
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
                <FormLabel>Nome do snippet</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Consulta de Vendas Mensais"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código SQL</FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-[150px] font-mono"
                    placeholder="Ex: SELECT * FROM vendas WHERE data BETWEEN '${1:data_inicio}' AND '${2:data_fim}'"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Use ${'{1:nome}'} para criar placeholders que o usuário pode
                  navegar com Tab.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição curta</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Consulta para vendas mensais por produto"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="documentation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Documentação (opcional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ex: Documentação do snippet"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Adicione informações adicionais sobre o snippet, como
                  parâmetros ou exemplos de uso. Aceita Markdown.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 bg-white">
                <div className="space-y-0.5">
                  <FormLabel>
                    Visivel para todos
                    <FormDescription>
                      Disponibilizar para todos os usuários do sistema.
                    </FormDescription>
                  </FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" text="Criar snippet" />
        </form>
      </Form>
    </Modal>
  )
}

const SqlSnippetsButton = ({
  setShowSqlSnippetsModal,
  text,
}: {
  text?: string
  setShowSqlSnippetsModal: Dispatch<SetStateAction<boolean>>
}) => {
  return (
    <div>
      <Button
        className="w-fit rounded-bl-none rounded-br-none border-b-0"
        type="button"
        variant="secondary"
        icon={<Braces className="size-3 text-muted-foreground" />}
        size="sm"
        onClick={() => setShowSqlSnippetsModal(true)}
        text={text || 'Novo snippet'}
      />
    </div>
  )
}

export const useSqlSnippetsModal = () => {
  const [showSqlSnippetsModal, setShowSqlSnippetsModal] = useState(false)

  const SqlSnippetsModalCallback = useCallback(() => {
    return (
      <SqlSnippetsModal
        showSqlSnippetsModal={showSqlSnippetsModal}
        setShowSqlSnippetsModal={setShowSqlSnippetsModal}
      />
    )
  }, [showSqlSnippetsModal])

  const SqlSnippetsButtonCallback = useCallback(
    ({ text }: { text?: string }) => {
      return (
        <SqlSnippetsButton
          text={text}
          setShowSqlSnippetsModal={setShowSqlSnippetsModal}
        />
      )
    },
    []
  )

  return useMemo(
    () => ({
      setShowSqlSnippetsModal,
      SqlSnippetsModal: SqlSnippetsModalCallback,
      SqlSnippetsButton: SqlSnippetsButtonCallback,
    }),
    [SqlSnippetsModalCallback, SqlSnippetsButtonCallback]
  )
}
