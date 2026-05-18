"use client"

import { useState, useMemo, type FormEvent } from "react"
import { useLanguage } from "@/lib/i18n"

// Pricing rates per square foot
const SERVICE_RATES: Record<string, number> = {
  office: 0.10,
  retail: 0.12,
  apartment: 0.09,
  construction: 0.35,
  medical: 0.18,
}

// Frequency multipliers
const FREQUENCY_MULTIPLIERS: Record<string, number> = {
  monthly: 1.0,
  biweekly: 1.6,
  weekly: 2.4,
  threeWeekly: 3.8,
  daily: 5.5,
}

export function CommercialQuoteForm() {
  const { locale } = useLanguage()
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    serviceType: "",
    squareFootage: "",
    frequency: "",
    restrooms: "",
    floors: "",
    startDate: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  // Calculate estimated monthly range
  const estimate = useMemo(() => {
    const sqft = parseFloat(formData.squareFootage.replace(/,/g, "")) || 0
    const rate = SERVICE_RATES[formData.serviceType] || 0
    const multiplier = FREQUENCY_MULTIPLIERS[formData.frequency] || 0

    if (sqft > 0 && rate > 0 && multiplier > 0) {
      const baseEstimate = sqft * rate * multiplier
      return {
        low: Math.round(baseEstimate * 0.85),
        high: Math.round(baseEstimate * 1.25),
        show: true,
      }
    }
    return { low: 0, high: 0, show: false }
  }, [formData.squareFootage, formData.serviceType, formData.frequency])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    try {
      const response = await fetch("/api/commercial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          estimatedRange: estimate.show ? `$${estimate.low.toLocaleString()} - $${estimate.high.toLocaleString()}` : "Custom quote required",
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to send message")
      }

      setStatus("success")
      setFormData({
        businessName: "",
        contactName: "",
        email: "",
        phone: "",
        serviceType: "",
        squareFootage: "",
        frequency: "",
        restrooms: "",
        floors: "",
        startDate: "",
        message: "",
      })
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong")
    }
  }

  const serviceTypes = [
    { value: "office", label: locale === "es" ? "Limpieza de Oficinas" : "Office Cleaning" },
    { value: "retail", label: locale === "es" ? "Espacios Comerciales" : "Retail Spaces" },
    { value: "apartment", label: locale === "es" ? "Edificios de Apartamentos / Multifamiliar" : "Apartment Buildings / Multifamily" },
    { value: "construction", label: locale === "es" ? "Limpieza Post-Construcción" : "Construction Cleanup" },
    { value: "medical", label: locale === "es" ? "Oficinas Médicas" : "Medical Offices" },
  ]

  const frequencies = [
    { value: "monthly", label: locale === "es" ? "Mensual" : "Monthly" },
    { value: "biweekly", label: locale === "es" ? "Quincenal" : "Biweekly" },
    { value: "weekly", label: locale === "es" ? "Semanal" : "Weekly" },
    { value: "threeWeekly", label: locale === "es" ? "3x por Semana" : "3x Weekly" },
    { value: "daily", label: locale === "es" ? "Diario" : "Daily" },
  ]

  if (status === "success") {
    return (
      <section id="commercial-quote" className="bg-white py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
              <svg className="h-8 w-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-semibold">
              {locale === "es" ? "¡Solicitud Enviada!" : "Quote Request Sent!"}
            </h2>
            <p className="mt-4 text-slate-600">
              {locale === "es"
                ? "Gracias por su interés. Revisaremos su solicitud y le contactaremos dentro de 24-48 horas con una cotización personalizada."
                : "Thank you for your interest. We'll review your request and contact you within 24-48 hours with a customized quote."
              }
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="commercial-quote" className="bg-white py-20">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">
            {locale === "es" ? "Estimador de Limpieza Comercial" : "Commercial Cleaning Estimator"}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            {locale === "es"
              ? "Obtenga un rango estimado de precios mensuales para sus necesidades de limpieza comercial."
              : "Get an estimated monthly price range for your commercial cleaning needs."
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-12">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  {locale === "es" ? "Nombre del Negocio" : "Business Name"} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder={locale === "es" ? "Nombre de su empresa" : "Your company name"}
                />
              </div>

              {/* Contact Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  {locale === "es" ? "Nombre de Contacto" : "Contact Name"} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder={locale === "es" ? "Su nombre" : "Your name"}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  {locale === "es" ? "Correo Electrónico" : "Email"} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder={locale === "es" ? "correo@empresa.com" : "email@company.com"}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  {locale === "es" ? "Teléfono" : "Phone"} *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="(555) 555-5555"
                />
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  {locale === "es" ? "Tipo de Servicio" : "Service Type"} *
                </label>
                <select
                  required
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="">{locale === "es" ? "Seleccione un servicio" : "Select a service"}</option>
                  {serviceTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Square Footage */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  {locale === "es" ? "Pies Cuadrados" : "Square Footage"} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.squareFootage}
                  onChange={(e) => setFormData({ ...formData, squareFootage: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder={locale === "es" ? "ej., 2500" : "e.g., 2500"}
                />
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  {locale === "es" ? "Frecuencia de Limpieza" : "Cleaning Frequency"} *
                </label>
                <select
                  required
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="">{locale === "es" ? "Seleccione frecuencia" : "Select frequency"}</option>
                  {frequencies.map((freq) => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of Restrooms */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  {locale === "es" ? "Número de Baños" : "Number of Restrooms"}
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.restrooms}
                  onChange={(e) => setFormData({ ...formData, restrooms: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder={locale === "es" ? "ej., 4" : "e.g., 4"}
                />
              </div>

              {/* Number of Floors */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  {locale === "es" ? "Número de Pisos" : "Number of Floors"}
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.floors}
                  onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder={locale === "es" ? "ej., 2" : "e.g., 2"}
                />
              </div>

              {/* Desired Start Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  {locale === "es" ? "Fecha de Inicio Deseada" : "Desired Start Date"}
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* Message / Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">
                  {locale === "es" ? "Mensaje / Notas" : "Message / Notes"}
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder={locale === "es" 
                    ? "Cuéntenos más sobre su espacio y necesidades específicas..." 
                    : "Tell us more about your space and specific needs..."
                  }
                />
              </div>
            </div>

            {/* Service-specific notices */}
            {formData.serviceType === "construction" && (
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm text-amber-800">
                  {locale === "es" 
                    ? "Se recomienda una visita al sitio antes de la cotización final."
                    : "Site walkthrough recommended before final quote."
                  }
                </p>
              </div>
            )}

            {formData.serviceType === "medical" && (
              <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  {locale === "es" 
                    ? "Protocolos de saneamiento mejorados disponibles. La cotización final depende del número de habitaciones, baños y requisitos de servicio."
                    : "Enhanced sanitation protocols available. Final quote depends on room count, restroom count, and service requirements."
                  }
                </p>
              </div>
            )}

            {/* Estimated Monthly Range */}
            {estimate.show && (
              <div className="mt-8 rounded-xl border border-teal-200 bg-teal-50 p-6">
                <h3 className="text-lg font-semibold text-teal-900">
                  {locale === "es" ? "Rango Mensual Estimado" : "Estimated Monthly Range"}
                </h3>
                <p className="mt-2 text-3xl font-bold text-teal-700">
                  ${estimate.low.toLocaleString()} - ${estimate.high.toLocaleString()}
                </p>
                <p className="mt-3 text-sm text-teal-800">
                  {locale === "es" 
                    ? "Este es un estimado preliminar. El precio final puede variar después de la visita, revisión de las condiciones de la instalación, requisitos de frecuencia y alcance del trabajo."
                    : "This is a preliminary estimate. Final pricing may vary after walkthrough, facility condition review, frequency requirements, and scope of work."
                  }
                </p>
              </div>
            )}

            <div className="mt-8">
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-2xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {status === "loading" 
                  ? (locale === "es" ? "Enviando..." : "Sending...") 
                  : (locale === "es" ? "Solicitar Cotización Comercial" : "Request Commercial Quote")
                }
              </button>
              {status === "error" && (
                <p className="mt-4 text-center text-sm text-red-600">
                  {errorMessage}
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
