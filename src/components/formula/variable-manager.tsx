'use client'

import { Button } from '@/components/ui/button-shadcn'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { TooltipProvider } from '@/components/ui/tooltip'

import { CirclePlus, X } from 'lucide-react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Variable } from './types'

export function VariableManager() {
  const form = useFormContext()
  const variables = (form.watch('variables') || []) as Variable[]

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'variables',
  })

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div className="relative flex items-start gap-2" key={field.id}>
            <FormField
              control={form.control}
              name={`variables.${index}.name`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Nome da Variável</FormLabel>
                  <FormControl>
                    <Input placeholder="ex.: receita" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`variables.${index}.value`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Nome da Variável</FormLabel>
                  <FormControl>
                    <Input placeholder="ex.: 1000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="relative top-[22px] shrink-0 hover:bg-red-100 hover:text-rose-800 transition-colors"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
            >
              <X className="size-4" />
            </Button>
          </div>
        ))}

        {!variables.length && (
          <div className="py-4 text-center text-muted-foreground">
            Nenhuma variável definida. Adicione variáveis para usar na sua
            fórmula.
          </div>
        )}

        <Button
          variant="outline"
          onClick={() => {
            append({ name: '', value: 0 })
          }}
          type="button"
        >
          <CirclePlus className="size-4 text-muted-foreground" />
          Adicionar Variável
        </Button>
      </div>
    </TooltipProvider>
  )
}
