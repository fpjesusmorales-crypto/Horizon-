"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { useLanguage } from "@/lib/i18n"

export default function AboutPage() {
  const { locale, t } = useLanguage()

  const values = locale === "es" ? [
    {
      title: "Confiable y Consistente",
      description: "Programación confiable, expectativas claras y un estándar consistente en cada visita.",
    },
    {
      title: "Servicio Totalmente Profesional",
      description: "Limpiadores capacitados, equipo adecuado y atención al detalle en cada trabajo.",
    },
    {
      title: "Reserva en Línea Fácil",
      description: "Proceso de programación simple con cotizaciones rápidas y horarios de citas flexibles.",
    },
    {
      title: "Planes Recurrentes Flexibles",
      description: "Horarios de limpieza semanal, quincenal o mensual con descuentos recurrentes.",
    },
    {
      title: "Enfocados en la Satisfacción",
      description: "Su satisfacción es nuestra prioridad. Respaldamos nuestro trabajo.",
    },
    {
      title: "Negocio Local de Nashville",
      description: "Sirviendo orgullosamente el área metropolitana de Nashville con servicio local y personalizado.",
    },
  ] : [
    {
      title: "Reliable & Consistent",
      description: "Dependable scheduling, clear expectations, and a consistent standard every visit.",
    },
    {
      title: "Fully Professional Service",
      description: "Trained cleaners, proper equipment, and attention to detail on every job.",
    },
    {
      title: "Easy Online Booking",
      description: "Simple scheduling process with quick quotes and flexible appointment times.",
    },
    {
      title: "Flexible Recurring Plans",
      description: "Weekly, biweekly, or monthly cleaning schedules with recurring discounts.",
    },
    {
      title: "Satisfaction Focused",
      description: "Your satisfaction is our priority. We stand behind our work.",
    },
    {
      title: "Nashville Local Business",
      description: "Proudly serving the Nashville metro area with local, personalized service.",
    },
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
                {locale === "es" ? "SOBRE NOSOTROS" : "ABOUT US"}
              </div>
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                {locale === "es"
                  ? "Una empresa de limpieza construida sobre confianza y consistencia"
                  : "A cleaning company built on trust and consistency"
                }
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                {locale === "es"
                  ? "Horizon Operations es una empresa de limpieza residencial con sede en Nashville enfocada en confiabilidad, profesionalismo y calidad constante."
                  : "Horizon Operations is a Nashville-based residential cleaning company focused on reliability, professionalism, and consistent quality."
                }
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-600">
                  {locale === "es" ? "Nuestra Misión" : "Our Mission"}
                </div>
                <h2 className="mt-3 text-3xl font-semibold text-balance md:text-4xl">
                  {locale === "es"
                    ? "Brindar servicios de limpieza confiables con comunicación clara y atención al detalle."
                    : "Deliver dependable cleaning services with clear communication and attention to detail."
                  }
                </h2>
                <p className="mt-5 leading-7 text-slate-700">
                  {locale === "es"
                    ? "Nos especializamos en limpieza rutinaria del hogar, limpieza profunda, servicios de mudanza y planes de mantenimiento recurrente diseñados para simplificar la vida cotidiana de propietarios y familias ocupadas."
                    : "We specialize in routine home cleaning, deep cleaning, move-in/move-out services, and recurring maintenance plans designed to simplify everyday life for busy homeowners and families."
                  }
                </p>
                <p className="mt-4 leading-7 text-slate-700">
                  {locale === "es"
                    ? "En Horizon Operations, creemos que un ambiente limpio crea tranquilidad. Cada servicio está construido en torno al profesionalismo, la confianza y la consistencia operativa — desde la reserva hasta la revisión final."
                    : "At Horizon Operations, we believe a clean environment creates peace of mind. Every service is built around professionalism, trust, and operational consistency — from booking to final walkthrough."
                  }
                </p>
                <p className="mt-4 leading-7 text-slate-700">
                  {locale === "es"
                    ? "Ya sea que necesite un reinicio único o apoyo de limpieza recurrente, Horizon Operations está comprometido a crear una experiencia de hogar más limpia y cómoda."
                    : "Whether you need a one-time reset or recurring cleaning support, Horizon Operations is committed to creating a cleaner, more comfortable home experience."
                  }
                </p>
              </div>

              <div className="relative">
                <div className="overflow-hidden rounded-[2rem] shadow-xl">
                  <Image
                    src="/images/horizon-team-cleaning.png?v=2"
                    alt={locale === "es" ? "Profesionales de limpieza de Horizon Operations" : "Horizon Operations cleaning professionals"}
                    width={800}
                    height={533}
                    className="h-auto w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-slate-100">
                  <div className="text-2xl font-bold text-teal-600">Nashville</div>
                  <div className="text-sm text-slate-600">{locale === "es" ? "Negocio Local" : "Local Business"}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Stand For */}
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <div className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-600">
                {locale === "es" ? "Lo Que Representamos" : "What We Stand For"}
              </div>
              <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                {locale === "es" ? "Por Qué Elegir Horizon Operations" : "Why Choose Horizon Operations"}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                {locale === "es"
                  ? "Servimos orgullosamente el área metropolitana de Nashville y continuamos construyendo una reputación centrada en estos valores fundamentales."
                  : "We proudly serve the greater Nashville area and continue building a reputation centered on these core values."
                }
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="text-xl font-semibold text-slate-900">{value.title}</div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Principles */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-[1.5rem] bg-slate-100 p-6">
                <div className="text-sm font-medium text-slate-500">
                  {locale === "es" ? "Nuestro Enfoque" : "Our Focus"}
                </div>
                <div className="mt-2 text-xl font-semibold">
                  {locale === "es" ? "Confiabilidad primero" : "Reliability first"}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {locale === "es"
                    ? "Programación confiable, expectativas claras y un estándar consistente en cada visita."
                    : "Dependable scheduling, clear expectations, and a consistent standard every visit."
                  }
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-100 p-6">
                <div className="text-sm font-medium text-slate-500">
                  {locale === "es" ? "Nuestro Proceso" : "Our Process"}
                </div>
                <div className="mt-2 text-xl font-semibold">
                  {locale === "es" ? "Servicio estructurado" : "Structured service"}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {locale === "es"
                    ? "Un flujo de trabajo de limpieza repetible que apoya el control de calidad y una mejor experiencia del cliente."
                    : "A repeatable cleaning workflow that supports quality control and a better client experience."
                  }
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-100 p-6">
                <div className="text-sm font-medium text-slate-500">
                  {locale === "es" ? "Nuestro Estándar" : "Our Standard"}
                </div>
                <div className="mt-2 text-xl font-semibold">
                  {locale === "es" ? "Respeto por el hogar" : "Respect for the home"}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {locale === "es"
                    ? "Tratamos cada hogar con cuidado, nos comunicamos profesionalmente y trabajamos con respeto por su espacio."
                    : "We treat every home carefully, communicate professionally, and work with respect for your space."
                  }
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-100 p-6">
                <div className="text-sm font-medium text-slate-500">
                  {locale === "es" ? "Nuestra Dirección" : "Our Direction"}
                </div>
                <div className="mt-2 text-xl font-semibold">
                  {locale === "es" ? "Construido para crecer bien" : "Built to grow well"}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {locale === "es"
                    ? "Comenzando con servicio residencial y construyendo una base lo suficientemente fuerte para escalar con el tiempo."
                    : "Starting with residential service and building a foundation strong enough to scale over time."
                  }
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-950 py-20 text-white">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-3xl font-semibold md:text-4xl">
              {locale === "es" ? "¿Listo para experimentar la diferencia?" : "Ready to experience the difference?"}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              {locale === "es"
                ? "Reserve su primera limpieza hoy y vea por qué los propietarios de Nashville confían en Horizon Operations."
                : "Book your first cleaning today and see why Nashville homeowners trust Horizon Operations."
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
