import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Customer Portal | Horizon Operations",
  description: "Manage your bookings, recurring services, and account details",
}

export default async function PortalDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Fetch upcoming bookings
  const { data: upcomingBookings } = await supabase
    .from("bookings")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "scheduled")
    .gte("scheduled_date", new Date().toISOString().split("T")[0])
    .order("scheduled_date", { ascending: true })
    .limit(3)

  // Fetch recurring service
  const { data: recurringService } = await supabase
    .from("recurring_services")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single()

  // Fetch recent invoices
  const { data: recentInvoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3)

  const firstName = profile?.first_name || user.email?.split("@")[0] || "there"

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Welcome back, {firstName}!
            </h1>
            <p className="mt-2 text-slate-600">
              Manage your cleanings, view invoices, and update your account details.
            </p>
          </div>

          {/* Refer a friend banner */}
          <Link
            href="/portal/referrals"
            className="mb-8 flex items-center justify-between rounded-2xl border border-teal-200 bg-teal-50 p-5 transition hover:border-teal-300 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Refer a friend, get $25</p>
                <p className="text-sm text-slate-600">You both save when they book their first cleaning.</p>
              </div>
            </div>
            <span className="hidden text-sm font-medium text-teal-700 sm:inline">Get your link →</span>
          </Link>

          {/* Quick Actions */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/book"
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-300 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="font-medium text-slate-900">Book a Cleaning</span>
            </Link>

            <Link
              href="/portal/bookings"
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-300 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-medium text-slate-900">View Bookings</span>
            </Link>

            <Link
              href="/portal/recurring"
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-300 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <span className="font-medium text-slate-900">Recurring Service</span>
            </Link>

            <Link
              href="/portal/account"
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-300 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="font-medium text-slate-900">Account Settings</span>
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Upcoming Bookings */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Upcoming Cleanings</h2>
                <Link href="/portal/bookings" className="text-sm font-medium text-teal-600 hover:text-teal-500">
                  View all
                </Link>
              </div>
              {upcomingBookings && upcomingBookings.length > 0 ? (
                <div className="space-y-3">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{booking.service_type}</p>
                        <p className="text-sm text-slate-600">
                          {new Date(booking.scheduled_date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          at {booking.scheduled_time}
                        </p>
                      </div>
                      <Link
                        href={`/portal/bookings/${booking.id}`}
                        className="rounded-lg bg-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-300"
                      >
                        Manage
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl bg-slate-50 p-6 text-center">
                  <p className="text-slate-600">No upcoming cleanings scheduled.</p>
                  <Link
                    href="/book"
                    className="mt-3 inline-block text-sm font-medium text-teal-600 hover:text-teal-500"
                  >
                    Book your first cleaning
                  </Link>
                </div>
              )}
            </div>

            {/* Recurring Service Status */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Recurring Service</h2>
                <Link href="/portal/recurring" className="text-sm font-medium text-teal-600 hover:text-teal-500">
                  Manage
                </Link>
              </div>
              {recurringService ? (
                <div className="rounded-xl bg-teal-50 p-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-2 w-2 rounded-full bg-teal-500"></span>
                    <span className="text-sm font-medium text-teal-700">Active</span>
                  </div>
                  <p className="mt-2 font-medium text-slate-900">{recurringService.service_type}</p>
                  <p className="text-sm text-slate-600">
                    {recurringService.frequency.charAt(0).toUpperCase() + recurringService.frequency.slice(1)} on{" "}
                    {recurringService.preferred_day}s
                  </p>
                  {recurringService.next_service_date && (
                    <p className="mt-2 text-sm text-slate-600">
                      Next cleaning:{" "}
                      {new Date(recurringService.next_service_date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-xl bg-slate-50 p-6 text-center">
                  <p className="text-slate-600">No active recurring service.</p>
                  <Link
                    href="/portal/recurring"
                    className="mt-3 inline-block text-sm font-medium text-teal-600 hover:text-teal-500"
                  >
                    Set up recurring cleaning
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Invoices */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Recent Invoices</h2>
                <Link href="/portal/invoices" className="text-sm font-medium text-teal-600 hover:text-teal-500">
                  View all
                </Link>
              </div>
              {recentInvoices && recentInvoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-sm text-slate-600">
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Description</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentInvoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b border-slate-100">
                          <td className="py-3 text-sm text-slate-900">
                            {new Date(invoice.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 text-sm text-slate-600">{invoice.description || "Cleaning Service"}</td>
                          <td className="py-3 text-sm font-medium text-slate-900">${invoice.amount}</td>
                          <td className="py-3">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                invoice.status === "paid"
                                  ? "bg-green-100 text-green-700"
                                  : invoice.status === "pending"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-xl bg-slate-50 p-6 text-center">
                  <p className="text-slate-600">No invoices yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="mt-8 text-center">
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
