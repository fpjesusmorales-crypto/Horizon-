"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ServicesSection } from "@/components/services-section"
import { AddonsSection } from "@/components/addons-section"
import { RecurringPlansSection } from "@/components/recurring-plans-section"
import QuoteEstimator from "@/components/quote-estimator"
import { useLanguage } from "@/lib/i18n"

export default function ServicesPage() {
  const { locale, t } = useLanguage()

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-slate-950 py-20 text-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs tracking-[0.18em] text-slate-200">
                {locale === "es" ? "NUESTROS SERVICIOS" : "OUR SERVICES"}
              </div>
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                {locale === "es" 
                  ? "Servicios de Limpieza Profesional en Nashville" 
                  : "Professional Cleaning Services in Nashville"
                }
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                {locale === "es"
                  ? "Desde mantenimiento rutinario hasta limpieza profunda y servicios de mudanza, ofrecemos opciones flexibles diseñadas según sus necesidades."
                  : "From routine maintenance to deep cleaning and move-in/move-out services, we offer flexible options designed around your needs."
                }
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#quote-estimator"
                  className="rounded-2xl bg-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                >
                  {t.nav.getQuote}
                </a>
                <a
                  href="/contact"
                  className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  {t.common.contactUs}
                </a>
              </div>
            </div>
          </div>
        </section>

        <ServicesSection />
        <AddonsSection />
        <RecurringPlansSection />
        <QuoteEstimator />

        {/* CTA */}
        <section className="bg-slate-950 py-20 text-white">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-3xl font-semibold md:text-4xl">
              {locale === "es" ? "¿Listo para reservar su limpieza?" : "Ready to book your cleaning?"}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              {locale === "es"
                ? "Comience con una cotización o comuníquese para discutir sus necesidades específicas. Respondemos en 24 horas."
                : "Get started with a quote or reach out to discuss your specific needs. We respond within 24 hours."
              }
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/book"
                className="rounded-2xl bg-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
              >
                {t.nav.bookCleaning}
              </a>
              <a
                href="/contact"
                className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                {t.common.contactUs}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
