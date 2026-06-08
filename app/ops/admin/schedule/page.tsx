import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { ArrowLeft, Calendar, Plus } from "lucide-react"
import { ScheduleCalendar } from "@/components/ops/schedule-calendar"

export default async function SchedulePage() {
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

  // Get work orders for the current month (broader range for calendar)
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0)

  const { data: jobs } = await supabase
    .from("work_orders")
    .select(`
      id,
      customer_name,
      address,
      city,
      scheduled_date,
      scheduled_time,
      status,
      service_type,
      assigned_employee_id,
      employee:employees(id, first_name, last_name)
    `)
    .gte("scheduled_date", startOfMonth.toISOString().split("T")[0])
    .lte("scheduled_date", endOfMonth.toISOString().split("T")[0])
    .not("status", "eq", "cancelled")
    .order("scheduled_time", { ascending: true })

  const { data: employees } = await supabase
    .from("employees")
    .select("id, first_name, last_name, role")
    .eq("status", "active")

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
          <p className="mb-2 text-xs font-medium uppercase text-slate-400">Scheduling</p>
          <Link href="/ops/admin" className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50">
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
          <Link href="/ops/admin/schedule" className="mb-1 flex items-center gap-3 rounded-lg bg-teal-50 px-3 py-2 text-teal-700">
            <Calendar className="h-5 w-5" />
            Calendar View
          </Link>
        </nav>

        {/* Legend */}
        <div className="border-t border-slate-200 p-4">
          <p className="mb-3 text-xs font-medium uppercase text-slate-400">Status Legend</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-amber-400"></div>
              <span className="text-sm text-slate-600">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-blue-400"></div>
              <span className="text-sm text-slate-600">Assigned</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-purple-400"></div>
              <span className="text-sm text-slate-600">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-green-400"></div>
              <span className="text-sm text-slate-600">Completed</span>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="border-t border-slate-200 p-4">
          <p className="mb-2 text-xs font-medium uppercase text-slate-400">Tips</p>
          <p className="text-xs text-slate-500">
            Drag and drop jobs between days to reschedule. In day view, drag jobs between employees to reassign.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Schedule Calendar</h1>
            <p className="text-slate-500">Drag and drop to reschedule or reassign jobs</p>
          </div>
          <Link
            href="/ops/admin/work-orders/new"
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
          >
            <Plus className="h-4 w-4" />
            New Work Order
          </Link>
        </div>

        <ScheduleCalendar initialJobs={jobs || []} employees={employees || []} />
      </main>
    </div>
  )
}
