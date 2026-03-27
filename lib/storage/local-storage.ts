/**
 * Generic localStorage wrapper with type safety
 * Provides get/set/remove operations with JSON serialization
 */

type StorageKey = string

interface StorageOperations {
  get<T>(key: StorageKey): T | null
  set<T>(key: StorageKey, value: T): void
  remove(key: StorageKey): void
  clear(): void
  getAllKeys(): string[]
}

class LocalStorageProvider implements StorageOperations {
  private prefix = 'fitness_app_'

  private getPrefixedKey(key: StorageKey): string {
    return `${this.prefix}${key}`
  }

  get<T>(key: StorageKey): T | null {
    try {
      const prefixedKey = this.getPrefixedKey(key)
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(prefixedKey) : null
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`[Storage] Error reading key "${key}":`, error)
      return null
    }
  }

  set<T>(key: StorageKey, value: T): void {
    try {
      const prefixedKey = this.getPrefixedKey(key)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(prefixedKey, JSON.stringify(value))
      }
    } catch (error) {
      console.error(`[Storage] Error writing key "${key}":`, error)
    }
  }

  remove(key: StorageKey): void {
    try {
      const prefixedKey = this.getPrefixedKey(key)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(prefixedKey)
      }
    } catch (error) {
      console.error(`[Storage] Error removing key "${key}":`, error)
    }
  }

  clear(): void {
    try {
      if (typeof window !== 'undefined') {
        const keys = Object.keys(window.localStorage).filter((k) => k.startsWith(this.prefix))
        keys.forEach((key) => window.localStorage.removeItem(key))
      }
    } catch (error) {
      console.error('[Storage] Error clearing storage:', error)
    }
  }

  getAllKeys(): string[] {
    try {
      if (typeof window !== 'undefined') {
        return Object.keys(window.localStorage)
          .filter((k) => k.startsWith(this.prefix))
          .map((k) => k.replace(this.prefix, ''))
      }
      return []
    } catch (error) {
      console.error('[Storage] Error getting keys:', error)
      return []
    }
  }
}

export const storage = new LocalStorageProvider()
export type { StorageOperations, StorageKey }
