"use client"

import { useState, type FormEvent } from "react"
import { useLanguage } from "@/lib/i18n"

export function ContactSection() {
  const { t, locale } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    homeSize: "",
    service: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    try {
      const response = await fetch("/api/contact", {
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
        name: "",
        phone: "",
        email: "",
        homeSize: "",
        service: "",
        message: "",
      })
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong")
    }
  }

  return (
    <section id="contact" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] bg-slate-100 p-8 md:p-10">
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-600">
              {t.nav.bookCleaning}
            </div>
            <h2 className="mt-3 text-3xl font-semibold text-balance md:text-4xl">
              {locale === "es"
                ? "Cuéntenos sobre su hogar y el tipo de limpieza que necesita."
                : "Tell us about your home and the type of cleaning you need."
              }
            </h2>
            <p className="mt-4 max-w-2xl text-slate-600">
              {locale === "es"
                ? "Use el formulario a continuación para solicitar una limpieza. También puede enviar un correo electrónico o un mensaje directamente."
                : "Use the form below to request a cleaning. You can also call, email, or send a message directly."
              }
            </p>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-teal-500"
                placeholder={t.contact.form.namePlaceholder}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="tel"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-teal-500"
                placeholder={t.contact.form.phonePlaceholder}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <input
                type="email"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-teal-500 sm:col-span-2"
                placeholder={t.contact.form.emailPlaceholder}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type="text"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-teal-500"
                placeholder={locale === "es" ? "Tamaño del hogar o número de habitaciones" : "Home size or number of bedrooms"}
                value={formData.homeSize}
                onChange={(e) => setFormData({ ...formData, homeSize: e.target.value })}
              />
              <select
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 outline-none transition focus:border-teal-500"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              >
                <option value="">{t.contact.form.servicePlaceholder}</option>
                <option value="standard">{t.contact.serviceTypes.standard}</option>
                <option value="deep">{t.contact.serviceTypes.deep}</option>
                <option value="move">{t.contact.serviceTypes.moveinout}</option>
              </select>
              <textarea
                className="min-h-[140px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 sm:col-span-2"
                placeholder={t.contact.form.messagePlaceholder}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 sm:col-span-2"
              >
                {status === "loading" ? t.contact.form.sending : t.contact.form.submit}
              </button>
              {status === "success" && (
                <p className="text-center text-sm text-teal-600 sm:col-span-2">
                  {t.contact.form.success}
                </p>
              )}
              {status === "error" && (
                <p className="text-center text-sm text-red-600 sm:col-span-2">
                  {errorMessage}
                </p>
              )}
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="text-sm font-medium text-slate-500">{t.contact.email}</div>
              <a href="mailto:contact@horizonoperations.cleaning" className="mt-2 block text-lg font-semibold text-slate-900 hover:text-teal-600 transition">contact@horizonoperations.cleaning</a>
            </div>
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="text-sm font-medium text-slate-500">{t.contact.message}</div>
              <div className="mt-2 text-base leading-7 text-slate-600">
                {locale === "es"
                  ? "Sirviendo Nashville, Tennessee. Respondemos lo más rápido posible y nos esforzamos por hacer que la reserva sea sencilla y sin estrés."
                  : "Serving Nashville, Tennessee. We respond as quickly as possible and aim to make booking straightforward and stress-free."
                }
              </div>
            </div>
            <div className="rounded-[1.75rem] bg-slate-950 p-8 text-white shadow-xl">
              <div className="text-sm font-medium text-slate-400">{t.contact.whatToExpect}</div>
              <div className="mt-2 text-2xl font-semibold">
                {locale === "es"
                  ? "Un proceso más limpio desde la primera conversación."
                  : "A cleaner process from the first conversation."
                }
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {locale === "es"
                  ? "Cuéntenos lo que necesita y le ayudaremos a identificar el servicio correcto y el siguiente paso."
                  : "Tell us what you need, and we'll help you identify the right service and next step."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
