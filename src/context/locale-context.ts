import { createContext } from 'react'
import type { Language } from '../data/scenes'

export type LocaleContextValue = {
  language: Language
  setLanguage: (language: Language) => void
}

export const STORAGE_KEY = 'ian.dimension.locale'

export const LocaleContext = createContext<LocaleContextValue | null>(null)

export function detectLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'en'
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'zh' || stored === 'en' || stored === 'de') {
    return stored
  }

  const candidates = window.navigator.languages ?? [window.navigator.language]
  for (const candidate of candidates) {
    const normalized = candidate.toLowerCase()
    if (normalized.startsWith('zh')) {
      return 'zh'
    }
    if (normalized.startsWith('de')) {
      return 'de'
    }
  }

  return 'en'
}
