"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations, type Locale } from "./translations"

type TranslationType = typeof translations.en

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslationType
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")

  useEffect(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem("horizon-locale") as Locale | null
    if (saved && (saved === "en" || saved === "es")) {
      setLocaleState(saved)
    } else {
      // Check browser language
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith("es")) {
        setLocaleState("es")
      }
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("horizon-locale", newLocale)
  }

  const t = translations[locale]

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
