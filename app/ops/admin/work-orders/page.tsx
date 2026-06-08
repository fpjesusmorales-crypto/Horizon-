import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { ArrowLeft, Plus, Search, Filter, Calendar, Users, ClipboardList, LogOut } from "lucide-react"

export default async function WorkOrdersPage() {
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

  // Get all work orders
  const { data: workOrders } = await supabase
    .from("work_orders")
    .select(`
      *,
      employee:employees(id, first_name, last_name)
    `)
    .order("scheduled_date", { ascending: false })
    .order("scheduled_time", { ascending: true })
    .limit(50)

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
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Work Orders</h1>
          <Link
            href="/ops/admin/work-orders/new"
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
          >
            <Plus className="h-4 w-4" />
            New Work Order
          </Link>
        </div>

        {/* Work Orders Table */}
        <div className="rounded-2xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase text-slate-500">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase text-slate-500">Address</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase text-slate-500">Date/Time</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase text-slate-500">Service</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase text-slate-500">Assigned</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase text-slate-500">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase text-slate-500"></th>
                </tr>
              </thead>
              <tbody>
                {workOrders?.map((order) => (
                  <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{order.customer_name}</p>
                      {order.customer_phone && (
                        <p className="text-sm text-slate-500">{order.customer_phone}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700">{order.address}</p>
                      <p className="text-xs text-slate-500">{order.city} {order.zip}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700">
                        {new Date(order.scheduled_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                      <p className="text-xs text-slate-500">{order.scheduled_time || "Flexible"}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{order.service_type}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {order.employee 
                        ? `${order.employee.first_name} ${order.employee.last_name}`
                        : <span className="text-amber-600">Unassigned</span>
                      }
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(order.status)}`}>
                        {order.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/ops/admin/work-orders/${order.id}`}
                        className="text-sm text-teal-600 hover:text-teal-700"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
