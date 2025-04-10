'use client'

import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { Button, buttonVariants } from '@/components/ui/button'
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
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const createDatabricksConnection = z.object({
  name: z.string({
    required_error: 'Nome é obrigatório',
  }),
  hostname: z.string({
    required_error: 'Host é obrigatório',
  }),
  httpPath: z.string({
    required_error: 'Http Path é obrigatório',
  }),
  token: z.string({
    required_error: 'Token é obrigatório',
  }),
  catalog: z.string().optional(),
  schema: z.string().optional(),
})

export const CreateDatabricksConnectionPageClient = () => {
  const { slug } = useParams() as { slug: string }
  const form = useForm<z.infer<typeof createDatabricksConnection>>({
    resolver: zodResolver(createDatabricksConnection),
  })

  const onSubmit = form.handleSubmit(async data => {
    console.log(data)
  })

  return (
    <MaxWidthWrapper className="mt-8">
      <h2 className="text-lg font-semibold leading-7 text-gray-900">
        Nova fonte de dados SQL do Databricks
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-500">
        Adicione um banco de dados SQL do Databricks para que o Argos possa
        extrair dados.
      </p>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className="border-b border-gray-900/10 pb-8 mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-10">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Nome da exibição</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Meu banco de dados SQL Databricks"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hostname"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Host</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="*************cloud.databricks.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="httpPath"
              render={({ field }) => (
                <FormItem className="col-span-5">
                  <FormLabel>HTTP Path</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="/sql/1.0/warehouses/**********"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem className="col-span-5">
                  <FormLabel>Token</FormLabel>
                  <FormControl>
                    <Input placeholder="dapi****************" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="catalog"
              render={({ field }) => (
                <FormItem className="col-span-5">
                  <FormLabel>Catalog (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="hive_metastore" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="schema"
              render={({ field }) => (
                <FormItem className="col-span-5">
                  <FormLabel>Schema (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="default" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-full flex justify-end mt-4 gap-x-3">
            <Link
              href={`/${slug}/configuracoes/fontes-de-dados`}
              className={cn(
                'group cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap rounded-md border px-4 text-sm',
                buttonVariants({
                  variant: 'outline',
                })
              )}
            >
              Cancelar
            </Link>
            <Button text="Salvar" className="w-fit" />
          </div>
        </form>
      </Form>
    </MaxWidthWrapper>
  )
}
