import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Calendar, Users, ClipboardList, LogOut, Plus, Mail, Phone } from "lucide-react"

export default async function EmployeesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/ops/auth/login")

  const { data: currentEmployee } = await supabase
    .from("employees")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!currentEmployee || !["admin", "dispatcher", "team_lead"].includes(currentEmployee.role)) {
    redirect("/ops/employee")
  }

  const { data: employees } = await supabase
    .from("employees")
    .select("*")
    .order("first_name", { ascending: true })

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-green-100 text-green-700",
      inactive: "bg-slate-100 text-slate-700",
      on_leave: "bg-amber-100 text-amber-700",
    }
    return styles[status] || "bg-slate-100 text-slate-700"
  }

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: "bg-purple-100 text-purple-700",
      dispatcher: "bg-blue-100 text-blue-700",
      team_lead: "bg-amber-100 text-amber-700",
      cleaner: "bg-teal-100 text-teal-700",
    }
    return styles[role] || "bg-slate-100 text-slate-700"
  }

  const formatRole = (role: string) => {
    return role.replace("_", " ")
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
          <Link href="/ops/admin/work-orders" className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50">
            <ClipboardList className="h-5 w-5" />
            Work Orders
          </Link>
          <Link href="/ops/admin/employees" className="mb-1 flex items-center gap-3 rounded-lg bg-teal-50 px-3 py-2 text-teal-700">
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
          <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
          <Link
            href="/ops/admin/employees/new"
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </Link>
        </div>

        {/* Employees Grid */}
        <div className="grid grid-cols-3 gap-4">
          {employees?.map((emp) => (
            <Link key={emp.id} href={`/ops/admin/employees/${emp.id}`} className="block rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg font-medium text-slate-600">
                    {emp.first_name[0]}{emp.last_name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{emp.first_name} {emp.last_name}</p>
                    <div className="mt-1 flex gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${getRoleBadge(emp.role)}`}>
                        {formatRole(emp.role)}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${getStatusBadge(emp.status)}`}>
                        {emp.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <a href={`mailto:${emp.email}`} className="hover:text-teal-600">{emp.email}</a>
                </div>
                {emp.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <a href={`tel:${emp.phone}`} className="hover:text-teal-600">{emp.phone}</a>
                  </div>
                )}
              </div>
              {emp.hire_date && (
                <p className="mt-3 text-xs text-slate-400">
                  Hired: {new Date(emp.hire_date).toLocaleDateString()}
                </p>
              )}
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
