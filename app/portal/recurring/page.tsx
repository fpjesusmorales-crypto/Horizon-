"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface RecurringService {
  id: string
  service_type: string
  frequency: string
  preferred_day: string | null
  preferred_time: string | null
  home_size: string | null
  status: string
  next_service_date: string | null
}

export default function RecurringServicePage() {
  const [service, setService] = useState<RecurringService | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function fetchService() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("recurring_services")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single()

      setService(data)
      setLoading(false)
    }
    fetchService()
  }, [supabase])

  const handlePause = async () => {
    if (!service) return
    setUpdating(true)
    await supabase
      .from("recurring_services")
      .update({ status: "paused" })
      .eq("id", service.id)
    setService({ ...service, status: "paused" })
    setUpdating(false)
  }

  const handleResume = async () => {
    if (!service) return
    setUpdating(true)
    await supabase
      .from("recurring_services")
      .update({ status: "active" })
      .eq("id", service.id)
    setService({ ...service, status: "active" })
    setUpdating(false)
  }

  const handleCancel = async () => {
    if (!service || !confirm("Are you sure you want to cancel your recurring service?")) return
    setUpdating(true)
    await supabase
      .from("recurring_services")
      .update({ status: "cancelled" })
      .eq("id", service.id)
    setService(null)
    setUpdating(false)
  }

  const frequencyLabels: Record<string, string> = {
    weekly: "Weekly",
    biweekly: "Every 2 Weeks",
    monthly: "Monthly",
  }

  const serviceLabels: Record<string, string> = {
    standard: "Standard Clean",
    deep: "Deep Clean",
    moveinout: "Move In/Out Clean",
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-slate-200" />
            <div className="h-64 rounded-2xl bg-slate-200" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Recurring Service</h1>
          <Link
            href="/portal"
            className="text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            Back to Dashboard
          </Link>
        </div>

        {service ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {serviceLabels[service.service_type] || service.service_type}
                </h2>
                <p className="text-slate-600">
                  {frequencyLabels[service.frequency] || service.frequency}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  service.status === "active"
                    ? "bg-teal-100 text-teal-700"
                    : service.status === "paused"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
              </span>
            </div>

            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Preferred Day</p>
                <p className="font-medium text-slate-900">
                  {service.preferred_day || "Not set"}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Preferred Time</p>
                <p className="font-medium text-slate-900">
                  {service.preferred_time || "Not set"}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Home Size</p>
                <p className="font-medium text-slate-900">
                  {service.home_size || "Not specified"}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Next Service</p>
                <p className="font-medium text-slate-900">
                  {service.next_service_date
                    ? new Date(service.next_service_date).toLocaleDateString()
                    : "To be scheduled"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {service.status === "active" ? (
                <button
                  onClick={handlePause}
                  disabled={updating}
                  className="rounded-xl bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-200 disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Pause Service"}
                </button>
              ) : service.status === "paused" ? (
                <button
                  onClick={handleResume}
                  disabled={updating}
                  className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Resume Service"}
                </button>
              ) : null}
              <button
                onClick={handleCancel}
                disabled={updating}
                className="rounded-xl bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-200 disabled:opacity-50"
              >
                Cancel Service
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-slate-900">No Recurring Service</h2>
            <p className="mb-6 text-slate-600">
              Set up a recurring cleaning plan to save money and keep your home consistently clean.
            </p>
            <Link
              href="/book"
              className="inline-block rounded-xl bg-teal-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-teal-700"
            >
              Set Up Recurring Service
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
