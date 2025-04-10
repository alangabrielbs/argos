'use client'

import { Button } from '@/components/ui/button-shadcn'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Edit, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export type CustomSnippet = {
  id: string
  label: string
  insertText: string
  detail: string
  documentation?: string
}

interface CustomAutocompleteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaveSnippets: (snippets: CustomSnippet[]) => void
  snippets: CustomSnippet[]
}

export function CustomAutocompleteModal({
  open,
  onOpenChange,
  onSaveSnippets,
  snippets,
}: CustomAutocompleteModalProps) {
  const [customSnippets, setCustomSnippets] =
    useState<CustomSnippet[]>(snippets)
  const [currentSnippet, setCurrentSnippet] = useState<CustomSnippet | null>(
    null
  )
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setCustomSnippets(snippets)
  }, [snippets])

  const handleAddSnippet = () => {
    setCurrentSnippet({
      id: Date.now().toString(),
      label: '',
      insertText: '',
      detail: '',
      documentation: '',
    })
    setIsEditing(true)
  }

  const handleEditSnippet = (snippet: CustomSnippet) => {
    setCurrentSnippet(snippet)
    setIsEditing(true)
  }

  const handleDeleteSnippet = (id: string) => {
    const updatedSnippets = customSnippets.filter(snippet => snippet.id !== id)
    setCustomSnippets(updatedSnippets)
    onSaveSnippets(updatedSnippets)
  }

  const handleSaveSnippet = () => {
    if (!currentSnippet || !currentSnippet.label || !currentSnippet.insertText)
      return

    const updatedSnippets = isEditing
      ? customSnippets.map(s =>
          s.id === currentSnippet.id ? currentSnippet : s
        )
      : [...customSnippets, currentSnippet]

    setCustomSnippets(updatedSnippets)
    onSaveSnippets(updatedSnippets)
    setCurrentSnippet(null)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setCurrentSnippet(null)
    setIsEditing(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Gerenciar Autocompletes Personalizados</DialogTitle>
          <DialogDescription>
            Crie e gerencie seus próprios snippets e templates para o editor
            SQL.
          </DialogDescription>
        </DialogHeader>

        {isEditing ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="label">Nome do Snippet</Label>
              <Input
                id="label"
                value={currentSnippet?.label || ''}
                onChange={e =>
                  setCurrentSnippet(prev =>
                    prev ? { ...prev, label: e.target.value } : null
                  )
                }
                placeholder="Ex: Consulta de Vendas Mensais"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="insertText">Código SQL</Label>
              <Textarea
                id="insertText"
                value={currentSnippet?.insertText || ''}
                onChange={e =>
                  setCurrentSnippet(prev =>
                    prev ? { ...prev, insertText: e.target.value } : null
                  )
                }
                placeholder="Ex: SELECT * FROM vendas WHERE data BETWEEN '${1:data_inicio}' AND '${2:data_fim}'"
                className="min-h-[150px] font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Use ${'{1:nome}'} para criar placeholders que o usuário pode
                navegar com Tab.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="detail">Descrição Curta</Label>
              <Input
                id="detail"
                value={currentSnippet?.detail || ''}
                onChange={e =>
                  setCurrentSnippet(prev =>
                    prev ? { ...prev, detail: e.target.value } : null
                  )
                }
                placeholder="Ex: Consulta de vendas por período"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="documentation">Documentação (opcional)</Label>
              <Textarea
                id="documentation"
                value={currentSnippet?.documentation || ''}
                onChange={e =>
                  setCurrentSnippet(prev =>
                    prev ? { ...prev, documentation: e.target.value } : null
                  )
                }
                placeholder="Ex: Esta consulta retorna todas as vendas dentro do período especificado."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancelar
              </Button>
              <Button onClick={handleSaveSnippet}>Salvar</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="py-4">
              <Button onClick={handleAddSnippet}>
                Adicionar Novo Autocomplete
              </Button>
            </div>

            <ScrollArea className="h-[300px] pr-4">
              {customSnippets.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum autocomplete personalizado criado ainda.
                </p>
              ) : (
                <div className="space-y-4">
                  {customSnippets.map(snippet => (
                    <div
                      key={snippet.id}
                      className="border rounded-md p-3 flex flex-col space-y-2 hover:bg-muted/50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{snippet.label}</h4>
                          <p className="text-sm text-muted-foreground">
                            {snippet.detail}
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditSnippet(snippet)}
                            aria-label="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSnippet(snippet.id)}
                            aria-label="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                        {snippet.insertText}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </>
        )}

        <DialogFooter>
          {!isEditing && (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
