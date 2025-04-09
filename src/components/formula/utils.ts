import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Função para calcular a distância de Levenshtein (similaridade entre strings)
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []

  // Inicializar a matriz
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  // Preencher a matriz
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substituição
          matrix[i][j - 1] + 1, // inserção
          matrix[i - 1][j] + 1 // remoção
        )
      }
    }
  }

  return matrix[b.length][a.length]
}

// Função para calcular a similaridade entre duas strings (0 a 1)
export function stringSimilarity(a: string, b: string): number {
  const maxLength = Math.max(a.length, b.length)
  if (maxLength === 0) return 1.0 // Ambas strings vazias são 100% similares

  const distance = levenshteinDistance(a, b)
  return 1 - distance / maxLength
}

// Função para encontrar a melhor correspondência para uma string
export function findBestMatch(
  input: string,
  options: string[]
): { bestMatch: string; similarity: number } | null {
  if (!input || options.length === 0) return null

  let bestMatch = ''
  let highestSimilarity = 0

  for (const option of options) {
    const similarity = stringSimilarity(
      input.toLowerCase(),
      option.toLowerCase()
    )

    if (similarity > highestSimilarity) {
      highestSimilarity = similarity
      bestMatch = option
    }
  }

  return { bestMatch, similarity: highestSimilarity }
}
