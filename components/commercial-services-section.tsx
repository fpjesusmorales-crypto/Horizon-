"use client"

import { useLanguage } from "@/lib/i18n"

export function CommercialServicesSection() {
  const { locale } = useLanguage()

  const services = [
    {
      title: locale === "es" ? "Limpieza de Oficinas" : "Office Cleaning",
      description: locale === "es"
        ? "Mantenimiento regular de oficinas para mantener su espacio de trabajo profesional, limpio y productivo."
        : "Regular office maintenance to keep your workspace professional, clean, and productive.",
      features: locale === "es"
        ? ["Limpieza de escritorios y estaciones de trabajo", "Desinfección de áreas comunes", "Limpieza de salas de conferencias", "Limpieza de cocina y área de descanso", "Limpieza de pisos y aspirado"]
        : ["Desk and workstation cleaning", "Common area sanitization", "Conference room cleaning", "Kitchen and break room cleaning", "Floor cleaning and vacuuming"],
    },
    {
      title: locale === "es" ? "Espacios Comerciales" : "Retail Spaces",
      description: locale === "es"
        ? "Mantenga su tienda brillante y acogedora para los clientes con servicios regulares de limpieza comercial."
        : "Keep your store sparkling and inviting for customers with regular retail cleaning services.",
      features: locale === "es"
        ? ["Limpieza de piso de ventas", "Limpieza de vitrinas", "Mantenimiento de probadores", "Limpieza de entrada y escaparate", "Limpieza de baños de clientes"]
        : ["Sales floor cleaning", "Display case cleaning", "Fitting room maintenance", "Entrance and storefront cleaning", "Customer restroom cleaning"],
      badge: locale === "es" ? "Popular" : "Popular",
    },
    {
      title: locale === "es" ? "Edificios de Apartamentos" : "Apartment Buildings",
      description: locale === "es"
        ? "Servicios de áreas comunes para administradores de propiedades, incluyendo vestíbulos, pasillos y servicios compartidos."
        : "Common area services for property managers including lobbies, hallways, and shared amenities.",
      features: locale === "es"
        ? ["Limpieza de vestíbulo y entrada", "Mantenimiento de pasillos", "Limpieza de áreas de amenidades", "Limpieza de cuartos de basura", "Limpieza de lavandería común"]
        : ["Lobby and entrance cleaning", "Hallway maintenance", "Amenity area cleaning", "Trash room cleaning", "Common laundry room cleaning"],
    },
    {
      title: locale === "es" ? "Limpieza Post-Construcción" : "Construction Cleanup",
      description: locale === "es"
        ? "Limpieza detallada después de renovaciones o nueva construcción para preparar espacios para ocupación."
        : "Detailed cleaning after renovations or new construction to prepare spaces for occupancy.",
      features: locale === "es"
        ? ["Remoción de escombros y polvo", "Limpieza de ventanas y marcos", "Limpieza de pisos y superficies", "Limpieza de accesorios y electrodomésticos", "Inspección final de calidad"]
        : ["Debris and dust removal", "Window and frame cleaning", "Floor and surface cleaning", "Fixture and appliance cleaning", "Final quality inspection"],
    },
    {
      title: locale === "es" ? "Oficinas Médicas" : "Medical Offices",
      description: locale === "es"
        ? "Limpieza especializada para instalaciones de atención médica con protocolos estrictos de desinfección y estándares de cumplimiento."
        : "Specialized cleaning for healthcare facilities with strict sanitization protocols and compliance standards.",
      features: locale === "es"
        ? ["Desinfección de salas de examen", "Saneamiento de área de espera", "Limpieza de superficies de alto contacto", "Manejo adecuado de desechos", "Cumplimiento de estándares de salud"]
        : ["Exam room disinfection", "Waiting area sanitization", "High-touch surface cleaning", "Proper waste handling", "Health standard compliance"],
    },
  ]

  return (
    <section id="commercial-services" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-600">
            {locale === "es" ? "Servicios Comerciales" : "Commercial Services"}
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-balance md:text-4xl">
            {locale === "es"
              ? "Soluciones de limpieza profesional para su negocio."
              : "Professional cleaning solutions for your business."
            }
          </h2>
          <p className="mt-4 text-slate-600">
            {locale === "es"
              ? "Entendemos que cada negocio tiene necesidades únicas. Nuestros servicios comerciales están diseñados para mantener su espacio limpio, seguro y profesional."
              : "We understand that every business has unique needs. Our commercial services are designed to keep your space clean, safe, and professional."
            }
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              className={`rounded-[1.75rem] border border-slate-200 p-8 shadow-sm ${
                service.badge ? "bg-white shadow-lg" : "bg-slate-50"
              }`}
            >
              {service.badge && (
                <div className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                  {service.badge}
                </div>
              )}
              <div className={`text-lg font-semibold ${service.badge ? "mt-4" : ""}`}>
                {service.title}
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {service.description}
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                {service.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
