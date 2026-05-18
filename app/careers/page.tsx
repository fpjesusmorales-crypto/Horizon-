"use client"

import { useState, type FormEvent } from "react"
import { useLanguage } from "@/lib/i18n"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckCircle } from "lucide-react"

export default function CareersPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    hasTransportation: "",
    hasExperience: "",
    availability: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    try {
      const response = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to submit application")
      }

      setStatus("success")
      setFormData({
        name: "",
        phone: "",
        email: "",
        city: "",
        hasTransportation: "",
        hasExperience: "",
        availability: "",
        message: "",
      })
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong")
    }
  }

  const responsibilities = [
    t.careers.responsibilities.clean,
    t.careers.responsibilities.checklists,
    t.careers.responsibilities.communicate,
    t.careers.responsibilities.onTime,
    t.careers.responsibilities.report,
  ]

  const qualifications = [
    t.careers.qualifications.experience,
    t.careers.qualifications.transportation,
    t.careers.qualifications.detail,
    t.careers.qualifications.communication,
    t.careers.qualifications.independent,
    t.careers.qualifications.availability,
  ]

  if (status === "success") {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="py-20">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
              <CheckCircle className="h-8 w-8 text-teal-600" />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-slate-900">{t.careers.successTitle}</h1>
            <p className="mt-4 text-slate-600">{t.careers.successDescription}</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-slate-900 py-20 text-white">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <h1 className="text-4xl font-bold md:text-5xl">{t.careers.title}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
              {t.careers.description}
            </p>
          </div>
        </section>

        {/* Job Details */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-xl font-semibold text-teal-600">{t.careers.opportunity}</h2>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{t.careers.position}</h3>
                
                <div className="mt-6">
                  <h4 className="font-semibold text-slate-900">{t.careers.responsibilitiesTitle}</h4>
                  <ul className="mt-3 space-y-2">
                    {responsibilities.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h4 className="font-semibold text-slate-900">{t.careers.qualificationsTitle}</h4>
                <ul className="mt-3 space-y-2">
                  {qualifications.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-500" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <h4 className="font-semibold text-slate-900">{t.careers.compensationTitle}</h4>
                  <p className="mt-2 text-sm text-slate-600">{t.careers.compensationDescription}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section id="apply" className="bg-slate-50 py-16">
          <div className="mx-auto max-w-2xl px-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900">{t.careers.applyNow}</h2>
              <p className="mt-2 text-slate-600">{t.careers.cta}</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700">{t.careers.form.name}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t.careers.form.namePlaceholder}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">{t.careers.form.phone}</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t.careers.form.phonePlaceholder}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700">{t.careers.form.email}</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t.careers.form.emailPlaceholder}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">{t.careers.form.city}</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder={t.careers.form.cityPlaceholder}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700">{t.careers.form.transportation}</label>
                  <select
                    required
                    value={formData.hasTransportation}
                    onChange={(e) => setFormData({ ...formData, hasTransportation: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="">{t.careers.form.selectOption}</option>
                    <option value="yes">{t.careers.form.yes}</option>
                    <option value="no">{t.careers.form.no}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">{t.careers.form.experience}</label>
                  <select
                    required
                    value={formData.hasExperience}
                    onChange={(e) => setFormData({ ...formData, hasExperience: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="">{t.careers.form.selectOption}</option>
                    <option value="yes">{t.careers.form.yes}</option>
                    <option value="no">{t.careers.form.no}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">{t.careers.form.availability}</label>
                <input
                  type="text"
                  required
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  placeholder={t.careers.form.availabilityPlaceholder}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">{t.careers.form.message}</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t.careers.form.messagePlaceholder}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-2xl bg-slate-900 px-5 py-4 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {status === "loading" ? t.careers.form.submitting : t.careers.form.submit}
              </button>

              {status === "error" && (
                <p className="text-center text-sm text-red-600">{errorMessage}</p>
              )}
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
