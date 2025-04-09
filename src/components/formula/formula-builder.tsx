'use client'

import { Button } from '@/components/ui/button-shadcn'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Calculator, VariableIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { FormulaInput } from './formula-input'
import { Variable } from './types'
import { VariableManager } from './variable-manager'

export function FormulaBuilder() {
  const [activeTab, setActiveTab] = useState('formula')
  const [cursorPosition, setCursorPosition] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const form = useFormContext()
  const variables = (form.watch('variables') || []) as Variable[]
  const formula = form.watch('expression')

  const setFormula = (newFormula: string) => {
    form.setValue('expression', newFormula)
  }

  const operators = [
    { symbol: '+', label: 'Adição', tooltip: 'Adição: Soma dois valores' },
    {
      symbol: '-',
      label: 'Subtração',
      tooltip: 'Subtração: Diminui um valor do outro',
    },
    {
      symbol: '*',
      label: 'Multiplicação',
      tooltip: 'Multiplicação: Multiplica dois valores',
    },
    {
      symbol: '/',
      label: 'Divisão',
      tooltip: 'Divisão: Divide um valor pelo outro',
    },
    {
      symbol: '(',
      label: 'Abre parênteses',
      tooltip: 'Abre parênteses: Agrupa operações',
    },
    {
      symbol: ')',
      label: 'Fecha parênteses',
      tooltip: 'Fecha parênteses: Fecha um agrupamento',
    },
    {
      symbol: '^',
      label: 'Potência',
      insert: 'Math.pow(x,y)',
      tooltip: 'Potência: Eleva um número a uma potência',
    },
    {
      symbol: '%',
      label: 'Módulo',
      tooltip: 'Módulo: Retorna o resto da divisão',
    },
  ]

  const helpers = [
    {
      name: 'round',
      description: 'Arredonda para o inteiro mais próximo',
      insert: 'round(x)',
      tooltip: 'Arredonda para o inteiro mais próximo',
    },
    {
      name: 'floor',
      description: 'Arredonda para baixo',
      insert: 'floor(x)',
      tooltip: 'Arredonda para baixo (menor inteiro)',
    },
    {
      name: 'ceil',
      description: 'Arredonda para cima',
      insert: 'ceil(x)',
      tooltip: 'Arredonda para cima (maior inteiro)',
    },
    {
      name: 'abs',
      description: 'Valor absoluto (remove sinal negativo)',
      insert: 'abs(x)',
      tooltip: 'Valor absoluto (remove sinal negativo)',
    },
    {
      name: 'max',
      description: 'Maior valor',
      insert: 'max(x,y)',
      tooltip: 'Retorna o maior valor entre os argumentos',
    },
    {
      name: 'min',
      description: 'Menor valor',
      insert: 'min(x,y)',
      tooltip: 'Retorna o menor valor entre os argumentos',
    },
  ]

  // Função para inserir texto na posição do cursor
  const insertAtCursor = (text: string) => {
    if (inputRef.current) {
      // Obter a posição atual do cursor
      const position = cursorPosition

      // Dividir o texto em duas partes: antes e depois do cursor
      const textBeforeCursor = formula.substring(0, position)
      const textAfterCursor = formula.substring(position)

      // Criar a nova fórmula com o texto inserido na posição do cursor
      const newFormula = textBeforeCursor + text + textAfterCursor

      // Atualizar a fórmula
      setFormula(newFormula)

      // Atualizar a posição do cursor para depois do texto inserido
      const newPosition = position + text.length

      // Focar no input e posicionar o cursor
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          inputRef.current.setSelectionRange(newPosition, newPosition)
          setCursorPosition(newPosition)
        }
      }, 0)
    } else {
      // Fallback para o comportamento anterior se o ref não estiver disponível
      setFormula(formula + text)
    }
  }

  const insertOperator = (op: string) => {
    insertAtCursor(op)
  }

  const insertHelper = (helperInsert: string) => {
    insertAtCursor(helperInsert)
  }

  const insertVariable = (varName: string) => {
    insertAtCursor(varName)
  }

  return (
    <TooltipProvider>
      <div className="border rounded-md">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            className={cn('grid grid-cols-2 w-full rounded-[7px]', {
              '!border-rose-500 border':
                form.formState.errors.expression?.message,
            })}
          >
            <TabsTrigger value="formula">
              <Calculator className="w-4 h-4 mr-2" />
              Formula
            </TabsTrigger>
            <TabsTrigger value="variables">
              <VariableIcon className="w-4 h-4 mr-2" />
              Variables
            </TabsTrigger>
          </TabsList>

          <TabsContent value="formula" className="p-4 space-y-4">
            <FormulaInput
              formula={formula}
              setFormula={setFormula}
              variables={variables}
              operators={operators}
              helpers={helpers}
              cursorPosition={cursorPosition}
              setCursorPosition={setCursorPosition}
              inputRef={inputRef}
            />

            <div className="space-y-2">
              <Label>Operadores</Label>
              <div className="flex flex-wrap gap-2">
                {operators.map(op => (
                  <Tooltip key={op.symbol} delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => insertOperator(op.insert || op.symbol)}
                      >
                        {op.symbol}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{op.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Funções Auxiliares</Label>
              <div className="flex flex-wrap gap-2">
                {helpers.map(helper => (
                  <Tooltip key={helper.name} delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => insertHelper(helper.insert)}
                        title={helper.description}
                      >
                        {helper.name}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{helper.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>

            {variables.filter(item => Boolean(item.name)).length > 0 && (
              <div className="space-y-2">
                <Label>Suas Variáveis</Label>
                <div className="flex flex-wrap gap-2">
                  {variables.map(variable => (
                    <Tooltip key={variable.name} delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="secondary"
                          size="sm"
                          type="button"
                          onClick={() => insertVariable(variable.name)}
                        >
                          {variable.name}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Valor de exemplo: {variable.value}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="variables" className="p-4">
            <VariableManager />
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}
