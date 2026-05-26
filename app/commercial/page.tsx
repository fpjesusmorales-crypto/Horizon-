"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CommercialServicesSection } from "@/components/commercial-services-section"
import { CommercialQuoteForm } from "@/components/commercial-quote-form"
import { useLanguage } from "@/lib/i18n"

export default function CommercialPage() {
  const { locale, t } = useLanguage()

  const whyHorizonPoints = locale === "es" 
    ? [
        "Listas de verificación de limpieza estructuradas",
        "Programación confiable",
        "Comunicación profesional",
        "Planes de servicio recurrente escalables",
        "Operaciones basadas en Nashville",
        "Inspecciones enfocadas en calidad",
      ]
    : [
        "Structured cleaning checklists",
        "Reliable scheduling",
        "Professional communication",
        "Scalable recurring service plans",
        "Nashville-based operations",
        "Quality-focused walkthroughs",
      ]

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-slate-950 py-20 text-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs tracking-[0.18em] text-slate-200">
                {locale === "es" ? "SERVICIOS COMERCIALES" : "COMMERCIAL SERVICES"}
              </div>
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                {locale === "es" 
                  ? "Limpieza Comercial Basada en Consistencia Operacional" 
                  : "Commercial Cleaning Built Around Operational Consistency"
                }
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                {locale === "es"
                  ? "Soluciones profesionales de limpieza para oficinas, espacios comerciales, comunidades de apartamentos, sitios de construcción y oficinas médicas en el área metropolitana de Nashville."
                  : "Professional cleaning solutions for offices, retail spaces, apartment communities, construction sites, and medical offices across the greater Nashville area."
                }
              </p>
              <div className="mt-8">
                <a
                  href="#commercial-quote"
                  className="inline-flex rounded-2xl bg-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                >
                  {locale === "es" ? "Solicitar Cotización Comercial" : "Request Commercial Quote"}
                </a>
              </div>
            </div>
          </div>
        </section>

        <CommercialServicesSection />

        <CommercialQuoteForm />

        {/* Why Horizon Operations */}
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl font-semibold md:text-4xl">
                  {locale === "es" ? "¿Por Qué Horizon Operations?" : "Why Horizon Operations?"}
                </h2>
                <p className="mt-4 text-slate-600">
                  {locale === "es"
                    ? "Nos enfocamos en construir relaciones a largo plazo con nuestros clientes comerciales a través de un servicio consistente, confiable y profesional."
                    : "We focus on building long-term relationships with our commercial clients through consistent, reliable, and professional service."
                  }
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {whyHorizonPoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100">
                      <svg className="h-4 w-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-slate-950 py-20 text-white">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-3xl font-semibold md:text-4xl">
              {locale === "es" 
                ? "¿Listo para Construir una Instalación Más Limpia y Confiable?" 
                : "Ready to Build a Cleaner, More Reliable Facility?"
              }
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              {locale === "es"
                ? "Contáctenos hoy para discutir sus necesidades de limpieza comercial. Ofrecemos cotizaciones personalizadas y programación flexible."
                : "Contact us today to discuss your commercial cleaning needs. We offer customized quotes and flexible scheduling."
              }
            </p>
            <div className="mt-8">
              <a
                href="#commercial-quote"
                className="inline-flex rounded-2xl bg-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
              >
                {locale === "es" ? "Solicitar Cotización Comercial" : "Request Commercial Quote"}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
