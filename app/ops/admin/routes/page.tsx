import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { ArrowLeft, Filter } from "lucide-react"
import { RouteOptimizationMap } from "@/components/ops/route-optimization-map"

export default async function RoutePlanningPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/ops/auth/login")

  const { data: employee } = await supabase
    .from("employees")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!employee || !["admin", "dispatcher", "team_lead"].includes(employee.role)) {
    redirect("/ops/employee")
  }

  const today = new Date().toISOString().split("T")[0]

  // Get today's work orders with employee info
  const { data: todayJobs } = await supabase
    .from("work_orders")
    .select(`
      id,
      customer_name,
      address,
      city,
      zip,
      latitude,
      longitude,
      status,
      scheduled_time,
      service_type,
      estimated_duration,
      employee:employees(id, first_name, last_name)
    `)
    .eq("scheduled_date", today)
    .not("status", "eq", "cancelled")
    .order("scheduled_time", { ascending: true })

  // Get active employees for filter
  const { data: employees } = await supabase
    .from("employees")
    .select("id, first_name, last_name")
    .eq("status", "active")
    .in("role", ["cleaner", "team_lead"])

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
          <p className="mb-2 text-xs font-medium uppercase text-slate-400">Route Planning</p>
          <Link href="/ops/admin" className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50">
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
        </nav>

        {/* Employee Filter */}
        <div className="border-t border-slate-200 p-4">
          <p className="mb-3 text-xs font-medium uppercase text-slate-400">Filter by Employee</p>
          <div className="space-y-2">
            <Link
              href="/ops/admin/routes"
              className="block rounded-lg bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700"
            >
              All Employees
            </Link>
            {employees?.map((emp) => (
              <Link
                key={emp.id}
                href={`/ops/admin/routes?employee=${emp.id}`}
                className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                {emp.first_name} {emp.last_name}
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Route Planning</h1>
          <p className="text-slate-500">
            Optimize driving routes for today&apos;s {todayJobs?.length || 0} jobs
          </p>
        </div>

        {/* Legend */}
        <div className="mb-6 flex flex-wrap gap-4 rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500"></div>
            <span className="text-sm text-slate-600">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-slate-600">Assigned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-purple-500"></div>
            <span className="text-sm text-slate-600">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-slate-600">Completed</span>
          </div>
        </div>

        <RouteOptimizationMap jobs={todayJobs || []} />
      </main>
    </div>
  )
}
