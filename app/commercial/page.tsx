"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CommercialServicesSection } from "@/components/commercial-services-section"
import { CommercialQuoteForm } from "@/components/commercial-quote-form"
import { useLanguage } from "@/lib/i18n"

export default function CommercialPage() {
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
                {locale === "es" ? "SERVICIOS COMERCIALES" : "COMMERCIAL SERVICES"}
              </div>
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                {locale === "es" 
                  ? "Limpieza Comercial Profesional en Nashville" 
                  : "Professional Commercial Cleaning in Nashville"
                }
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                {locale === "es"
                  ? "Desde oficinas hasta espacios comerciales, edificios de apartamentos y más, brindamos servicios de limpieza comercial confiables y profesionales diseñados para su negocio."
                  : "From offices to retail spaces, apartment buildings, and more, we provide reliable, professional commercial cleaning services designed for your business."
                }
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#commercial-quote"
                  className="rounded-2xl bg-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                >
                  {locale === "es" ? "Solicitar Cotización" : "Request a Quote"}
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

        <CommercialServicesSection />

        {/* Why Choose Us */}
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <h2 className="text-3xl font-semibold md:text-4xl">
                {locale === "es" ? "¿Por qué elegir Horizon Operations?" : "Why Choose Horizon Operations?"}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                {locale === "es"
                  ? "Nos enfocamos en construir relaciones a largo plazo con nuestros clientes comerciales a través de un servicio consistente y confiable."
                  : "We focus on building long-term relationships with our commercial clients through consistent, reliable service."
                }
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold">
                  {locale === "es" ? "Programación Flexible" : "Flexible Scheduling"}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {locale === "es"
                    ? "Servicios diarios, semanales o mensuales adaptados a las necesidades de su negocio."
                    : "Daily, weekly, or monthly services tailored to your business needs."
                  }
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold">
                  {locale === "es" ? "Asegurado y Confiable" : "Insured & Bonded"}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {locale === "es"
                    ? "Completamente asegurado para su tranquilidad y protección."
                    : "Fully insured for your peace of mind and protection."
                  }
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold">
                  {locale === "es" ? "Equipo Capacitado" : "Trained Staff"}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {locale === "es"
                    ? "Profesionales capacitados en protocolos de limpieza comercial."
                    : "Professionals trained in commercial cleaning protocols."
                  }
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold">
                  {locale === "es" ? "Comunicación Clara" : "Clear Communication"}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {locale === "es"
                    ? "Respuestas rápidas y actualizaciones regulares de servicio."
                    : "Quick responses and regular service updates."
                  }
                </p>
              </div>
            </div>
          </div>
        </section>

        <CommercialQuoteForm />

        {/* CTA */}
        <section className="bg-slate-950 py-20 text-white">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-3xl font-semibold md:text-4xl">
              {locale === "es" ? "¿Listo para un espacio de trabajo más limpio?" : "Ready for a cleaner workspace?"}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              {locale === "es"
                ? "Contáctenos hoy para discutir sus necesidades de limpieza comercial. Ofrecemos cotizaciones personalizadas y horarios flexibles."
                : "Contact us today to discuss your commercial cleaning needs. We offer customized quotes and flexible scheduling."
              }
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="#commercial-quote"
                className="rounded-2xl bg-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
              >
                {locale === "es" ? "Solicitar Cotización" : "Request a Quote"}
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
