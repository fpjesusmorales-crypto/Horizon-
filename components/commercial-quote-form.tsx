"use client"

import { useState, type FormEvent } from "react"
import { useLanguage } from "@/lib/i18n"

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
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    try {
      const response = await fetch("/api/commercial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
    { value: "apartment", label: locale === "es" ? "Edificios de Apartamentos" : "Apartment Buildings" },
    { value: "construction", label: locale === "es" ? "Limpieza Post-Construcción" : "Construction Cleanup" },
    { value: "medical", label: locale === "es" ? "Oficinas Médicas" : "Medical Offices" },
  ]

  const frequencies = [
    { value: "daily", label: locale === "es" ? "Diario" : "Daily" },
    { value: "weekly", label: locale === "es" ? "Semanal" : "Weekly" },
    { value: "biweekly", label: locale === "es" ? "Quincenal" : "Bi-Weekly" },
    { value: "monthly", label: locale === "es" ? "Mensual" : "Monthly" },
    { value: "onetime", label: locale === "es" ? "Una Vez" : "One-Time" },
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
            {locale === "es" ? "Solicitar una Cotización Comercial" : "Request a Commercial Quote"}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            {locale === "es"
              ? "Cuéntenos sobre su negocio y necesidades de limpieza. Le proporcionaremos una cotización personalizada dentro de 24-48 horas."
              : "Tell us about your business and cleaning needs. We'll provide a customized quote within 24-48 hours."
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-12">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8">
            <div className="grid gap-6 md:grid-cols-2">
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
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  {locale === "es" ? "Pies Cuadrados Aproximados" : "Approximate Square Footage"}
                </label>
                <input
                  type="text"
                  value={formData.squareFootage}
                  onChange={(e) => setFormData({ ...formData, squareFootage: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder={locale === "es" ? "ej., 2,500 pies cuadrados" : "e.g., 2,500 sq ft"}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">
                  {locale === "es" ? "Frecuencia Deseada" : "Desired Frequency"} *
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">
                  {locale === "es" ? "Detalles Adicionales" : "Additional Details"}
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

            <div className="mt-8">
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-2xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {status === "loading" 
                  ? (locale === "es" ? "Enviando..." : "Sending...") 
                  : (locale === "es" ? "Solicitar Cotización" : "Request Quote")
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
