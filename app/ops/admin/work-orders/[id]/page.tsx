import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { ArrowLeft, Calendar, Users, ClipboardList, LogOut, MapPin, Clock, Phone, Mail, CheckCircle, AlertCircle } from "lucide-react"
import { WorkOrderControls } from "@/components/ops/work-order-controls"

export default async function WorkOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/ops/auth/login")

  const { data: employee } = await supabase
    .from("employees")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!employee || !["admin", "manager"].includes(employee.role)) {
    redirect("/ops/employee")
  }

  const { data: workOrder } = await supabase
    .from("work_orders")
    .select(`
      *,
      assigned_employee:employees(id, first_name, last_name, phone)
    `)
    .eq("id", id)
    .single()

  if (!workOrder) {
    redirect("/ops/admin/work-orders")
  }

  // Get all employees for reassignment
  const { data: allEmployees } = await supabase
    .from("employees")
    .select("id, first_name, last_name")
    .eq("status", "active")

  // Parse checklist
  let checklistItems: { id: string; task: string; area: string; completed?: boolean }[] = []
  if (workOrder.checklist_completed && Array.isArray(workOrder.checklist_completed)) {
    checklistItems = workOrder.checklist_completed
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-amber-100 text-amber-700",
      assigned: "bg-blue-100 text-blue-700",
      in_progress: "bg-purple-100 text-purple-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    }
    return styles[status] || "bg-slate-100 text-slate-700"
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
          <Link href="/ops/admin" className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50">
            <Calendar className="h-5 w-5" />
            Dashboard
          </Link>
          <Link href="/ops/admin/work-orders" className="mb-1 flex items-center gap-3 rounded-lg bg-teal-50 px-3 py-2 text-teal-700">
            <ClipboardList className="h-5 w-5" />
            Work Orders
          </Link>
          <Link href="/ops/admin/employees" className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50">
            <Users className="h-5 w-5" />
            Employees
          </Link>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-4">
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
        <div className="mb-6 flex items-center gap-4">
          <Link href="/ops/admin/work-orders" className="rounded-lg p-2 hover:bg-slate-200">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">Work Order Details</h1>
            <p className="text-sm text-slate-500">#{workOrder.id.slice(0, 8)}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusBadge(workOrder.status)}`}>
            {workOrder.status.replace("_", " ")}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="col-span-2 space-y-6">
            {/* Customer */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Customer</h2>
              <p className="text-xl font-medium text-slate-900">{workOrder.customer_name}</p>
              <div className="mt-3 flex gap-4">
                {workOrder.customer_phone && (
                  <a href={`tel:${workOrder.customer_phone}`} className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700">
                    <Phone className="h-4 w-4" />
                    {workOrder.customer_phone}
                  </a>
                )}
                {workOrder.customer_email && (
                  <a href={`mailto:${workOrder.customer_email}`} className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700">
                    <Mail className="h-4 w-4" />
                    {workOrder.customer_email}
                  </a>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Location</h2>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-900">{workOrder.address}</p>
                  <p className="text-slate-600">{workOrder.city} {workOrder.zip}</p>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${workOrder.address}, ${workOrder.city} ${workOrder.zip}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm text-teal-600 hover:text-teal-700"
              >
                View in Google Maps
              </a>
            </div>

            {/* Notes */}
            {(workOrder.notes || workOrder.employee_notes) && (
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">Notes</h2>
                {workOrder.notes && (
                  <div className="mb-4">
                    <p className="text-xs font-medium uppercase text-slate-500">Instructions</p>
                    <p className="mt-1 text-slate-700">{workOrder.notes}</p>
                  </div>
                )}
                {workOrder.employee_notes && (
                  <div>
                    <p className="text-xs font-medium uppercase text-slate-500">Employee Notes</p>
                    <p className="mt-1 text-slate-700">{workOrder.employee_notes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Checklist */}
            {checklistItems.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">Checklist Completion</h2>
                <div className="space-y-2">
                  {checklistItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                      {item.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-slate-300" />
                      )}
                      <span className={item.completed ? "text-slate-700" : "text-slate-500"}>
                        {item.task || `Item ${idx + 1}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Schedule */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Schedule</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-slate-400" />
                  <span className="text-slate-700">
                    {new Date(workOrder.scheduled_date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-slate-400" />
                  <span className="text-slate-700">{workOrder.scheduled_time || "Flexible"}</span>
                </div>
                <p className="text-sm text-slate-500">Duration: ~{workOrder.estimated_duration} min</p>
              </div>
            </div>

            {/* Service */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Service</h2>
              <p className="font-medium text-slate-900">{workOrder.service_type}</p>
              {workOrder.price && (
                <p className="mt-2 text-2xl font-bold text-teal-600">${workOrder.price}</p>
              )}
            </div>

            {/* Assignment */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Assigned Employee</h2>
              {workOrder.assigned_employee ? (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-medium text-teal-700">
                    {workOrder.assigned_employee.first_name[0]}{workOrder.assigned_employee.last_name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {workOrder.assigned_employee.first_name} {workOrder.assigned_employee.last_name}
                    </p>
                    {workOrder.assigned_employee.phone && (
                      <a href={`tel:${workOrder.assigned_employee.phone}`} className="text-sm text-teal-600">
                        {workOrder.assigned_employee.phone}
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="h-5 w-5" />
                  <span>Unassigned</span>
                </div>
              )}
            </div>

            {/* Management Controls */}
            <WorkOrderControls
              workOrderId={workOrder.id}
              currentStatus={workOrder.status}
              currentEmployeeId={workOrder.assigned_employee_id ?? null}
              employees={allEmployees ?? []}
            />

            {/* Timestamps */}
            {(workOrder.check_in_time || workOrder.check_out_time) && (
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">Activity</h2>
                {workOrder.check_in_time && (
                  <p className="text-sm text-slate-600">
                    Check-in: {new Date(workOrder.check_in_time).toLocaleString()}
                  </p>
                )}
                {workOrder.check_out_time && (
                  <p className="mt-1 text-sm text-slate-600">
                    Check-out: {new Date(workOrder.check_out_time).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
