"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface CancelPageProps {
  params: Promise<{ id: string }>
}

export default function CancelPage({ params }: CancelPageProps) {
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { id } = await params
    const supabase = createClient()

    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        notes: reason ? `Cancellation reason: ${reason}` : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
    } else {
      router.push("/portal/bookings?cancelled=true")
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <Link href="/portal/bookings" className="text-sm text-slate-600 hover:text-slate-900">
            &larr; Back to Bookings
          </Link>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-slate-900">Cancel Booking</h1>
            <p className="mt-2 text-slate-600">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>

            <form onSubmit={handleCancel} className="mt-6 space-y-4">
              <div>
                <label htmlFor="reason" className="mb-1 block text-sm font-medium text-slate-700">
                  Reason for cancellation (optional)
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="Let us know why you're cancelling..."
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Link
                  href="/portal/bookings"
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Keep Booking
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? "Cancelling..." : "Confirm Cancellation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
