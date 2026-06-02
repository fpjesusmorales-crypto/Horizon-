import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Calendar, Users, ClipboardList, Plus, LogOut, Clock, CheckCircle, AlertCircle, MapPin, Route, BarChart3 } from "lucide-react"
import { NotificationsDropdown } from "@/components/ops/notifications-dropdown"

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/ops/auth/login")

  // Verify admin/manager role
  const { data: employee } = await supabase
    .from("employees")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!employee || !["admin", "dispatcher", "team_lead"].includes(employee.role)) {
    redirect("/ops/employee")
  }

  const today = new Date().toISOString().split("T")[0]

  // Get stats
  const { count: todayJobsCount } = await supabase
    .from("work_orders")
    .select("*", { count: "exact", head: true })
    .eq("scheduled_date", today)

  const { count: pendingCount } = await supabase
    .from("work_orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  const { count: inProgressCount } = await supabase
    .from("work_orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "in_progress")

  const { count: completedTodayCount } = await supabase
    .from("work_orders")
    .select("*", { count: "exact", head: true })
    .eq("scheduled_date", today)
    .eq("status", "completed")

  const { data: activeEmployees } = await supabase
    .from("employees")
    .select("*")
    .eq("status", "active")

  // Get today's work orders with employee info
  const { data: todayJobs } = await supabase
    .from("work_orders")
    .select(`
      *,
      employee:employees(id, first_name, last_name)
    `)
    .eq("scheduled_date", today)
    .order("scheduled_time", { ascending: true })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in_progress": return <Clock className="h-4 w-4 text-blue-500" />
      case "pending": return <AlertCircle className="h-4 w-4 text-amber-500" />
      default: return <Clock className="h-4 w-4 text-slate-400" />
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-20 h-full w-64 border-r border-slate-200 bg-white">
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <Link href="/ops/admin" className="text-xl font-bold text-slate-900">
            Horizon Ops
          </Link>
        </div>
        <nav className="p-4">
          <p className="mb-2 text-xs font-medium uppercase text-slate-400">Main</p>
          <Link href="/ops/admin" className="mb-1 flex items-center gap-3 rounded-lg bg-teal-50 px-3 py-2 text-teal-700">
            <Calendar className="h-5 w-5" />
            Dashboard
          </Link>
          <Link href="/ops/admin/work-orders" className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50">
            <ClipboardList className="h-5 w-5" />
            Work Orders
          </Link>
          <Link href="/ops/admin/map" className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50">
            <Route className="h-5 w-5" />
            Route Map
          </Link>
          <Link href="/ops/admin/schedule" className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50">
            <Calendar className="h-5 w-5" />
            Schedule
          </Link>
          <Link href="/ops/admin/employees" className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50">
            <Users className="h-5 w-5" />
            Employees
          </Link>
          <Link href="/ops/admin/reports" className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50">
            <BarChart3 className="h-5 w-5" />
            Reports
          </Link>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-4">
          <div className="mb-3 text-sm">
            <p className="font-medium text-slate-900">{employee.first_name} {employee.last_name}</p>
            <p className="text-slate-500 capitalize">{employee.role}</p>
          </div>
          <a
            href="/ops/auth/signout"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500">
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationsDropdown />
            <Link
              href="/ops/admin/work-orders/new"
              className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
            >
              <Plus className="h-4 w-4" />
              New Work Order
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-4 gap-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Today&apos;s Jobs</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{todayJobsCount || 0}</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Pending Assignment</p>
            <p className="mt-1 text-3xl font-bold text-amber-600">{pendingCount || 0}</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">In Progress</p>
            <p className="mt-1 text-3xl font-bold text-blue-600">{inProgressCount || 0}</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Completed Today</p>
            <p className="mt-1 text-3xl font-bold text-green-600">{completedTodayCount || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="col-span-2 rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Today&apos;s Schedule</h2>
              <Link href="/ops/admin/work-orders" className="text-sm text-teal-600 hover:text-teal-700">
                View All
              </Link>
            </div>
            {!todayJobs || todayJobs.length === 0 ? (
              <div className="py-8 text-center text-slate-500">
                No jobs scheduled for today
              </div>
            ) : (
              <div className="space-y-3">
                {todayJobs.slice(0, 6).map((job) => (
                  <Link
                    key={job.id}
                    href={`/ops/admin/work-orders/${job.id}`}
                    className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-slate-200 hover:bg-slate-50"
                  >
                    {getStatusIcon(job.status)}
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{job.customer_name}</p>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin className="h-3 w-3" />
                        {job.address}, {job.city}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-700">{job.scheduled_time || "Flexible"}</p>
                      <p className="text-xs text-slate-400">
                        {job.employee ? `${job.employee.first_name} ${job.employee.last_name}` : "Unassigned"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Active Employees */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Active Team</h2>
              <Link href="/ops/admin/employees" className="text-sm text-teal-600 hover:text-teal-700">
                Manage
              </Link>
            </div>
            {!activeEmployees || activeEmployees.length === 0 ? (
              <div className="py-8 text-center text-slate-500">
                No active employees
              </div>
            ) : (
              <div className="space-y-3">
                {activeEmployees.map((emp) => (
                  <div key={emp.id} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-600">
                      {emp.first_name[0]}{emp.last_name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{emp.first_name} {emp.last_name}</p>
                      <p className="text-xs text-slate-500 capitalize">{emp.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
