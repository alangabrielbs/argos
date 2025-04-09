'use client'

import type React from 'react'
import { RefObject, useEffect, useRef, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormContext } from 'react-hook-form'
import { Variable } from './types'

interface FormulaInputProps {
  formula: string
  setFormula: (formula: string) => void
  variables: Variable[]
  operators: Array<{ symbol: string; label: string; insert?: string }>
  helpers: Array<{ name: string; description: string; insert: string }>
  cursorPosition: number
  setCursorPosition: (position: number) => void
  inputRef: RefObject<HTMLInputElement | null>
}

export function FormulaInput({
  formula,
  setFormula,
  variables,
  operators,
  helpers,
  cursorPosition,
  setCursorPosition,
  inputRef,
}: FormulaInputProps) {
  const [suggestions, setSuggestions] = useState<
    Array<{ text: string; value: string; type: string }>
  >([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [currentWord, setCurrentWord] = useState('')
  const form = useFormContext()

  // Update cursor position when input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormula(value)

    if (inputRef?.current) {
      const position = inputRef.current.selectionStart || 0
      setCursorPosition(position)

      // Extract the current word being typed
      const textBeforeCursor = value.substring(0, position)
      const wordMatch = textBeforeCursor.match(/[a-zA-Z0-9_]*$/)
      const word = wordMatch ? wordMatch[0] : ''
      setCurrentWord(word)

      // Show suggestions if we have a partial word
      if (word.length > 0) {
        generateSuggestions(word)
        setShowSuggestions(true)
      } else {
        setShowSuggestions(false)
      }
    }
  }

  // Generate suggestions based on current word
  const generateSuggestions = (word: string) => {
    const lowercaseWord = word.toLowerCase()
    const allSuggestions: Array<{ text: string; value: string; type: string }> =
      []

    // Add variable suggestions
    variables.forEach(variable => {
      if (variable.name.toLowerCase().includes(lowercaseWord)) {
        allSuggestions.push({
          text: `${variable.name} (valor: ${variable.value})`,
          value: variable.name,
          type: 'variable',
        })
      }
    })

    // Add operator suggestions
    operators.forEach(op => {
      if (
        op.symbol.toLowerCase().includes(lowercaseWord) ||
        op.label.toLowerCase().includes(lowercaseWord)
      ) {
        allSuggestions.push({
          text: `"${op.symbol}" (${op.label})`,
          value: op.insert || op.symbol,
          type: 'operator',
        })
      }
    })

    // Add helper function suggestions
    helpers.forEach(helper => {
      if (helper.name.toLowerCase().includes(lowercaseWord)) {
        allSuggestions.push({
          text: `"${helper.name}" (${helper.description})`,
          value: helper.insert,
          type: 'helper',
        })
      }
    })

    setSuggestions(allSuggestions)
  }

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: {
    text: string
    value: string
  }) => {
    if (inputRef?.current) {
      const position = cursorPosition
      const textBeforeCursor = formula.substring(0, position)
      const textAfterCursor = formula.substring(position)

      // Replace the current word with the suggestion
      const wordStartPos = textBeforeCursor.length - currentWord.length
      const newFormula =
        formula.substring(0, wordStartPos) + suggestion.value + textAfterCursor

      setFormula(newFormula)

      // Reset suggestions
      setShowSuggestions(false)

      // Focus back on input and set cursor position after the inserted suggestion
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          const newPosition = wordStartPos + suggestion.value.length
          inputRef.current.setSelectionRange(newPosition, newPosition)
          setCursorPosition(newPosition)
        }
      }, 0)
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef?.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [inputRef])

  // Handle cursor position changes
  const handleSelect = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const position = e.currentTarget.selectionStart || 0
    setCursorPosition(position)
  }

  return (
    <div className="relative">
      <Label htmlFor="formula-input">Formula</Label>
      <div className="mt-1">
        <Input
          id="formula-input"
          ref={inputRef}
          value={formula}
          autoComplete="off"
          onChange={handleInputChange}
          onSelect={handleSelect}
          onClick={handleSelect}
          onKeyDown={e => {
            if (e.key === 'Escape') {
              setShowSuggestions(false)
            } else if (e.key === 'ArrowDown' && showSuggestions) {
              e.preventDefault()
              // Focus on first suggestion
              const suggestionElement = document.getElementById('suggestion-0')
              if (suggestionElement) suggestionElement.focus()
            }
          }}
          placeholder="Construa sua fórmula..."
          className="font-mono"
        />

        {form.formState.errors.expression?.message && (
          <div className="text-rose-600 text-sm">
            {typeof form.formState.errors.expression?.message === 'string' &&
              form.formState.errors.expression?.message}
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full max-h-60 overflow-auto bg-background border rounded-md shadow-md mt-1">
          {suggestions.map((suggestion, index) => (
            // biome-ignore lint/a11y/useButtonType: <explanation>
            <button
              key={index}
              id={`suggestion-${index}`}
              className={`w-full text-left px-3 py-2 hover:bg-muted flex items-center ${
                suggestion.type === 'variable'
                  ? 'text-green-600'
                  : suggestion.type === 'operator'
                    ? 'text-blue-600'
                    : 'text-purple-600'
              }`}
              onClick={e => {
                e.stopPropagation()
                handleSelectSuggestion(suggestion)
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSelectSuggestion(suggestion)
                } else if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  const nextElement = document.getElementById(
                    `suggestion-${index + 1}`
                  )
                  if (nextElement) nextElement.focus()
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  if (index === 0) {
                    if (inputRef?.current) inputRef.current.focus()
                  } else {
                    const prevElement = document.getElementById(
                      `suggestion-${index - 1}`
                    )
                    if (prevElement) prevElement.focus()
                  }
                } else if (e.key === 'Escape') {
                  setShowSuggestions(false)
                  if (inputRef?.current) inputRef.current.focus()
                }
              }}
            >
              <span className="mr-2">
                {suggestion.type === 'variable'
                  ? '🔢'
                  : suggestion.type === 'operator'
                    ? '🔣'
                    : '🔧'}
              </span>
              {suggestion.text}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
