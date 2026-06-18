"use client"

import { useLanguage } from "@/lib/i18n"

export function HeroSection() {
  const { t, locale } = useLanguage()

  return (
    <section id="home" className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_35%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-2 md:items-center md:py-32">
        <div>
          <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs tracking-[0.18em] text-slate-200">
            {locale === "es" 
              ? "LIMPIEZA RESIDENCIAL • SEGURIDAD • CONFIABILIDAD • NASHVILLE, TN"
              : "RESIDENTIAL CLEANING • SAFETY • RELIABILITY • NASHVILLE, TN"
            }
          </div>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-balance md:text-6xl">
            {locale === "es"
              ? "Limpieza Residencial Confiable en Nashville"
              : "Reliable Residential Cleaning in Nashville"
            }
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 md:text-lg">
            {t.hero.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-teal-300">
            <span>
              {t.hero.email}{" "}
              <a
                href="mailto:contact@horizonoperations.cleaning"
                className="underline underline-offset-2 transition hover:text-teal-200"
              >
                contact@horizonoperations.cleaning
              </a>
            </span>
            <span aria-hidden="true" className="hidden text-teal-500/50 sm:inline">
              |
            </span>
            <span>
              {t.hero.phone}{" "}
              <a
                href="tel:+16154287282"
                className="underline underline-offset-2 transition hover:text-teal-200"
              >
                (615) 428-7282
              </a>
            </span>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="rounded-2xl bg-teal-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:-translate-y-0.5"
            >
              {t.nav.bookCleaning}
            </a>
            <a
              href="#services"
              className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              {t.hero.viewServices}
            </a>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl font-semibold">{locale === "es" ? "Confiable" : "Reliable"}</div>
              <div className="mt-1 text-sm text-slate-300">
                {locale === "es" 
                  ? "Programación clara y servicio confiable."
                  : "Clear scheduling and dependable service."
                }
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl font-semibold">{locale === "es" ? "Seguro" : "Safe"}</div>
              <div className="mt-1 text-sm text-slate-300">
                {locale === "es"
                  ? "Respetuoso, cuidadoso y orientado al detalle."
                  : "Respectful, careful, and detail-driven in every home."
                }
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-2xl font-semibold">{locale === "es" ? "Consistente" : "Consistent"}</div>
              <div className="mt-1 text-sm text-slate-300">
                {locale === "es"
                  ? "Un proceso estructurado diseñado para calidad constante."
                  : "A structured process designed for repeat quality."
                }
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div className="rounded-[1.5rem] bg-white p-6 text-slate-900 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="text-sm font-medium text-slate-500">Horizon Operations</div>
                <div className="text-2xl font-semibold">
                  {locale === "es" ? "Limpieza Residencial" : "Residential Cleaning"}
                </div>
              </div>
              <div className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                {locale === "es" ? "Reservando" : "Now Booking"}
              </div>
            </div>
            <div className="mt-6 space-y-4 text-sm text-slate-600">
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <div className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-teal-500" />
                <div>
                  <div className="font-medium text-slate-900">
                    {locale === "es" ? "Limpieza Estándar" : "Standard Cleaning"}
                  </div>
                  <div>
                    {locale === "es"
                      ? "Ideal para mantenimiento recurrente y mantener un hogar limpio y cómodo."
                      : "Ideal for recurring upkeep and maintaining a clean, comfortable home."
                    }
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <div className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-sky-500" />
                <div>
                  <div className="font-medium text-slate-900">
                    {locale === "es" ? "Limpieza Profunda" : "Deep Cleaning"}
                  </div>
                  <div>
                    {locale === "es"
                      ? "Diseñada para primeras visitas, espacios descuidados y un reinicio completo del hogar."
                      : "Built for first visits, neglected spaces, and a full reset of the home."
                    }
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <div className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-slate-900" />
                <div>
                  <div className="font-medium text-slate-900">
                    {locale === "es" ? "Limpieza de Mudanza" : "Move-In / Move-Out"}
                  </div>
                  <div>
                    {locale === "es"
                      ? "Limpieza detallada de hogares vacíos para transiciones suaves y entregas limpias."
                      : "Detailed empty-home cleaning for smooth transitions and clean handoffs."
                    }
                  </div>
                </div>
              </div>
            </div>
            <a
              href="#contact"
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"
            >
              {t.nav.bookCleaning}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
