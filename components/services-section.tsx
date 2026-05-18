"use client"

import { useLanguage } from "@/lib/i18n"

export function ServicesSection() {
  const { locale } = useLanguage()

  return (
    <section id="services" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-600">
            {locale === "es" ? "Servicios" : "Services"}
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-balance md:text-4xl">
            {locale === "es"
              ? "Limpieza residencial diseñada en torno a la confianza y consistencia."
              : "Residential cleaning designed around trust and consistency."
            }
          </h2>
          <p className="mt-4 text-slate-600">
            {locale === "es"
              ? "Comenzamos con limpieza residencial y nos enfocamos en hacer lo básico excepcionalmente bien: comunicación clara, servicio confiable y resultados visibles."
              : "We start with residential cleaning and focus on doing the basics exceptionally well: clear communication, dependable service, and visible results."
            }
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <div className="text-lg font-semibold">
              {locale === "es" ? "Limpieza Estándar" : "Standard Cleaning"}
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {locale === "es"
                ? "Un servicio recurrente diseñado para mantener su hogar limpio, cómodo y mantenido en un horario consistente."
                : "A recurring service designed to keep your home clean, comfortable, and maintained on a consistent schedule."
              }
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              {locale === "es" ? (
                <>
                  <li>Limpieza de superficies de cocina</li>
                  <li>Limpieza y desinfección de baños</li>
                  <li>Quitar polvo y ordenar</li>
                  <li>Aspirar y trapear</li>
                  <li>Retiro de basura</li>
                </>
              ) : (
                <>
                  <li>Kitchen surface wipe-down</li>
                  <li>Bathroom cleaning and disinfecting</li>
                  <li>Dusting and straightening</li>
                  <li>Vacuuming and mopping</li>
                  <li>Trash removal</li>
                </>
              )}
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-lg">
            <div className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
              {locale === "es" ? "Más Solicitado" : "Most Requested"}
            </div>
            <div className="mt-4 text-lg font-semibold">
              {locale === "es" ? "Limpieza Profunda" : "Deep Cleaning"}
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {locale === "es"
                ? "Mejor para citas por primera vez o hogares que necesitan más atención antes de pasar a una rutina de mantenimiento."
                : "Best for first-time appointments or homes that need more attention before moving into a maintenance routine."
              }
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              {locale === "es" ? (
                <>
                  <li>Todo en Limpieza Estándar</li>
                  <li>Zócalos y marcos de puertas</li>
                  <li>Frentes de gabinetes y limpiezas detalladas</li>
                  <li>Áreas de atención con acumulación pesada</li>
                  <li>Reinicio más profundo de espacios principales</li>
                </>
              ) : (
                <>
                  <li>Everything in Standard Cleaning</li>
                  <li>Baseboards and door frames</li>
                  <li>Cabinet fronts and detailed wipe-downs</li>
                  <li>Heavy buildup attention areas</li>
                  <li>Deeper reset of key living spaces</li>
                </>
              )}
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <div className="text-lg font-semibold">
              {locale === "es" ? "Limpieza de Mudanza" : "Move-In / Move-Out"}
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {locale === "es"
                ? "Limpieza detallada para hogares vacíos para apoyar una transición más limpia y suave entre mudanza y salida."
                : "Detailed cleaning for empty homes to support a cleaner, smoother transition between move-in and move-out."
              }
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              {locale === "es" ? (
                <>
                  <li>Interior de gabinetes y cajones</li>
                  <li>Limpieza exterior de electrodomésticos</li>
                  <li>Reinicio de baño y cocina</li>
                  <li>Limpieza de piso a techo</li>
                  <li>Revisión final de calidad</li>
                </>
              ) : (
                <>
                  <li>Inside cabinets and drawers</li>
                  <li>Appliance exterior cleaning</li>
                  <li>Bathroom and kitchen reset</li>
                  <li>Floor-to-finish cleaning</li>
                  <li>Final walkthrough quality check</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
