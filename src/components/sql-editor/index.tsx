'use client'

import { useSnippets } from '@/lib/swr/use-snippets'
import Editor, { type Monaco } from '@monaco-editor/react'
import { useEffect, useState } from 'react'

export function SqlEditor({
  value: defaultValue,
  setValue: setDefaultValue,
}: {
  value?: string
  setValue?: (value?: string) => void
}) {
  const [value, setValue] = useState<string | undefined>(defaultValue)
  const [isClient, setIsClient] = useState(false)
  const [monacoInstance, setMonacoInstance] = useState<Monaco | null>(null)

  const { isLoading, snippets, isValidating } = useSnippets()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (monacoInstance && !isLoading && !isValidating) {
      registerCompletionProvider(monacoInstance)
    }
  }, [monacoInstance, isValidating, isLoading])

  const registerCompletionProvider = (monaco: Monaco) => {
    // Registrar novo provedor com todos os snippets atualizados
    monaco.languages.registerCompletionItemProvider('sql', {
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

            // Workspace custom snippets
            ...(snippets || []).map(snippet => ({
              label: snippet.name,
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              insertText: snippet.code,
              detail: snippet.description ?? '',
              range,
            })),
          ],
        }
      },
    })
  }

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    setMonacoInstance(monaco)

    // Inicializar o provedor de autocompletion
    registerCompletionProvider(monaco)

    editor.focus()
  }

  if (isLoading || !isClient) {
    return <div className="h-96 w-full animate-pulse bg-slate-100" />
  }

  return (
    <div className="border shadow-xs">
      <div className="h-96 w-full">
        <Editor
          height="100%"
          defaultLanguage="sql"
          defaultValue={value}
          onChange={value => {
            setValue(value)
            setDefaultValue?.(value)
          }}
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
  )
}
