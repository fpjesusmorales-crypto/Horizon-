"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n"

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { t, locale } = useLanguage()

  return (
    <section id="faq" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-600">
            FAQ
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-balance md:text-4xl">
            {t.faq.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            {locale === "es"
              ? "¿Tiene preguntas sobre nuestros servicios de limpieza? Encuentre respuestas a preguntas comunes a continuación, o comuníquese con nosotros directamente."
              : "Have questions about our cleaning services? Find answers to common questions below, or reach out to us directly."
            }
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {t.faq.questions.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-medium text-slate-900 pr-4">{faq.question}</span>
                <span
                  className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </button>
              <div
                className={`grid transition-all duration-200 ease-in-out ${
                  openIndex === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-5 text-slate-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-600">
            {locale === "es" ? "¿Todavía tiene preguntas? " : "Still have questions? "}
            <a
              href="mailto:contact@horizonoperations.cleaning"
              className="font-medium text-teal-600 hover:text-teal-700 transition"
            >
              {locale === "es" ? "Contáctenos directamente" : "Contact us directly"}
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
