import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ReviewForm } from "@/components/review-form"

export const metadata = {
  title: "My Bookings | Horizon Operations",
  description: "View and manage your cleaning bookings",
}

export default async function BookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .eq("user_id", user.id)
    .order("scheduled_date", { ascending: false })

  const upcomingBookings = bookings?.filter(
    (b) => b.status === "scheduled" && new Date(b.scheduled_date) >= new Date()
  ) || []

  const pastBookings = bookings?.filter(
    (b) => b.status === "completed" || new Date(b.scheduled_date) < new Date()
  ) || []

  const cancelledBookings = bookings?.filter((b) => b.status === "cancelled") || []

  // Fetch the customer's existing reviews so we don't show duplicate prompts
  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, rating, comment, work_order_id")
    .eq("customer_user_id", user.id)

  const reviewByWorkOrder = new Map(
    (reviews || []).filter((r) => r.work_order_id).map((r) => [r.work_order_id as string, r])
  )

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Link href="/portal" className="text-sm text-slate-600 hover:text-slate-900">
                &larr; Back to Dashboard
              </Link>
              <h1 className="mt-2 text-2xl font-bold text-slate-900">My Bookings</h1>
            </div>
            <Link
              href="/book"
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Book New Cleaning
            </Link>
          </div>

          {/* Upcoming Bookings */}
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Upcoming Bookings</h2>
            {upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-2 w-2 rounded-full bg-teal-500"></span>
                        <span className="text-sm font-medium text-teal-700">Scheduled</span>
                      </div>
                      <p className="mt-1 text-lg font-medium text-slate-900">{booking.service_type}</p>
                      <p className="text-slate-600">
                        {new Date(booking.scheduled_date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        at {booking.scheduled_time}
                      </p>
                      {booking.price && (
                        <p className="mt-1 text-sm text-slate-600">Estimated: ${booking.price}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/portal/bookings/${booking.id}/reschedule`}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Reschedule
                      </Link>
                      <Link
                        href={`/portal/bookings/${booking.id}/cancel`}
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Cancel
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <p className="text-slate-600">No upcoming bookings.</p>
                <Link
                  href="/book"
                  className="mt-4 inline-block text-sm font-medium text-teal-600 hover:text-teal-500"
                >
                  Book a cleaning
                </Link>
              </div>
            )}
          </div>

          {/* Past Bookings */}
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Past Bookings</h2>
            {pastBookings.length > 0 ? (
              <div className="space-y-4">
                {pastBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                        <span className="text-sm font-medium text-green-700">Completed</span>
                      </div>
                      <p className="mt-1 text-lg font-medium text-slate-900">{booking.service_type}</p>
                      <p className="text-slate-600">
                        {new Date(booking.scheduled_date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      {booking.price && (
                        <p className="mt-1 text-sm text-slate-600">${booking.price}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-start gap-2 sm:items-end">
                      <ReviewForm
                        bookingId={booking.id}
                        workOrderId={booking.work_order_id ?? null}
                        customerName={booking.customer_name ?? null}
                        existingReview={
                          booking.work_order_id ? reviewByWorkOrder.get(booking.work_order_id) ?? null : null
                        }
                      />
                      <Link
                        href="/book"
                        className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                      >
                        Book Again
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <p className="text-slate-600">No past bookings yet.</p>
              </div>
            )}
          </div>

          {/* Cancelled Bookings */}
          {cancelledBookings.length > 0 && (
            <div>
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Cancelled Bookings</h2>
              <div className="space-y-4">
                {cancelledBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 opacity-75 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-2 w-2 rounded-full bg-slate-400"></span>
                        <span className="text-sm font-medium text-slate-500">Cancelled</span>
                      </div>
                      <p className="mt-1 text-lg font-medium text-slate-700">{booking.service_type}</p>
                      <p className="text-slate-500">
                        {new Date(booking.scheduled_date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
