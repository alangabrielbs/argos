import { JsonValue } from '@prisma/client/runtime/library'

export function getPrimitiveKeys(json: any, prefix = ''): string[] {
  if (typeof json !== 'object' || json === null) {
    return []
  }

  let keys: string[] = []

  for (const key in json) {
    const value = json[key]
    const fullKey = prefix ? `${prefix}.${key}` : key

    // Check if the value is a primitive (number, string, boolean) or null
    if (
      value === null ||
      typeof value === 'number' ||
      typeof value === 'string' ||
      typeof value === 'boolean'
    ) {
      keys.push(fullKey)
    }
    // If it's an object (but not an array or date), recursively check its properties
    else if (
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      keys = keys.concat(getPrimitiveKeys(value, fullKey))
    }
  }

  return keys
}

export function getValueByPath({
  path,
  obj,
}: { obj?: JsonValue; path: string }) {
  const parts = path.split('.')
  let current = obj

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      if (
        typeof current === 'object' &&
        !Array.isArray(current) &&
        current !== null
      ) {
        if (current[part] !== undefined) {
          current = current[part] as JsonValue
        } else {
          return undefined
        }
        if (current === undefined) {
          return undefined
        }
      } else {
        return undefined
      }
    } else {
      return undefined
    }
  }

  return current
}
