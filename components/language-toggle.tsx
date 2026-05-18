"use client"

import { useLanguage, type Locale } from "@/lib/i18n"

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage()

  return (
    <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1">
      <button
        onClick={() => setLocale("en")}
        className={`rounded-full px-3 py-1 text-sm font-medium transition ${
          locale === "en"
            ? "bg-slate-900 text-white"
            : "text-slate-600 hover:text-slate-900"
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => setLocale("es")}
        className={`rounded-full px-3 py-1 text-sm font-medium transition ${
          locale === "es"
            ? "bg-slate-900 text-white"
            : "text-slate-600 hover:text-slate-900"
        }`}
        aria-label="Cambiar a Español"
      >
        ES
      </button>
    </div>
  )
}
