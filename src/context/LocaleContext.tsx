import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Language } from '../data/scenes'
import { detectLanguage, LocaleContext, STORAGE_KEY } from './locale-context'

export function LocaleProvider({
  children,
}: {
  children: ReactNode
}) {
  const [language, setLanguage] = useState<Language>(detectLanguage)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language)
    document.documentElement.lang = language
  }, [language])

  return (
    <LocaleContext.Provider value={{ language, setLanguage }}>
      {children}
    </LocaleContext.Provider>
  )
}
