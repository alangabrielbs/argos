'use client'

import { Button } from '@/components/ui/button-shadcn'
import Editor, { type Monaco } from '@monaco-editor/react'
import { Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSqlSnippetsModal } from '../modals/sql-snippets-modal'
import {
  CustomAutocompleteModal,
  type CustomSnippet,
} from './custom-autocomplete-modal'

export function SqlEditor() {
  const [value, setValue] = useState<string | undefined>(
    '\n\n\n-- Escreva seu SQL aqui'
  )
  const [isClient, setIsClient] = useState(false)
  const [customSnippetsModalOpen, setCustomSnippetsModalOpen] = useState(false)
  const [customSnippets, setCustomSnippets] = useState<CustomSnippet[]>([])
  const [editorInstance, setEditorInstance] = useState<any>(null)
  const [monacoInstance, setMonacoInstance] = useState<Monaco | null>(null)

  // Carregar snippets personalizados do localStorage
  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      try {
        const savedSnippets = localStorage.getItem('sqlEditorCustomSnippets')
        if (savedSnippets) {
          setCustomSnippets(JSON.parse(savedSnippets))
        }
      } catch (error) {
        console.error('Erro ao carregar snippets personalizados:', error)
      }
    }
  }, [])

  // Atualizar as sugestões quando os snippets personalizados mudarem
  useEffect(() => {
    if (monacoInstance) {
      registerCompletionProvider(monacoInstance)
    }
  }, [monacoInstance])

  // Salvar snippets personalizados no localStorage
  const saveCustomSnippets = (snippets: CustomSnippet[]) => {
    setCustomSnippets(snippets)
    if (typeof window !== 'undefined') {
      localStorage.setItem('sqlEditorCustomSnippets', JSON.stringify(snippets))
    }
  }

  const registerCompletionProvider = (monaco: Monaco) => {
    // Registrar novo provedor com todos os snippets atualizados
    const disposable = monaco.languages.registerCompletionItemProvider('sql', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        }

        return {
          suggestions: [
            ...['SELECT', 'TRUNCATE', 'GRANT', 'REVOKE'].map(cmd => ({
              label: cmd,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: cmd,
              detail: 'SQL Command',
              range,
            })),

            // SQL Keywords
            ...[
              'FROM',
              'WHERE',
              'GROUP BY',
              'HAVING',
              'ORDER BY',
              'LIMIT',
              'JOIN',
              'LEFT JOIN',
              'RIGHT JOIN',
              'INNER JOIN',
              'OUTER JOIN',
              'ON',
              'AS',
              'UNION',
              'ALL',
              'IN',
              'BETWEEN',
              'LIKE',
              'IS NULL',
              'IS NOT NULL',
              'ASC',
              'DESC',
            ].map(keyword => ({
              label: keyword,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: keyword,
              detail: 'SQL Keyword',
              range,
            })),

            // SQL Functions
            ...[
              'COUNT',
              'SUM',
              'AVG',
              'MIN',
              'MAX',
              'ROUND',
              'UPPER',
              'LOWER',
              'CONCAT',
              'SUBSTRING',
              'TRIM',
              'LENGTH',
              'NOW',
              'CURRENT_DATE',
              'COALESCE',
            ].map(func => ({
              label: func,
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: func,
              detail: 'SQL Function',
              range,
            })),

            // Data Types
            ...[
              'INT',
              'VARCHAR',
              'TEXT',
              'DATE',
              'DATETIME',
              'BOOLEAN',
              'FLOAT',
              'DOUBLE',
              'DECIMAL',
              'CHAR',
              'TIMESTAMP',
            ].map(type => ({
              label: type,
              kind: monaco.languages.CompletionItemKind.TypeParameter,
              insertText: type,
              detail: 'Data Type',
              range,
            })),

            {
              label: 'SELECT FROM',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'SELECT ${1:*} FROM ${2:table_name}',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'SELECT query snippet',
              range,
            },
          ],
        }
      },
    })
  }

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    setEditorInstance(editor)
    setMonacoInstance(monaco)

    // Inicializar o provedor de autocompletion
    registerCompletionProvider(monaco)

    editor.focus()
  }

  if (!isClient) {
    return <div className="h-96 w-full animate-pulse bg-muted" />
  }

  return (
    <>
      {/* <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setShowSqlSnippetsModal(true)}
      >
        <Settings className="h-4 w-4 mr-2" />
        Gerenciar Autocompletes
      </Button> */}

      <div className="border shadow-xs">
        <div className="h-96 w-full">
          <Editor
            height="100%"
            defaultLanguage="sql"
            defaultValue={value}
            onChange={setValue}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              fontFamily: 'var(--font-geist-mono)',
              wordWrap: 'on',
              automaticLayout: true,
              scrollBeyondLastColumn: 0,
              cursorWidth: 0,
              overviewRulerLanes: 0,
              renderLineHighlight: 'gutter',
            }}
          />
        </div>
      </div>
    </>
  )
}
