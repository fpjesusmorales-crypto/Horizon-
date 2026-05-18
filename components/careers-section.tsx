"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/i18n"
import { CheckCircle } from "lucide-react"

export function CareersSection() {
  const { t } = useLanguage()

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

  return (
    <section id="careers" className="bg-slate-900 py-20 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold md:text-4xl">{t.careers.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            {t.careers.description}
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-8">
            <h3 className="text-xl font-semibold text-teal-400">{t.careers.opportunity}</h3>
            <h4 className="mt-2 text-lg font-medium">{t.careers.position}</h4>
            
            <div className="mt-6">
              <h5 className="font-medium text-slate-200">{t.careers.responsibilitiesTitle}</h5>
              <ul className="mt-3 space-y-2">
                {responsibilities.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-8">
            <h5 className="font-medium text-slate-200">{t.careers.qualificationsTitle}</h5>
            <ul className="mt-3 space-y-2">
              {qualifications.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-400" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <h5 className="font-medium text-slate-200">{t.careers.compensationTitle}</h5>
              <p className="mt-2 text-sm text-slate-300">{t.careers.compensationDescription}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="mb-6 text-slate-300">{t.careers.cta}</p>
          <Link
            href="/careers"
            className="inline-block rounded-2xl bg-teal-500 px-8 py-4 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-teal-400"
          >
            {t.careers.applyNow}
          </Link>
        </div>
      </div>
    </section>
  )
}
