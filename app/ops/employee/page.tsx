import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { MapPin, Clock, CheckCircle, LogOut, Calendar, Navigation } from "lucide-react"

export default async function EmployeeDashboard() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/ops/auth/login")

  // Get employee info
  const { data: employee } = await supabase
    .from("employees")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!employee) redirect("/ops/auth/login")

  // Get today's date
  const today = new Date().toISOString().split("T")[0]

  // Get today's work orders for this employee
  const { data: todayJobs } = await supabase
    .from("work_orders")
    .select("*")
    .eq("assigned_employee_id", employee.id)
    .eq("scheduled_date", today)
    .order("scheduled_time", { ascending: true })

  // Get upcoming work orders (next 7 days)
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  const { data: upcomingJobs } = await supabase
    .from("work_orders")
    .select("*")
    .eq("assigned_employee_id", employee.id)
    .gt("scheduled_date", today)
    .lte("scheduled_date", nextWeek.toISOString().split("T")[0])
    .order("scheduled_date", { ascending: true })
    .order("scheduled_time", { ascending: true })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700"
      case "in_progress": return "bg-blue-100 text-blue-700"
      case "assigned": return "bg-yellow-100 text-yellow-700"
      default: return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Horizon Ops</h1>
            <p className="text-sm text-slate-500">Welcome, {employee.first_name}</p>
          </div>
          <a
            href="/ops/auth/signout"
            className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600 hover:bg-slate-200"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </a>
        </div>
      </header>

      <main className="p-4">
        {/* Today's Jobs */}
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-teal-600" />
            <h2 className="text-lg font-semibold text-slate-900">Today&apos;s Jobs</h2>
            <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700">
              {todayJobs?.length || 0}
            </span>
          </div>

          {!todayJobs || todayJobs.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-500" />
              <p className="font-medium text-slate-700">No jobs scheduled for today</p>
              <p className="text-sm text-slate-500">Enjoy your day off!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/ops/employee/job/${job.id}`}
                  className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status.replace("_", " ")}
                        </span>
                        <span className="text-xs text-slate-500">{job.service_type}</span>
                      </div>
                      <h3 className="mt-2 font-semibold text-slate-900">{job.customer_name}</h3>
                      <div className="mt-1 flex items-center gap-1 text-sm text-slate-600">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.address}, {job.city}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-sm text-slate-600">
                        <Clock className="h-3.5 w-3.5" />
                        {job.scheduled_time || "Flexible"} • ~{job.estimated_duration} min
                      </div>
                    </div>
                    <Navigation className="h-5 w-5 text-slate-400" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Upcoming Jobs */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Upcoming This Week</h2>
          {!upcomingJobs || upcomingJobs.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
              <p className="text-sm text-slate-500">No upcoming jobs this week</p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">{job.customer_name}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(job.scheduled_date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      {job.scheduled_time && ` at ${job.scheduled_time}`}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500">{job.service_type}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
