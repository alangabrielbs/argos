'use client'

import { Button as PrimaryButton } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { mutate } from 'swr'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Textarea } from '../ui/textarea'
import { FormulaBuilder } from './formula-builder'
import { Variable } from './types'
import { findBestMatch } from './utils'

const createKpiSchema = z.object({
  name: z
    .string({
      required_error: 'Nome é obrigatório',
    })
    .min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  expression: z
    .string({
      required_error: 'Fórumla é obrigatória',
    })
    .min(1, 'Fórumla é obrigatória'),
  variables: z
    .array(
      z.object({
        name: z
          .string({
            required_error: 'Nome da variável é obrigatório',
          })
          .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, {
            message:
              'O nome da variável deve começar com uma letra e conter apenas letras, números e sublinhados',
          })
          .min(1, 'Nome da variável é obrigatório'),
        value: z.coerce
          .number({
            required_error: 'Valor da variável é obrigatório',
          })
          .min(1, 'Valor da variável deve ser maior ou igual a 1'),
      })
    )
    .optional(),
  'decimal-places': z.string().default('2'),
})

export function KpiCreationForm() {
  const router = useRouter()
  const { slug } = useParams() as { slug: string | null }

  const form = useForm<z.infer<typeof createKpiSchema>>({
    resolver: zodResolver(createKpiSchema),
    defaultValues: {
      name: '',
      description: '',
      expression: '',
      'decimal-places': '2',
    },
  })

  const [testResult, setTestResult] = useState<number | string | null>(null)
  const [undefinedVariables, setUndefinedVariables] = useState<string[]>([])
  const [helperSuggestions, setHelperSuggestions] = useState<
    Array<{
      original: string
      suggestion: string
      startIndex: number
      endIndex: number
    }>
  >([])

  const formula = form.watch('expression')
  const decimalPlaces = form.watch('decimal-places')
  const variables = (form.watch('variables') || []) as Variable[]

  const onSubmit = form.handleSubmit(async data => {
    if (handleTest() === false) return

    if (helperSuggestions.length > 0 || undefinedVariables.length > 0) {
      return
    }

    try {
      const response = await fetch(`/api/${slug}/kpis`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        await mutate(`/api/${slug}/kpis`)

        const data = await response.json()

        router.push(`/${slug}/kpis`)
      }
    } catch (error) {
      console.error(error)
    }
  })

  const handleTest = () => {
    try {
      form.clearErrors()
      // Primeiro, vamos verificar se há variáveis na fórmula que não foram definidas
      const potentialVariables = formula.match(/[a-zA-Z][a-zA-Z0-9_]*/g) || []

      // Filtramos palavras reservadas de JavaScript e nossas funções auxiliares
      const reservedWords = [
        'Math',
        'round',
        'floor',
        'ceil',
        'abs',
        'max',
        'min',
        'toFixed',
        'Number',
      ]

      // Encontrar variáveis que estão na fórmula mas não na lista de variáveis definidas
      const undefinedVars = potentialVariables.filter(name => {
        return (
          !reservedWords.includes(name) && !variables.some(v => v.name === name)
        )
      })

      // Se houver variáveis não definidas, mostrar um aviso
      if (undefinedVars.length > 0) {
        const uniqueUndefined = Array.from(new Set(undefinedVars))
        setUndefinedVariables(
          uniqueUndefined.filter(v => {
            // deve remover as helperSuggestions do array
            return !helperSuggestions.some(s => s.original === v)
          })
        )
        return false
      }

      setUndefinedVariables([])
      // Create a function from the formula string
      let evalFormula = formula

      // Replace variable names with their values
      variables.forEach(variable => {
        const regex = new RegExp(`\\b${variable.name}\\b`, 'g')
        evalFormula = evalFormula.replace(regex, variable.value.toString())
      })

      // Replace helper functions with their JavaScript equivalents
      evalFormula = evalFormula
        .replace(/round\(/g, 'Math.round(')
        .replace(/floor\(/g, 'Math.floor(')
        .replace(/ceil\(/g, 'Math.ceil(')
        .replace(/abs\(/g, 'Math.abs(')
        .replace(/max\(/g, 'Math.max(')
        .replace(/min\(/g, 'Math.min(')
        // replace , with .
        .replace(/,/g, '.')

      // Evaluate the formula
      // biome-ignore lint/security/noGlobalEval: <explanation>
      const result = eval(evalFormula)
      setTestResult(result)
    } catch (error) {
      console.error('Error evaluating formula:', error)
      setTestResult(null)
      form.setError('expression', {
        type: 'manual',
        message: 'Erro na fórmula. Verifique a sintaxe e variáveis.',
      })
    }
  }

  useKeyboardShortcut('t', () => formula && handleTest())

  // Função para corrigir um helper com erro de digitação
  const correctHelper = (suggestion: {
    original: string
    suggestion: string
    startIndex: number
    endIndex: number
  }) => {
    const newFormula =
      formula.substring(0, suggestion.startIndex) +
      suggestion.suggestion +
      formula.substring(suggestion.endIndex)

    form.setValue('expression', newFormula)

    // Limpar sugestões após a correção
    setHelperSuggestions(
      helperSuggestions.filter(s => s.original !== suggestion.original)
    )
  }
  const formattedResult =
    testResult !== null || testResult !== undefined
      ? typeof testResult === 'number'
        ? testResult.toFixed(Number(decimalPlaces))
        : testResult?.toString()
      : null

  // Lista de funções auxiliares conhecidas
  const knownHelpers = [
    'round',
    'floor',
    'ceil',
    'abs',
    'max',
    'min',
    'toFixed',
  ]

  // Verificar erros de digitação nas funções auxiliares
  useEffect(() => {
    // Regex para encontrar possíveis funções (palavras seguidas por parênteses)
    const functionRegex = /([a-zA-Z][a-zA-Z0-9_]*)\s*\(/g
    const potentialFunctions: Array<{ name: string; index: number }> = []

    // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
    let match
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    while ((match = functionRegex.exec(formula)) !== null) {
      potentialFunctions.push({
        name: match[1],
        index: match.index,
      })
    }

    const suggestions: Array<{
      original: string
      suggestion: string
      startIndex: number
      endIndex: number
    }> = []

    // Verificar cada função potencial
    potentialFunctions.forEach(func => {
      // Ignorar se já é uma função conhecida
      if (knownHelpers.includes(func.name)) return

      // Verificar se é similar a alguma função conhecida
      const bestMatch = findBestMatch(func.name, knownHelpers)

      // Se a similaridade for alta (acima de 0.7), sugerir correção
      if (bestMatch && bestMatch.similarity > 0.7) {
        suggestions.push({
          original: func.name,
          suggestion: bestMatch.bestMatch,
          startIndex: func.index,
          endIndex: func.index + func.name.length,
        })
      }
    })

    setHelperSuggestions(suggestions)
  }, [formula])

  return (
    <div className="w-full mt-6">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do KPI</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex.: ROI, CSAT..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Nome do KPI, apenas para fins de identificação.
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
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormDescription>
                    Descrição para entedimento da fórmula.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>Construtor de Fórmula</Label>
              <FormulaBuilder />
            </div>

            {helperSuggestions.length > 0 && (
              <div className="p-4 space-y-2 border border-blue-200 rounded-md bg-blue-50">
                <p className="font-medium text-blue-800">
                  Sugestões de correção:
                </p>
                <div className="flex flex-wrap gap-2">
                  {helperSuggestions.map((suggestion, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => correctHelper(suggestion)}
                      className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md flex items-center transition-colors"
                    >
                      <span className="mr-1 line-through">
                        {suggestion.original}
                      </span>
                      <span className="font-medium">
                        → {suggestion.suggestion}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-sm text-blue-700">
                  Clique em uma sugestão para corrigir automaticamente a função.
                </p>
              </div>
            )}

            {undefinedVariables.length > 0 && (
              <div className="p-4 space-y-2 border rounded-md bg-amber-50 border-amber-200">
                <p className="font-medium text-amber-800">
                  Variáveis não definidas:
                </p>
                <div className="flex flex-wrap gap-2">
                  {undefinedVariables.map(varName => (
                    <button
                      type="button"
                      key={varName}
                      className="flex items-center px-2 py-1 rounded-md cursor-pointer bg-amber-100 text-amber-800"
                    >
                      <span>{varName}</span>
                    </button>
                  ))}
                </div>
                <p className="text-sm text-amber-700">
                  Estas variáveis foram usadas na fórmula, mas não estão
                  definidas. Por favor, defina-as na aba de Variáveis.
                </p>
              </div>
            )}

            {testResult !== null && (
              <div className="p-4 space-y-2 rounded-md bg-muted">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Resultado do Teste:</p>
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <FormField
                          control={form.control}
                          name="decimal-places"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormLabel>Casas decimais:</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  max="10"
                                  className="w-16 h-8 bg-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Ajuste o número de casas decimais exibidas no
                          resultado
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-2xl font-bold">{formattedResult}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <div className="flex items-center space-x-2">
              <PrimaryButton
                text="Testar Fórmula"
                shortcut="T"
                variant="secondary"
                onClick={handleTest}
                disabled={!formula}
              />

              <PrimaryButton text="Salvar KPI" shortcut="k" variant="primary" />
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
